import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { DashboardPage } from "./components/DashboardPage";
import { AssessmentsList } from "./components/assessments.index";
import { AssessmentView } from "./components/assessments.$id.index";
import { Wizard } from "./components/assessments.$id.edit";
import { NewAssessment } from "./components/assessments.new";
import { FarmsList } from "./components/farms.index";
import { FarmDetail } from "./components/farms.$id";
import { NCList } from "./components/non-compliance";
import { NCDetail } from "./components/nc.$id";
import { Reports } from "./components/reports.index";
import { RiskMapPage } from "./components/RiskMapPage";
import { NotificationsPage } from "./components/NotificationsPage";
import { UserManagementPage } from "./components/UserManagementPage";
import { useAuth } from "../auth/AuthContext";
import { LoginPage } from "../auth/LoginPage";
import { ProtectedRoute } from "../auth/ProtectedRoute";
import { useStore, useCurrentUser } from "../../lib/store";

type AssessmentSubView = "list" | "new" | "detail" | "edit";
type FarmSubView = "list" | "detail";
type NCSubView = "list" | "detail";

export default function App() {
  const { isAuthenticated } = useAuth();
  const saveAssessment = useStore((s) => s.saveAssessment);
  const currentUser = useCurrentUser();

  const [activeView, setActiveView] = useState("dashboard");

  const [assessmentSubView, setAssessmentSubView] = useState<AssessmentSubView>("list");
  const [activeAssessmentId, setActiveAssessmentId] = useState<string | null>(null);
  const [newAssessmentTab, setNewAssessmentTab] = useState<"registered" | "non-registered">("registered");

  const [farmSubView, setFarmSubView] = useState<FarmSubView>("list");
  const [activeFarmId, setActiveFarmId] = useState<string | null>(null);

  const [ncSubView, setNcSubView] = useState<NCSubView>("list");
  const [activeNCId, setActiveNCId] = useState<string | null>(null);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const handleViewChange = (view: string) => {
    setActiveView(view);
    setAssessmentSubView("list");
    setActiveAssessmentId(null);
    setNewAssessmentTab("registered");
    setFarmSubView("list");
    setActiveFarmId(null);
    setNcSubView("list");
    setActiveNCId(null);
  };

  const handleStartFollowUp = (farmId: string, followUpOfId: string) => {
    const id = `ASMT-${Date.now().toString().slice(-6)}`;
    saveAssessment({
      id,
      farmId,
      inspectorId: currentUser?.id ?? "u1",
      date: new Date().toISOString(),
      status: "Draft",
      responses: [],
      domainScores: {},
      overallScore: 0,
      band: "Poor",
      ncCount: 0,
      followUpOfId,
    });
    setActiveAssessmentId(id);
    setActiveView("assessments");
    setAssessmentSubView("edit");
    setNcSubView("list");
    setActiveNCId(null);
  };

  const renderAssessments = () => {
    switch (assessmentSubView) {
      case "new":
        return (
          <NewAssessment
            onBack={() => { setAssessmentSubView("list"); setNewAssessmentTab("registered"); }}
            onStart={(id) => {
              setActiveAssessmentId(id);
              setAssessmentSubView("edit");
            }}
            initialTab={newAssessmentTab}
          />
        );
      case "detail":
        return activeAssessmentId ? (
          <AssessmentView
            assessmentId={activeAssessmentId}
            onBack={() => setAssessmentSubView("list")}
            onEdit={(id) => {
              setActiveAssessmentId(id);
              setAssessmentSubView("edit");
            }}
          />
        ) : null;
      case "edit":
        return activeAssessmentId ? (
          <Wizard
            assessmentId={activeAssessmentId}
            onDone={() => {
              setAssessmentSubView("detail");
            }}
          />
        ) : null;
      default:
        return (
          <AssessmentsList
            onNew={() => setAssessmentSubView("new")}
            onView={(id) => {
              setActiveAssessmentId(id);
              setAssessmentSubView("detail");
            }}
          />
        );
    }
  };

  const renderNonCompliance = () => {
    if (ncSubView === "detail" && activeNCId) {
      return (
        <NCDetail
          ncId={activeNCId}
          onBack={() => { setNcSubView("list"); setActiveNCId(null); }}
          onViewAssessment={(id) => {
            setActiveAssessmentId(id);
            setActiveView("assessments");
            setAssessmentSubView("detail");
            setNcSubView("list");
            setActiveNCId(null);
          }}
          onStartFollowUp={handleStartFollowUp}
        />
      );
    }
    return (
      <NCList
        onView={(id) => {
          setActiveNCId(id);
          setNcSubView("detail");
        }}
      />
    );
  };

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
            {renderAssessments()}
          </ProtectedRoute>
        );
      case "farm-registry":
        return (
          <ProtectedRoute permission="view_farm_registry">
            {farmSubView === "detail" && activeFarmId ? (
              <FarmDetail
                farmId={activeFarmId}
                onBack={() => { setFarmSubView("list"); setActiveFarmId(null); }}
              />
            ) : (
              <FarmsList
                onView={(id) => { setActiveFarmId(id); setFarmSubView("detail"); }}
                onAddNonRegistered={() => {
                  setActiveView("assessments");
                  setAssessmentSubView("new");
                  setNewAssessmentTab("non-registered");
                }}
              />
            )}
          </ProtectedRoute>
        );
      case "non-compliance":
        return (
          <ProtectedRoute permission="view_non_compliance">
            {renderNonCompliance()}
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
      case "notifications":
        return (
          <ProtectedRoute permission="view_dashboard">
            <NotificationsPage />
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
      <Sidebar activeView={activeView} onViewChange={handleViewChange} />
      <div className="flex-1 overflow-y-auto">
        {renderView()}
      </div>
    </div>
  );
}
