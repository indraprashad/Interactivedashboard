import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useStore } from "../../../lib/store";

import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

import { DZONGKHAGS } from "../data/dzongkhags";
import { ExportButton } from "../data/ExportButton";

const PER_PAGE = 10;

export function FarmsList() {
  const farms = useStore((s) => s.farms);

  const [q, setQ] = useState("");
  const [dz, setDz] = useState("all");
  const [type, setType] = useState("all");
  const [src, setSrc] = useState("all");

  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () =>
      farms.filter(
        (f) =>
          (q === "" ||
            f.name
              .toLowerCase()
              .includes(q.toLowerCase()) ||
            f.id
              .toLowerCase()
              .includes(q.toLowerCase()) ||
            f.ownerName
              .toLowerCase()
              .includes(q.toLowerCase())) &&
          (dz === "all" ||
            f.dzongkhag === dz) &&
          (type === "all" ||
            f.type === type) &&
          (src === "all" ||
            f.source === src)
      ),
    [farms, q, dz, type, src]
  );

  const totalPages = Math.ceil(
    filtered.length / PER_PAGE
  );

  const paginatedFarms = useMemo(() => {
    const start =
      (page - 1) * PER_PAGE;

    return filtered.slice(
      start,
      start + PER_PAGE
    );
  }, [filtered, page]);

  const handleSearch = (
    value: string
  ) => {
    setQ(value);
    setPage(1);
  };

  const handleDzChange = (
    value: string
  ) => {
    setDz(value);
    setPage(1);
  };

  const handleTypeChange = (
    value: string
  ) => {
    setType(value);
    setPage(1);
  };

  const handleSourceChange = (
    value: string
  ) => {
    setSrc(value);
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
            Farms
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            {filtered.length} of{" "}
            {farms.length} farms
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <ExportButton
            filename="farms.csv"
            rows={
              filtered as unknown as Record<
                string,
                unknown
              >[]
            }
          />

          <Button>
            <Plus className="mr-1.5 h-4 w-4" />
            Non-Registered Farm
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="rounded-3xl border-border/60 shadow-sm">
        <CardContent
          className="
            grid gap-3 p-4
            lg:grid-cols-4
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
              placeholder="Search by name, ID or owner..."
              className="
                h-11 rounded-xl
                pl-9
              "
            />
          </div>

          {/* Dzongkhag */}
          <Select
            value={dz}
            onValueChange={
              handleDzChange
            }
          >
            <SelectTrigger className="h-11 rounded-xl">
              <SelectValue placeholder="Dzongkhag" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">
                All Dzongkhags
              </SelectItem>

              {DZONGKHAGS.map((d) => (
                <SelectItem
                  key={d}
                  value={d}
                >
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Type + Source */}
          <div className="grid grid-cols-2 gap-2">
            {/* Type */}
            <Select
              value={type}
              onValueChange={
                handleTypeChange
              }
            >
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue placeholder="Type" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  All Types
                </SelectItem>

                <SelectItem value="Poultry">
                  Poultry
                </SelectItem>

                <SelectItem value="Piggery">
                  Piggery
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Source */}
            <Select
              value={src}
              onValueChange={
                handleSourceChange
              }
            >
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue placeholder="Source" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  All Sources
                </SelectItem>

                <SelectItem value="PPFRS">
                  PPFRS
                </SelectItem>

                <SelectItem value="Non-Registered">
                  Non-Registered
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Farms Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {paginatedFarms.length >
        0 ? (
          paginatedFarms.map((f) => (
            <div
              key={f.id}
              className="cursor-pointer"
            >
              <Card
                className="
                  h-full rounded-3xl
                  border-border/60
                  transition-all duration-200
                  hover:-translate-y-1
                  hover:shadow-lg
                "
              >
                <CardContent className="space-y-4 p-5">
                  {/* Top */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3
                        className="
                          truncate
                          text-lg font-semibold
                        "
                      >
                        {f.name}
                      </h3>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {f.id} · {f.type}
                      </p>
                    </div>

                    <span
                      className={`
                        rounded-full
                        px-2.5 py-1
                        text-[10px]
                        font-medium
                        ${
                          f.source ===
                          "PPFRS"
                            ? `
                              bg-primary/10
                              text-primary
                            `
                            : `
                              bg-accent/30
                              text-accent-foreground
                            `
                        }
                      `}
                    >
                      {f.source}
                    </span>
                  </div>

                  {/* Owner */}
                  <div>
                    <p className="text-sm font-medium">
                      {f.ownerName}
                    </p>
                  </div>

                  {/* Location */}
                  <div
                    className="
                      flex items-center gap-1.5
                      text-xs text-muted-foreground
                    "
                  >
                    <MapPin className="h-3.5 w-3.5" />

                    <span>
                      {f.dzongkhag} ·{" "}
                      {f.gewog}
                    </span>
                  </div>

                  {/* Bottom */}
                  <div
                    className="
                      flex items-center justify-between
                      border-t pt-3
                      text-xs
                    "
                  >
                    <span className="text-muted-foreground">
                      {f.size}{" "}
                      {f.type ===
                      "Poultry"
                        ? "birds"
                        : "pigs"}
                    </span>

                    <span
                      className={
                        f.status ===
                        "Active"
                          ? "font-medium text-[var(--excellent)]"
                          : "text-muted-foreground"
                      }
                    >
                      {f.status}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))
        ) : (
          <Card className="col-span-full rounded-3xl">
            <CardContent className="p-10 text-center text-muted-foreground">
              No farms found
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pagination */}
      <Card className="rounded-3xl border-border/60 shadow-sm">
        <CardContent
          className="
            flex flex-col gap-4
            px-5 py-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          {/* Info */}
          <div className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {filtered.length === 0
                ? 0
                : (page - 1) *
                    PER_PAGE +
                  1}
            </span>{" "}
            to{" "}
            <span className="font-medium text-foreground">
              {Math.min(
                page * PER_PAGE,
                filtered.length
              )}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">
              {filtered.length}
            </span>{" "}
            farms
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Previous */}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPage(
                  (prev) => prev - 1
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
                    key={pageNumber}
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
                    {pageNumber}
                  </Button>
                );
              })}
            </div>

            {/* Next */}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPage(
                  (prev) => prev + 1
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
        </CardContent>
      </Card>
    </div>
  );
}