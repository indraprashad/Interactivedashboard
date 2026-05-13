export type Role = "inspector" | "supervisor" | "admin" | "dlo";

export interface User {
  id: string;
  name: string;
  role: Role;
  email: string;
  dzongkhag?: string;
}

export type FarmType = "Poultry" | "Piggery";
export type FarmStatus = "Active" | "Deregistered";
export type RegistrationSource = "PPFRS" | "Non-Registered";

export interface Farm {
  id: string;
  name: string;
  ownerName: string;
  ownerCID: string;
  contact: string;
  type: FarmType;
  size: number; // animals/birds count
  dzongkhag: string;
  gewog: string;
  village: string;
  gps: { lat: number; lng: number };
  registrationDate: string; // ISO
  source: RegistrationSource;
  status: FarmStatus;
}

export interface ChecklistItem {
  id: string;
  prompt: string;
  guidance?: string;
}

export interface ChecklistDomain {
  id: string;
  name: string;
  weight: number; // 0..1
  items: ChecklistItem[];
}

export type ScoreValue = 0 | 1 | 2 | 3;
export type ComplianceBand = "Poor" | "Fair" | "Good" | "Excellent";

export interface ItemResponse {
  itemId: string;
  score: ScoreValue;
  comment?: string;
  photoCount?: number;
  na?: boolean;
}

export type AssessmentStatus =
  | "Draft"
  | "Submitted"
  | "NC-Follow-Up"
  | "Closed";

export interface NCRecord {
  id: string;
  assessmentId: string;
  farmId: string;
  domainId: string;
  itemId: string;
  prompt: string;
  raisedAt: string;
  closedAt?: string;
  active: boolean;
}

export interface Assessment {
  id: string;
  farmId: string;
  inspectorId: string;
  date: string;
  status: AssessmentStatus;
  responses: ItemResponse[];
  domainScores: Record<string, number>; // 0..100
  overallScore: number; // 0..100
  band: ComplianceBand;
  ncCount: number;
  followUpOfId?: string;
  gps?: { lat: number; lng: number };
  notes?: string;
}

export interface NotificationLogEntry {
  id: string;
  date: string;
  recipient: string;
  channel: "Email" | "System";
  subject: string;
  assessmentId?: string;
}
