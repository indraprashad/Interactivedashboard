import { auditService, AuditActions, EntityTypes } from "./auditService";

interface User {
  id: string;
  name: string;
  email: string;
  role: "Administrator" | "Inspector" | "Veterinarian" | "Viewer" | "Supervisor";
  dzongkhag: string;
  status: "Active" | "Inactive";
  phone?: string;
  createdAt: string;
  lastLogin?: string;
}

class UserService {
  private users: User[] = [];
  private readonly STORAGE_KEY = "bbas_users";

  constructor() {
    this.loadUsers();
  }

  private loadUsers() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.users = JSON.parse(stored);
      } else {
        this.initializeDefaultUsers();
      }
    } catch (error) {
      console.error("Failed to load users:", error);
      this.initializeDefaultUsers();
    }
  }

  private initializeDefaultUsers() {
    this.users = [
      {
        id: "U001",
        name: "Soho Tshering",
        email: "soho.t@bbas.gov.bt",
        role: "Administrator",
        dzongkhag: "National",
        status: "Active",
        phone: "+975-17-123456",
        createdAt: "2024-01-01T00:00:00Z",
        lastLogin: "2025-03-15T00:00:00Z",
      },
      {
        id: "U002",
        name: "Kinley Wangmo",
        email: "kinley.w@bbas.gov.bt",
        role: "Inspector",
        dzongkhag: "Thimphu",
        status: "Active",
        phone: "+975-17-234567",
        createdAt: "2024-02-01T00:00:00Z",
        lastLogin: "2025-03-14T00:00:00Z",
      },
      {
        id: "U003",
        name: "Pema Dorji",
        email: "pema.d@bbas.gov.bt",
        role: "Veterinarian",
        dzongkhag: "Paro",
        status: "Active",
        phone: "+975-17-345678",
        createdAt: "2024-03-01T00:00:00Z",
        lastLogin: "2025-03-13T00:00:00Z",
      },
      {
        id: "U004",
        name: "Tshering Lhamo",
        email: "tshering.l@bbas.gov.bt",
        role: "Supervisor",
        dzongkhag: "Thimphu",
        status: "Active",
        phone: "+975-17-456789",
        createdAt: "2024-04-01T00:00:00Z",
        lastLogin: "2025-03-12T00:00:00Z",
      },
      {
        id: "U005",
        name: "Dorji Wangchuk",
        email: "dorji.w@bbas.gov.bt",
        role: "Veterinarian",
        dzongkhag: "Bumthang",
        status: "Active",
        phone: "+975-17-567890",
        createdAt: "2024-05-01T00:00:00Z",
        lastLogin: "2025-03-10T00:00:00Z",
      },
      {
        id: "U006",
        name: "Ugyen Tshomo",
        email: "ugyen.t@bbas.gov.bt",
        role: "Viewer",
        dzongkhag: "Thimphu",
        status: "Inactive",
        phone: "+975-17-678901",
        createdAt: "2024-06-01T00:00:00Z",
        lastLogin: "2025-02-28T00:00:00Z",
      },
    ];
    this.saveUsers();
  }

  private saveUsers() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.users));
    } catch (error) {
      console.error("Failed to save users:", error);
    }
  }

  private generateId(): string {
    return `U${String(this.users.length + 1).padStart(3, "0")}`;
  }

  getAllUsers(): User[] {
    return this.users;
  }

  getUserById(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.users.find((user) => user.email === email);
  }

  getUsersByRole(role: string): User[] {
    return this.users.filter((user) => user.role === role);
  }

  getUsersByDzongkhag(dzongkhag: string): User[] {
    return this.users.filter((user) => user.dzongkhag === dzongkhag);
  }

  createUser(
    userData: Omit<User, "id" | "createdAt">,
    createdBy: string
  ): User {
    const newUser: User = {
      ...userData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
    };

    this.users.push(newUser);
    this.saveUsers();

    auditService.log(
      createdBy,
      createdBy,
      AuditActions.CREATE_USER,
      EntityTypes.USER,
      newUser.id,
      `Created user: ${newUser.name} (${newUser.email}) with role ${newUser.role}`
    );

    return newUser;
  }

  updateUser(
    id: string,
    updates: Partial<Omit<User, "id" | "createdAt">>,
    updatedBy: string
  ): User | null {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) return null;

    const oldUser = this.users[index];
    this.users[index] = { ...this.users[index], ...updates };
    this.saveUsers();

    auditService.log(
      updatedBy,
      updatedBy,
      AuditActions.UPDATE_USER,
      EntityTypes.USER,
      id,
      `Updated user: ${oldUser.name} (${oldUser.email})`
    );

    return this.users[index];
  }

  deactivateUser(id: string, deactivatedBy: string): User | null {
    const user = this.getUserById(id);
    if (!user || user.status === "Inactive") return null;

    user.status = "Inactive";
    this.saveUsers();

    auditService.log(
      deactivatedBy,
      deactivatedBy,
      AuditActions.DEACTIVATE_USER,
      EntityTypes.USER,
      id,
      `Deactivated user: ${user.name} (${user.email})`
    );

    return user;
  }

  activateUser(id: string, activatedBy: string): User | null {
    const user = this.getUserById(id);
    if (!user || user.status === "Active") return null;

    user.status = "Active";
    this.saveUsers();

    auditService.log(
      activatedBy,
      activatedBy,
      AuditActions.ACTIVATE_USER,
      EntityTypes.USER,
      id,
      `Activated user: ${user.name} (${user.email})`
    );

    return user;
  }

  deleteUser(id: string, deletedBy: string): boolean {
    const user = this.getUserById(id);
    if (!user) return false;

    this.users = this.users.filter((u) => u.id !== id);
    this.saveUsers();

    auditService.log(
      deletedBy,
      deletedBy,
      AuditActions.DELETE_USER,
      EntityTypes.USER,
      id,
      `Deleted user: ${user.name} (${user.email})`
    );

    return true;
  }

  resetPassword(id: string, resetBy: string): boolean {
    const user = this.getUserById(id);
    if (!user) return false;

    auditService.log(
      resetBy,
      resetBy,
      AuditActions.RESET_PASSWORD,
      EntityTypes.USER,
      id,
      `Password reset initiated for user: ${user.name} (${user.email})`
    );

    return true;
  }

  transferJurisdiction(id: string, newDzongkhag: string, transferredBy: string): User | null {
    const user = this.getUserById(id);
    if (!user) return null;

    const oldDzongkhag = user.dzongkhag;
    user.dzongkhag = newDzongkhag;
    this.saveUsers();

    auditService.log(
      transferredBy,
      transferredBy,
      AuditActions.UPDATE_USER,
      EntityTypes.USER,
      id,
      `Transferred user ${user.name} from ${oldDzongkhag} to ${newDzongkhag}`
    );

    return user;
  }

  updateLastLogin(id: string): void {
    const user = this.getUserById(id);
    if (user) {
      user.lastLogin = new Date().toISOString();
      this.saveUsers();
    }
  }
}

export const userService = new UserService();
