import type { ChoiceKey, Question } from "./questions";

const CHOICE_POINTS: Record<ChoiceKey, number> = { A: 4, B: 3, C: 2, D: 1 };

export type EvaResult = {
  index: number;          // 0..100
  percentile: number;     // 1..99 (approx)
  classification: string; // label
  flags: string[];
};

/**
 * Depth knobs (tune these, don’t rewrite logic)
 * - curveGamma > 1 exaggerates extremes (loyal vs deviant).
 * - curveGamma < 1 compresses differences.
 */
const curveGamma = 1.25;

// Optional: slight extra weight for “high-control” questions beyond their own weight.
// This lets you make certain questions punch above weight without editing questions.ts.
const DIAGNOSTIC_BOOST: Record<number, number> = {
  4: 1.05,
  7: 1.08,
  11: 1.08,
  12: 1.10,
  15: 1.05,
};

// Hidden dimension mapping (question -> dimensions it informs)
type Dim = "SURVEILLANCE" | "VERIFICATION" | "BUREAUCRATICIZATION" | "AFFECT_HOSTILITY";
const DIM_MAP: Record<number, Dim[]> = {
  4: ["SURVEILLANCE"],
  5: ["SURVEILLANCE", "AFFECT_HOSTILITY"],
  7: ["VERIFICATION"],
  8: ["AFFECT_HOSTILITY"],
  11: ["SURVEILLANCE", "AFFECT_HOSTILITY"],
  12: ["VERIFICATION"],
  13: ["AFFECT_HOSTILITY"],
  14: ["BUREAUCRATICIZATION"],
  15: ["BUREAUCRATICIZATION", "SURVEILLANCE"],
  2: ["BUREAUCRATICIZATION"],
  6: ["BUREAUCRATICIZATION"],
};

export function scoreEva(
  questions: Question[],
  answers: Record<number, ChoiceKey>
): EvaResult {
  let weightedEarned = 0;
  let weightedMax = 0;

  const flags: string[] = [];

  // Dimension accumulators (0..1 scale internally)
  const dimEarned: Record<Dim, number> = {
    SURVEILLANCE: 0,
    VERIFICATION: 0,
    BUREAUCRATICIZATION: 0,
    AFFECT_HOSTILITY: 0,
  };
  const dimMax: Record<Dim, number> = {
    SURVEILLANCE: 0,
    VERIFICATION: 0,
    BUREAUCRATICIZATION: 0,
    AFFECT_HOSTILITY: 0,
  };

  // Helper to normalize ChoiceKey to 0..1 loyalty scale
  // A=1, B=0.666..., C=0.333..., D=0
  const choiceToUnit = (a: ChoiceKey) => (CHOICE_POINTS[a] - 1) / 3;

  // Track for contradiction logic
  const picked: Record<number, ChoiceKey | undefined> = {};

  for (const q of questions) {
    const baseW = q.weight ?? 1;
    const boost = DIAGNOSTIC_BOOST[q.id] ?? 1;
    const w = baseW * boost;

    weightedMax += 4 * w;

    // Dimension max always counts (even if unanswered) only if you want strictness.
    // Here we only count answered questions for dims to avoid punishing missing answers.
    const a = answers[q.id];
    picked[q.id] = a;
    if (!a) continue;

    // Nonlinear scoring: push extremes harder
    const unit = choiceToUnit(a);               // 0..1
    const curved = Math.pow(unit, curveGamma);  // 0..1
    const curvedPoints = 1 + curved * 3;        // back to 1..4

    weightedEarned += curvedPoints * w;

    // Dimensions
    const dims = DIM_MAP[q.id];
    if (dims && dims.length) {
      for (const d of dims) {
        dimEarned[d] += curved * w; // use curved loyalty
        dimMax[d] += 1 * w;
      }
    }

    // Strong, meaningful flags (single-answer diagnostics)
    if (q.id === 12 && a === "A") flags.push("Legitimacy outsourced (12A)");
    if (q.id === 7 && a === "A") flags.push("Private happiness rejected (7A)");
    if (q.id === 4 && a === "A") flags.push("Continuous self-monitoring (4A)");
    if (q.id === 11 && a === "A") flags.push("Happiness terminated upon awareness (11A)");
    if (q.id === 15 && a === "A") flags.push("Status permanently under review (15A)");
  }

  // Contradictions / pattern flags (these add depth fast)
  // Example: “happiness is sufficient” but also “legitimacy depends on external acknowledgment”
  if (picked[7] === "D" && picked[12] === "A") {
    flags.push("Contradiction: internal sufficiency vs external legitimacy (7D + 12A)");
  }
  // Example: claims low monitoring but reports happiness terminates on awareness
  if (picked[4] === "D" && picked[11] === "A") {
    flags.push("Contradiction: low monitoring yet termination trigger (4D + 11A)");
  }
  // Example: calls adversity happiness unremarkable, but distrusts private happiness
  if (picked[8] === "D" && picked[7] === "A") {
    flags.push("Inconsistent affect policy (8D vs 7A)");
  }

  const raw = weightedMax === 0 ? 0 : (weightedEarned / weightedMax) * 100;
  const index = round1(raw);

  // Percentile: steeper mid-curve for dystopian “standardization” feel
  // Uses a logistic-like curve centered at 50.
  const percentile = clamp(Math.round(1 + 98 * logistic01(index, 50, 0.085)), 1, 99);

  // Dimension summaries (optional to expose later, currently used to classify/flag)
  const dimScore = (d: Dim) => (dimMax[d] === 0 ? 0 : dimEarned[d] / dimMax[d]); // 0..1
  const surveillance = dimScore("SURVEILLANCE");
  const verification = dimScore("VERIFICATION");
  const bureaucratic = dimScore("BUREAUCRATICIZATION");
  const hostility = dimScore("AFFECT_HOSTILITY");

  // Classification that reflects “dog to the machine”
  // (High index = highly domesticated / ideologically aligned)
  let classification: string;
  if (index >= 85) classification = "CERTIFIED COMPLIANCE";
  else if (index >= 70) classification = "INSTITUTIONAL FIT";
  else if (index >= 55) classification = "MANAGED VARIANCE";
  else if (index >= 40) classification = "UNSTABLE REPORTING";
  else classification = "NONCONFORMING SIGNAL";

  // Add a couple “profile” flags based on dominant dimension
const dimPairs: [Dim, number][] = [
  ["SURVEILLANCE", surveillance],
  ["VERIFICATION", verification],
  ["BUREAUCRATICIZATION", bureaucratic],
  ["AFFECT_HOSTILITY", hostility],
];

dimPairs.sort((a, b) => b[1] - a[1]);

const [] = dimPairs[0];

  // If very high index but low verification, call it out (rare but interesting)
  if (index >= 80 && verification < 0.35) {
    flags.push("Anomaly: high alignment without external verification dependency");
  }

  return { index, percentile, classification, flags };
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

// Logistic mapping to 0..1
// center = midpoint, k = steepness
function logistic01(x: number, center: number, k: number) {
  const z = -k * (x - center);
  return 1 / (1 + Math.exp(z));
}
