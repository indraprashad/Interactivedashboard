import { checklistService, Checklist } from "./checklistService";
import { auditService, AuditActions, EntityTypes } from "./auditService";

interface ChecklistVersion {
  id: string;
  checklistId: string;
  version: string;
  name: string;
  description: string;
  changes: string[];
  effectiveDate: string;
  expiryDate?: string;
  status: "Draft" | "Active" | "Deprecated";
  createdBy: string;
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

class ChecklistVersionService {
  private versions: ChecklistVersion[] = [];
  private readonly STORAGE_KEY = "bbas_checklist_versions";

  constructor() {
    this.loadVersions();
  }

  private loadVersions() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.versions = JSON.parse(stored);
      } else {
        this.initializeDefaultVersions();
      }
    } catch (error) {
      console.error("Failed to load checklist versions:", error);
      this.initializeDefaultVersions();
    }
  }

  private initializeDefaultVersions() {
    this.versions = [
      {
        id: "VER-001",
        checklistId: "CHK-001",
        version: "1.0",
        name: "Poultry Biosecurity Assessment Checklist v1.0",
        description: "Initial version of poultry biosecurity assessment checklist",
        changes: ["Initial release"],
        effectiveDate: "2024-01-01",
        status: "Active",
        createdBy: "System",
        createdAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "VER-002",
        checklistId: "CHK-002",
        version: "1.0",
        name: "Piggery Biosecurity Assessment Checklist v1.0",
        description: "Initial version of piggery biosecurity assessment checklist",
        changes: ["Initial release"],
        effectiveDate: "2024-01-01",
        status: "Active",
        createdBy: "System",
        createdAt: "2024-01-01T00:00:00Z",
      },
    ];
    this.saveVersions();
  }

  private saveVersions() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.versions));
    } catch (error) {
      console.error("Failed to save checklist versions:", error);
    }
  }

  getAllVersions(): ChecklistVersion[] {
    return this.versions;
  }

  getVersionsByChecklist(checklistId: string): ChecklistVersion[] {
    return this.versions.filter((v) => v.checklistId === checklistId);
  }

  getActiveVersion(checklistId: string): ChecklistVersion | undefined {
    return this.versions.find(
      (v) => v.checklistId === checklistId && v.status === "Active"
    );
  }

  getVersionById(id: string): ChecklistVersion | undefined {
    return this.versions.find((v) => v.id === id);
  }

  createVersion(
    checklistId: string,
    versionData: Omit<ChecklistVersion, "id" | "checklistId" | "status" | "createdAt">,
    createdBy: string
  ): ChecklistVersion {
    const newVersion: ChecklistVersion = {
      ...versionData,
      id: `VER-${String(this.versions.length + 1).padStart(3, "0")}`,
      checklistId,
      status: "Draft",
      createdAt: new Date().toISOString(),
    };

    this.versions.push(newVersion);
    this.saveVersions();

    auditService.log(
      createdBy,
      createdBy,
      AuditActions.UPDATE_CHECKLIST,
      EntityTypes.CHECKLIST,
      newVersion.id,
      `Created new checklist version ${newVersion.version} for checklist ${checklistId}`
    );

    return newVersion;
  }

  approveVersion(versionId: string, approvedBy: string): ChecklistVersion | null {
    const version = this.getVersionById(versionId);
    if (!version) return null;

    const checklistVersions = this.getVersionsByChecklist(version.checklistId);
    
    checklistVersions.forEach((v) => {
      if (v.status === "Active") {
        v.status = "Deprecated";
      }
    });

    version.status = "Active";
    version.approvedBy = approvedBy;
    version.approvedAt = new Date().toISOString();

    this.saveVersions();

    auditService.log(
      approvedBy,
      approvedBy,
      AuditActions.UPDATE_CHECKLIST,
      EntityTypes.CHECKLIST,
      versionId,
      `Approved checklist version ${version.version}`
    );

    return version;
  }

  deprecateVersion(versionId: string, deprecatedBy: string): ChecklistVersion | null {
    const version = this.getVersionById(versionId);
    if (!version) return null;

    version.status = "Deprecated";
    this.saveVersions();

    auditService.log(
      deprecatedBy,
      deprecatedBy,
      AuditActions.UPDATE_CHECKLIST,
      EntityTypes.CHECKLIST,
      versionId,
      `Deprecated checklist version ${version.version}`
    );

    return version;
  }

  deleteVersion(versionId: string, deletedBy: string): boolean {
    const version = this.getVersionById(versionId);
    if (!version) return false;

    if (version.status === "Active") {
      return false;
    }

    this.versions = this.versions.filter((v) => v.id !== versionId);
    this.saveVersions();

    auditService.log(
      deletedBy,
      deletedBy,
      AuditActions.UPDATE_CHECKLIST,
      EntityTypes.CHECKLIST,
      versionId,
      `Deleted checklist version ${version.version}`
    );

    return true;
  }

  getVersionHistory(checklistId: string): ChecklistVersion[] {
    return this.getVersionsByChecklist(checklistId).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}

export const checklistVersionService = new ChecklistVersionService();
