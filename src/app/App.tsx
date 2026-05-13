import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { DashboardPage } from "./components/DashboardPage";
import { AssessmentsList } from "./components/assessments.index";
import { FarmsList } from "./components/farms.index";
import { NCList } from "./components/non-compliance";
import { Reports } from "./components/reports.index";
import { RiskMapPage } from "./components/RiskMapPage";
import { UserManagementPage } from "./components/UserManagementPage";
import { useAuth } from "../auth/AuthContext";
import { LoginPage } from "../auth/LoginPage";
import { ProtectedRoute } from "../auth/ProtectedRoute";

export default function App() {
  const { isAuthenticated, user, logout } = useAuth();
  const [activeView, setActiveView] = useState("dashboard");

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <ProtectedRoute permission="view_dashboard">
            <DashboardPage />
          </ProtectedRoute>
        );
      case "assessments":
        return (
          <ProtectedRoute permission="view_assessments">
            <AssessmentsList />
          </ProtectedRoute>
        );
      case "farm-registry":
        return (
          <ProtectedRoute permission="view_farm_registry">
            <FarmsList />
          </ProtectedRoute>
        );
      case "non-compliance":
        return (
          <ProtectedRoute permission="view_non_compliance">
            <NCList />
          </ProtectedRoute>
        );
      case "reports":
        return (
          <ProtectedRoute permission="view_reports">
            <Reports />
          </ProtectedRoute>
        );
      case "risk-map":
        return (
          <ProtectedRoute permission="view_dashboard">
            <RiskMapPage />
          </ProtectedRoute>
        );
      case "user-management":
        return (
          <ProtectedRoute permission="view_user_management">
            <UserManagementPage />
          </ProtectedRoute>
        );
      default:
        return (
          <ProtectedRoute permission="view_dashboard">
            <DashboardPage />
          </ProtectedRoute>
        );
    }
  };

  return (
    <div className="flex h-screen bg-[#e7efe9] overflow-hidden">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <div className="flex-1 overflow-y-auto">
        {renderView()}
      </div>
    </div>
  );
}