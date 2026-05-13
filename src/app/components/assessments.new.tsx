import { AppShell } from "../data/AppShell";
import { useStore, useCurrentUser } from "../../../lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ArrowLeft, Search, Plus, Route } from "lucide-react";
import { useState } from "react";

interface Search { farmId?: string } 

export function NewAssessment() {
  const farms = useStore((s) => s.farms.filter((f) => f.status === "Active"));
  const saveAssessment = useStore((s) => s.saveAssessment);
  const user = useCurrentUser();
  const [q, setQ] = useState("");

  const start = (fid: string) => {
    const id = `ASMT-${Date.now().toString().slice(-6)}`;
    saveAssessment({
      id, farmId: fid, inspectorId: user?.id ?? "u1",
      date: new Date().toISOString(), status: "Draft",
      responses: [], domainScores: {}, overallScore: 0, band: "Poor", ncCount: 0,
    });
  };


  const filtered = farms.filter((f) => q === "" || f.name.toLowerCase().includes(q.toLowerCase()) || f.id.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-4 max-w-3xl">
      <Button variant="ghost" size="sm" asChild><div onClick={() => window.location.href = "/assessments"}><ArrowLeft className="h-4 w-4 mr-1" /> Back</div></Button>
      <Card>
        <CardHeader>
          <CardTitle>Start New Assessment</CardTitle>
          <p className="text-sm text-muted-foreground">Pick a farm or <div onClick={() => window.location.href = "/farms/new"} className="text-primary underline">register a non-registered farm</div>.</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search farms..." className="pl-8" />
          </div>
          <div className="divide-y divide-border max-h-[60vh] overflow-y-auto rounded-md border border-border">
            {filtered.map((f) => (
              <button key={f.id} onClick={() => start(f.id)} className="flex w-full items-center justify-between p-3 text-left hover:bg-secondary/50">
                <div>
                  <div className="font-medium text-sm">{f.name}</div>
                  <div className="text-xs text-muted-foreground">{f.id} · {f.type} · {f.dzongkhag}</div>
                </div>
                <Plus className="h-4 w-4 text-primary" />
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
