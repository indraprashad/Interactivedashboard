import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { DashboardPage } from "./components/DashboardPage";
import { AssessmentsPage } from "./components/AssessmentsPage";
import { FarmRegistryPage } from "./components/FarmRegistryPage";
import { NonCompliancePage } from "./components/NonCompliancePage";
import { ReportsPage } from "./components/ReportsPage";
import { RiskMapPage } from "./components/RiskMapPage";
import { UserManagementPage } from "./components/UserManagementPage";

export default function App() {
  const [activeView, setActiveView] = useState("dashboard");

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <DashboardPage />;
      case "assessments":
        return <AssessmentsPage />;
      case "farm-registry":
        return <FarmRegistryPage />;
      case "non-compliance":
        return <NonCompliancePage />;
      case "reports":
        return <ReportsPage />;
      case "risk-map":
        return <RiskMapPage />;
      case "user-management":
        return <UserManagementPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="size-full flex bg-[#e7efe9] overflow-hidden">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <div className="flex-1 overflow-hidden">
        {renderView()}
      </div>
    </div>
  );
}