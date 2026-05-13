import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "../data/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useStore } from "../../../lib/store";
import { ExportButton } from "../data/ExportButton";
import { CHECKLIST } from "../data/checklist";
import { REPORTS } from "../components/reports.index";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid } from "recharts";
import { format, parseISO } from "date-fns";

export const Route = createFileRoute()({
  head: () => ({ meta: [{ title: "Report — BBAS" }] }),
  component: () => <AppShell><ReportView /></AppShell>,
});

const COLORS = ["var(--primary)", "var(--accent)", "var(--good)", "var(--fair)", "var(--poor)", "var(--excellent)"];

function ReportView() {
  const { reportId } = Route.useParams();
  const meta = REPORTS.find((r) => r.id === reportId);
  const { assessments, farms, ncs, users, notifications } = useStore();

  if (!meta) return <div>Unknown report. <Link to="/reports" className="text-primary underline">Back</Link></div>;

  const renderRows: { rows: Record<string, unknown>[]; chart: React.ReactNode } = (() => {
    switch (reportId) {
      case "by-dzongkhag": {
        const map = new Map<string, number>();
        assessments.forEach((a) => {
          const dz = farms.find((f) => f.id === a.farmId)?.dzongkhag ?? "Unknown";
          map.set(dz, (map.get(dz) ?? 0) + 1);
        });
        const data = [...map.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
        return {
          rows: data.map((d) => ({ dzongkhag: d.name, assessments: d.value })),
          chart: (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={data}><XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={60} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]} /></BarChart>
            </ResponsiveContainer>
          ),
        };
      }
      case "compliance-distribution": {
        const bands = ["Poor", "Fair", "Good", "Excellent"];
        const data = bands.map((b) => ({ name: b, value: assessments.filter((a) => a.band === b).length }));
        return {
          rows: data.map((d) => ({ band: d.name, count: d.value })),
          chart: (
            <ResponsiveContainer width="100%" height={320}>
              <PieChart><Pie data={data} dataKey="value" nameKey="name" outerRadius={110} label>
                {data.map((d, i) => <Cell key={d.name} fill={[`var(--poor)`, `var(--fair)`, `var(--good)`, `var(--excellent)`][i]} />)}
              </Pie><Tooltip /><Legend /></PieChart>
            </ResponsiveContainer>
          ),
        };
      }
      case "nc-trends": {
        const map = new Map<string, number>();
        assessments.forEach((a) => {
          const k = format(parseISO(a.date), "yyyy-MM");
          map.set(k, (map.get(k) ?? 0) + a.ncCount);
        });
        const data = [...map.entries()].map(([month, ncs]) => ({ month, ncs })).sort((a, b) => a.month.localeCompare(b.month));
        return {
          rows: data,
          chart: (
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={data}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="ncs" stroke="var(--poor)" strokeWidth={2} /></LineChart>
            </ResponsiveContainer>
          ),
        };
      }
      case "top-nc-categories": {
        const counts = new Map<string, number>();
        ncs.forEach((n) => counts.set(n.prompt, (counts.get(n.prompt) ?? 0) + 1));
        const data = [...counts.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 10);
        return {
          rows: data.map((d) => ({ item: d.name, occurrences: d.value })),
          chart: (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={data} layout="vertical" margin={{ left: 180 }}><XAxis type="number" tick={{ fontSize: 11 }} /><YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={170} /><Tooltip /><Bar dataKey="value" fill="var(--accent)" radius={[0, 4, 4, 0]} /></BarChart>
            </ResponsiveContainer>
          ),
        };
      }
      case "inspector-activity": {
        const map = new Map<string, number>();
        assessments.forEach((a) => map.set(a.inspectorId, (map.get(a.inspectorId) ?? 0) + 1));
        const data = [...map.entries()].map(([id, v]) => ({ name: users.find((u) => u.id === id)?.name ?? id, value: v }));
        return {
          rows: data.map((d) => ({ inspector: d.name, assessments: d.value })),
          chart: (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={data}><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]} /></BarChart>
            </ResponsiveContainer>
          ),
        };
      }
      case "risk-classification": {
        const cats = { High: 0, Medium: 0, Low: 0 };
        assessments.forEach((a) => {
          if (a.overallScore < 50) cats.High++;
          else if (a.overallScore < 75) cats.Medium++;
          else cats.Low++;
        });
        const data = Object.entries(cats).map(([name, value]) => ({ name, value }));
        return {
          rows: data.map((d) => ({ risk: d.name, farms: d.value })),
          chart: (
            <ResponsiveContainer width="100%" height={320}>
              <PieChart><Pie data={data} dataKey="value" nameKey="name" outerRadius={110} label>
                {data.map((d, i) => <Cell key={d.name} fill={[`var(--poor)`, `var(--fair)`, `var(--excellent)`][i]} />)}
              </Pie><Tooltip /><Legend /></PieChart>
            </ResponsiveContainer>
          ),
        };
      }
      case "follow-up-status": {
        const open = ncs.filter((n) => n.active).length;
        const closed = ncs.filter((n) => !n.active).length;
        const data = [{ name: "Open", value: open }, { name: "Closed", value: closed }];
        return {
          rows: data,
          chart: (
            <ResponsiveContainer width="100%" height={320}>
              <PieChart><Pie data={data} dataKey="value" nameKey="name" outerRadius={110} label>
                <Cell fill="var(--poor)" /><Cell fill="var(--excellent)" />
              </Pie><Tooltip /><Legend /></PieChart>
            </ResponsiveContainer>
          ),
        };
      }
      case "score-distribution": {
        const buckets = [0, 20, 40, 60, 80, 100];
        const data = buckets.slice(0, -1).map((b, i) => ({
          range: `${b}-${buckets[i + 1]}`,
          count: assessments.filter((a) => a.overallScore >= b && a.overallScore < buckets[i + 1] + (i === buckets.length - 2 ? 1 : 0)).length,
        }));
        return {
          rows: data,
          chart: (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={data}><XAxis dataKey="range" /><YAxis /><Tooltip /><Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} /></BarChart>
            </ResponsiveContainer>
          ),
        };
      }
      case "dzongkhag-comparison": {
        const map = new Map<string, number[]>();
        assessments.forEach((a) => {
          const dz = farms.find((f) => f.id === a.farmId)?.dzongkhag ?? "Unknown";
          if (!map.has(dz)) map.set(dz, []);
          map.get(dz)!.push(a.overallScore);
        });
        const data = [...map.entries()].map(([name, arr]) => ({ name, avg: Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) })).sort((a, b) => b.avg - a.avg);
        return {
          rows: data.map((d) => ({ dzongkhag: d.name, avg_score: d.avg })),
          chart: (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={data}><XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={60} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="avg" fill="var(--accent)" radius={[4, 4, 0, 0]} /></BarChart>
            </ResponsiveContainer>
          ),
        };
      }
      case "improvement": {
        const byFarm = new Map<string, { date: string; score: number }[]>();
        assessments.forEach((a) => {
          if (!byFarm.has(a.farmId)) byFarm.set(a.farmId, []);
          byFarm.get(a.farmId)!.push({ date: a.date, score: a.overallScore });
        });
        const top = [...byFarm.entries()].sort((a, b) => b[1].length - a[1].length).slice(0, 5);
        const maxLen = Math.max(...top.map(([, arr]) => arr.length));
        const data = Array.from({ length: maxLen }, (_, i) => {
          const row: Record<string, unknown> = { idx: `Round ${i + 1}` };
          top.forEach(([fid, arr]) => {
            const farmName = farms.find((f) => f.id === fid)?.name ?? fid;
            row[farmName] = arr[i]?.score;
          });
          return row;
        });
        const lines = top.map(([fid]) => farms.find((f) => f.id === fid)?.name ?? fid);
        return {
          rows: data,
          chart: (
            <ResponsiveContainer width="100%" height={360}>
              <LineChart data={data}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="idx" /><YAxis domain={[0, 100]} /><Tooltip /><Legend wrapperStyle={{ fontSize: 11 }} />
                {lines.map((n, i) => <Line key={n} type="monotone" dataKey={n} stroke={COLORS[i % COLORS.length]} strokeWidth={2} />)}
              </LineChart>
            </ResponsiveContainer>
          ),
        };
      }
      case "notification-log": {
        return {
          rows: notifications.map((n) => ({ date: format(parseISO(n.date), "yyyy-MM-dd"), recipient: n.recipient, channel: n.channel, subject: n.subject, assessment: n.assessmentId ?? "" })),
          chart: (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50 text-left text-xs uppercase text-muted-foreground"><tr><th className="p-2">Date</th><th className="p-2">Recipient</th><th className="p-2">Channel</th><th className="p-2">Subject</th><th className="p-2">Assessment</th></tr></thead>
                <tbody className="divide-y divide-border">
                  {notifications.map((n) => (
                    <tr key={n.id}><td className="p-2 text-muted-foreground">{format(parseISO(n.date), "dd MMM yyyy")}</td><td className="p-2">{n.recipient}</td><td className="p-2">{n.channel}</td><td className="p-2">{n.subject}</td><td className="p-2 text-primary">{n.assessmentId}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          ),
        };
      }
      default:
        return { rows: [], chart: null };
    }
  })();

  return (
    <div className="space-y-4 max-w-6xl">
      <Button variant="ghost" size="sm" asChild><Link to="/reports"><ArrowLeft className="h-4 w-4 mr-1" /> All Reports</Link></Button>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">{meta.title}</h1>
          <p className="text-sm text-muted-foreground">{meta.desc}</p>
        </div>
        <ExportButton filename={`${reportId}.csv`} rows={renderRows.rows} />
      </div>
      <Card><CardHeader><CardTitle className="text-base">Visualization</CardTitle></CardHeader><CardContent>{renderRows.chart}</CardContent></Card>
      {renderRows.rows.length > 0 && reportId !== "notification-log" && (
        <Card>
          <CardHeader><CardTitle className="text-base">Data Table</CardTitle></CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 text-left text-xs uppercase text-muted-foreground">
                <tr>{Object.keys(renderRows.rows[0]).map((k) => <th key={k} className="p-3">{k.replace(/_/g, " ")}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-border">
                {renderRows.rows.map((r, i) => (
                  <tr key={i}>{Object.values(r).map((v, j) => <td key={j} className="p-3">{String(v ?? "")}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
      <input type="hidden" data-len={CHECKLIST.length} />
    </div>
  );
}
