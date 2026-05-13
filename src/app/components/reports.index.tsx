import { AppShell } from "../data/AppShell";
import { Card, CardContent } from "../components/ui/card";
import { ArrowRight } from "lucide-react";

export const REPORTS = [
  { id: "by-dzongkhag", title: "Farms Assessed by Dzongkhag", desc: "Geographic distribution of completed assessments." },
  { id: "compliance-distribution", title: "Compliance Status Distribution", desc: "Breakdown of Poor / Fair / Good / Excellent." },
  { id: "nc-trends", title: "NC Trends Over Time", desc: "Monthly non-compliance counts." },
  { id: "top-nc-categories", title: "Top NC Categories", desc: "Most frequent non-compliant items." },
  { id: "inspector-activity", title: "Inspector Activity Report", desc: "Assessments per inspector." },
  { id: "risk-classification", title: "Farm Risk Classification", desc: "High / medium / low risk farms." },
  { id: "follow-up-status", title: "Follow-Up Status Report", desc: "Open vs closed follow-ups." },
  { id: "score-distribution", title: "Score Distribution Histogram", desc: "Histogram of overall scores." },
  { id: "dzongkhag-comparison", title: "Dzongkhag Comparison", desc: "Avg scores across dzongkhags." },
  { id: "improvement", title: "Farm Performance Improvement", desc: "Score trend per farm over assessments." },
  { id: "notification-log", title: "Notification Log", desc: "Notifications sent to DLO / EC / BFDA." },
] as const;

export function Reports() {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2 bg-white rounded-lg p-4">
        <h1 className="text-2xl font-semibold">Reports</h1>
        <p className="text-sm text-muted-foreground">
          Aggregated reports and Excel exports
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {REPORTS.map((r) => (
          <div key={r.id}>
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium">{r.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {r.desc}
                  </div>
                </div>

                <ArrowRight className="h-4 w-4 text-muted-foreground mt-1" />
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}