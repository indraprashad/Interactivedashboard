import { useMemo } from "react";
import { useStore } from "../../../lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ArrowLeft, MapPin, Phone, User, Calendar, ClipboardList } from "lucide-react";
import { format } from "date-fns";
import { ScoreBadge } from "../components/ScoreBadge";

interface FarmDetailProps {
  farmId: string;
  onBack: () => void;
}

export function FarmDetail({ farmId, onBack }: FarmDetailProps) {
  const farm = useStore((s) => s.farms.find((f) => f.id === farmId));
  const allAssessments = useStore((s) => s.assessments);
  const users = useStore((s) => s.users);

  const assessments = useMemo(
    () =>
      [...allAssessments.filter((a) => a.farmId === farmId)].sort(
        (a, b) => +new Date(b.date) - +new Date(a.date)
      ),
    [allAssessments, farmId]
  );

  if (!farm) {
    return (
      <div className="p-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <p className="mt-4 text-muted-foreground">Farm not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-3xl border border-border/60 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="mt-0.5 flex-shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-sm text-muted-foreground font-mono">{farm.id}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  farm.source === "PPFRS"
                    ? "bg-primary/10 text-primary"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {farm.source}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  farm.status === "Active"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {farm.status}
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{farm.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{farm.type} Farm</p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-xs text-muted-foreground">Total Assessments</div>
          <div className="text-3xl font-bold">{assessments.length}</div>
        </div>
      </div>

      {/* Detail tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-white px-5 py-4 shadow-sm">
          <User className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-xs text-muted-foreground">Owner</div>
            <div className="text-sm font-medium">{farm.ownerName}</div>
            <div className="text-xs text-muted-foreground mt-0.5">CID: {farm.ownerCID}</div>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-white px-5 py-4 shadow-sm">
          <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-xs text-muted-foreground">Contact</div>
            <div className="text-sm font-medium">{farm.contact || "—"}</div>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-white px-5 py-4 shadow-sm">
          <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-xs text-muted-foreground">Location</div>
            <div className="text-sm font-medium">
              {farm.dzongkhag} · {farm.gewog}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">{farm.village}</div>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-white px-5 py-4 shadow-sm">
          <ClipboardList className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-xs text-muted-foreground">Stock Size</div>
            <div className="text-sm font-medium">
              {farm.size.toLocaleString()}{" "}
              {farm.type === "Poultry" ? "birds" : "pigs"}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-white px-5 py-4 shadow-sm">
          <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-xs text-muted-foreground">Registration Date</div>
            <div className="text-sm font-medium">
              {format(new Date(farm.registrationDate), "dd MMM yyyy")}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-white px-5 py-4 shadow-sm">
          <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-xs text-muted-foreground">GPS</div>
            <div className="text-sm font-medium font-mono">
              {farm.gps.lat.toFixed(4)}, {farm.gps.lng.toFixed(4)}
            </div>
          </div>
        </div>
      </div>

      {/* Assessment history */}
      <Card className="rounded-3xl border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">
            Assessment History ({assessments.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {assessments.length === 0 ? (
            <p className="p-8 text-center text-muted-foreground">
              No assessments recorded for this farm
            </p>
          ) : (
            <div className="divide-y divide-border">
              {assessments.map((a) => {
                const inspector = users.find((u) => u.id === a.inspectorId);
                const statusColor =
                  a.status === "Submitted"
                    ? "bg-emerald-100 text-emerald-800"
                    : a.status === "NC-Follow-Up"
                    ? "bg-orange-100 text-orange-800"
                    : "bg-secondary text-muted-foreground";
                return (
                  <div
                    key={a.id}
                    className="flex items-center justify-between gap-4 px-6 py-4"
                  >
                    <div>
                      <div className="text-sm font-medium font-mono">{a.id}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {format(new Date(a.date), "dd MMM yyyy")} ·{" "}
                        {inspector?.name ?? "—"}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap justify-end">
                      <ScoreBadge band={a.band} score={a.overallScore} />
                      {a.ncCount > 0 && (
                        <span className="text-xs text-[var(--poor)] font-medium">
                          {a.ncCount} NC
                        </span>
                      )}
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor}`}
                      >
                        {a.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
