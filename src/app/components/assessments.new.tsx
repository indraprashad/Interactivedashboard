import { useStore, useCurrentUser } from "../../../lib/store";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { ArrowLeft, Search, Plus, MapPin, ChevronRight } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { DZONGKHAGS } from "../data/dzongkhags";
import { GEWOG_BY_DZONGKHAG } from "../data/gewogs";
import type { Farm } from "../data/types";

interface NewAssessmentProps {
  onBack: () => void;
  onStart: (assessmentId: string) => void;
  initialTab?: Tab;
}

type Tab = "registered" | "non-registered";

const FARM_TYPES = ["Poultry", "Piggery"] as const;

export function NewAssessment({ onBack, onStart, initialTab }: NewAssessmentProps) {
  const allFarms = useStore((s) => s.farms);
  const farms = useMemo(
    () => allFarms.filter((f) => f.status === "Active" && f.source === "PPFRS"),
    [allFarms]
  );
  const saveAssessment = useStore((s) => s.saveAssessment);
  const addFarm = useStore((s) => s.addFarm);
  const user = useCurrentUser();

  const [tab, setTab] = useState<Tab>(initialTab ?? "registered");
  const [q, setQ] = useState("");
  const [farmPage, setFarmPage] = useState(1);
  const FARMS_PER_PAGE = 10;

  const [nrForm, setNrForm] = useState({
    ownerName: "",
    ownerCID: "",
    farmName: "",
    farmType: "Poultry" as (typeof FARM_TYPES)[number],
    dzongkhag: "",
    gewog: "",
    village: "",
    contact: "",
    size: "",
  });
  const [nrErrors, setNrErrors] = useState<Partial<typeof nrForm>>({});

  const filtered = useMemo(
    () =>
      farms.filter(
        (f) =>
          q === "" ||
          f.name.toLowerCase().includes(q.toLowerCase()) ||
          f.id.toLowerCase().includes(q.toLowerCase()) ||
          f.ownerName.toLowerCase().includes(q.toLowerCase())
      ),
    [farms, q]
  );

  useEffect(() => { setFarmPage(1); }, [q]);

  const totalFarmPages = Math.ceil(filtered.length / FARMS_PER_PAGE);
  const paginatedFarms = useMemo(
    () => filtered.slice((farmPage - 1) * FARMS_PER_PAGE, farmPage * FARMS_PER_PAGE),
    [filtered, farmPage]
  );

  const startFromFarm = (fid: string) => {
    const id = `ASMT-${Date.now().toString().slice(-6)}`;
    saveAssessment({
      id,
      farmId: fid,
      inspectorId: user?.id ?? "u1",
      date: new Date().toISOString(),
      status: "Draft",
      responses: [],
      domainScores: {},
      overallScore: 0,
      band: "Poor",
      ncCount: 0,
    });
    onStart(id);
  };

  const validateNr = () => {
    const errs: Partial<typeof nrForm> = {};
    if (!nrForm.ownerName.trim()) errs.ownerName = "Required";
    if (!nrForm.ownerCID.trim()) errs.ownerCID = "Required";
    if (!nrForm.farmName.trim()) errs.farmName = "Required";
    if (!nrForm.dzongkhag) errs.dzongkhag = "Required";
    if (!nrForm.gewog) errs.gewog = "Required";
    if (!nrForm.contact.trim()) errs.contact = "Required";
    return errs;
  };

  const startNonRegistered = () => {
    const errs = validateNr();
    if (Object.keys(errs).length > 0) { setNrErrors(errs); return; }

    const farmId = `NR-${Date.now().toString().slice(-6)}`;
    const farm: Farm = {
      id: farmId,
      name: nrForm.farmName,
      ownerName: nrForm.ownerName,
      ownerCID: nrForm.ownerCID,
      contact: nrForm.contact,
      type: nrForm.farmType,
      source: "Non-Registered",
      dzongkhag: nrForm.dzongkhag,
      gewog: nrForm.gewog,
      village: nrForm.village || nrForm.gewog,
      size: Number(nrForm.size) || 0,
      status: "Active",
      registrationDate: new Date().toISOString(),
      gps: { lat: 27.5, lng: 90.5 },
    };
    addFarm(farm);

    const assessmentId = `ASMT-${Date.now().toString().slice(-6)}`;
    saveAssessment({
      id: assessmentId,
      farmId,
      inspectorId: user?.id ?? "u1",
      date: new Date().toISOString(),
      status: "Draft",
      responses: [],
      domainScores: {},
      overallScore: 0,
      band: "Poor",
      ncCount: 0,
    });
    onStart(assessmentId);
  };

  const gewogs = nrForm.dzongkhag ? (GEWOG_BY_DZONGKHAG[nrForm.dzongkhag] ?? []) : [];

  return (
    <div className="space-y-5 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-3xl border border-border/60 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">New Assessment</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Select a registered farm or record a non-registered farm to begin
            </p>
          </div>
        </div>

        {/* Tab toggle */}
        <div className="flex rounded-xl border border-border overflow-hidden w-fit">
          <button
            onClick={() => setTab("registered")}
            className={`px-5 py-2.5 text-sm font-medium transition-colors ${
              tab === "registered"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:bg-secondary"
            }`}
          >
            Registered Farm
          </button>
          <button
            onClick={() => setTab("non-registered")}
            className={`px-5 py-2.5 text-sm font-medium transition-colors ${
              tab === "non-registered"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:bg-secondary"
            }`}
          >
            Non-Registered Farm
          </button>
        </div>
      </div>

      {tab === "registered" ? (
        <>
          {/* Search bar */}
          <Card className="rounded-3xl border-border/60 shadow-sm">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search by farm name, ID or owner name..."
                  className="h-11 rounded-xl pl-9"
                />
              </div>
            </CardContent>
          </Card>

          {/* Farm list */}
          <Card className="overflow-hidden rounded-3xl border-border/60 shadow-sm">
            <CardContent className="p-0">
              {/* Stats row */}
              <div className="border-b border-border bg-secondary/30 px-5 py-3 text-sm text-muted-foreground">
                Showing <span className="font-medium text-foreground">{paginatedFarms.length === 0 ? 0 : (farmPage - 1) * FARMS_PER_PAGE + 1}</span>–<span className="font-medium text-foreground">{Math.min(farmPage * FARMS_PER_PAGE, filtered.length)}</span> of{" "}
                <span className="font-medium text-foreground">{filtered.length}</span> active PPFRS farms
              </div>

              {filtered.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">No farms found</div>
              ) : (
                <div className="divide-y divide-border">
                  {paginatedFarms.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => startFromFarm(f.id)}
                      className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-secondary/30"
                    >
                      {/* Icon */}
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                        {f.type === "Poultry" ? "🐔" : "🐷"}
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm">{f.name}</span>
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                            {f.source}
                          </span>
                          <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
                            {f.type}
                          </span>
                        </div>
                        <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          {f.dzongkhag} · {f.gewog}
                          <span className="mx-1">·</span>
                          Owner: {f.ownerName}
                          <span className="mx-1">·</span>
                          {f.id}
                        </div>
                      </div>

                      {/* Stock */}
                      <div className="hidden text-right text-sm sm:block">
                        <div className="font-medium">{f.size.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">
                          {f.type === "Poultry" ? "birds" : "pigs"}
                        </div>
                      </div>

                      <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {totalFarmPages > 1 && (
            <Card className="rounded-3xl border-border/60 shadow-sm">
              <CardContent className="flex items-center justify-between px-5 py-3">
                <span className="text-sm text-muted-foreground">Page {farmPage} of {totalFarmPages}</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={farmPage === 1} onClick={() => setFarmPage(p => p - 1)}>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" disabled={farmPage === totalFarmPages} onClick={() => setFarmPage(p => p + 1)}>
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        /* Non-registered form */
        <Card className="rounded-3xl border-border/60 shadow-sm">
          <CardContent className="p-6">
            <div className="mb-5">
              <h2 className="text-lg font-semibold">Farm & Owner Details</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Fields marked * are required before the assessment can begin
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {/* Owner Name */}
              <div className="space-y-1.5">
                <Label>Owner Name *</Label>
                <Input
                  value={nrForm.ownerName}
                  onChange={(e) => setNrForm({ ...nrForm, ownerName: e.target.value })}
                  placeholder="Full name"
                />
                {nrErrors.ownerName && <p className="text-xs text-[var(--poor)]">{nrErrors.ownerName}</p>}
              </div>

              {/* Owner CID */}
              <div className="space-y-1.5">
                <Label>Owner CID *</Label>
                <Input
                  value={nrForm.ownerCID}
                  onChange={(e) => setNrForm({ ...nrForm, ownerCID: e.target.value })}
                  placeholder="11-digit CID number"
                />
                {nrErrors.ownerCID && <p className="text-xs text-[var(--poor)]">{nrErrors.ownerCID}</p>}
              </div>

              {/* Mobile */}
              <div className="space-y-1.5">
                <Label>Mobile No. *</Label>
                <Input
                  value={nrForm.contact}
                  onChange={(e) => setNrForm({ ...nrForm, contact: e.target.value })}
                  placeholder="17XXXXXX"
                />
                {nrErrors.contact && <p className="text-xs text-[var(--poor)]">{nrErrors.contact}</p>}
              </div>

              {/* Farm Name */}
              <div className="space-y-1.5">
                <Label>Farm Name *</Label>
                <Input
                  value={nrForm.farmName}
                  onChange={(e) => setNrForm({ ...nrForm, farmName: e.target.value })}
                  placeholder="Farm name"
                />
                {nrErrors.farmName && <p className="text-xs text-[var(--poor)]">{nrErrors.farmName}</p>}
              </div>

              {/* Farm Type */}
              <div className="space-y-1.5">
                <Label>Farm Type *</Label>
                <Select
                  value={nrForm.farmType}
                  onValueChange={(v) => setNrForm({ ...nrForm, farmType: v as typeof nrForm.farmType })}
                >
                  <SelectTrigger className="h-10 rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {FARM_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Stock Size */}
              <div className="space-y-1.5">
                <Label>Stock Size</Label>
                <Input
                  type="number"
                  value={nrForm.size}
                  onChange={(e) => setNrForm({ ...nrForm, size: e.target.value })}
                  placeholder="Number of birds / pigs"
                />
              </div>

              {/* Dzongkhag */}
              <div className="space-y-1.5">
                <Label>Dzongkhag *</Label>
                <Select
                  value={nrForm.dzongkhag}
                  onValueChange={(v) => setNrForm({ ...nrForm, dzongkhag: v, gewog: "" })}
                >
                  <SelectTrigger className="h-10 rounded-xl">
                    <SelectValue placeholder="Select dzongkhag" />
                  </SelectTrigger>
                  <SelectContent>
                    {DZONGKHAGS.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {nrErrors.dzongkhag && <p className="text-xs text-[var(--poor)]">{nrErrors.dzongkhag}</p>}
              </div>

              {/* Gewog */}
              <div className="space-y-1.5">
                <Label>Gewog *</Label>
                <Select
                  value={nrForm.gewog}
                  onValueChange={(v) => setNrForm({ ...nrForm, gewog: v })}
                  disabled={!nrForm.dzongkhag}
                >
                  <SelectTrigger className="h-10 rounded-xl">
                    <SelectValue placeholder={nrForm.dzongkhag ? "Select gewog" : "Select dzongkhag first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {gewogs.map((g) => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {nrErrors.gewog && <p className="text-xs text-[var(--poor)]">{nrErrors.gewog}</p>}
              </div>

              {/* Village */}
              <div className="space-y-1.5">
                <Label>Village</Label>
                <Input
                  value={nrForm.village}
                  onChange={(e) => setNrForm({ ...nrForm, village: e.target.value })}
                  placeholder="Village name"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button size="lg" onClick={startNonRegistered}>
                <Plus className="h-4 w-4 mr-1.5" /> Start Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
