import { useStore } from "../../../lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { CHECKLIST, SCORE_LABELS } from "../data/checklist";
import { computeScores, ncCount } from "../data/assessments";
import type { ItemResponse, ScoreValue } from "../data/types";
import { useState, useMemo } from "react";
import { ArrowLeft, ArrowRight, Save, Send, Camera, MapPin } from "lucide-react";
import { toast } from "sonner";
import { cn } from "../../../lib/utils";
import { useNavigate } from "@tanstack/react-router";


function Wizard() {
  const a = useStore((s) => s.assessments.find((x) => x.id === "1"));
  const farm = useStore((s) => s.farms.find((f) => f.id === a?.farmId));
  const save = useStore((s) => s.saveAssessment);
  const navigate = useNavigate();
  const [responses, setResponses] = useState<ItemResponse[]>(a?.responses ?? []);
  const [step, setStep] = useState(0);
  const [notes, setNotes] = useState(a?.notes ?? "");

  const totals = useMemo(() => {
    const { domainScores, overallScore, band } = computeScores(responses);
    return { domainScores, overallScore, band, nc: ncCount(responses) };
  }, [responses]);

  if (!a || !farm) return <div>Not found</div>;

  const setResponse = (itemId: string, patch: Partial<ItemResponse>) => {
    setResponses((curr) => {
      const ex = curr.find((r) => r.itemId === itemId);
      if (ex) return curr.map((r) => r.itemId === itemId ? { ...r, ...patch } : r);
      return [...curr, { itemId, score: 0, ...patch }];
    });
  };

  const persist = (status: typeof a.status) => {
    save({ ...a, responses, ...totals, ncCount: totals.nc, status, notes });
  };

  const saveDraft = () => { persist("Draft"); toast.success("Draft saved"); };
  const submit = () => {
    const status = totals.nc > 0 ? "NC-Follow-Up" : "Submitted";
    persist(status);
    if (totals.nc > 0) toast.warning(`${totals.nc} NC found · pushed to PPFRS`);
    else toast.success("Assessment submitted · score pushed to PPFRS");
    navigate({ to: "/assessments/$id", params: { id: a.id } });
  };

  const domains = CHECKLIST;
  const isLast = step === domains.length;

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <Button variant="ghost" size="sm" asChild><div onClick={() => navigate({ to: "/assessments/$id", params: { id: a.id } })}><ArrowLeft className="h-4 w-4 mr-1" /> Cancel</div></Button>
          <h1 className="text-2xl font-semibold mt-1">{farm.name}</h1>
          <p className="text-sm text-muted-foreground">{farm.id} · {farm.type} · {farm.dzongkhag}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={saveDraft}><Save className="h-4 w-4 mr-1" /> Save Draft</Button>
          <Button size="sm" onClick={submit}><Send className="h-4 w-4 mr-1" /> Submit</Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {domains.map((d, i) => (
          <button key={d.id} onClick={() => setStep(i)} className={cn(
            "text-xs rounded-full px-3 py-1 border transition-colors",
            step === i ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:bg-secondary",
          )}>{i + 1}. {d.name}</button>
        ))}
        <button onClick={() => setStep(domains.length)} className={cn(
          "text-xs rounded-full px-3 py-1 border transition-colors",
          isLast ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:bg-secondary",
        )}>Review & Submit</button>
      </div>

      {!isLast ? (
        <Card>
          <CardHeader><CardTitle className="text-base">{domains[step].name}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {domains[step].items.map((it) => {
              const r = responses.find((x) => x.itemId === it.id);
              return (
                <div key={it.id} className="border border-border rounded-md p-3 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-sm font-medium">{it.prompt}</div>
                    <label className="text-xs flex items-center gap-1 text-muted-foreground">
                      <input type="checkbox" checked={r?.na ?? false} onChange={(e) => setResponse(it.id, { na: e.target.checked })} /> N/A
                    </label>
                  </div>
                  {!r?.na && (
                    <>
                      <div className="grid grid-cols-4 gap-2">
                        {[0, 1, 2, 3].map((v) => (
                          <button key={v} type="button" onClick={() => setResponse(it.id, { score: v as ScoreValue })} className={cn(
                            "rounded-md border py-2 text-xs font-medium transition-colors",
                            r?.score === v
                              ? v === 0 ? "bg-[var(--poor)] text-white border-[var(--poor)]"
                              : v === 1 ? "bg-[var(--fair)] text-foreground border-[var(--fair)]"
                              : v === 2 ? "bg-[var(--good)] text-foreground border-[var(--good)]"
                              : "bg-[var(--excellent)] text-white border-[var(--excellent)]"
                              : "border-border hover:bg-secondary",
                          )}>{v} · {SCORE_LABELS[v]}</button>
                        ))}
                      </div>
                      <Textarea placeholder="Comment / observation (optional)" rows={2} value={r?.comment ?? ""} onChange={(e) => setResponse(it.id, { comment: e.target.value })} />
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Button variant="ghost" size="sm" type="button" onClick={() => setResponse(it.id, { photoCount: (r?.photoCount ?? 0) + 1 })}>
                          <Camera className="h-3 w-3 mr-1" /> Add Photo {r?.photoCount ? `(${r.photoCount})` : ""}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
            <div className="flex justify-between pt-2">
              <Button variant="outline" disabled={step === 0} onClick={() => setStep((s) => s - 1)}><ArrowLeft className="h-4 w-4 mr-1" /> Previous</Button>
              <Button onClick={() => setStep((s) => s + 1)}>Next <ArrowRight className="h-4 w-4 ml-1" /></Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader><CardTitle className="text-base">Review & Submit</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-5 gap-2">
              {domains.map((d) => (
                <div key={d.id} className="rounded-md border border-border p-3">
                  <div className="text-[11px] text-muted-foreground">{d.name}</div>
                  <div className="text-xl font-semibold">{totals.domainScores[d.id] ?? 0}</div>
                </div>
              ))}
            </div>
            <div className="rounded-md border border-border p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Overall Score</div>
                <div className="text-3xl font-semibold">{totals.overallScore}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Compliance Band</div>
                <div className="text-lg font-semibold">{totals.band}</div>
                <div className="text-xs text-[var(--poor)]">{totals.nc} NC item{totals.nc === 1 ? "" : "s"}</div>
              </div>
            </div>
            <Textarea placeholder="Final notes / observations" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" /> GPS: {farm.gps.lat.toFixed(4)}, {farm.gps.lng.toFixed(4)}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={saveDraft}>Save Draft</Button>
              <Button onClick={submit}><Send className="h-4 w-4 mr-1" /> Submit Assessment</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
