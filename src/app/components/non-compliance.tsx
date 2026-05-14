import { useMemo, useState } from "react";
import { format, differenceInDays, addDays } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";

import { toast } from "sonner";

import { useStore } from "../../../lib/store";

import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

import { ComplianceTag } from "../components/ScoreBadge";

import { ExportButton } from "../data/ExportButton";
import { CHECKLIST } from "../data/checklist";

const PER_PAGE = 10;

interface NCListProps {
  onView?: (ncId: string) => void;
}

export function NCList({ onView }: NCListProps) {
  const {
    ncs,
    farms,
    closeNC,
  } = useStore();

  const [q, setQ] = useState("");
  const [status, setStatus] =
    useState("all");
  const [page, setPage] =
    useState(1);

  const enriched = useMemo(
    () =>
      ncs
        .map((n) => ({
          ...n,
          farm: farms.find(
            (f) =>
              f.id === n.farmId
          ),
          domain:
            CHECKLIST.find(
              (d) =>
                d.id ===
                n.domainId
            )?.name,
        }))
        .filter(
          (n) =>
            (status === "all" ||
              (status ===
                "active" &&
                n.active) ||
              (status ===
                "closed" &&
                !n.active)) &&
            (q === "" ||
              n.id
                .toLowerCase()
                .includes(
                  q.toLowerCase()
                ) ||
              (
                n.farm?.name ??
                ""
              )
                .toLowerCase()
                .includes(
                  q.toLowerCase()
                ) ||
              (
                n.prompt ??
                ""
              )
                .toLowerCase()
                .includes(
                  q.toLowerCase()
                ))
        )
        .sort(
          (a, b) =>
            +new Date(
              b.raisedAt
            ) -
            +new Date(
              a.raisedAt
            )
        ),
    [ncs, farms, q, status]
  );

  const capped = useMemo(() => enriched.slice(0, 20), [enriched]);

  const totalPages = Math.ceil(capped.length / PER_PAGE);

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return capped.slice(start, start + PER_PAGE);
  }, [capped, page]);

  const exportRows = enriched.map(
    (n) => ({
      nc_id: n.id,
      farm: n.farm?.name,
      dzongkhag:
        n.farm?.dzongkhag,
      domain: n.domain,
      prompt: n.prompt,
      raised: format(
        new Date(n.raisedAt),
        "yyyy-MM-dd"
      ),
      status: n.active
        ? "Active"
        : "Closed",
    })
  );

  const handleSearch = (
    value: string
  ) => {
    setQ(value);
    setPage(1);
  };

  const handleStatusChange = (
    value: string
  ) => {
    setStatus(value);
    setPage(1);
  };

  const today = new Date();
  const activeCount  = ncs.filter((n) => n.active).length;
  const closedCount  = ncs.filter((n) => !n.active).length;
  const overdueCount = ncs.filter(
    (n) => n.active && differenceInDays(today, new Date(n.raisedAt)) > 14
  ).length;

  return (
    <div className="space-y-5 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-3xl border border-border/60 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Non-Compliance Register</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Showing {capped.length} of {enriched.length} records
          </p>
        </div>
        <ExportButton filename="non-compliance.csv" rows={exportRows} />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="rounded-3xl border-border/60 shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Active NCs</p>
            <p className="mt-1 text-3xl font-bold text-amber-500">{activeCount}</p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-border/60 shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Closed NCs</p>
            <p className="mt-1 text-3xl font-bold text-[#1a6b58]">{closedCount}</p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-border/60 shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Overdue (&gt;14 days)</p>
            <p className="mt-1 text-3xl font-bold text-[#c2410c]">{overdueCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="rounded-3xl border-border/60 shadow-sm">
        <CardContent
          className="
            grid gap-3 p-4
            lg:grid-cols-3
          "
        >
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search
              className="
                absolute left-3 top-1/2
                h-4 w-4
                -translate-y-1/2
                text-muted-foreground
              "
            />

            <Input
              value={q}
              onChange={(e) =>
                handleSearch(
                  e.target.value
                )
              }
              placeholder="Search by NC ID, farm or item..."
              className="
                h-11 rounded-xl
                pl-9
              "
            />
          </div>

          {/* Status */}
          <Select
            value={status}
            onValueChange={
              handleStatusChange
            }
          >
            <SelectTrigger className="h-11 rounded-xl">
              <SelectValue placeholder="Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">
                All Status
              </SelectItem>

              <SelectItem value="active">
                Active
              </SelectItem>

              <SelectItem value="closed">
                Closed
              </SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* List */}
      <Card className="overflow-hidden rounded-3xl border-border/60 shadow-sm">
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {paginatedRows.length > 0 ? (
              paginatedRows.map((n, index) => {
                const days = differenceInDays(new Date(), new Date(n.raisedAt));
                const isOverdue = n.active && days > 14;
                const eligibleDate = addDays(new Date(n.raisedAt), 3);
                const followUpReady = n.active && eligibleDate <= new Date();

                const accentColor = !n.active
                  ? "#1a6b58"
                  : isOverdue
                  ? "#c2410c"
                  : "#fbbf24";

                return (
                  <div
                    key={n.id}
                    className={`flex gap-4 px-6 py-5 transition-colors hover:bg-secondary/20 ${onView ? "cursor-pointer" : ""}`}
                    style={{ borderLeft: `3px solid ${accentColor}` }}
                    onClick={() => onView?.(n.id)}
                  >
                    {/* Serial number */}
                    <div className="w-7 pt-0.5 flex-shrink-0 text-sm font-semibold text-muted-foreground">
                      {(page - 1) * PER_PAGE + index + 1}
                    </div>

                    {/* Main content */}
                    <div className="flex-1 min-w-0 space-y-2">
                      {/* Top row: farm + badges + action */}
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-[#0b1f1a]">{n.farm?.name}</span>
                            <span className="text-xs text-muted-foreground">{n.farm?.dzongkhag}</span>
                          </div>
                          <div className="mt-0.5 flex flex-wrap items-center gap-2">
                            {/* Domain chip */}
                            <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground">
                              {n.domain}
                            </span>
                            {/* Score badge */}
                            {n.score === 0 ? (
                              <span className="rounded px-2 py-0.5 text-[11px] font-semibold bg-red-100 text-red-700">
                                0 · Poor
                              </span>
                            ) : (
                              <span className="rounded px-2 py-0.5 text-[11px] font-semibold bg-amber-100 text-amber-700">
                                1 · Fair
                              </span>
                            )}
                            {/* Status */}
                            <ComplianceTag active={n.active} />
                            {/* Overdue */}
                            {isOverdue && (
                              <span className="rounded px-2 py-0.5 text-[11px] font-bold bg-red-100 text-red-600">
                                Overdue
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action — stop propagation so row click doesn't fire */}
                        <div onClick={(e) => e.stopPropagation()}>
                          {n.active ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-lg text-xs"
                              onClick={() => {
                                closeNC(n.id);
                                toast.success("NC marked closed");
                              }}
                            >
                              Mark Closed
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground">Closed</span>
                          )}
                        </div>
                      </div>

                      {/* NC item text */}
                      <p className="text-sm text-foreground/80 leading-relaxed">{n.prompt}</p>

                      {/* Footer row: metadata */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span>Raised: <span className="font-medium text-foreground">{format(new Date(n.raisedAt), "dd MMM yyyy")}</span></span>
                        <span>
                          Days active:{" "}
                          <span className={`font-medium ${isOverdue ? "text-red-600" : "text-foreground"}`}>
                            {days}d
                          </span>
                        </span>
                        <span>Assessment: <span className="font-mono font-medium text-foreground">{n.assessmentId}</span></span>
                        {n.active && (
                          <span className={followUpReady ? "text-emerald-600 font-medium" : ""}>
                            Follow-up eligible: {format(eligibleDate, "dd MMM yyyy")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-10 text-center text-muted-foreground">
                No non-compliance records found
              </div>
            )}
          </div>

          {/* Pagination */}
          <div
            className="
              flex flex-col gap-4
              border-t border-border
              bg-background/50
              px-4 py-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            {/* Info */}
            <div className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">
                {capped.length === 0 ? 0 : (page - 1) * PER_PAGE + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium text-foreground">
                {Math.min(page * PER_PAGE, capped.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-foreground">
                {capped.length}
              </span>{" "}
              records
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {/* Previous */}
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPage(
                    (prev) =>
                      prev - 1
                  )
                }
                disabled={
                  page === 1
                }
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </Button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({
                  length:
                    totalPages,
                }).map(
                  (_, idx) => {
                    const pageNumber =
                      idx + 1;

                    return (
                      <Button
                        key={
                          pageNumber
                        }
                        size="sm"
                        variant={
                          page ===
                          pageNumber
                            ? "default"
                            : "outline"
                        }
                        onClick={() =>
                          setPage(
                            pageNumber
                          )
                        }
                        className="min-w-9"
                      >
                        {
                          pageNumber
                        }
                      </Button>
                    );
                  }
                )}
              </div>

              {/* Next */}
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPage(
                    (prev) =>
                      prev + 1
                  )
                }
                disabled={
                  page ===
                    totalPages ||
                  totalPages ===
                    0
                }
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}