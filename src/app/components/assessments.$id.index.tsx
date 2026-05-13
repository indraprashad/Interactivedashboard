import { useStore } from "../../../lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ScoreBadge, bandColor } from "../components/ScoreBadge";
import { CHECKLIST, SCORE_LABELS } from "../data/checklist";
import { ArrowLeft, MapPin, Calendar, User, Edit, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

export function AssessmentView() {
  const a = useStore((s) => s.assessments.find((x) => x.id === "1"));
  const farm = useStore((s) => s.farms.find((f) => f.id === a?.farmId));
  const inspector = useStore((s) => s.users.find((u) => u.id === a?.inspectorId));

  if (!a || !farm) return <div>Not found. <div onClick={() => window.location.href = "/assessments"} className="text-primary underline">Back</div></div>;

  return (
    <div className="space-y-4 max-w-5xl">
      <Button variant="ghost" size="sm" asChild><div onClick={() => window.location.href = "/assessments"}><ArrowLeft className="h-4 w-4 mr-1" /> Back</div></Button>

      <Card>
        <CardContent className="p-6 space-y-3">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <div className="text-xs text-muted-foreground">{a.id} · {a.status}</div>
              <h1 className="text-2xl font-semibold">{farm.name}</h1>
              <div className="text-sm text-muted-foreground">{farm.id} · {farm.type}</div>
            </div>
            <div className="flex items-center gap-2">
              <ScoreBadge band={a.band} score={a.overallScore} />
              {a.status === "Draft" && (
                <Button asChild size="sm"><div onClick={() => window.location.href = `/assessments/${a.id}/edit`}><Edit className="h-4 w-4 mr-1" /> Continue</div></Button>
              )}
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-3 text-sm pt-3 border-t">
            <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /> {format(new Date(a.date), "dd MMM yyyy")}</div>
            <div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" /> {inspector?.name ?? "—"}</div>
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /> {farm.dzongkhag}</div>
          </div>
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-5 gap-3">
        {CHECKLIST.map((d) => {
          const score = a.domainScores[d.id] ?? 0;
          return (
            <Card key={d.id}>
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground">{d.name}</div>
                <div className="text-2xl font-semibold mt-1" style={{ color: bandColor(score >= 81 ? "Excellent" : score >= 61 ? "Good" : score >= 41 ? "Fair" : "Poor") }}>{score}</div>
                <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${score}%`, background: bandColor(score >= 81 ? "Excellent" : score >= 61 ? "Good" : score >= 41 ? "Fair" : "Poor") }} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {a.ncCount > 0 && (
        <Card className="border-[var(--poor)]/40">
          <CardHeader><CardTitle className="text-base flex items-center gap-2 text-[var(--poor)]"><AlertTriangle className="h-4 w-4" /> Non-Compliances ({a.ncCount})</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {a.responses.filter((r) => !r.na && r.score === 0).map((r) => {
                const item = CHECKLIST.flatMap((d) => d.items).find((i) => i.id === r.itemId);
                const dom = CHECKLIST.find((d) => d.items.some((i) => i.id === r.itemId));
                return (
                  <div key={r.itemId} className="p-3 text-sm">
                    <div className="font-medium">{item?.prompt}</div>
                    <div className="text-xs text-muted-foreground">{dom?.name}{r.comment ? ` · ${r.comment}` : ""}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle className="text-base">Checklist Responses</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {CHECKLIST.map((d) => (
            <div key={d.id}>
              <div className="font-medium text-sm mb-2">{d.name}</div>
              <div className="border border-border rounded-md divide-y divide-border">
                {d.items.map((it) => {
                  const r = a.responses.find((x) => x.itemId === it.id);
                  const score = r?.score ?? 0;
                  return (
                    <div key={it.id} className="flex items-center justify-between gap-3 p-3 text-sm">
                      <div className="min-w-0">
                        <div>{it.prompt}</div>
                        {r?.comment && <div className="text-xs text-muted-foreground mt-0.5">{r.comment}</div>}
                      </div>
                      <div className="text-xs px-2 py-1 rounded-full" style={{ background: `color-mix(in oklab, ${bandColor(score === 3 ? "Excellent" : score === 2 ? "Good" : score === 1 ? "Fair" : "Poor")} 18%, transparent)`, color: bandColor(score === 3 ? "Excellent" : score === 2 ? "Good" : score === 1 ? "Fair" : "Poor") }}>
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
