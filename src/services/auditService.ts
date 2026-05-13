interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: string;
  timestamp: string;
  ipAddress?: string;
}

class AuditService {
  private logs: AuditLog[] = [];
  private readonly STORAGE_KEY = "bbas_audit_logs";

  constructor() {
    this.loadLogs();
  }

  private loadLogs() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.logs = JSON.parse(stored);
      }
    } catch (error) {
      console.error("Failed to load audit logs:", error);
    }
  }

  private saveLogs() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.logs));
    } catch (error) {
      console.error("Failed to save audit logs:", error);
    }
  }

  log(
    userId: string,
    userName: string,
    action: string,
    entityType: string,
    entityId?: string,
    details?: string
  ) {
    const log: AuditLog = {
      id: `AUD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      userName,
      action,
      entityType,
      entityId,
      details,
      timestamp: new Date().toISOString(),
    };

    this.logs.unshift(log);
    
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(0, 1000);
    }

    this.saveLogs();
    console.log("[AUDIT]", log);
  }

  getLogs(filters?: {
    userId?: string;
    action?: string;
    entityType?: string;
    startDate?: Date;
    endDate?: Date;
  }): AuditLog[] {
    let filtered = this.logs;

    if (filters?.userId) {
      filtered = filtered.filter((log) => log.userId === filters.userId);
    }

    if (filters?.action) {
      filtered = filtered.filter((log) => log.action === filters.action);
    }

    if (filters?.entityType) {
      filtered = filtered.filter((log) => log.entityType === filters.entityType);
    }

    if (filters?.startDate) {
      filtered = filtered.filter((log) => new Date(log.timestamp) >= filters.startDate!);
    }

    if (filters?.endDate) {
      filtered = filtered.filter((log) => new Date(log.timestamp) <= filters.endDate!);
    }

    return filtered;
  }

  getRecentLogs(limit: number = 50): AuditLog[] {
    return this.logs.slice(0, limit);
  }

  clearLogs() {
    this.logs = [];
    this.saveLogs();
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const auditService = new AuditService();

export const AuditActions = {
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  CREATE_ASSESSMENT: "CREATE_ASSESSMENT",
  UPDATE_ASSESSMENT: "UPDATE_ASSESSMENT",
  DELETE_ASSESSMENT: "DELETE_ASSESSMENT",
  CREATE_FARM: "CREATE_FARM",
  UPDATE_FARM: "UPDATE_FARM",
  DELETE_FARM: "DELETE_FARM",
  CREATE_USER: "CREATE_USER",
  UPDATE_USER: "UPDATE_USER",
  DELETE_USER: "DELETE_USER",
  DEACTIVATE_USER: "DEACTIVATE_USER",
  ACTIVATE_USER: "ACTIVATE_USER",
  RESET_PASSWORD: "RESET_PASSWORD",
  APPROVE_FOLLOW_UP: "APPROVE_FOLLOW_UP",
  SYNC_ASSESSMENT: "SYNC_ASSESSMENT",
  EXPORT_REPORT: "EXPORT_REPORT",
  VIEW_REPORT: "VIEW_REPORT",
  UPDATE_CHECKLIST: "UPDATE_CHECKLIST",
  UPDATE_SCORING_RULES: "UPDATE_SCORING_RULES",
  UPDATE_LOOKUP_TABLE: "UPDATE_LOOKUP_TABLE",
  CONFIGURE_PPFRS: "CONFIGURE_PPFRS",
} as const;

export const EntityTypes = {
  ASSESSMENT: "ASSESSMENT",
  FARM: "FARM",
  USER: "USER",
  CHECKLIST: "CHECKLIST",
  SCORING_RULE: "SCORING_RULE",
  LOOKUP_TABLE: "LOOKUP_TABLE",
  PPFRS_CONFIG: "PPFRS_CONFIG",
  REPORT: "REPORT",
  NC_CASE: "NC_CASE",
} as const;
