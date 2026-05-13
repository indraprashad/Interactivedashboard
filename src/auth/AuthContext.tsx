import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { auditService, AuditActions, EntityTypes } from "../services/auditService";

interface User {
  id: string;
  name: string;
  email: string;
  role: "Administrator" | "Inspector" | "Veterinarian" | "Viewer" | "Supervisor";
  dzongkhag: string;
  status: "Active" | "Inactive";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const rolePermissions: Record<string, string[]> = {
  Administrator: [
    "view_dashboard",
    "view_assessments",
    "create_assessment",
    "edit_assessment",
    "delete_assessment",
    "view_farm_registry",
    "create_farm",
    "edit_farm",
    "delete_farm",
    "view_non_compliance",
    "manage_non_compliance",
    "view_reports",
    "export_reports",
    "view_user_management",
    "create_user",
    "edit_user",
    "delete_user",
    "manage_roles",
    "view_audit_logs",
    "manage_checklist_versions",
    "manage_lookup_tables",
    "configure_scoring_rules",
    "manage_ppfrs_integration",
  ],
  Supervisor: [
    "view_dashboard",
    "view_assessments",
    "view_jurisdiction_assessments",
    "approve_follow_up",
    "view_non_compliance",
    "manage_non_compliance",
    "view_reports",
    "export_reports",
    "track_pending_assessments",
  ],
  Inspector: [
    "view_dashboard",
    "view_assessments",
    "create_assessment",
    "edit_assessment",
    "view_own_assessment_history",
    "sync_assessments",
    "initiate_follow_up",
    "view_checklist",
    "capture_evidence",
  ],
  Veterinarian: [
    "view_dashboard",
    "view_assessments",
    "create_assessment",
    "edit_assessment",
    "view_own_assessment_history",
    "sync_assessments",
    "initiate_follow_up",
    "view_checklist",
    "capture_evidence",
  ],
  Viewer: [
    "view_dashboard",
    "view_reports",
    "export_reports",
  ],
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("bbas_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!email || !password) {
      return false;
    }

    if (password.length < 8) {
      return false;
    }

    const mockUsers: User[] = [
      {
        id: "U001",
        name: "Soho Tshering",
        email: "soho.t@bbas.gov.bt",
        role: "Administrator",
        dzongkhag: "National",
        status: "Active",
      },
      {
        id: "U002",
        name: "Kinley Wangmo",
        email: "kinley.w@bbas.gov.bt",
        role: "Inspector",
        dzongkhag: "Thimphu",
        status: "Active",
      },
      {
        id: "U003",
        name: "Pema Dorji",
        email: "pema.d@bbas.gov.bt",
        role: "Veterinarian",
        dzongkhag: "Paro",
        status: "Active",
      },
      {
        id: "U004",
        name: "Tshering Lhamo",
        email: "tshering.l@bbas.gov.bt",
        role: "Supervisor",
        dzongkhag: "Thimphu",
        status: "Active",
      },
    ];

    const foundUser = mockUsers.find((u) => u.email === email && u.status === "Active");
    
    if (foundUser) {
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem("bbas_user", JSON.stringify(foundUser));
      localStorage.setItem("bbas_login_time", new Date().toISOString());
      
      auditService.log(
        foundUser.id,
        foundUser.name,
        AuditActions.LOGIN,
        EntityTypes.USER,
        foundUser.id,
        `User logged in from ${email}`
      );
      
      return true;
    }

    return false;
  };

  const logout = () => {
    if (user) {
      auditService.log(
        user.id,
        user.name,
        AuditActions.LOGOUT,
        EntityTypes.USER,
        user.id,
        "User logged out"
      );
    }
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("bbas_user");
    localStorage.removeItem("bbas_login_time");
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    const permissions = rolePermissions[user.role] || [];
    return permissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
