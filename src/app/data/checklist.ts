import type { ChecklistDomain } from "./types";

export const CHECKLIST: ChecklistDomain[] = [
  {
    id: "premises",
    name: "Farm Premises",
    weight: 0.2,
    items: [
      {
        id: "p1",
        prompt: "Farm boundary is properly fenced",
        guidance: "Intact perimeter fencing with no gaps or breaks; clearly demarcates farm boundary",
      },
      {
        id: "p2",
        prompt: "Biosecurity signboard is displayed at the farm entrance",
        guidance: "Visible biosecurity signboard at main entrance; restricts unauthorized entry and displays farm biosecurity rules",
      },
      {
        id: "p3",
        prompt: "Visitor log is maintained at entry",
        guidance: "Up-to-date record of all visitors with name, date, time, and purpose of visit",
      },
      {
        id: "p4",
        prompt: "Tyre dip / vehicle disinfection bay present and functional",
        guidance: "Vehicle tyres disinfected on entry; disinfectant solution replenished regularly",
      },
      {
        id: "p5",
        prompt: "Foot wash / disinfectant station available at entry",
        guidance: "Functional foot bath or spray station at farm and shed entry; solution changed regularly",
      },
      {
        id: "p6",
        prompt: "Farm-specific gears (boots, overalls) available for visitors",
        guidance: "Dedicated farm gear provided and used by all persons entering the farm",
      },
      {
        id: "p7",
        prompt: "Farm is located at adequate distance from highway / public road",
        guidance: "Farm premises sufficiently set back from main roads to reduce disease entry risk",
      },
    ],
  },
  {
    id: "shed",
    name: "Farm Shed Facilities",
    weight: 0.2,
    items: [
      {
        id: "s1",
        prompt: "Shed surroundings are clean and free of debris",
        guidance: "No litter, dead birds/animals, stagnant water or organic waste around sheds",
      },
      {
        id: "s2",
        prompt: "Shed is properly ventilated",
        guidance: "Adequate air circulation; no heat or ammonia build-up; ventilation adjusted by season",
      },
      {
        id: "s3",
        prompt: "Adequate lighting in shed",
        guidance: "Proper light intensity for the species; lighting schedule followed",
      },
      {
        id: "s4",
        prompt: "Drainage system is functional",
        guidance: "Drainage channels clear; no pooling of water inside or around shed",
      },
      {
        id: "s5",
        prompt: "Pest and rodent control measures in place",
        guidance: "Evidence of active rodent control (bait stations, traps); no pest harbourage",
      },
      {
        id: "s6",
        prompt: "Separate isolation pen / cage available",
        guidance: "Designated area for isolating sick or new animals; physically separated from main stock",
      },
    ],
  },
  {
    id: "herd",
    name: "Herd Health Practices",
    weight: 0.2,
    items: [
      {
        id: "h1",
        prompt: "Vaccination schedule is followed per DoL/BFDA guidelines",
        guidance: "Vaccination records up to date; correct vaccines, doses, and intervals used",
      },
      {
        id: "h2",
        prompt: "Deworming programme is implemented regularly",
        guidance: "Regular anthelmintic treatment; records of deworming dates and products used",
      },
      {
        id: "h3",
        prompt: "Animals checked at least twice daily for signs of illness",
        guidance: "Routine twice-daily observation; abnormal behaviour or clinical signs detected promptly",
      },
      {
        id: "h4",
        prompt: "Sick animals are isolated promptly",
        guidance: "Any animal showing illness immediately moved to isolation pen; treatment commenced",
      },
      {
        id: "h5",
        prompt: "Mortality and disease reported within 24 hours to DLO",
        guidance: "Unusual mortality or notifiable disease reported to District Livestock Officer within 24 hours",
      },
      {
        id: "h6",
        prompt: "Feeding practices follow species-specific nutritional standards",
        guidance: "Correct feed type, quantity, and frequency per species and age group",
      },
      {
        id: "h7",
        prompt: "Water source is clean and regularly tested",
        guidance: "Potable water supply; records of water quality tests; sources protected from contamination",
      },
      {
        id: "h8",
        prompt: "Carcass disposal follows safe protocol",
        guidance: "Dead animals disposed by incineration, deep burial, or approved rendering; not dumped openly",
      },
      {
        id: "h9",
        prompt: "Visitor access is restricted to essential personnel only",
        guidance: "Non-essential visitors are denied entry; essential visitors follow biosecurity protocols before entering",
      },
    ],
  },
  {
    id: "feed",
    name: "Feed & Equipment",
    weight: 0.2,
    items: [
      {
        id: "f1",
        prompt: "Feed is stored in clean, dry, rodent-proof area; within expiry",
        guidance: "Feed store off floor, sealed containers; no mould, pests or expired feed present",
      },
      {
        id: "f2",
        prompt: "Feeders, drinkers and equipment cleaned and disinfected regularly",
        guidance: "Equipment cleaned per schedule; records of disinfection; no build-up of organic matter",
      },
    ],
  },
  {
    id: "records",
    name: "Record Keeping",
    weight: 0.2,
    items: [
      {
        id: "r1",
        prompt: "Daily production records (eggs/weight/mortality) maintained",
        guidance: "Records updated daily; available for inspection; figures consistent with actual stock",
      },
      {
        id: "r2",
        prompt: "Treatment and veterinary records are up to date",
        guidance: "All medicines, doses, dates and withdrawal periods recorded; prescribed by registered vet",
      },
      {
        id: "r3",
        prompt: "Animal movement records (in/out) maintained",
        guidance: "All movements of stock, feed and visitors documented with dates and quantities",
      },
    ],
  },
];

export const SCORE_LABELS: Record<number, string> = {
  0: "Poor",
  1: "Fair",
  2: "Good",
  3: "Excellent",
};
