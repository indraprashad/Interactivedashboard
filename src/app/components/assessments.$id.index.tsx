import { useStore } from "../../../lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ScoreBadge, bandColor } from "../components/ScoreBadge";
import { CHECKLIST, SCORE_LABELS } from "../data/checklist";
import { ArrowLeft, MapPin, Calendar, User, Edit, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

interface AssessmentViewProps {
  assessmentId: string;
  onBack: () => void;
  onEdit?: (id: string) => void;
}

export function AssessmentView({ assessmentId, onBack, onEdit }: AssessmentViewProps) {
  const a = useStore((s) => s.assessments.find((x) => x.id === assessmentId));
  const farm = useStore((s) => s.farms.find((f) => f.id === a?.farmId));
  const inspector = useStore((s) => s.users.find((u) => u.id === a?.inspectorId));

  if (!a || !farm) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Assessment not found.</p>
        <Button variant="ghost" size="sm" className="mt-2" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
      </div>
    );
  }

  const statusColor =
    a.status === "Submitted" ? "bg-emerald-100 text-emerald-800"
    : a.status === "NC-Follow-Up" ? "bg-orange-100 text-orange-800"
    : "bg-secondary text-muted-foreground";

  return (
    <div className="space-y-5 p-6">
      {/* Header card */}
      <div className="flex flex-col gap-4 rounded-3xl border border-border/60 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="mt-0.5 flex-shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-sm text-muted-foreground font-mono">{a.id}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor}`}>{a.status}</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{farm.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{farm.id} · {farm.type}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <ScoreBadge band={a.band} score={a.overallScore} />
          {(a.status === "Draft" || a.status === "NC-Follow-Up") && onEdit && (
            <Button onClick={() => onEdit(a.id)}>
              <Edit className="h-4 w-4 mr-1.5" /> {a.status === "Draft" ? "Continue" : "Edit"}
            </Button>
          )}
        </div>
      </div>

      {/* Meta row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-white px-5 py-4 shadow-sm">
          <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <div>
            <div className="text-xs text-muted-foreground">Date</div>
            <div className="text-sm font-medium">{format(new Date(a.date), "dd MMM yyyy")}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-white px-5 py-4 shadow-sm">
          <User className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <div>
            <div className="text-xs text-muted-foreground">Inspector</div>
            <div className="text-sm font-medium">{inspector?.name ?? "—"}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-white px-5 py-4 shadow-sm">
          <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <div>
            <div className="text-xs text-muted-foreground">Location</div>
            <div className="text-sm font-medium">{farm.dzongkhag}</div>
          </div>
        </div>
      </div>

      {/* Domain score tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {CHECKLIST.map((d) => {
          const score = a.domainScores[d.id] ?? 0;
          const band = score >= 81 ? "Excellent" : score >= 61 ? "Good" : score >= 41 ? "Fair" : "Poor";
          return (
            <div key={d.id} className="rounded-2xl border border-border/60 bg-white p-4 shadow-sm">
              <div className="text-[11px] text-muted-foreground leading-tight">{d.name}</div>
              <div className="text-2xl font-bold mt-1" style={{ color: bandColor(band) }}>{score}</div>
              <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${score}%`, background: bandColor(band) }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* NC list */}
      {a.ncCount > 0 && (
        <Card className="rounded-3xl border-[var(--poor)]/30 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-[var(--poor)]">
              <AlertTriangle className="h-4 w-4" /> Non-Compliances ({a.ncCount})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {a.responses.filter((r) => !r.na && r.score <= 1).map((r) => {
                const item = CHECKLIST.flatMap((d) => d.items).find((i) => i.id === r.itemId);
                const dom = CHECKLIST.find((d) => d.items.some((i) => i.id === r.itemId));
                return (
                  <div key={r.itemId} className="flex items-start justify-between gap-4 px-6 py-4">
                    <div>
                      <div className="text-sm font-medium">{item?.prompt}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {dom?.name}{r.comment ? ` · ${r.comment}` : ""}
                      </div>
                    </div>
                    <span
                      className="text-xs px-2 py-1 rounded-full whitespace-nowrap font-medium flex-shrink-0"
                      style={{
                        background: `color-mix(in oklab, var(--poor) 15%, transparent)`,
                        color: "var(--poor)",
                      }}
                    >
                      {r.score} · {SCORE_LABELS[r.score]}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Full checklist */}
      <Card className="rounded-3xl border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Checklist Responses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {CHECKLIST.map((d) => (
            <div key={d.id}>
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">{d.name}</div>
              <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
                {d.items.map((it) => {
                  const r = a.responses.find((x) => x.itemId === it.id);
                  if (r?.na) {
                    return (
                      <div key={it.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm opacity-50">
                        <div>{it.prompt}</div>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">N/A</span>
                      </div>
                    );
                  }
                  const score = r?.score ?? 0;
                  const scoreBand = score === 3 ? "Excellent" : score === 2 ? "Good" : score === 1 ? "Fair" : "Poor";
                  return (
                    <div key={it.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                      <div className="min-w-0">
                        <div>{it.prompt}</div>
                        {r?.comment && <div className="text-xs text-muted-foreground mt-0.5">{r.comment}</div>}
                      </div>
                      <div
                        className="text-xs px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0 font-medium"
                        style={{
                          background: `color-mix(in oklab, ${bandColor(scoreBand)} 15%, transparent)`,
                          color: bandColor(scoreBand),
                        }}
                      >
                        {score} · {SCORE_LABELS[score]}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
