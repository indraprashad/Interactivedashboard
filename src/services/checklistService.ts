export interface ChecklistItem {
  id: string;
  category: string;
  section: string;
  question: string;
  assessorGuide: string;
  scoringCriteria: {
    yes: string;
    no: string;
    partial: string;
  };
  maxScore: number;
  weight: number;
  mandatory: boolean;
  evidenceRequired: boolean;
}

export interface Checklist {
  id: string;
  version: string;
  name: string;
  description: string;
  farmType: "Poultry" | "Pig" | "Cattle" | "All";
  items: ChecklistItem[];
  effectiveDate: string;
  expiryDate?: string;
}

class ChecklistService {
  private checklists: Checklist[] = [];
  private readonly STORAGE_KEY = "bbas_checklists";

  constructor() {
    this.loadChecklists();
  }

  private loadChecklists() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.checklists = JSON.parse(stored);
      } else {
        this.initializeDefaultChecklists();
      }
    } catch (error) {
      console.error("Failed to load checklists:", error);
      this.initializeDefaultChecklists();
    }
  }

  private initializeDefaultChecklists() {
    this.checklists = [
      {
        id: "CHK-001",
        version: "1.0",
        name: "Poultry Biosecurity Assessment Checklist",
        description: "Standard biosecurity assessment checklist for poultry farms",
        farmType: "Poultry",
        effectiveDate: "2024-01-01",
        items: [
          {
            id: "P-001",
            category: "Location and Infrastructure",
            section: "Farm Location",
            question: "Is the farm located at least 500m from other poultry farms?",
            assessorGuide: "Verify distance using GPS or farm map. Check for nearby poultry operations within 500m radius.",
            scoringCriteria: {
              yes: "Full compliance - 2 points",
              no: "Non-compliant - 0 points",
              partial: "Partial compliance - 1 point (300-500m)"
            },
            maxScore: 2,
            weight: 1,
            mandatory: true,
            evidenceRequired: true
          },
          {
            id: "P-002",
            category: "Location and Infrastructure",
            section: "Farm Location",
            question: "Is the farm accessible by a dedicated road not shared with other livestock?",
            assessorGuide: "Inspect road access. Verify no other livestock use the same access road.",
            scoringCriteria: {
              yes: "Full compliance - 2 points",
              no: "Non-compliant - 0 points",
              partial: "Partial compliance - 1 point"
            },
            maxScore: 2,
            weight: 1,
            mandatory: true,
            evidenceRequired: false
          },
          {
            id: "P-003",
            category: "Biosecurity Measures",
            section: "Perimeter Security",
            question: "Is the entire farm perimeter fenced with secure fencing?",
            assessorGuide: "Inspect fence integrity. Check for gaps, damage, or unauthorized entry points.",
            scoringCriteria: {
              yes: "Full compliance - 2 points",
              no: "Non-compliant - 0 points",
              partial: "Partial compliance - 1 point (fenced but needs repair)"
            },
            maxScore: 2,
            weight: 1.5,
            mandatory: true,
            evidenceRequired: true
          },
          {
            id: "P-004",
            category: "Biosecurity Measures",
            section: "Entry Control",
            question: "Are there designated entry points with disinfection facilities?",
            assessorGuide: "Check for footbaths, vehicle disinfection, and hand washing stations at entry points.",
            scoringCriteria: {
              yes: "Full compliance - 2 points",
              no: "Non-compliant - 0 points",
              partial: "Partial compliance - 1 point"
            },
            maxScore: 2,
            weight: 1.5,
            mandatory: true,
            evidenceRequired: true
          },
          {
            id: "P-005",
            category: "Biosecurity Measures",
            section: "Visitor Control",
            question: "Is there a visitor logbook and visitor protocol in place?",
            assessorGuide: "Review visitor logbook. Check if protocol includes health declaration and PPE requirements.",
            scoringCriteria: {
              yes: "Full compliance - 2 points",
              no: "Non-compliant - 0 points",
              partial: "Partial compliance - 1 point"
            },
            maxScore: 2,
            weight: 1,
            mandatory: true,
            evidenceRequired: true
          },
          {
            id: "P-006",
            category: "Housing and Equipment",
            section: "Housing Design",
            question: "Are poultry houses designed to prevent wild bird access?",
            assessorGuide: "Inspect netting, screens, and structural integrity. Check for wild bird entry points.",
            scoringCriteria: {
              yes: "Full compliance - 2 points",
              no: "Non-compliant - 0 points",
              partial: "Partial compliance - 1 point"
            },
            maxScore: 2,
            weight: 1.5,
            mandatory: true,
            evidenceRequired: true
          },
          {
            id: "P-007",
            category: "Housing and Equipment",
            section: "Ventilation",
            question: "Is adequate ventilation system in place and functional?",
            assessorGuide: "Inspect ventilation equipment. Verify air quality and temperature control.",
            scoringCriteria: {
              yes: "Full compliance - 2 points",
              no: "Non-compliant - 0 points",
              partial: "Partial compliance - 1 point"
            },
            maxScore: 2,
            weight: 1,
            mandatory: true,
            evidenceRequired: false
          },
          {
            id: "P-008",
            category: "Health Management",
            section: "Vaccination",
            question: "Is there a documented vaccination program for all required diseases?",
            assessorGuide: "Review vaccination records. Verify compliance with national vaccination schedule.",
            scoringCriteria: {
              yes: "Full compliance - 2 points",
              no: "Non-compliant - 0 points",
              partial: "Partial compliance - 1 point"
            },
            maxScore: 2,
            weight: 2,
            mandatory: true,
            evidenceRequired: true
          },
          {
            id: "P-009",
            category: "Health Management",
            section: "Disease Monitoring",
            question: "Is there regular health monitoring and reporting system?",
            assessorGuide: "Review health monitoring records. Check frequency and completeness of reports.",
            scoringCriteria: {
              yes: "Full compliance - 2 points",
              no: "Non-compliant - 0 points",
              partial: "Partial compliance - 1 point"
            },
            maxScore: 2,
            weight: 1.5,
            mandatory: true,
            evidenceRequired: true
          },
          {
            id: "P-010",
            category: "Feed and Water Management",
            section: "Feed Storage",
            question: "Is feed stored in secure, pest-proof containers?",
            assessorGuide: "Inspect feed storage. Check for pest evidence and container integrity.",
            scoringCriteria: {
              yes: "Full compliance - 2 points",
              no: "Non-compliant - 0 points",
              partial: "Partial compliance - 1 point"
            },
            maxScore: 2,
            weight: 1,
            mandatory: true,
            evidenceRequired: true
          },
          {
            id: "P-011",
            category: "Feed and Water Management",
            section: "Water Quality",
            question: "Is water source tested regularly for quality and safety?",
            assessorGuide: "Review water quality test reports. Verify testing frequency and standards.",
            scoringCriteria: {
              yes: "Full compliance - 2 points",
              no: "Non-compliant - 0 points",
              partial: "Partial compliance - 1 point"
            },
            maxScore: 2,
            weight: 1.5,
            mandatory: true,
            evidenceRequired: true
          },
          {
            id: "P-012",
            category: "Waste Management",
            section: "Manure Disposal",
            question: "Is there proper manure management and disposal system?",
            assessorGuide: "Inspect manure storage and disposal. Verify compliance with environmental regulations.",
            scoringCriteria: {
              yes: "Full compliance - 2 points",
              no: "Non-compliant - 0 points",
              partial: "Partial compliance - 1 point"
            },
            maxScore: 2,
            weight: 1.5,
            mandatory: true,
            evidenceRequired: true
          },
          {
            id: "P-013",
            category: "Waste Management",
            section: "Dead Bird Disposal",
            question: "Is there a proper dead bird disposal method in place?",
            assessorGuide: "Inspect disposal facility. Verify compliance with biosecurity regulations.",
            scoringCriteria: {
              yes: "Full compliance - 2 points",
              no: "Non-compliant - 0 points",
              partial: "Partial compliance - 1 point"
            },
            maxScore: 2,
            weight: 2,
            mandatory: true,
            evidenceRequired: true
          },
          {
            id: "P-014",
            category: "Record Keeping",
            section: "Production Records",
            question: "Are comprehensive production records maintained?",
            assessorGuide: "Review production records. Check completeness and accuracy.",
            scoringCriteria: {
              yes: "Full compliance - 2 points",
              no: "Non-compliant - 0 points",
              partial: "Partial compliance - 1 point"
            },
            maxScore: 2,
            weight: 1,
            mandatory: false,
            evidenceRequired: false
          },
          {
            id: "P-015",
            category: "Record Keeping",
            section: "Medication Records",
            question: "Are medication and treatment records properly maintained?",
            assessorGuide: "Review medication records. Verify proper documentation and withdrawal periods.",
            scoringCriteria: {
              yes: "Full compliance - 2 points",
              no: "Non-compliant - 0 points",
              partial: "Partial compliance - 1 point"
            },
            maxScore: 2,
            weight: 1.5,
            mandatory: true,
            evidenceRequired: true
          }
        ]
      },
      {
        id: "CHK-002",
        version: "1.0",
        name: "Piggery Biosecurity Assessment Checklist",
        description: "Standard biosecurity assessment checklist for pig farms",
        farmType: "Pig",
        effectiveDate: "2024-01-01",
        items: [
          {
            id: "PIG-001",
            category: "Location and Infrastructure",
            section: "Farm Location",
            question: "Is the farm located at least 500m from other pig farms?",
            assessorGuide: "Verify distance using GPS or farm map. Check for nearby pig operations within 500m radius.",
            scoringCriteria: {
              yes: "Full compliance - 2 points",
              no: "Non-compliant - 0 points",
              partial: "Partial compliance - 1 point (300-500m)"
            },
            maxScore: 2,
            weight: 1,
            mandatory: true,
            evidenceRequired: true
          },
          {
            id: "PIG-002",
            category: "Biosecurity Measures",
            section: "Perimeter Security",
            question: "Is the entire farm perimeter fenced with secure fencing?",
            assessorGuide: "Inspect fence integrity. Check for gaps, damage, or unauthorized entry points.",
            scoringCriteria: {
              yes: "Full compliance - 2 points",
              no: "Non-compliant - 0 points",
              partial: "Partial compliance - 1 point"
            },
            maxScore: 2,
            weight: 1.5,
            mandatory: true,
            evidenceRequired: true
          },
          {
            id: "PIG-003",
            category: "Biosecurity Measures",
            section: "Entry Control",
            question: "Are there designated entry points with disinfection facilities?",
            assessorGuide: "Check for footbaths, vehicle disinfection, and hand washing stations at entry points.",
            scoringCriteria: {
              yes: "Full compliance - 2 points",
              no: "Non-compliant - 0 points",
              partial: "Partial compliance - 1 point"
            },
            maxScore: 2,
            weight: 1.5,
            mandatory: true,
            evidenceRequired: true
          },
          {
            id: "PIG-004",
            category: "Health Management",
            section: "Vaccination",
            question: "Is there a documented vaccination program for all required diseases?",
            assessorGuide: "Review vaccination records. Verify compliance with national vaccination schedule.",
            scoringCriteria: {
              yes: "Full compliance - 2 points",
              no: "Non-compliant - 0 points",
              partial: "Partial compliance - 1 point"
            },
            maxScore: 2,
            weight: 2,
            mandatory: true,
            evidenceRequired: true
          },
          {
            id: "PIG-005",
            category: "Feed and Water Management",
            section: "Feed Storage",
            question: "Is feed stored in secure, pest-proof containers?",
            assessorGuide: "Inspect feed storage. Check for pest evidence and container integrity.",
            scoringCriteria: {
              yes: "Full compliance - 2 points",
              no: "Non-compliant - 0 points",
              partial: "Partial compliance - 1 point"
            },
            maxScore: 2,
            weight: 1,
            mandatory: true,
            evidenceRequired: true
          }
        ]
      }
    ];
    this.saveChecklists();
  }

  private saveChecklists() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.checklists));
    } catch (error) {
      console.error("Failed to save checklists:", error);
    }
  }

  getAllChecklists(): Checklist[] {
    return this.checklists;
  }

  getChecklistById(id: string): Checklist | undefined {
    return this.checklists.find((c) => c.id === id);
  }

  getChecklistByFarmType(farmType: string): Checklist[] {
    return this.checklists.filter((c) => c.farmType === farmType || c.farmType === "All");
  }

  getChecklistItems(checklistId: string): ChecklistItem[] {
    const checklist = this.getChecklistById(checklistId);
    return checklist?.items || [];
  }

  getChecklistItem(checklistId: string, itemId: string): ChecklistItem | undefined {
    const checklist = this.getChecklistById(checklistId);
    return checklist?.items.find((item) => item.id === itemId);
  }

  calculateScore(responses: Record<string, "yes" | "no" | "partial">, checklistId: string): {
    totalScore: number;
    maxScore: number;
    percentage: number;
    complianceStatus: "Compliant" | "Non-compliant" | "Moderate";
  } {
    const checklist = this.getChecklistById(checklistId);
    if (!checklist) {
      return { totalScore: 0, maxScore: 0, percentage: 0, complianceStatus: "Non-compliant" };
    }

    let totalScore = 0;
    let maxScore = 0;

    checklist.items.forEach((item) => {
      const response = responses[item.id];
      const weightedMaxScore = item.maxScore * item.weight;
      maxScore += weightedMaxScore;

      if (response === "yes") {
        totalScore += weightedMaxScore;
      } else if (response === "partial") {
        totalScore += weightedMaxScore * 0.5;
      }
    });

    const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
    let complianceStatus: "Compliant" | "Non-compliant" | "Moderate";

    if (percentage >= 80) {
      complianceStatus = "Compliant";
    } else if (percentage >= 50) {
      complianceStatus = "Moderate";
    } else {
      complianceStatus = "Non-compliant";
    }

    return { totalScore, maxScore, percentage, complianceStatus };
  }
}

export const checklistService = new ChecklistService();
