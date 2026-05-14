import { useMemo, useState } from "react";
import { format, addDays, differenceInDays } from "date-fns";
import { Bell, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";

import { useStore } from "../../../lib/store";
import { Card, CardContent } from "./ui/card";

const PER_PAGE  = 10;
const MAX_ALERTS = 20;

type Tab = "log" | "alerts";

export function NotificationsPage() {
  const notifications = useStore((s) => s.notifications);
  const ncs           = useStore((s) => s.ncs);
  const farms         = useStore((s) => s.farms);

  const [activeTab, setActiveTab] = useState<Tab>("alerts");
  const [logPage,   setLogPage]   = useState(1);
  const [alertPage, setAlertPage] = useState(1);

  // Follow-up due alerts: active NCs where eligibleDate (raisedAt + 3d) has passed
  const followUpAlerts = useMemo(() => {
    const today = new Date();
    return ncs
      .filter((n) => n.active && addDays(new Date(n.raisedAt), 3) <= today)
      .map((n) => ({
        ...n,
        farm:       farms.find((f) => f.id === n.farmId),
        daysActive: differenceInDays(today, new Date(n.raisedAt)),
        isOverdue:  differenceInDays(today, new Date(n.raisedAt)) > 14,
      }))
      .sort((a, b) => b.daysActive - a.daysActive);
  }, [ncs, farms]);

  const logTotalPages   = Math.max(1, Math.ceil(notifications.length / PER_PAGE));
  const cappedAlerts    = followUpAlerts.slice(0, MAX_ALERTS);
  const alertTotalPages = Math.max(1, Math.ceil(cappedAlerts.length / PER_PAGE));

  const logRows   = notifications.slice((logPage   - 1) * PER_PAGE, logPage   * PER_PAGE);
  const alertRows = cappedAlerts.slice((alertPage - 1) * PER_PAGE, alertPage * PER_PAGE);

  return (
    <div className="space-y-5 p-6">
      {/* Header + tabs */}
      <div className="flex flex-col gap-4 rounded-3xl border border-border/60 bg-white p-6 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            System alerts, follow-up reminders, and notification log
          </p>
        </div>
        <div className="flex gap-2 border-b border-border/60 pb-0">
          {(["alerts", "log"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-5 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === t
                  ? "border-[#1a6b58] text-[#1a6b58]"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "alerts" ? "Follow-up Alerts" : "Notification Log"}
              {t === "alerts" && cappedAlerts.length > 0 && (
                <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#c2410c] text-[10px] font-bold text-white">
                  {cappedAlerts.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="rounded-3xl border-border/60 shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Follow-up Due</p>
            <p className="mt-1 text-3xl font-bold text-amber-500">{followUpAlerts.length}</p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-border/60 shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Overdue (&gt;14 days)</p>
            <p className="mt-1 text-3xl font-bold text-[#c2410c]">
              {followUpAlerts.filter((a) => a.isOverdue).length}
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-border/60 shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Log Entries</p>
            <p className="mt-1 text-3xl font-bold text-[#0b1f1a]">{notifications.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Follow-up Alerts tab ── */}
      {activeTab === "alerts" && (
        <Card className="overflow-hidden rounded-3xl border-border/60 shadow-sm">
          <CardContent className="p-0">
            {alertRows.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
                <Bell className="h-10 w-10 opacity-30" />
                <p className="text-sm">No follow-up alerts at this time</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {alertRows.map((n, idx) => (
                  <div
                    key={n.id}
                    className="flex gap-4 px-6 py-5"
                    style={{ borderLeft: `3px solid ${n.isOverdue ? "#c2410c" : "#fbbf24"}` }}
                  >
                    <div className="w-7 pt-0.5 flex-shrink-0 text-sm font-semibold text-muted-foreground">
                      {(alertPage - 1) * PER_PAGE + idx + 1}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <AlertTriangle className={`h-4 w-4 flex-shrink-0 ${n.isOverdue ? "text-[#c2410c]" : "text-amber-500"}`} />
                        <span className="font-semibold text-[#0b1f1a]">{n.farm?.name ?? n.farmId}</span>
                        <span className="text-xs text-muted-foreground">{n.farm?.dzongkhag}</span>
                        {n.isOverdue && (
                          <span className="rounded px-2 py-0.5 text-[11px] font-bold bg-red-100 text-red-600">Overdue</span>
                        )}
                      </div>
                      <p className="text-sm text-foreground/80">{n.prompt}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span>Raised: <span className="font-medium text-foreground">{format(new Date(n.raisedAt), "dd MMM yyyy")}</span></span>
                        <span>
                          Days active:{" "}
                          <span className={`font-medium ${n.isOverdue ? "text-red-600" : "text-foreground"}`}>{n.daysActive}d</span>
                        </span>
                        <span>Assessment: <span className="font-mono font-medium text-foreground">{n.assessmentId}</span></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Pagination page={alertPage} total={alertTotalPages} onPage={setAlertPage} count={followUpAlerts.length} />
          </CardContent>
        </Card>
      )}

      {/* ── Notification Log tab ── */}
      {activeTab === "log" && (
        <Card className="overflow-hidden rounded-3xl border-border/60 shadow-sm">
          <CardContent className="p-0">
            {logRows.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
                <Bell className="h-10 w-10 opacity-30" />
                <p className="text-sm">No log entries</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="p-4">S/N</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Recipient</th>
                      <th className="p-4">Channel</th>
                      <th className="p-4">Subject</th>
                      <th className="p-4">Assessment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {logRows.map((n, i) => (
                      <tr key={n.id} className="hover:bg-secondary/20 transition-colors">
                        <td className="p-4 text-muted-foreground font-medium">
                          {(logPage - 1) * PER_PAGE + i + 1}
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {format(new Date(n.date), "dd MMM yyyy")}
                        </td>
                        <td className="p-4 font-medium">{n.recipient}</td>
                        <td className="p-4">
                          <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            n.channel === "Email"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}>
                            {n.channel}
                          </span>
                        </td>
                        <td className="p-4 text-foreground/80">{n.subject}</td>
                        <td className="p-4 font-mono text-xs text-muted-foreground">
                          {n.assessmentId ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <Pagination page={logPage} total={logTotalPages} onPage={setLogPage} count={notifications.length} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Pagination({
  page, total, onPage, count,
}: { page: number; total: number; onPage: (p: number) => void; count: number }) {
  if (count === 0) return null;
  return (
    <div className="flex flex-col gap-4 border-t border-border bg-background/50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-muted-foreground">
        Page <span className="font-medium text-foreground">{page}</span> of{" "}
        <span className="font-medium text-foreground">{total}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm font-medium disabled:opacity-40 hover:bg-secondary/40 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </button>
        {Array.from({ length: total }).map((_, idx) => (
          <button
            key={idx + 1}
            onClick={() => onPage(idx + 1)}
            className={`min-w-9 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
              page === idx + 1
                ? "bg-[#1a6b58] text-white border-[#1a6b58]"
                : "border-border hover:bg-secondary/40"
            }`}
          >
            {idx + 1}
          </button>
        ))}
        <button
          onClick={() => onPage(page + 1)}
          disabled={page === total}
          className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm font-medium disabled:opacity-40 hover:bg-secondary/40 transition-colors"
        >
          Next <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
