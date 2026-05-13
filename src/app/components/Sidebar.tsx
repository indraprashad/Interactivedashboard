import { useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Home,
  Flag,
  FileText,
  Map,
  Users,
  LogOut,
  Menu,
  X
} from "lucide-react";
import imgImage1 from "../../imports/Group1/c2f1f828417fb5a7a6ec38e739df5d359d6431bc.png";
import imgEllipse1 from "../../imports/Group1/24ecce4f34ea964d966110252b5c657e874d5c27.png";

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "assessments", label: "Assessments", icon: BookOpen },
  { id: "farm-registry", label: "Farm registry", icon: Home },
  { id: "non-compliance", label: "Non-compliance", icon: Flag },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "risk-map", label: "Risk map", icon: Map },
  { id: "user-management", label: "User Management", icon: Users },
];

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (viewId: string) => {
    onViewChange(viewId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#0b1f1a] text-white rounded-lg shadow-lg"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:relative h-screen w-[280px] lg:w-[320px] bg-[#0b1f1a] flex flex-col z-40
          transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{ fontFamily: 'Manrope, sans-serif' }}
      >
      {/* Background effects */}
      <div className="absolute inset-0 rounded-[20px] shadow-[0px_8px_40px_0px_rgba(0,0,0,0.12)]">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[20px]">
          <div className="absolute bg-[#0b1f1a] inset-0 mix-blend-color-dodge rounded-[20px]" />
          <div className="absolute bg-[rgba(11,31,26,0.7)] inset-0 rounded-[20px]" />
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none rounded-[20px]">
        <div aria-hidden="true" className="absolute bg-[rgba(0,0,0,0)] inset-0 rounded-[20px]" />
        <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0px_4px_14px_0px_rgba(0,0,0,0.25)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full px-4 pt-11 lg:pt-11 pt-16">
        {/* Logo and Title */}
        <div className="flex items-center gap-3 lg:gap-6 mb-8 lg:mb-12">
          <div className="h-[60px] w-[60px] lg:h-[80px] lg:w-[80px]">
            <img alt="BBAS Logo" className="w-full h-full object-cover" src={imgImage1} />
          </div>
          <div>
            <h1 className="text-white text-[28px] lg:text-[36px] font-bold leading-tight">BBAS</h1>
            <p className="text-[#9db9a4] text-[14px] lg:text-[18px]">System Admin</p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-[#8A8A8A] mb-10" />

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`
                  w-full h-[50px] lg:h-[55px] flex items-center gap-3 lg:gap-4 px-3 lg:px-[18px] rounded-[10px]
                  transition-all duration-200 ease-in-out
                  ${isActive
                    ? 'bg-[#c2410c] text-white shadow-lg'
                    : 'text-[#8a8a8a] hover:bg-[#1a2f2a] hover:text-[#9db9a4]'
                  }
                `}
              >
                <Icon className="w-5 h-5 lg:w-6 lg:h-6 flex-shrink-0" />
                <span className="text-[16px] lg:text-[18px] font-bold truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="mt-auto pb-4">
          <div className="w-full h-[1px] bg-[#8A8A8A] mb-4" />

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-[50px] h-[50px] lg:w-[60px] lg:h-[60px] flex-shrink-0">
                <img alt="User" className="w-full h-full rounded-full" src={imgEllipse1} />
              </div>
              <div className="min-w-0">
                <p className="text-white text-[16px] lg:text-[20px] font-bold truncate">Indra Adhikari</p>
                <p className="text-[#9db9a4] text-[12px] lg:text-[14px] truncate">System Admin</p>
              </div>
            </div>

            <button
              className="w-[36px] h-[36px] lg:w-[39px] lg:h-[39px] rounded-full bg-[#808080] flex items-center justify-center hover:bg-[#9a9a9a] transition-colors flex-shrink-0"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4 lg:w-5 lg:h-5 text-black" />
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
