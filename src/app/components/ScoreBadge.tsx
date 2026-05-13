import { cn } from "../../../lib/utils";
import type { ComplianceBand } from "../data/types";

const bandStyle: Record<ComplianceBand, string> = {
  Excellent: "bg-[var(--excellent)] text-white",
  Good: "bg-[var(--good)] text-foreground",
  Fair: "bg-[var(--fair)] text-foreground",
  Poor: "bg-[var(--poor)] text-white",
};

export function ScoreBadge({ band, score, className }: { band: ComplianceBand; score?: number; className?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
      bandStyle[band], className,
    )}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {band}{typeof score === "number" ? ` · ${score}` : ""}
    </span>
  );
}

export function ComplianceTag({ active }: { active: boolean }) {
  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
      active ? "bg-[var(--poor)]/15 text-[var(--poor)]" : "bg-[var(--excellent)]/15 text-[var(--excellent)]",
    )}>
      {active ? "Active NC" : "Closed"}
    </span>
  );
}

export function bandColor(band: ComplianceBand) {
  return ({ Excellent: "var(--excellent)", Good: "var(--good)", Fair: "var(--fair)", Poor: "var(--poor)" } as const)[band];
}
