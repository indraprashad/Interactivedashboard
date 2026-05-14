import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";

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

import { ScoreBadge } from "../components/ScoreBadge";
import { ExportButton } from "../data/ExportButton";

const PER_PAGE = 10;

interface AssessmentsListProps {
  onView: (id: string) => void;
  onNew: () => void;
}

export function AssessmentsList({ onView, onNew }: AssessmentsListProps) {
  const { assessments, farms, users } = useStore();

  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const rows = useMemo(
    () =>
      assessments
        .map((a) => ({
          ...a,
          farm: farms.find((f) => f.id === a.farmId),
          inspector:
            users.find((u) => u.id === a.inspectorId)
              ?.name ?? "—",
        }))
        .filter(
          (a) =>
            (status === "all" ||
              a.status === status) &&
            (q === "" ||
              a.id
                .toLowerCase()
                .includes(q.toLowerCase()) ||
              (
                a.farm?.name ?? ""
              )
                .toLowerCase()
                .includes(q.toLowerCase()))
        )
        .sort(
          (a, b) =>
            +new Date(b.date) -
            +new Date(a.date)
        ),
    [
      assessments,
      farms,
      users,
      q,
      status,
    ]
  );

  const totalPages = Math.ceil(
    rows.length / PER_PAGE
  );

  const paginatedRows = useMemo(() => {
    const start =
      (page - 1) * PER_PAGE;

    return rows.slice(
      start,
      start + PER_PAGE
    );
  }, [rows, page]);

  const exportRows = rows.map((r) => ({
    id: r.id,
    farm: r.farm?.name,
    dzongkhag: r.farm?.dzongkhag,
    date: format(
      new Date(r.date),
      "yyyy-MM-dd"
    ),
    inspector: r.inspector,
    score: r.overallScore,
    band: r.band,
    ncs: r.ncCount,
    status: r.status,
  }));

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

  return (
      <div className="space-y-5 p-6">
        {/* Header */}
        <div
          className="
            flex flex-col gap-4
            rounded-3xl
            border border-border/60
            bg-white
            p-6
            shadow-sm
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          <div>
            <h1
              className="
                text-3xl
                font-bold
                tracking-tight
              "
            >
              Assessments
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              {rows.length} total
              assessments
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <ExportButton
              filename="assessments.csv"
              rows={exportRows}
            />

            <Button onClick={onNew}>
              <Plus className="mr-1.5 h-4 w-4" />
              New Assessment
            </Button>
          </div>
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
                placeholder="Search by ID or farm..."
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
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  All Status
                </SelectItem>

                <SelectItem value="Draft">
                  Draft
                </SelectItem>

                <SelectItem value="Submitted">
                  Submitted
                </SelectItem>

                <SelectItem value="NC-Follow-Up">
                  NC Follow-Up
                </SelectItem>

                <SelectItem value="Closed">
                  Closed
                </SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="overflow-hidden rounded-3xl border-border/60 shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                {/* Header */}
                <thead
                  className="
                    bg-secondary/40
                    text-left text-xs
                    uppercase tracking-wide
                    text-muted-foreground
                  "
                >
                  <tr>
                    <th className="p-4">
                      S/N
                    </th>

                    <th className="p-4">
                      ID
                    </th>

                    <th className="p-4">
                      Farm
                    </th>

                    <th className="p-4">
                      Dzongkhag
                    </th>

                    <th className="p-4">
                      Date
                    </th>

                    <th className="p-4">
                      Inspector
                    </th>

                    <th className="p-4">
                      Score
                    </th>

                    <th className="p-4">
                      NC
                    </th>

                    <th className="p-4">
                      Status
                    </th>
                  </tr>
                </thead>

                {/* Body */}
                <tbody className="divide-y divide-border">
                  {paginatedRows.length >
                  0 ? (
                    paginatedRows.map(
                      (r, idx) => (
                        <tr
                          key={r.id}
                          className="
                            transition-colors
                            hover:bg-secondary/20
                          "
                        >
                          {/* S/N */}
                          <td className="p-4 font-medium">
                            {(page - 1) *
                              PER_PAGE +
                              idx +
                              1}
                          </td>

                          {/* ID */}
                          <td className="p-4">
                            <button
                              onClick={() => onView(r.id)}
                              className="
                                font-medium
                                text-primary
                                hover:underline
                              "
                            >
                              {r.id}
                            </button>
                          </td>

                          {/* Farm */}
                          <td className="p-4 font-medium">
                            {r.farm?.name ??
                              r.farmId}
                          </td>

                          {/* Dzongkhag */}
                          <td
                            className="
                              p-4
                              text-muted-foreground
                            "
                          >
                            {
                              r.farm
                                ?.dzongkhag
                            }
                          </td>

                          {/* Date */}
                          <td
                            className="
                              p-4
                              text-muted-foreground
                            "
                          >
                            {format(
                              new Date(
                                r.date
                              ),
                              "dd MMM yyyy"
                            )}
                          </td>

                          {/* Inspector */}
                          <td
                            className="
                              p-4
                              text-muted-foreground
                            "
                          >
                            {r.inspector}
                          </td>

                          {/* Score */}
                          <td className="p-4">
                            <ScoreBadge
                              band={r.band}
                              score={
                                r.overallScore
                              }
                            />
                          </td>

                          {/* NC */}
                          <td className="p-4">
                            {r.ncCount >
                            0 ? (
                              <span
                                className="
                                  font-medium
                                  text-[var(--poor)]
                                "
                              >
                                {r.ncCount}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">
                                0
                              </span>
                            )}
                          </td>

                          {/* Status */}
                          <td
                            className="
                              p-4
                              text-xs font-medium
                            "
                          >
                            {r.status}
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan={9}
                        className="
                          p-10
                          text-center
                          text-muted-foreground
                        "
                      >
                        No assessments
                        found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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
                  {rows.length === 0
                    ? 0
                    : (page - 1) *
                        PER_PAGE +
                      1}
                </span>{" "}
                to{" "}
                <span className="font-medium text-foreground">
                  {Math.min(
                    page *
                      PER_PAGE,
                    rows.length
                  )}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                  {rows.length}
                </span>{" "}
                records
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPage(
                      (prev) =>
                        prev - 1
                    )
                  }
                  disabled={page === 1}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Previous
                </Button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({
                    length: totalPages,
                  }).map((_, idx) => {
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
                  })}
                </div>

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
                    page === totalPages ||
                    totalPages === 0
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