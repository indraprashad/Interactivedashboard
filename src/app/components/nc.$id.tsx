import { useMemo } from "react";
import { useStore } from "../../../lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ScoreBadge } from "../components/ScoreBadge";
import { CHECKLIST } from "../data/checklist";
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Clock,
  ExternalLink,
  Calendar,
  MapPin,
  User,
} from "lucide-react";
import { format, differenceInDays, addDays } from "date-fns";
import { toast } from "sonner";

interface NCDetailProps {
  ncId: string;
  onBack: () => void;
  onViewAssessment: (id: string) => void;
  onStartFollowUp: (farmId: string, followUpOfAssessmentId: string) => void;
}

export function NCDetail({ ncId, onBack, onViewAssessment, onStartFollowUp }: NCDetailProps) {
  const nc = useStore((s) => s.ncs.find((n) => n.id === ncId));
  const farm = useStore((s) => s.farms.find((f) => f.id === nc?.farmId));
  const assessment = useStore((s) => s.assessments.find((a) => a.id === nc?.assessmentId));
  const inspector = useStore((s) => s.users.find((u) => u.id === assessment?.inspectorId));
  const allAssessments = useStore((s) => s.assessments);
  const followUps = useMemo(
    () =>
      allAssessments
        .filter((a) => a.followUpOfId === nc?.assessmentId && a.status !== "Draft")
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [allAssessments, nc?.assessmentId]
  );
  const closeNC = useStore((s) => s.closeNC);

  if (!nc || !farm || !assessment) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">NC record not found.</p>
        <Button variant="ghost" size="sm" className="mt-2" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
      </div>
    );
  }

  const daysActive = differenceInDays(new Date(), new Date(nc.raisedAt));
  const followUpEligibleDate = addDays(new Date(nc.raisedAt), 3);
  const isFollowUpEligible = followUpEligibleDate <= new Date();
  const domain = CHECKLIST.find((d) => d.id === nc.domainId);

  return (
    <div className="space-y-5 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-3xl border border-border/60 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="mt-0.5 flex-shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-sm text-muted-foreground font-mono">{nc.id}</span>
              {nc.active ? (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-amber-100 text-amber-700">
                  Active
                </span>
              ) : (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-700">
                  Closed
                </span>
              )}
              {nc.active && daysActive > 14 && (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-red-100 text-red-700">
                  Overdue
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{farm.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {farm.id} · {farm.type} · {farm.dzongkhag}
            </p>
          </div>
        </div>
        {nc.active && (
          <Button
            variant="outline"
            onClick={() => {
              closeNC(nc.id);
              toast.success("NC marked closed");
              onBack();
            }}
            className="flex-shrink-0"
          >
            <CheckCircle className="h-4 w-4 mr-1.5" /> Mark Closed
          </Button>
        )}
      </div>

      {/* Meta tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-white px-5 py-4 shadow-sm">
          <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <div>
            <div className="text-xs text-muted-foreground">Raised Date</div>
            <div className="text-sm font-medium">{format(new Date(nc.raisedAt), "dd MMM yyyy")}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-white px-5 py-4 shadow-sm">
          <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <div>
            <div className="text-xs text-muted-foreground">Days Active</div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{daysActive} days</span>
              {nc.active && daysActive > 14 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-red-100 text-red-600">
                  Overdue
                </span>
              )}
            </div>
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

      {/* NC Details card */}
      <Card className="rounded-3xl border-border/60 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Non-Compliance Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Domain</div>
              <div className="text-sm font-medium">{domain?.name ?? nc.domainId}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Score</div>
              {nc.score === 0 ? (
                <span className="inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-700">
                  0 · Poor
                </span>
              ) : (
                <span className="inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold bg-amber-100 text-amber-700">
                  1 · Fair
                </span>
              )}
            </div>
            {nc.closedAt && (
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Closed Date
                </div>
                <div className="text-sm font-medium">
                  {format(new Date(nc.closedAt), "dd MMM yyyy")}
                </div>
              </div>
            )}
          </div>
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              Checklist Item
            </div>
            <div className="rounded-xl border border-border bg-secondary/20 p-3 text-sm leading-relaxed">
              {nc.prompt}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Linked Assessment */}
      <Card className="rounded-3xl border-border/60 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Linked Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Assessment ID
                </div>
                <div className="text-sm font-mono font-medium">{assessment.id}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Date</div>
                <div className="text-sm font-medium">
                  {format(new Date(assessment.date), "dd MMM yyyy")}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Inspector
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm font-medium">{inspector?.name ?? "—"}</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Score</div>
                <ScoreBadge band={assessment.band} score={assessment.overallScore} />
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewAssessment(assessment.id)}
              className="flex-shrink-0"
            >
              <ExternalLink className="h-3.5 w-3.5 mr-1" /> View Assessment
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Follow-up eligibility & action */}
      {nc.active && (
        <Card
          className={`rounded-3xl shadow-sm ${
            isFollowUpEligible
              ? "border-emerald-200 bg-emerald-50/40"
              : "border-border/60"
          }`}
        >
          <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold">
                {isFollowUpEligible
                  ? "Follow-up Assessment Ready"
                  : "Follow-up Assessment Pending"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {isFollowUpEligible ? (
                  "3-day waiting period has elapsed. You may initiate a follow-up assessment."
                ) : (
                  <>
                    Eligible from{" "}
                    <span className="font-medium">
                      {format(followUpEligibleDate, "dd MMM yyyy")}
                    </span>{" "}
                    ({differenceInDays(followUpEligibleDate, new Date())} day
                    {differenceInDays(followUpEligibleDate, new Date()) !== 1 ? "s" : ""}{" "}
                    remaining)
                  </>
                )}
              </div>
            </div>
            <Button
              disabled={!isFollowUpEligible}
              onClick={() => onStartFollowUp(nc.farmId, nc.assessmentId)}
              className="flex-shrink-0"
            >
              <Clock className="h-4 w-4 mr-1.5" /> Initiate Follow-up
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Follow-up History */}
      {followUps.length > 0 && (
        <Card className="rounded-3xl border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Follow-up History ({followUps.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {followUps.map((fu) => (
                <div
                  key={fu.id}
                  className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-secondary/20 transition-colors"
                >
                  <div>
                    <div className="text-sm font-mono font-medium">{fu.id}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {format(new Date(fu.date), "dd MMM yyyy")} ·{" "}
                      {fu.ncCount === 0 ? (
                        <span className="text-emerald-600 font-medium">No NCs remaining</span>
                      ) : (
                        <span className="text-amber-600 font-medium">{fu.ncCount} NC remaining</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ScoreBadge band={fu.band} score={fu.overallScore} />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewAssessment(fu.id)}
                    >
                      <ExternalLink className="h-3.5 w-3.5 mr-1" /> View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
