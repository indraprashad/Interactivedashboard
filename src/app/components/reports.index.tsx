import { useMemo, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, Legend,
} from "recharts";
import { format, subMonths, startOfMonth } from "date-fns";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

import { useStore } from "../../../lib/store";
import { CHECKLIST } from "../data/checklist";
import { Card, CardContent } from "../components/ui/card";

const COLORS = {
  compliant:    "#1a6b58",
  nonCompliant: "#c2410c",
  moderate:     "#fbbf24",
  gray:         "#8a8a8a",
};

function localityCompliance(score: number): { label: string; color: string; bg: string } {
  if (score >= 80) return { label: "High",     color: "#1a6b58", bg: "bg-emerald-100 text-emerald-700" };
  if (score >= 60) return { label: "Moderate", color: "#fbbf24", bg: "bg-amber-100 text-amber-700" };
  return              { label: "Low",      color: "#c2410c", bg: "bg-red-100 text-red-700" };
}

const BAND_COLOR: Record<string, string> = {
  Poor:      "#c2410c",
  Fair:      "#fbbf24",
  Good:      "#1a6b58",
  Excellent: "#0b1f1a",
};

const BAND_BG: Record<string, string> = {
  Poor:      "bg-red-100 text-red-700",
  Fair:      "bg-amber-100 text-amber-700",
  Good:      "bg-emerald-100 text-emerald-700",
  Excellent: "bg-[#0b1f1a]/10 text-[#0b1f1a]",
};

const ROWS_PER_PAGE = 10;

type Tab = "analytics" | "table";

export function Reports() {
  const assessments = useStore((s) => s.assessments);
  const farms       = useStore((s) => s.farms);
  const ncs         = useStore((s) => s.ncs);

  const [activeTab, setActiveTab] = useState<Tab>("analytics");

  // Table tab state
  const [tableSearch, setTableSearch]   = useState("");
  const [tableBand,   setTableBand]     = useState("All");
  const [tableStatus, setTableStatus]   = useState("All");
  const [tablePage,   setTablePage]     = useState(1);

  // ── Summary stats ──────────────────────────────────────────────────────────
  const summaryStats = useMemo(() => {
    const nonDraft = assessments.filter((a) => a.status !== "Draft");
    const assessedFarmIds  = new Set(nonDraft.map((a) => a.farmId));
    const compliantFarmIds = new Set(
      nonDraft.filter((a) => a.ncCount === 0).map((a) => a.farmId)
    );
    return {
      totalFarms:    farms.length,
      totalAssessed: assessedFarmIds.size,
      compliant:     compliantFarmIds.size,
      activeNCs:     ncs.filter((n) => n.active).length,
    };
  }, [assessments, farms, ncs]);

  // ── Monthly assessment trend ───────────────────────────────────────────────
  const monthlyTrendData = useMemo(() => {
    const months: { label: string; start: Date }[] = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const start = startOfMonth(subMonths(now, i));
      months.push({ label: format(start, "MMM yy"), start });
    }
    return months.map(({ label, start }) => {
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      const month = assessments.filter((a) => {
        const d = new Date(a.date);
        return d >= start && d < end && a.status !== "Draft";
      });
      return {
        label,
        Compliant:       month.filter((a) => a.ncCount === 0).length,
        "Non-Compliant": month.filter((a) => a.ncCount > 0).length,
      };
    });
  }, [assessments]);

  // ── Band distribution ──────────────────────────────────────────────────────
  const bandData = useMemo(() => {
    const bands: Record<string, number> = { Poor: 0, Fair: 0, Good: 0, Excellent: 0 };
    assessments
      .filter((a) => a.status !== "Draft" && a.band)
      .forEach((a) => { if (a.band && bands[a.band] !== undefined) bands[a.band]++; });
    return Object.entries(bands).map(([band, count]) => ({ band, count }));
  }, [assessments]);

  // ── Dzongkhag avg score ────────────────────────────────────────────────────
  const dzongkhagScoreData = useMemo(() => {
    const farmMap = new Map(farms.map((f) => [f.id, f]));
    const grouped: Record<string, { scores: number[]; full: string }> = {};
    assessments
      .filter((a) => a.status !== "Draft" && typeof a.overallScore === "number")
      .forEach((a) => {
        const farm = farmMap.get(a.farmId);
        if (!farm) return;
        const dz = farm.dzongkhag;
        if (!grouped[dz]) grouped[dz] = { scores: [], full: dz };
        grouped[dz].scores.push(a.overallScore);
      });
    return Object.entries(grouped)
      .map(([, { scores, full }]) => {
        const avg = Math.round(scores.reduce((s, v) => s + v, 0) / scores.length);
        const lc  = localityCompliance(avg);
        return {
          dzongkhag:   full.length > 10 ? full.slice(0, 10) + "…" : full,
          fullName:    full,
          avgScore:    avg,
          compliance:  lc.label,
          barColor:    lc.color,
        };
      })
      .sort((a, b) => b.avgScore - a.avgScore);
  }, [assessments, farms]);

  // ── Dzongkhag compliance map (full name → label) for table column ───────────
  const dzongkhagComplianceMap = useMemo(() => {
    const map: Record<string, ReturnType<typeof localityCompliance>> = {};
    dzongkhagScoreData.forEach((d) => {
      map[d.fullName] = localityCompliance(d.avgScore);
    });
    return map;
  }, [dzongkhagScoreData]);

  // ── NC by domain ───────────────────────────────────────────────────────────
  const ncByDomainData = useMemo(() => {
    const counts: Record<string, number> = {};
    ncs.forEach((n) => {
      const domain = CHECKLIST.find((d) => d.id === n.domainId);
      const name = domain?.name ?? n.domainId;
      counts[name] = (counts[name] ?? 0) + 1;
    });
    return Object.entries(counts)
      .map(([domain, count]) => ({
        domain: domain.length > 14 ? domain.slice(0, 14) + "…" : domain,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [ncs]);

  // ── Table tab: latest assessment per farm ──────────────────────────────────
  const farmTableRows = useMemo(() => {
    const farmMap = new Map(farms.map((f) => [f.id, f]));
    const latestByFarm = new Map<string, (typeof assessments)[0]>();
    [...assessments]
      .filter((a) => a.status !== "Draft")
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .forEach((a) => { if (!latestByFarm.has(a.farmId)) latestByFarm.set(a.farmId, a); });

    return Array.from(latestByFarm.values()).map((a) => {
      const farm = farmMap.get(a.farmId);
      return {
        farmId:     a.farmId,
        farmName:   farm?.name ?? a.farmId,
        dzongkhag:  farm?.dzongkhag ?? "—",
        type:       farm?.type ?? "—",
        date:       a.date,
        score:      a.overallScore,
        band:       a.band,
        ncCount:    a.ncCount,
        status:     a.status,
        assessmentId: a.id,
      };
    });
  }, [assessments, farms]);

  const tableFiltered = useMemo(() => {
    return farmTableRows.filter((r) => {
      const q = tableSearch.toLowerCase();
      const matchSearch =
        q === "" ||
        r.farmName.toLowerCase().includes(q) ||
        r.dzongkhag.toLowerCase().includes(q) ||
        r.farmId.toLowerCase().includes(q);
      const matchBand   = tableBand   === "All" || r.band   === tableBand;
      const matchStatus = tableStatus === "All" || r.status === tableStatus;
      return matchSearch && matchBand && matchStatus;
    });
  }, [farmTableRows, tableSearch, tableBand, tableStatus]);

  const tableTotalPages = Math.max(1, Math.ceil(tableFiltered.length / ROWS_PER_PAGE));
  const tableRows = useMemo(
    () => tableFiltered.slice((tablePage - 1) * ROWS_PER_PAGE, tablePage * ROWS_PER_PAGE),
    [tableFiltered, tablePage]
  );

  const handleSearch = (v: string) => { setTableSearch(v); setTablePage(1); };
  const handleBand   = (v: string) => { setTableBand(v);   setTablePage(1); };
  const handleStatus = (v: string) => { setTableStatus(v); setTablePage(1); };

  const statTiles = [
    { label: "Total Registered Farms", value: summaryStats.totalFarms,    color: "text-[#0b1f1a]" },
    { label: "Total Assessed",         value: summaryStats.totalAssessed,  color: "text-[#1a6b58]" },
    { label: "Compliant Farms",        value: summaryStats.compliant,      color: "text-[#1a6b58]" },
    { label: "Active NCs",             value: summaryStats.activeNCs,      color: "text-[#c2410c]" },
  ];

  return (
    <div className="space-y-5 p-6">
      {/* Header + tabs */}
      <div className="flex flex-col gap-4 rounded-3xl border border-border/60 bg-white p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Aggregated biosecurity reports and data exports
            </p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-secondary/40 transition-colors self-start lg:self-auto">
            Export to Excel
          </button>
        </div>
        {/* Tab switcher */}
        <div className="flex gap-2 border-b border-border/60 pb-0">
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-5 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "analytics"
                ? "border-[#1a6b58] text-[#1a6b58]"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Charts &amp; Analytics
          </button>
          <button
            onClick={() => setActiveTab("table")}
            className={`px-5 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "table"
                ? "border-[#1a6b58] text-[#1a6b58]"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Data Table
          </button>
        </div>
      </div>

      {/* ── Summary Stats (always visible) ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statTiles.map((tile) => (
          <Card key={tile.label} className="rounded-3xl border-border/60 shadow-sm">
            <CardContent className="p-5">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">{tile.label}</p>
              <p className={`mt-1 text-3xl font-bold ${tile.color}`}>{tile.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Analytics tab ── */}
      {activeTab === "analytics" && (
        <>
          {/* Row 1 — Monthly Trend + Band Distribution */}
          <div className="grid gap-5 lg:grid-cols-2">
            <Card className="rounded-3xl border-border/60 shadow-sm">
              <CardContent className="p-5">
                <h2 className="mb-4 text-base font-semibold">Monthly Assessment Trend</h2>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={monthlyTrendData} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="Compliant"     fill={COLORS.compliant}    radius={[3, 3, 0, 0]} />
                    <Bar dataKey="Non-Compliant" fill={COLORS.nonCompliant} radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-border/60 shadow-sm">
              <CardContent className="p-5">
                <h2 className="mb-4 text-base font-semibold">Compliance Distribution by Band</h2>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={bandData} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="band" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" name="Assessments" radius={[3, 3, 0, 0]}>
                      {bandData.map((entry) => (
                        <Cell key={entry.band} fill={BAND_COLOR[entry.band] ?? COLORS.gray} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Row 2 — Dzongkhag Avg Score + NC by Domain */}
          <div className="grid gap-5 lg:grid-cols-2">
            <Card className="rounded-3xl border-border/60 shadow-sm">
              <CardContent className="p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-base font-semibold">Dzongkhag Comparison (Avg Score)</h2>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#1a6b58]" />High ≥80%</span>
                    <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#fbbf24]" />Moderate 60–79%</span>
                    <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#c2410c]" />Low &lt;60%</span>
                  </div>
                </div>
                {dzongkhagScoreData.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-16 text-center">No assessment data yet.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart
                      layout="vertical"
                      data={dzongkhagScoreData}
                      margin={{ top: 4, right: 20, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                      <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                      <YAxis dataKey="dzongkhag" type="category" tick={{ fontSize: 11 }} width={80} />
                      <Tooltip formatter={(v) => [`${v}`, "Avg Score"]} />
                      <Bar dataKey="avgScore" name="Avg Score" radius={[0, 3, 3, 0]}>
                        {dzongkhagScoreData.map((entry) => (
                          <Cell key={entry.dzongkhag} fill={entry.barColor} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-border/60 shadow-sm">
              <CardContent className="p-5">
                <h2 className="mb-4 text-base font-semibold">NC Count by Domain</h2>
                {ncByDomainData.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-16 text-center">No NC data yet.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={ncByDomainData} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="domain" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="count" name="NCs" fill={COLORS.nonCompliant} radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* ── Data Table tab ── */}
      {activeTab === "table" && (
        <>
          {/* Filters */}
          <Card className="rounded-3xl border-border/60 shadow-sm">
            <CardContent className="p-4">
              <div className="grid gap-3 lg:grid-cols-4">
                {/* Search */}
                <div className="relative lg:col-span-2">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={tableSearch}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search by farm, owner or dzongkhag…"
                    className="h-11 w-full rounded-xl border border-border pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b58]/30"
                  />
                </div>
                {/* Band filter */}
                <select
                  value={tableBand}
                  onChange={(e) => handleBand(e.target.value)}
                  className="h-11 rounded-xl border border-border px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b58]/30"
                >
                  <option value="All">All Bands</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
                {/* Status filter */}
                <select
                  value={tableStatus}
                  onChange={(e) => handleStatus(e.target.value)}
                  className="h-11 rounded-xl border border-border px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b58]/30"
                >
                  <option value="All">All Status</option>
                  <option value="Submitted">Submitted</option>
                  <option value="NC-Follow-Up">NC-Follow-Up</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <div className="overflow-hidden rounded-3xl border border-border/60 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="p-4">S/N</th>
                    <th className="p-4">Farm</th>
                    <th className="p-4">Dzongkhag</th>
                    <th className="p-4 hidden lg:table-cell">Locality</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Last Assessed</th>
                    <th className="p-4 text-right">Score</th>
                    <th className="p-4">Band</th>
                    <th className="p-4 text-right text-[#c2410c]">NCs</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {tableRows.length > 0 ? (
                    tableRows.map((row, i) => (
                      <tr key={row.assessmentId} className="hover:bg-secondary/20 transition-colors">
                        <td className="p-4 font-medium text-muted-foreground">
                          {(tablePage - 1) * ROWS_PER_PAGE + i + 1}
                        </td>
                        <td className="p-4">
                          <div className="font-medium">{row.farmName}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{row.farmId}</div>
                        </td>
                        <td className="p-4 text-muted-foreground">{row.dzongkhag}</td>
                        <td className="p-4 hidden lg:table-cell">
                          {dzongkhagComplianceMap[row.dzongkhag] ? (
                            <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${dzongkhagComplianceMap[row.dzongkhag].bg}`}>
                              {dzongkhagComplianceMap[row.dzongkhag].label}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="p-4 text-muted-foreground">{row.type}</td>
                        <td className="p-4 text-muted-foreground">
                          {format(new Date(row.date), "dd MMM yyyy")}
                        </td>
                        <td className="p-4 text-right font-bold">{row.score}</td>
                        <td className="p-4">
                          <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${BAND_BG[row.band] ?? ""}`}>
                            {row.band}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {row.ncCount > 0 ? (
                            <span className="font-semibold text-[#c2410c]">{row.ncCount}</span>
                          ) : (
                            <span className="text-[#1a6b58] font-semibold">0</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              row.status === "Submitted"
                                ? "bg-emerald-100 text-emerald-700"
                                : row.status === "NC-Follow-Up"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-secondary text-muted-foreground"
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="p-10 text-center text-muted-foreground">
                        No records match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col gap-4 border-t border-border bg-background/50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {tableFiltered.length === 0 ? 0 : (tablePage - 1) * ROWS_PER_PAGE + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium text-foreground">
                  {Math.min(tablePage * ROWS_PER_PAGE, tableFiltered.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">{tableFiltered.length}</span>{" "}
                farms assessed
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTablePage((p) => p - 1)}
                  disabled={tablePage === 1}
                  className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm font-medium disabled:opacity-40 hover:bg-secondary/40 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: tableTotalPages }).map((_, idx) => {
                    const pg = idx + 1;
                    return (
                      <button
                        key={pg}
                        onClick={() => setTablePage(pg)}
                        className={`min-w-9 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                          tablePage === pg
                            ? "bg-[#1a6b58] text-white border-[#1a6b58]"
                            : "border-border hover:bg-secondary/40"
                        }`}
                      >
                        {pg}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setTablePage((p) => p + 1)}
                  disabled={tablePage === tableTotalPages}
                  className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm font-medium disabled:opacity-40 hover:bg-secondary/40 transition-colors"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
