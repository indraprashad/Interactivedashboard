interface OfflineData {
  assessments: any[];
  farms: any[];
  syncQueue: SyncQueueItem[];
  lastSyncTime: string;
}

interface SyncQueueItem {
  id: string;
  type: "CREATE" | "UPDATE" | "DELETE";
  entityType: "ASSESSMENT" | "FARM" | "NC_CASE";
  data: any;
  timestamp: string;
  status: "PENDING" | "SYNCING" | "FAILED" | "COMPLETED";
  errorMessage?: string;
}

class OfflineService {
  private readonly STORAGE_KEY = "bbas_offline_data";
  private offlineData: OfflineData;
  private isOnline: boolean = true;

  constructor() {
    this.offlineData = this.loadOfflineData();
    this.setupNetworkListeners();
  }

  private loadOfflineData(): OfflineData {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error("Failed to load offline data:", error);
    }

    return {
      assessments: [],
      farms: [],
      syncQueue: [],
      lastSyncTime: new Date().toISOString(),
    };
  }

  private saveOfflineData() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.offlineData));
    } catch (error) {
      console.error("Failed to save offline data:", error);
    }
  }

  private setupNetworkListeners() {
    if (typeof window !== "undefined") {
      window.addEventListener("online", () => {
        this.isOnline = true;
        this.syncPendingData();
      });

      window.addEventListener("offline", () => {
        this.isOnline = false;
      });

      this.isOnline = navigator.onLine;
    }
  }

  isOffline(): boolean {
    return !this.isOnline;
  }

  getPendingSyncCount(): number {
    return this.offlineData.syncQueue.filter((item) => item.status === "PENDING").length;
  }

  saveAssessmentOffline(assessment: any) {
    const existingIndex = this.offlineData.assessments.findIndex((a) => a.id === assessment.id);
    
    if (existingIndex >= 0) {
      this.offlineData.assessments[existingIndex] = assessment;
    } else {
      this.offlineData.assessments.push(assessment);
    }

    this.addToSyncQueue({
      id: `SYNC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: "CREATE",
      entityType: "ASSESSMENT",
      data: assessment,
      timestamp: new Date().toISOString(),
      status: "PENDING",
    });

    this.saveOfflineData();
  }

  saveFarmOffline(farm: any) {
    const existingIndex = this.offlineData.farms.findIndex((f) => f.id === farm.id);
    
    if (existingIndex >= 0) {
      this.offlineData.farms[existingIndex] = farm;
    } else {
      this.offlineData.farms.push(farm);
    }

    this.addToSyncQueue({
      id: `SYNC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: "CREATE",
      entityType: "FARM",
      data: farm,
      timestamp: new Date().toISOString(),
      status: "PENDING",
    });

    this.saveOfflineData();
  }

  private addToSyncQueue(item: SyncQueueItem) {
    this.offlineData.syncQueue.push(item);
  }

  async syncPendingData(): Promise<{ success: number; failed: number }> {
    if (!this.isOnline) {
      return { success: 0, failed: 0 };
    }

    const pendingItems = this.offlineData.syncQueue.filter((item) => item.status === "PENDING");
    let successCount = 0;
    let failedCount = 0;

    for (const item of pendingItems) {
      try {
        item.status = "SYNCING";
        this.saveOfflineData();

        await this.syncItem(item);
        
        item.status = "COMPLETED";
        successCount++;
      } catch (error) {
        item.status = "FAILED";
        item.errorMessage = error instanceof Error ? error.message : "Unknown error";
        failedCount++;
      }

      this.saveOfflineData();
    }

    if (successCount > 0) {
      this.offlineData.lastSyncTime = new Date().toISOString();
      this.saveOfflineData();
    }

    return { success: successCount, failed: failedCount };
  }

  private async syncItem(item: SyncQueueItem): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) {
          resolve();
        } else {
          reject(new Error("Sync failed"));
        }
      }, 1000);
    });
  }

  getOfflineAssessments(): any[] {
    return this.offlineData.assessments;
  }

  getOfflineFarms(): any[] {
    return this.offlineData.farms;
  }

  getSyncQueue(): SyncQueueItem[] {
    return this.offlineData.syncQueue;
  }

  getLastSyncTime(): string {
    return this.offlineData.lastSyncTime;
  }

  clearSyncQueue() {
    this.offlineData.syncQueue = this.offlineData.syncQueue.filter((item) => item.status !== "COMPLETED");
    this.saveOfflineData();
  }

  retryFailedSyncs(): void {
    this.offlineData.syncQueue.forEach((item) => {
      if (item.status === "FAILED") {
        item.status = "PENDING";
        item.errorMessage = undefined;
      }
    });
    this.saveOfflineData();
    this.syncPendingData();
  }
}

export const offlineService = new OfflineService();
