import type { Plan, PremiumQuote } from "@/types/plan";

const GST_RATE = 0.18;

/**
 * Deterministic premium model.
 *
 * Base annual premium scales linearly with cover (per-lakh rate) and rises
 * gently with the policy term to reflect the longer risk horizon. GST is then
 * applied on top. Kept as a pure function so the same number is shown on the
 * detail page, the review screen and the payment step.
 */
export function calculatePremium(
  plan: Plan,
  coverAmount: number,
  term: number,
): PremiumQuote {
  const lakhs = coverAmount / 100000;
  const baseTerm = plan.terms[0];
  const termFactor = 1 + Math.max(0, term - baseTerm) * 0.02;

  const basePremium = Math.round(lakhs * plan.ratePerLakh * termFactor);
  const tax = Math.round(basePremium * GST_RATE);

  return {
    coverAmount,
    term,
    basePremium,
    tax,
    taxRate: GST_RATE,
    totalPremium: basePremium + tax,
  };
}

/** Clamp a cover value to the plan's range and snap it to the step grid. */
export function normaliseCover(plan: Plan, cover: number): number {
  const clamped = Math.min(plan.coverMax, Math.max(plan.coverMin, cover));
  const stepped =
    Math.round((clamped - plan.coverMin) / plan.coverStep) * plan.coverStep +
    plan.coverMin;
  return Math.min(plan.coverMax, stepped);
}
