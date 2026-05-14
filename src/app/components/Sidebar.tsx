import { useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Home,
  Flag,
  FileText,
  Map,
  Users,
  Bell,
  LogOut,
  Menu,
  X,
  Shield,
  ChevronRight,
} from "lucide-react";

import imgImage1 from "../../imports/Group1/c2f1f828417fb5a7a6ec38e739df5d359d6431bc.png";
import { useAuth } from "../../auth/AuthContext";

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  permission?: string;
}

const navItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    permission: "view_dashboard",
  },
  {
    id: "assessments",
    label: "Assessments",
    icon: BookOpen,
    permission: "view_assessments",
  },
  {
    id: "farm-registry",
    label: "Farm Registry",
    icon: Home,
    permission: "view_farm_registry",
  },
  {
    id: "non-compliance",
    label: "Non-compliance",
    icon: Flag,
    permission: "view_non_compliance",
  },
  {
    id: "reports",
    label: "Reports",
    icon: FileText,
    permission: "view_reports",
  },
  {
    id: "risk-map",
    label: "Risk Map",
    icon: Map,
    permission: "view_dashboard",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    permission: "view_dashboard",
  },
  {
    id: "user-management",
    label: "User Management",
    icon: Users,
    permission: "view_user_management",
  },
];

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function Sidebar({
  activeView,
  onViewChange,
}: SidebarProps) {
  const { user, logout, hasPermission } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);

  const handleNavClick = (viewId: string) => {
    onViewChange(viewId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        onClick={() =>
          setIsMobileMenuOpen(!isMobileMenuOpen)
        }
        className="
          lg:hidden fixed top-4 left-4 z-50
          flex items-center justify-center
          w-11 h-11 rounded-xl
          bg-[#102821]
          border border-white/10
          text-white
          shadow-2xl backdrop-blur-md
          transition-all duration-200
          hover:scale-105
        "
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="
            lg:hidden fixed inset-0 z-30
            bg-black/60 backdrop-blur-sm
          "
          onClick={() =>
            setIsMobileMenuOpen(false)
          }
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative top-0 left-0 z-40
          h-screen w-[290px] lg:w-[320px]
          overflow-hidden
          transition-transform duration-300 ease-in-out
          ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
        style={{
          fontFamily: "Manrope, sans-serif",
        }}
      >
        {/* Background */}
        <div
          className="
            absolute inset-0
            bg-gradient-to-b
            from-[#102821]
            via-[#0d221c]
            to-[#081612]
          "
        />

        {/* Decorative glow */}
        <div
          className="
            absolute -top-32 -left-20
            h-72 w-72 rounded-full
            bg-[#1a6b58]/20 blur-3xl
          "
        />

        <div
          className="
            absolute bottom-0 right-0
            h-64 w-64 rounded-full
            bg-[#c2410c]/10 blur-3xl
          "
        />

        {/* Border */}
        <div
          className="
            absolute inset-0
            border-r border-white/10
            backdrop-blur-xl
          "
        />

        {/* Content */}
        <div
          className="
            relative z-10
            flex h-full flex-col
            px-5 pt-16 lg:pt-10 pb-5
          "
        >
          {/* Header */}
          <div className="flex items-center gap-4">
            <div
              className="
                flex items-center justify-center
                h-[72px] w-[72px]
                rounded-2xl
                bg-white/5
                border border-white/10
                shadow-lg
                overflow-hidden
              "
            >
              <img
                alt="BBAS Logo"
                className="h-full w-full object-cover"
                src={imgImage1}
              />
            </div>

            <div className="min-w-0">
              <h1
                className="
                  text-white text-[30px]
                  font-extrabold tracking-tight
                "
              >
                BBAS
              </h1>

              <p
                className="
                  text-[#9db9a4]
                  text-sm font-medium
                "
              >
                Biosecurity System
              </p>
            </div>
          </div>

          {/* User Badge */}
          <div
            className="
              mt-6
              rounded-2xl
              border border-white/10
              bg-white/[0.04]
              p-4
              backdrop-blur-sm
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  flex h-12 w-12 items-center justify-center
                  rounded-full
                  bg-gradient-to-br
                  from-[#1a6b58]
                  to-[#14483c]
                  shadow-lg
                "
              >
                <Shield className="h-6 w-6 text-white" />
              </div>

              <div className="min-w-0">
                <p
                  className="
                    truncate
                    text-base font-semibold text-white
                  "
                >
                  {user?.name || "User"}
                </p>

                <p
                  className="
                    truncate
                    text-sm text-[#9db9a4]
                  "
                >
                  {user?.role || "System User"}
                </p>
              </div>
            </div>
          </div>

          {/* Section Label */}
          <div
            className="
              mt-8 mb-3
              px-2
              text-xs font-semibold
              uppercase tracking-[0.18em]
              text-[#6f8a7b]
            "
          >
            Navigation
          </div>

          {/* Navigation */}
          <nav
            className="
              flex-1
              space-y-2
              overflow-y-auto
              pr-1
            "
          >
            {navItems
              .filter(
                (item) =>
                  !item.permission ||
                  hasPermission(item.permission)
              )
              .map((item) => {
                const Icon = item.icon;

                const isActive =
                  activeView === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() =>
                      handleNavClick(item.id)
                    }
                    className={`
                      group relative
                      flex w-full items-center
                      gap-3 rounded-2xl
                      px-4 py-3
                      transition-all duration-200
                      ${
                        isActive
                          ? `
                            bg-gradient-to-r
                            from-[#c2410c]
                            to-[#d97706]
                            text-white
                            shadow-xl
                            shadow-orange-950/30
                          `
                          : `
                            text-[#9aa8a2]
                            hover:bg-white/[0.06]
                            hover:text-white
                          `
                      }
                    `}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <div
                        className="
                          absolute left-0 top-1/2
                          h-8 w-1
                          -translate-y-1/2
                          rounded-r-full
                          bg-white
                        "
                      />
                    )}

                    <div
                      className={`
                        flex h-10 w-10
                        items-center justify-center
                        rounded-xl
                        transition-all duration-200
                        ${
                          isActive
                            ? "bg-white/15"
                            : "bg-white/[0.04] group-hover:bg-white/[0.08]"
                        }
                      `}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                    </div>

                    <span
                      className="
                        flex-1 text-left
                        text-[15px]
                        font-semibold
                      "
                    >
                      {item.label}
                    </span>

                    <ChevronRight
                      className={`
                        h-4 w-4
                        transition-all duration-200
                        ${
                          isActive
                            ? "opacity-100"
                            : "opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
                        }
                      `}
                    />
                  </button>
                );
              })}
          </nav>

          {/* Footer */}
          <div className="pt-4">
            <div
              className="
                rounded-2xl
                border border-white/10
                bg-white/[0.03]
                p-3
              "
            >
              <button
                onClick={logout}
                className="
                  group
                  flex w-full items-center justify-center
                  gap-2
                  rounded-xl
                  bg-[#1f1f1f]
                  px-4 py-3
                  text-sm font-semibold text-white
                  transition-all duration-200
                  hover:bg-[#2a2a2a]
                  hover:scale-[1.01]
                "
                aria-label="Logout"
              >
                <LogOut
                  className="
                    h-4 w-4
                    transition-transform duration-200
                    group-hover:-translate-x-0.5
                  "
                />

                Logout
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}