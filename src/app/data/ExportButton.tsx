import { Button } from "../components/ui/button";
import { Download } from "lucide-react";

export function exportCSV(filename: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => escape(r[h])).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function ExportButton({ filename, rows, label = "Export CSV" }: { filename: string; rows: Record<string, unknown>[]; label?: string }) {
  return (
    <Button variant="outline" size="sm" onClick={() => exportCSV(filename, rows)}>
      <Download className="h-4 w-4 mr-1.5" /> {label}
    </Button>
  );
}
