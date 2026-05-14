import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Assessment, Farm, NCRecord, NotificationLogEntry, User } from "../src/app/data/types";
import { FARMS } from "../src/app/data/farms";
import { USERS } from "../src/app/data/users";
import { SEED_ASSESSMENTS } from "../src/app/data/assessments";
import { CHECKLIST } from "../src/app/data/checklist";

function deriveNCs(assessments: Assessment[]): NCRecord[] {
  const out: NCRecord[] = [];
  for (const a of assessments) {
    for (const r of a.responses) {
      if (r.na || r.score > 1) continue;
      const domain = CHECKLIST.find((d) => d.items.some((i) => i.id === r.itemId));
      const item = domain?.items.find((i) => i.id === r.itemId);
      if (!domain || !item) continue;
      out.push({
        id: `${a.id}-${r.itemId}`,
        assessmentId: a.id,
        farmId: a.farmId,
        domainId: domain.id,
        itemId: r.itemId,
        prompt: item.prompt,
        score: r.score,
        raisedAt: a.date,
        active: a.status !== "Closed",
      });
    }
  }
  return out;
}

const seedNotifications: NotificationLogEntry[] = SEED_ASSESSMENTS
  .filter((a) => a.ncCount > 0)
  .slice(0, 8)
  .map((a, i) => ({
    id: `NTF-${i + 1}`,
    date: a.date,
    recipient: i % 2 === 0 ? "DLO Office" : "Focal Officer",
    channel: i % 3 === 0 ? "Email" : "System",
    subject: `Non-compliance flagged for ${a.farmId}`,
    assessmentId: a.id,
  }));

interface AppState {
  currentUserId: string | null;
  users: User[];
  farms: Farm[];
  assessments: Assessment[];
  ncs: NCRecord[];
  notifications: NotificationLogEntry[];
  login: (id: string) => void;
  logout: () => void;
  addFarm: (f: Farm) => void;
  saveAssessment: (a: Assessment) => void;
  closeNC: (ncId: string) => void;
  resetDemo: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      currentUserId: null,
      users: USERS,
      farms: FARMS,
      assessments: SEED_ASSESSMENTS,
      ncs: deriveNCs(SEED_ASSESSMENTS),
      notifications: seedNotifications,
      login: (id) => set({ currentUserId: id }),
      logout: () => set({ currentUserId: null }),
      addFarm: (f) => set((s) => ({ farms: [f, ...s.farms] })),
      saveAssessment: (a) =>
        set((s) => {
          const others = s.assessments.filter((x) => x.id !== a.id);
          const next = [a, ...others];
          return { assessments: next, ncs: deriveNCs(next) };
        }),
      closeNC: (ncId) =>
        set((s) => ({ ncs: s.ncs.map((n) => (n.id === ncId ? { ...n, active: false, closedAt: new Date().toISOString() } : n)) })),
      resetDemo: () =>
        set({
          farms: FARMS,
          assessments: SEED_ASSESSMENTS,
          ncs: deriveNCs(SEED_ASSESSMENTS),
          notifications: seedNotifications,
        }),
    }),
    { name: "bbas-store" },
  ),
);

export function useCurrentUser() {
  return useStore((s) => s.users.find((u) => u.id === s.currentUserId) ?? null);
}
