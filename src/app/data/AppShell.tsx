import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useStore, useCurrentUser } from "../../../lib/store";
import {
  LayoutDashboard, Sprout, ClipboardCheck, AlertTriangle,
  CalendarClock, ShieldCheck, BarChart3, Users, ListChecks,
  Settings, LogOut, Menu,
} from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { cn } from "../../../lib/utils";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/farms", label: "Farms", icon: Sprout },
  { to: "/assessments", label: "Assessments", icon: ClipboardCheck },
  { to: "/non-compliance", label: "Non-Compliance", icon: AlertTriangle },
  { to: "/follow-ups", label: "Follow-Ups", icon: CalendarClock },
  { to: "/supervisor", label: "Supervisor", icon: ShieldCheck },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/checklist", label: "Checklist", icon: ListChecks },
  { to: "/admin/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const user = useCurrentUser();
  const logout = useStore((s) => s.logout);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  if (!user) {
    if (typeof window !== "undefined") navigate({ to: "/login" });
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-card transition-transform md:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full",
      )}>
        <div className="flex h-16 items-center gap-2 border-b border-border px-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">B</div>
          <div>
            <div className="text-sm font-semibold leading-tight">BBAS</div>
            <div className="text-[11px] text-muted-foreground leading-tight">BFDA · Bhutan</div>
          </div>
        </div>
        <nav className="p-2 space-y-0.5">
          {NAV.map((n) => {
            const Icon = n.icon;
            const active = path === n.to || path.startsWith(n.to + "/");
            return (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary",
                )}
              >
                <Icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col md:ml-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-card/80 px-4 backdrop-blur md:px-6">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen((o) => !o)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium">{user.name}</div>
              <div className="text-[11px] capitalize text-muted-foreground">{user.role}{user.dzongkhag ? ` · ${user.dzongkhag}` : ""}</div>
            </div>
            <div className="h-9 w-9 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-semibold">
              {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <Button variant="ghost" size="icon" onClick={() => { logout(); navigate({ to: "/login" }); }} aria-label="Logout">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
