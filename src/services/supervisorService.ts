import { assessmentService } from "./assessmentService";
import { auditService, AuditActions, EntityTypes } from "./auditService";

interface JurisdictionStats {
  dzongkhag: string;
  totalAssessments: number;
  compliant: number;
  nonCompliant: number;
  moderate: number;
  pendingReview: number;
  followUpRequired: number;
}

interface FollowUpRequest {
  id: string;
  assessmentId: string;
  farmName: string;
  farmType: string;
  originalScore: number;
  nonConformities: string[];
  requestedBy: string;
  requestedDate: string;
  status: "Pending" | "Approved" | "Rejected" | "Completed";
  approvedBy?: string;
  approvedDate?: string;
  followUpAssessmentId?: string;
}

class SupervisorService {
  private followUpRequests: FollowUpRequest[] = [];
  private readonly STORAGE_KEY = "bbas_followup_requests";

  constructor() {
    this.loadFollowUpRequests();
  }

  private loadFollowUpRequests() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.followUpRequests = JSON.parse(stored);
      } else {
        this.initializeDefaultFollowUpRequests();
      }
    } catch (error) {
      console.error("Failed to load follow-up requests:", error);
      this.initializeDefaultFollowUpRequests();
    }
  }

  private initializeDefaultFollowUpRequests() {
    this.followUpRequests = [
      {
        id: "FUR-001",
        assessmentId: "ASM-1283",
        farmName: "Dorji Piggery",
        farmType: "Pig",
        originalScore: 1.85,
        nonConformities: ["Perimeter fencing needs repair", "Visitor logbook incomplete"],
        requestedBy: "Pema Dorji",
        requestedDate: "2025-03-14",
        status: "Pending",
      },
      {
        id: "FUR-002",
        assessmentId: "ASM-1282",
        farmName: "Sonam Poultry",
        farmType: "Poultry",
        originalScore: 1.20,
        nonConformities: ["No disinfection facilities", "No visitor logbook"],
        requestedBy: "Pema Tshering",
        requestedDate: "2025-03-14",
        status: "Pending",
      },
    ];
    this.saveFollowUpRequests();
  }

  private saveFollowUpRequests() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.followUpRequests));
    } catch (error) {
      console.error("Failed to save follow-up requests:", error);
    }
  }

  getJurisdictionStats(dzongkhag: string): JurisdictionStats {
    const assessments = assessmentService.getAssessmentsByDzongkhag(dzongkhag);
    
    return {
      dzongkhag,
      totalAssessments: assessments.length,
      compliant: assessments.filter((a) => a.complianceStatus === "Compliant").length,
      nonCompliant: assessments.filter((a) => a.complianceStatus === "Non-compliant").length,
      moderate: assessments.filter((a) => a.complianceStatus === "Moderate").length,
      pendingReview: assessments.filter((a) => a.status === "Submitted").length,
      followUpRequired: assessments.filter((a) => a.followUpRequired).length,
    };
  }

  getAllJurisdictionStats(): JurisdictionStats[] {
    const dzongkhags = ["Thimphu", "Paro", "Punakha", "Bumthang", "Wangdue", "Trashigang"];
    return dzongkhags.map((dzongkhag) => this.getJurisdictionStats(dzongkhag));
  }

  getPendingFollowUpRequests(): FollowUpRequest[] {
    return this.followUpRequests.filter((r) => r.status === "Pending");
  }

  approveFollowUpRequest(
    requestId: string,
    approvedBy: string,
    followUpAssessmentId?: string
  ): FollowUpRequest | null {
    const request = this.followUpRequests.find((r) => r.id === requestId);
    if (!request) return null;

    request.status = "Approved";
    request.approvedBy = approvedBy;
    request.approvedDate = new Date().toISOString();
    request.followUpAssessmentId = followUpAssessmentId;

    this.saveFollowUpRequests();

    auditService.log(
      approvedBy,
      approvedBy,
      AuditActions.APPROVE_FOLLOW_UP,
      EntityTypes.ASSESSMENT,
      requestId,
      `Approved follow-up request for ${request.farmName}`
    );

    return request;
  }

  rejectFollowUpRequest(requestId: string, rejectedBy: string): FollowUpRequest | null {
    const request = this.followUpRequests.find((r) => r.id === requestId);
    if (!request) return null;

    request.status = "Rejected";
    this.saveFollowUpRequests();

    auditService.log(
      rejectedBy,
      rejectedBy,
      AuditActions.UPDATE_ASSESSMENT,
      EntityTypes.ASSESSMENT,
      requestId,
      `Rejected follow-up request for ${request.farmName}`
    );

    return request;
  }

  createFollowUpRequest(
    assessmentId: string,
    requestedBy: string
  ): FollowUpRequest | null {
    const assessment = assessmentService.getAssessmentById(assessmentId);
    if (!assessment) return null;

    const request: FollowUpRequest = {
      id: `FUR-${String(this.followUpRequests.length + 1).padStart(3, "0")}`,
      assessmentId,
      farmName: assessment.farmName,
      farmType: assessment.farmType,
      originalScore: assessment.score,
      nonConformities: assessment.nonConformities,
      requestedBy,
      requestedDate: new Date().toISOString().split("T")[0],
      status: "Pending",
    };

    this.followUpRequests.push(request);
    this.saveFollowUpRequests();

    auditService.log(
      requestedBy,
      requestedBy,
      AuditActions.APPROVE_FOLLOW_UP,
      EntityTypes.ASSESSMENT,
      request.id,
      `Requested follow-up for ${request.farmName}`
    );

    return request;
  }

  getOverdueFollowUps(): FollowUpRequest[] {
    const today = new Date();
    return this.followUpRequests.filter((r) => {
      if (r.status !== "Approved" || !r.approvedDate) return false;
      const approvedDate = new Date(r.approvedDate);
      const daysSinceApproval = Math.floor((today.getTime() - approvedDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysSinceApproval > 30;
    });
  }
}

export const supervisorService = new SupervisorService();
