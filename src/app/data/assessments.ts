import type { Assessment, ItemResponse, ScoreValue, ComplianceBand } from "./types";
import { CHECKLIST } from "./checklist";
import { FARMS } from "./farms";

export function bandFor(score: number): ComplianceBand {
  if (score >= 81) return "Excellent";
  if (score >= 61) return "Good";
  if (score >= 41) return "Fair";
  return "Poor";
}

export function computeScores(responses: ItemResponse[]) {
  const domainScores: Record<string, number> = {};
  let overall = 0;
  for (const d of CHECKLIST) {
    const items = d.items.filter((it) => !responses.find((r) => r.itemId === it.id)?.na);
    const total = items.length * 3;
    const sum = items.reduce((acc, it) => {
      const r = responses.find((x) => x.itemId === it.id);
      return acc + (r ? r.score : 0);
    }, 0);
    const pct = total === 0 ? 0 : (sum / total) * 100;
    domainScores[d.id] = Math.round(pct);
    overall += pct * d.weight;
  }
  const overallScore = Math.round(overall);
  return { domainScores, overallScore, band: bandFor(overallScore) };
}

export function ncCount(responses: ItemResponse[]) {
  return responses.filter((r) => !r.na && r.score <= 1).length;
}

function genResponses(seed: number): ItemResponse[] {
  const out: ItemResponse[] = [];
  for (const d of CHECKLIST) {
    for (const it of d.items) {
      // pseudo-random scoring
      const v = ((seed * 31 + it.id.charCodeAt(0) + it.id.charCodeAt(1)) % 4) as ScoreValue;
      out.push({ itemId: it.id, score: v, comment: v === 0 ? "Needs immediate attention" : undefined });
    }
  }
  return out;
}

const inspectors = ["u1", "u2", "u3"];

export const SEED_ASSESSMENTS: Assessment[] = FARMS.slice(0, 18).map((farm, i) => {
  const responses = genResponses(i + 7);
  const { domainScores, overallScore, band } = computeScores(responses);
  const nc = ncCount(responses);
  const date = new Date(2025, (i % 6) + 4, (i % 27) + 1).toISOString();
  return {
    id: `ASMT-${5000 + i}`,
    farmId: farm.id,
    inspectorId: inspectors[i % inspectors.length],
    date,
    status: nc > 0 ? "NC-Follow-Up" : "Submitted",
    responses,
    domainScores,
    overallScore,
    band,
    ncCount: nc,
    gps: farm.gps,
    notes: nc > 0 ? "Follow-up scheduled" : "Compliant assessment",
  };
});
