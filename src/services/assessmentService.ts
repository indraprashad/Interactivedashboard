import { checklistService } from "./checklistService";
import { auditService, AuditActions, EntityTypes } from "./auditService";
import { offlineService } from "./offlineService";

interface AssessmentResponse {
  itemId: string;
  response: "yes" | "no" | "partial";
  notes?: string;
  evidence?: string[];
  photos?: string[];
}

interface Assessment {
  id: string;
  farmId: string;
  farmName: string;
  farmType: "Poultry" | "Pig" | "Cattle";
  checklistId: string;
  checklistVersion: string;
  assessmentType: "On Request" | "Regular" | "Follow Up" | "Complaint Based" | "Disease Outbreak";
  previousAssessmentId?: string;
  responses: AssessmentResponse[];
  score: number;
  maxScore: number;
  percentage: number;
  complianceStatus: "Compliant" | "Non-compliant" | "Moderate";
  inspectorId: string;
  inspectorName: string;
  dzongkhag: string;
  gewog: string;
  assessmentDate: string;
  status: "Draft" | "Submitted" | "Under Review" | "Approved" | "Rejected";
  followUpRequired: boolean;
  followUpDate?: string;
  nonConformities: string[];
  synced: boolean;
  createdAt: string;
  updatedAt: string;
}

class AssessmentService {
  private assessments: Assessment[] = [];
  private readonly STORAGE_KEY = "bbas_assessments";

  constructor() {
    this.loadAssessments();
  }

  private loadAssessments() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.assessments = JSON.parse(stored);
      } else {
        this.initializeDefaultAssessments();
      }
    } catch (error) {
      console.error("Failed to load assessments:", error);
      this.initializeDefaultAssessments();
    }
  }

  private initializeDefaultAssessments() {
    this.assessments = [
      {
        id: "ASM-1284",
        farmId: "F-001",
        farmName: "Lhamo Poultry Farm",
        farmType: "Poultry",
        checklistId: "CHK-001",
        checklistVersion: "1.0",
        assessmentType: "Regular",
        responses: [],
        score: 2.15,
        maxScore: 3,
        percentage: 71.67,
        complianceStatus: "Compliant",
        inspectorId: "U002",
        inspectorName: "Kinley Wangmo",
        dzongkhag: "Thimphu",
        gewog: "Chang",
        assessmentDate: "2025-03-15",
        status: "Approved",
        followUpRequired: false,
        nonConformities: [],
        synced: true,
        createdAt: "2025-03-15T00:00:00Z",
        updatedAt: "2025-03-15T00:00:00Z",
      },
      {
        id: "ASM-1283",
        farmId: "F-002",
        farmName: "Dorji Piggery",
        farmType: "Pig",
        checklistId: "CHK-002",
        checklistVersion: "1.0",
        assessmentType: "Regular",
        responses: [],
        score: 1.85,
        maxScore: 3,
        percentage: 61.67,
        complianceStatus: "Moderate",
        inspectorId: "U003",
        inspectorName: "Pema Dorji",
        dzongkhag: "Paro",
        gewog: "Doteng",
        assessmentDate: "2025-03-14",
        status: "Approved",
        followUpRequired: true,
        followUpDate: "2025-04-14",
        nonConformities: ["Perimeter fencing needs repair", "Visitor logbook incomplete"],
        synced: true,
        createdAt: "2025-03-14T00:00:00Z",
        updatedAt: "2025-03-14T00:00:00Z",
      },
    ];
    this.saveAssessments();
  }

  private saveAssessments() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.assessments));
    } catch (error) {
      console.error("Failed to save assessments:", error);
    }
  }

  private generateId(): string {
    return `ASM-${String(this.assessments.length + 1284).padStart(4, "0")}`;
  }

  getAllAssessments(): Assessment[] {
    return this.assessments;
  }

  getAssessmentById(id: string): Assessment | undefined {
    return this.assessments.find((a) => a.id === id);
  }

  getAssessmentsByInspector(inspectorId: string): Assessment[] {
    return this.assessments.filter((a) => a.inspectorId === inspectorId);
  }

  getAssessmentsByDzongkhag(dzongkhag: string): Assessment[] {
    return this.assessments.filter((a) => a.dzongkhag === dzongkhag);
  }

  getAssessmentsByFarm(farmId: string): Assessment[] {
    return this.assessments.filter((a) => a.farmId === farmId);
  }

  getPendingAssessments(): Assessment[] {
    return this.assessments.filter((a) => a.status === "Draft" || a.status === "Submitted");
  }

  getUnsyncedAssessments(): Assessment[] {
    return this.assessments.filter((a) => !a.synced);
  }

  createAssessment(
    assessmentData: Omit<
      Assessment,
      "id" | "score" | "maxScore" | "percentage" | "complianceStatus" | "synced" | "createdAt" | "updatedAt"
    >,
    createdBy: string
  ): Assessment {
    const scoreResult = checklistService.calculateScore(
      this.responsesToRecord(assessmentData.responses),
      assessmentData.checklistId
    );

    const newAssessment: Assessment = {
      ...assessmentData,
      id: this.generateId(),
      score: scoreResult.totalScore,
      maxScore: scoreResult.maxScore,
      percentage: scoreResult.percentage,
      complianceStatus: scoreResult.complianceStatus,
      synced: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.assessments.push(newAssessment);
    this.saveAssessments();

    auditService.log(
      createdBy,
      createdBy,
      AuditActions.CREATE_ASSESSMENT,
      EntityTypes.ASSESSMENT,
      newAssessment.id,
      `Created assessment for ${newAssessment.farmName}`
    );

    if (offlineService.isOffline()) {
      offlineService.saveAssessmentOffline(newAssessment);
    }

    return newAssessment;
  }

  updateAssessment(
    id: string,
    updates: Partial<Assessment>,
    updatedBy: string
  ): Assessment | null {
    const index = this.assessments.findIndex((a) => a.id === id);
    if (index === -1) return null;

    const oldAssessment = this.assessments[index];
    this.assessments[index] = { ...this.assessments[index], ...updates, updatedAt: new Date().toISOString() };

    if (updates.responses) {
      const scoreResult = checklistService.calculateScore(
        this.responsesToRecord(updates.responses),
        this.assessments[index].checklistId
      );
      this.assessments[index].score = scoreResult.totalScore;
      this.assessments[index].maxScore = scoreResult.maxScore;
      this.assessments[index].percentage = scoreResult.percentage;
      this.assessments[index].complianceStatus = scoreResult.complianceStatus;
    }

    this.saveAssessments();

    auditService.log(
      updatedBy,
      updatedBy,
      AuditActions.UPDATE_ASSESSMENT,
      EntityTypes.ASSESSMENT,
      id,
      `Updated assessment for ${this.assessments[index].farmName}`
    );

    return this.assessments[index];
  }

  submitAssessment(id: string, submittedBy: string): Assessment | null {
    return this.updateAssessment(id, { status: "Submitted" }, submittedBy);
  }

  approveAssessment(id: string, approvedBy: string): Assessment | null {
    return this.updateAssessment(id, { status: "Approved", synced: true }, approvedBy);
  }

  rejectAssessment(id: string, rejectedBy: string): Assessment | null {
    return this.updateAssessment(id, { status: "Rejected" }, rejectedBy);
  }

  deleteAssessment(id: string, deletedBy: string): boolean {
    const assessment = this.getAssessmentById(id);
    if (!assessment) return false;

    this.assessments = this.assessments.filter((a) => a.id !== id);
    this.saveAssessments();

    auditService.log(
      deletedBy,
      deletedBy,
      AuditActions.DELETE_ASSESSMENT,
      EntityTypes.ASSESSMENT,
      id,
      `Deleted assessment for ${assessment.farmName}`
    );

    return true;
  }

  createFollowUpAssessment(
    originalAssessmentId: string,
    inspectorId: string,
    inspectorName: string
  ): Assessment | null {
    const originalAssessment = this.getAssessmentById(originalAssessmentId);
    if (!originalAssessment) return null;

    const followUpAssessment = this.createAssessment(
      {
        farmId: originalAssessment.farmId,
        farmName: originalAssessment.farmName,
        farmType: originalAssessment.farmType,
        checklistId: originalAssessment.checklistId,
        checklistVersion: originalAssessment.checklistVersion,
        assessmentType: "Follow Up",
        previousAssessmentId: originalAssessmentId,
        responses: [],
        inspectorId,
        inspectorName,
        dzongkhag: originalAssessment.dzongkhag,
        gewog: originalAssessment.gewog,
        assessmentDate: new Date().toISOString().split("T")[0],
        status: "Draft",
        followUpRequired: false,
        nonConformities: [],
      },
      inspectorId
    );

    auditService.log(
      inspectorId,
      inspectorName,
      AuditActions.APPROVE_FOLLOW_UP,
      EntityTypes.ASSESSMENT,
      followUpAssessment.id,
      `Created follow-up assessment for ${followUpAssessment.farmName}`
    );

    return followUpAssessment;
  }

  private responsesToRecord(responses: AssessmentResponse[]): Record<string, "yes" | "no" | "partial"> {
    const record: Record<string, "yes" | "no" | "partial"> = {};
    responses.forEach((r) => {
      record[r.itemId] = r.response;
    });
    return record;
  }

  syncAssessment(id: string): boolean {
    const assessment = this.getAssessmentById(id);
    if (!assessment) return false;

    assessment.synced = true;
    this.saveAssessments();

    auditService.log(
      assessment.inspectorId,
      assessment.inspectorName,
      AuditActions.SYNC_ASSESSMENT,
      EntityTypes.ASSESSMENT,
      id,
      `Synced assessment for ${assessment.farmName}`
    );

    return true;
  }
}

export const assessmentService = new AssessmentService();
