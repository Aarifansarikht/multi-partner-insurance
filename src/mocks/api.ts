import type { Plan, PlanCategory } from "@/types/plan";
import { PLANS } from "./plans";

/**
 * Simulated network layer.
 *
 * Every function mimics a real REST endpoint: it returns a Promise, adds a
 * randomised latency, supports request cancellation via AbortSignal, and throws
 * typed errors. Components consume these exactly as they would a real client,
 * so swapping in Axios/fetch against a backend is an isolated change here.
 */

export class NotFoundError extends Error {
  constructor(message = "Resource not found") {
    super(message);
    this.name = "NotFoundError";
  }
}

export class AbortError extends Error {
  constructor() {
    super("Request aborted");
    this.name = "AbortError";
  }
}

function delay(signal?: AbortSignal): Promise<void> {
  const ms = 350 + Math.random() * 500;
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new AbortError());
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(new AbortError());
      },
      { once: true },
    );
  });
}

export interface PlanQuery {
  query?: string;
  category?: PlanCategory | "All";
  signal?: AbortSignal;
}

export async function fetchPlans(params: PlanQuery = {}): Promise<Plan[]> {
  await delay(params.signal);
  const q = params.query?.trim().toLowerCase();
  return PLANS.filter((plan) => {
    const matchesCategory =
      !params.category ||
      params.category === "All" ||
      plan.category === params.category;
    const matchesQuery =
      !q ||
      plan.name.toLowerCase().includes(q) ||
      plan.tagline.toLowerCase().includes(q) ||
      plan.category.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });
}

export async function fetchFeaturedPlans(
  signal?: AbortSignal,
): Promise<Plan[]> {
  await delay(signal);
  return PLANS.filter((plan) => plan.featured);
}

export async function fetchPlanBySlug(
  slug: string,
  signal?: AbortSignal,
): Promise<Plan> {
  await delay(signal);
  const plan = PLANS.find((p) => p.slug === slug || p.id === slug);
  if (!plan) throw new NotFoundError(`No plan found for "${slug}"`);
  return plan;
}

export const PLAN_CATEGORIES: (PlanCategory | "All")[] = [
  "All",
  "Term Life",
  "Health",
  "Motor",
  "Travel",
  "Home",
];
