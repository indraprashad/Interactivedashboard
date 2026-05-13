import { auditService, AuditActions, EntityTypes } from "./auditService";

interface LookupTable {
  id: string;
  name: string;
  category: string;
  description: string;
  data: Record<string, any>[];
  status: "Active" | "Inactive";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

class LookupTableService {
  private tables: LookupTable[] = [];
  private readonly STORAGE_KEY = "bbas_lookup_tables";

  constructor() {
    this.loadTables();
  }

  private loadTables() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.tables = JSON.parse(stored);
      } else {
        this.initializeDefaultTables();
      }
    } catch (error) {
      console.error("Failed to load lookup tables:", error);
      this.initializeDefaultTables();
    }
  }

  private initializeDefaultTables() {
    this.tables = [
      {
        id: "LKT-001",
        name: "Dzongkhags",
        category: "Geographic",
        description: "List of all Dzongkhags in Bhutan",
        data: [
          { code: "TH", name: "Thimphu" },
          { code: "PAR", name: "Paro" },
          { code: "PU", name: "Punakha" },
          { code: "BUM", name: "Bumthang" },
          { code: "WD", name: "Wangdue Phodrang" },
          { code: "TR", name: "Trashigang" },
          { code: "MON", name: "Mongar" },
          { code: "SD", name: "Samdrup Jongkhar" },
          { code: "TSI", name: "Trashiyangtse" },
          { code: "GA", name: "Gasa" },
          { code: "DAG", name: "Dagana" },
          { code: "CHU", name: "Chukha" },
          { code: "HL", name: "Haa" },
          { code: "SAM", name: "Samtse" },
          { code: "SARP", name: "Sarpang" },
          { code: "PEMA", name: "Pema Gatshel" },
          { code: "ZHEM", name: "Zhemgang" },
          { code: "TRONG", name: "Trongsa" },
          { code: "BART", name: "Bartang" },
          { code: "LHUNT", name: "Lhuentse" },
        ],
        status: "Active",
        createdBy: "System",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "LKT-002",
        name: "Farm Types",
        category: "Farm",
        description: "Types of farms in the system",
        data: [
          { code: "POULTRY", name: "Poultry", description: "Chicken and other poultry farms" },
          { code: "PIG", name: "Piggery", description: "Pig farms" },
          { code: "CATTLE", name: "Cattle", description: "Dairy and beef cattle farms" },
          { code: "MIXED", name: "Mixed", description: "Farms with multiple livestock types" },
        ],
        status: "Active",
        createdBy: "System",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "LKT-003",
        name: "Assessment Types",
        category: "Assessment",
        description: "Types of assessments that can be conducted",
        data: [
          { code: "ON_REQUEST", name: "On Request / New Farm Registration" },
          { code: "REGULAR", name: "Regular / Planned Assessment" },
          { code: "FOLLOW_UP", name: "Follow Up Assessment" },
          { code: "COMPLAINT", name: "Complaint Based Assessment" },
          { code: "OUTBREAK", name: "Assessment During Disease Outbreak" },
        ],
        status: "Active",
        createdBy: "System",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "LKT-004",
        name: "Compliance Status",
        category: "Assessment",
        description: "Compliance status classifications",
        data: [
          { code: "COMPLIANT", name: "Compliant", minScore: 80, color: "#1a6b58" },
          { code: "MODERATE", name: "Moderate", minScore: 50, color: "#fbbf24" },
          { code: "NON_COMPLIANT", name: "Non-compliant", minScore: 0, color: "#c2410c" },
        ],
        status: "Active",
        createdBy: "System",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "LKT-005",
        name: "Disease Categories",
        category: "Health",
        description: "Categories of diseases for reporting",
        data: [
          { code: "AVIAN", name: "Avian Diseases", description: "Bird-related diseases" },
          { code: "SWINE", name: "Swine Diseases", description: "Pig-related diseases" },
          { code: "BOVINE", name: "Bovine Diseases", description: "Cattle-related diseases" },
          { code: "ZONOTIC", name: "Zoonotic Diseases", description: "Diseases transmissible to humans" },
        ],
        status: "Active",
        createdBy: "System",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
    ];
    this.saveTables();
  }

  private saveTables() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tables));
    } catch (error) {
      console.error("Failed to save lookup tables:", error);
    }
  }

  getAllTables(): LookupTable[] {
    return this.tables;
  }

  getTableById(id: string): LookupTable | undefined {
    return this.tables.find((t) => t.id === id);
  }

  getTableByName(name: string): LookupTable | undefined {
    return this.tables.find((t) => t.name === name);
  }

  getTablesByCategory(category: string): LookupTable[] {
    return this.tables.filter((t) => t.category === category);
  }

  getActiveTables(): LookupTable[] {
    return this.tables.filter((t) => t.status === "Active");
  }

  createTable(
    tableData: Omit<LookupTable, "id" | "status" | "createdAt" | "updatedAt">,
    createdBy: string
  ): LookupTable {
    const newTable: LookupTable = {
      ...tableData,
      id: `LKT-${String(this.tables.length + 1).padStart(3, "0")}`,
      status: "Active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.tables.push(newTable);
    this.saveTables();

    auditService.log(
      createdBy,
      createdBy,
      AuditActions.UPDATE_LOOKUP_TABLE,
      EntityTypes.LOOKUP_TABLE,
      newTable.id,
      `Created lookup table: ${newTable.name}`
    );

    return newTable;
  }

  updateTable(
    id: string,
    updates: Partial<Omit<LookupTable, "id" | "createdAt">>,
    updatedBy: string
  ): LookupTable | null {
    const index = this.tables.findIndex((t) => t.id === id);
    if (index === -1) return null;

    this.tables[index] = {
      ...this.tables[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.saveTables();

    auditService.log(
      updatedBy,
      updatedBy,
      AuditActions.UPDATE_LOOKUP_TABLE,
      EntityTypes.LOOKUP_TABLE,
      id,
      `Updated lookup table: ${this.tables[index].name}`
    );

    return this.tables[index];
  }

  deactivateTable(id: string, deactivatedBy: string): LookupTable | null {
    return this.updateTable(id, { status: "Inactive" }, deactivatedBy);
  }

  activateTable(id: string, activatedBy: string): LookupTable | null {
    return this.updateTable(id, { status: "Active" }, activatedBy);
  }

  deleteTable(id: string, deletedBy: string): boolean {
    const table = this.getTableById(id);
    if (!table) return false;

    this.tables = this.tables.filter((t) => t.id !== id);
    this.saveTables();

    auditService.log(
      deletedBy,
      deletedBy,
      AuditActions.UPDATE_LOOKUP_TABLE,
      EntityTypes.LOOKUP_TABLE,
      id,
      `Deleted lookup table: ${table.name}`
    );

    return true;
  }

  getTableData(tableName: string): Record<string, any>[] {
    const table = this.getTableByName(tableName);
    return table?.data || [];
  }
}

export const lookupTableService = new LookupTableService();
