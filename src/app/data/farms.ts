import type { Farm } from "./types";
import { DZONGKHAGS } from "./dzongkhags";

const owners = [
  ["Tashi Wangmo", "10101001234"],
  ["Dorji Phuntsho", "10202003456"],
  ["Sangay Choden", "10303005678"],
  ["Kinley Dema", "10404007890"],
  ["Phurba Tshering", "10505009012"],
  ["Norbu Wangdi", "10606001234"],
  ["Choki Lhamo", "10707003456"],
  ["Tenzin Jamtsho", "10808005678"],
  ["Yeshey Pelden", "10909007890"],
  ["Ngawang Drukpa", "11010009012"],
  ["Karma Yangki", "11111001234"],
  ["Pema Wangchuk", "11212003456"],
  ["Sherab Zangmo", "11313005678"],
  ["Tandin Wangmo", "11414007890"],
  ["Ugyen Dorji", "11515009012"],
  ["Jamyang Choden", "11616001234"],
  ["Lhakpa Tshering", "11717003456"],
  ["Rinchen Pelmo", "11818005678"],
  ["Sonam Tobgay", "11919007890"],
  ["Dechen Wangmo", "12020009012"],
  ["Wangchuk Penjor", "12121001234"],
  ["Gyem Tshomo", "12222003456"],
  ["Tshewang Dorji", "12323005678"],
  ["Karma Lhaden", "12424007890"],
  ["Jigme Wangchuk", "12525009012"],
];

export const FARMS: Farm[] = owners.map(([name, cid], i) => {
  const type = i % 2 === 0 ? "Poultry" : "Piggery";
  const dz = DZONGKHAGS[i % DZONGKHAGS.length];
  const isNonReg = i >= 22;
  return {
    id: isNonReg ? `NR-${1000 + i}` : `FRM-${2000 + i}`,
    name: `${name.split(" ")[0]} ${type} Farm`,
    ownerName: name,
    ownerCID: cid,
    contact: `+975 1700${(1000 + i).toString().slice(-4)}`,
    type,
    size: type === "Poultry" ? 200 + i * 35 : 20 + i * 3,
    dzongkhag: dz,
    gewog: `${dz} Gewog`,
    village: `Village ${i + 1}`,
    gps: {
      lat: 27.0 + (i % 10) * 0.15 + Math.random() * 0.05,
      lng: 89.5 + (i % 10) * 0.18 + Math.random() * 0.05,
    },
    registrationDate: new Date(2024, (i % 12), (i % 27) + 1).toISOString(),
    source: isNonReg ? "Non-Registered" : "PPFRS",
    status: i === 5 ? "Deregistered" : "Active",
  };
});
