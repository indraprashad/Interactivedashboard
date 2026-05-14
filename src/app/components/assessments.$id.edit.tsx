import { useStore } from "../../../lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Input } from "../components/ui/input";
import { CHECKLIST, SCORE_LABELS } from "../data/checklist";
import { computeScores, ncCount } from "../data/assessments";
import type { ItemResponse, ScoreValue, AssessmentType, FarmCategory } from "../data/types";
import { useState, useMemo } from "react";
import { ArrowLeft, ArrowRight, Save, Send, Camera, MapPin, Crosshair, ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { cn } from "../../../lib/utils";

interface WizardProps {
  assessmentId: string;
  onDone: () => void;
}

const ASSESSMENT_TYPES: AssessmentType[] = [
  "Regular", "On Request", "Follow-Up", "Complaint", "Disease Outbreak",
];
const FARM_CATEGORIES: FarmCategory[] = ["Commercial", "Semi-Commercial", "Subsistence"];

// step 0 = Overview, step 1..N = domains, step N+1 = Review
const OVERVIEW_STEP = 0;

export function Wizard({ assessmentId, onDone }: WizardProps) {
  const a    = useStore((s) => s.assessments.find((x) => x.id === assessmentId));
  const farm = useStore((s) => s.farms.find((f) => f.id === a?.farmId));
  const save = useStore((s) => s.saveAssessment);

  const [responses, setResponses] = useState<ItemResponse[]>(a?.responses ?? []);
  const [step, setStep] = useState(OVERVIEW_STEP);
  const [notes, setNotes] = useState(a?.notes ?? "");

  // Overview fields (FR-08)
  const [assessmentType, setAssessmentType] = useState<AssessmentType>(a?.assessmentType ?? "Regular");
  const [animalCount, setAnimalCount]         = useState<string>(a?.animalCount?.toString() ?? "");
  const [farmCategory, setFarmCategory]       = useState<FarmCategory>(a?.farmCategory ?? "Commercial");

  // GPS capture (FR-09)
  const [capturedGps, setCapturedGps] = useState<{ lat: number; lng: number } | null>(a?.gps ?? null);
  const [gpsLoading, setGpsLoading]   = useState(false);

  const totals = useMemo(() => {
    const { domainScores, overallScore, band } = computeScores(responses);
    return { domainScores, overallScore, band, nc: ncCount(responses) };
  }, [responses]);

  if (!a || !farm) return <div>Not found</div>;

  const domains = CHECKLIST;
  const REVIEW_STEP = domains.length + 1;
  const isOverview = step === OVERVIEW_STEP;
  const isReview   = step === REVIEW_STEP;
  const domainStep = step - 1; // 0-based domain index when in domain steps

  const setResponse = (itemId: string, patch: Partial<ItemResponse>) => {
    setResponses((curr) => {
      const ex = curr.find((r) => r.itemId === itemId);
      if (ex) return curr.map((r) => r.itemId === itemId ? { ...r, ...patch } : r);
      return [...curr, { itemId, score: 0, ...patch }];
    });
  };

  const captureGps = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported by this browser");
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCapturedGps({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGpsLoading(false);
        toast.success("GPS coordinates captured");
      },
      () => {
        setGpsLoading(false);
        toast.error("Could not get GPS location — check browser permissions");
      },
      { timeout: 10000 }
    );
  };

  const persist = (status: typeof a.status) => {
    save({
      ...a,
      responses,
      ...totals,
      ncCount:        totals.nc,
      status,
      notes,
      assessmentType,
      animalCount:    animalCount ? parseInt(animalCount, 10) : undefined,
      farmCategory,
      gps:            capturedGps ?? a.gps,
    });
  };

  const saveDraft = () => { persist("Draft"); toast.success("Draft saved"); };
  const submit = () => {
    const status = totals.nc > 0 ? "NC-Follow-Up" : "Submitted";
    persist(status);
    if (totals.nc > 0) toast.warning(`${totals.nc} NC found · pushed to PPFRS`);
    else toast.success("Assessment submitted · score pushed to PPFRS");
    onDone();
  };

  const gpsDisplay = capturedGps
    ? `${capturedGps.lat.toFixed(5)}, ${capturedGps.lng.toFixed(5)}`
    : farm.gps
    ? `${farm.gps.lat.toFixed(5)}, ${farm.gps.lng.toFixed(5)} (farm default)`
    : "Not captured";

  return (
    <div className="space-y-5 p-6">
      {/* Header card */}
      <div className="flex flex-col gap-4 rounded-3xl border border-border/60 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <Button variant="ghost" size="sm" onClick={onDone} className="mt-0.5 flex-shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{farm.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {farm.id} · {farm.type} · {farm.dzongkhag}
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button variant="outline" onClick={saveDraft}>
            <Save className="h-4 w-4 mr-1.5" /> Save Draft
          </Button>
          <Button onClick={submit}>
            <Send className="h-4 w-4 mr-1.5" /> Submit
          </Button>
        </div>
      </div>

      {/* Step tabs */}
      <div className="rounded-3xl border border-border/60 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {/* Overview tab */}
          <button
            onClick={() => setStep(OVERVIEW_STEP)}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-medium border transition-colors",
              isOverview
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-secondary/40 border-border text-muted-foreground hover:bg-secondary",
            )}
          >
            Overview
          </button>
          {/* Domain tabs */}
          {domains.map((d, i) => (
            <button
              key={d.id}
              onClick={() => setStep(i + 1)}
              className={cn(
                "rounded-xl px-4 py-2 text-sm font-medium border transition-colors",
                step === i + 1
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary/40 border-border text-muted-foreground hover:bg-secondary",
              )}
            >
              {i + 1}. {d.name}
            </button>
          ))}
          <button
            onClick={() => setStep(REVIEW_STEP)}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-medium border transition-colors",
              isReview
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-secondary/40 border-border text-muted-foreground hover:bg-secondary",
            )}
          >
            Review &amp; Submit
          </button>
        </div>
      </div>

      {/* Overview step */}
      {isOverview && (
        <Card className="rounded-3xl border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-muted-foreground" />
              Assessment Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Assessment Type */}
            <div>
              <label className="text-sm font-medium mb-2 block">Assessment Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ASSESSMENT_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setAssessmentType(t)}
                    className={cn(
                      "rounded-xl border py-2.5 px-3 text-sm font-medium transition-colors text-left",
                      assessmentType === t
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border bg-white hover:bg-secondary",
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Farm Category */}
            <div>
              <label className="text-sm font-medium mb-2 block">Farm Category</label>
              <div className="grid grid-cols-3 gap-2">
                {FARM_CATEGORIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFarmCategory(c)}
                    className={cn(
                      "rounded-xl border py-2.5 text-sm font-medium transition-colors",
                      farmCategory === c
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border bg-white hover:bg-secondary",
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Animal Count */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Number of Animals / Birds Present at Time of Assessment
              </label>
              <Input
                type="number"
                min={0}
                placeholder="e.g. 250"
                value={animalCount}
                onChange={(e) => setAnimalCount(e.target.value)}
                className="rounded-xl max-w-xs"
              />
            </div>

            {/* GPS Capture */}
            <div>
              <label className="text-sm font-medium mb-2 block">GPS Coordinates</label>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground rounded-xl border border-border bg-secondary/20 px-4 py-2.5 flex-1">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="font-mono text-xs">{gpsDisplay}</span>
                </div>
                <Button
                  variant="outline"
                  onClick={captureGps}
                  disabled={gpsLoading}
                  className="flex-shrink-0"
                >
                  <Crosshair className="h-4 w-4 mr-1.5" />
                  {gpsLoading ? "Capturing…" : capturedGps ? "Re-capture" : "Capture GPS"}
                </Button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={() => setStep(1)}>
                Start Checklist <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Domain step */}
      {!isOverview && !isReview && (
        <Card className="rounded-3xl border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{domains[domainStep].name}</CardTitle>
              <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                Weight: {(domains[domainStep].weight * 100).toFixed(0)}%
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {domains[domainStep].items.map((it) => {
              const r = responses.find((x) => x.itemId === it.id);
              return (
                <div key={it.id} className="rounded-xl border border-border bg-secondary/20 p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="text-sm font-medium">{it.prompt}</div>
                      {it.guidance && (
                        <div className="text-xs text-muted-foreground mt-1">{it.guidance}</div>
                      )}
                    </div>
                    <label className="text-xs flex items-center gap-1.5 text-muted-foreground whitespace-nowrap cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded"
                        checked={r?.na ?? false}
                        onChange={(e) => setResponse(it.id, { na: e.target.checked })}
                      />
                      N/A
                    </label>
                  </div>
                  {!r?.na && (
                    <>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[0, 1, 2, 3].map((v) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => setResponse(it.id, { score: v as ScoreValue })}
                            className={cn(
                              "rounded-xl border py-2.5 text-xs font-semibold transition-colors",
                              r?.score === v
                                ? v === 0
                                  ? "bg-[var(--poor)] text-white border-[var(--poor)]"
                                  : v === 1
                                  ? "bg-[var(--fair)] text-foreground border-[var(--fair)]"
                                  : v === 2
                                  ? "bg-[var(--good)] text-foreground border-[var(--good)]"
                                  : "bg-[var(--excellent)] text-white border-[var(--excellent)]"
                                : "border-border bg-white hover:bg-secondary",
                            )}
                          >
                            {v} · {SCORE_LABELS[v]}
                          </button>
                        ))}
                      </div>
                      <Textarea
                        placeholder="Comment / observation (optional)"
                        rows={2}
                        value={r?.comment ?? ""}
                        onChange={(e) => setResponse(it.id, { comment: e.target.value })}
                        className="rounded-xl"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        className="text-xs"
                        onClick={() => setResponse(it.id, { photoCount: (r?.photoCount ?? 0) + 1 })}
                      >
                        <Camera className="h-3.5 w-3.5 mr-1" />
                        Add Photo {r?.photoCount ? `(${r.photoCount})` : ""}
                      </Button>
                    </>
                  )}
                </div>
              );
            })}
            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setStep((s) => s - 1)}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <Button onClick={() => setStep((s) => s + 1)}>
                Next <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review step */}
      {isReview && (
        <Card className="rounded-3xl border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Review &amp; Submit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Overview summary */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-border bg-secondary/20 p-4">
                <div className="text-[11px] text-muted-foreground uppercase tracking-wide">Assessment Type</div>
                <div className="text-sm font-semibold mt-1">{assessmentType}</div>
              </div>
              <div className="rounded-xl border border-border bg-secondary/20 p-4">
                <div className="text-[11px] text-muted-foreground uppercase tracking-wide">Farm Category</div>
                <div className="text-sm font-semibold mt-1">{farmCategory}</div>
              </div>
              <div className="rounded-xl border border-border bg-secondary/20 p-4">
                <div className="text-[11px] text-muted-foreground uppercase tracking-wide">Animals Present</div>
                <div className="text-sm font-semibold mt-1">{animalCount || "—"}</div>
              </div>
            </div>

            {/* Domain score tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {domains.map((d) => (
                <div key={d.id} className="rounded-xl border border-border bg-secondary/20 p-4">
                  <div className="text-[11px] text-muted-foreground leading-tight">{d.name}</div>
                  <div className="text-2xl font-bold mt-1">{totals.domainScores[d.id] ?? 0}</div>
                </div>
              ))}
            </div>

            {/* Overall score */}
            <div className="rounded-xl border border-border bg-secondary/20 p-5 flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Overall Score</div>
                <div className="text-4xl font-bold mt-1">{totals.overallScore}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Compliance Band</div>
                <div className="text-xl font-bold mt-1">{totals.band}</div>
                <div className="text-sm text-[var(--poor)] mt-0.5">
                  {totals.nc} NC item{totals.nc === 1 ? "" : "s"}
                </div>
              </div>
            </div>

            <Textarea
              placeholder="Final notes / observations"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="rounded-xl"
            />

            {/* GPS row */}
            <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/20 px-4 py-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                GPS: <span className="font-mono ml-1">{gpsDisplay}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={captureGps} disabled={gpsLoading} className="text-xs">
                <Crosshair className="h-3.5 w-3.5 mr-1" />
                {gpsLoading ? "…" : capturedGps ? "Re-capture" : "Capture"}
              </Button>
            </div>

            <div className="flex justify-between items-center pt-1">
              <Button variant="outline" onClick={() => setStep((s) => s - 1)}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={saveDraft}>
                  <Save className="h-4 w-4 mr-1.5" /> Save Draft
                </Button>
                <Button onClick={submit}>
                  <Send className="h-4 w-4 mr-1.5" /> Submit Assessment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
