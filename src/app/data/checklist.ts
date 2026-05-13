import type { ChecklistDomain } from "./types";

export const CHECKLIST: ChecklistDomain[] = [
  {
    id: "premises",
    name: "Farm Premises",
    weight: 0.2,
    items: [
      { id: "p1", prompt: "Farm boundary is properly fenced", guidance: "Intact perimeter fencing with no gaps" },
      { id: "p2", prompt: "Restricted entry with controlled gate" },
      { id: "p3", prompt: "Visitor log is maintained" },
      { id: "p4", prompt: "Foot dip / disinfectant available at entry" },
      { id: "p5", prompt: "Vehicles disinfected before entry" },
      { id: "p6", prompt: "Farm premises are clean and free of debris" },
    ],
  },
  {
    id: "shed",
    name: "Farm Shed Facilities",
    weight: 0.2,
    items: [
      { id: "s1", prompt: "The shed surroundings are clean" },
      { id: "s2", prompt: "Shed is properly ventilated" },
      { id: "s3", prompt: "Adequate lighting in shed" },
      { id: "s4", prompt: "Drainage system is functional" },
      { id: "s5", prompt: "Pest and rodent control measures in place" },
      { id: "s6", prompt: "Separate isolation pen/cage available" },
    ],
  },
  {
    id: "herd",
    name: "Herd Health Practices",
    weight: 0.25,
    items: [
      { id: "h1", prompt: "Vaccination schedule is followed" },
      { id: "h2", prompt: "Sick animals are isolated promptly" },
      { id: "h3", prompt: "Veterinary records are maintained" },
      { id: "h4", prompt: "Mortality is recorded and reported" },
      { id: "h5", prompt: "Carcass disposal follows safe protocol" },
      { id: "h6", prompt: "New animals quarantined before introduction" },
    ],
  },
  {
    id: "feed",
    name: "Feed & Equipment",
    weight: 0.175,
    items: [
      { id: "f1", prompt: "Feed is stored in clean dry area" },
      { id: "f2", prompt: "Feed within expiry / visibly fresh" },
      { id: "f3", prompt: "Water source is clean and tested" },
      { id: "f4", prompt: "Feeders & drinkers cleaned regularly" },
      { id: "f5", prompt: "Equipment disinfected between uses" },
    ],
  },
  {
    id: "records",
    name: "Record Keeping",
    weight: 0.175,
    items: [
      { id: "r1", prompt: "Daily production records maintained" },
      { id: "r2", prompt: "Treatment records up to date" },
      { id: "r3", prompt: "Movement records (in/out) maintained" },
      { id: "r4", prompt: "Staff training records available" },
      { id: "r5", prompt: "Biosecurity SOP documented" },
    ],
  },
];

export const SCORE_LABELS: Record<number, string> = {
  0: "Poor",
  1: "Fair",
  2: "Good",
  3: "Excellent",
};
