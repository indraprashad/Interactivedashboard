import { useMemo, useState } from "react";
import { format } from "date-fns";
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

export function NCList() {
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

  const totalPages = Math.ceil(
    enriched.length / PER_PAGE
  );

  const paginatedRows =
    useMemo(() => {
      const start =
        (page - 1) *
        PER_PAGE;

      return enriched.slice(
        start,
        start + PER_PAGE
      );
    }, [enriched, page]);

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
            Non-Compliance
            Register
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            {
              enriched.filter(
                (n) =>
                  n.active
              ).length
            }{" "}
            active ·{" "}
            {enriched.length} total
          </p>
        </div>

        <ExportButton
          filename="non-compliance.csv"
          rows={exportRows}
        />
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
                    Farm
                  </th>

                  <th className="p-4">
                    Domain
                  </th>

                  <th className="p-4">
                    Item
                  </th>

                  <th className="p-4">
                    Raised
                  </th>

                  <th className="p-4">
                    Assessment
                  </th>

                  <th className="p-4">
                    Status
                  </th>

                  <th className="p-4">
                    Action
                  </th>
                </tr>
              </thead>

              {/* Body */}
              <tbody className="divide-y divide-border">
                {paginatedRows.length >
                0 ? (
                  paginatedRows.map(
                    (
                      n,
                      index
                    ) => (
                      <tr
                        key={n.id}
                        className="
                          transition-colors
                          hover:bg-secondary/20
                        "
                      >
                        {/* S/N */}
                        <td className="p-4 font-medium">
                          {(page - 1) *
                            PER_PAGE +
                            index +
                            1}
                        </td>

                        {/* Farm */}
                        <td className="p-4">
                          <div className="font-medium text-primary">
                            {
                              n
                                .farm
                                ?.name
                            }
                          </div>

                          <div
                            className="
                              mt-1 text-xs
                              text-muted-foreground
                            "
                          >
                            {
                              n
                                .farm
                                ?.dzongkhag
                            }
                          </div>
                        </td>

                        {/* Domain */}
                        <td
                          className="
                            p-4
                            text-muted-foreground
                          "
                        >
                          {n.domain}
                        </td>

                        {/* Item */}
                        <td className="max-w-[320px] p-4">
                          <div className="line-clamp-2">
                            {
                              n.prompt
                            }
                          </div>
                        </td>

                        {/* Raised */}
                        <td
                          className="
                            p-4 text-xs
                            text-muted-foreground
                          "
                        >
                          {format(
                            new Date(
                              n.raisedAt
                            ),
                            "dd MMM yyyy"
                          )}
                        </td>

                        {/* Assessment */}
                        <td className="p-4">
                          <span
                            className="
                              text-xs
                              font-medium
                              text-primary
                            "
                          >
                            {
                              n.assessmentId
                            }
                          </span>
                        </td>

                        {/* Status */}
                        <td className="p-4">
                          <ComplianceTag
                            active={
                              n.active
                            }
                          />
                        </td>

                        {/* Action */}
                        <td className="p-4">
                          {n.active ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-lg"
                              onClick={() => {
                                closeNC(
                                  n.id
                                );

                                toast.success(
                                  "NC marked closed"
                                );
                              }}
                            >
                              Close
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              Closed
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="
                        p-10
                        text-center
                        text-muted-foreground
                      "
                    >
                      No non-compliance
                      records found
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
                {enriched.length ===
                0
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
                  enriched.length
                )}
              </span>{" "}
              of{" "}
              <span className="font-medium text-foreground">
                {enriched.length}
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