import { useCallback } from "react";
import { useAsync } from "@/hooks/useAsync";
import {
  fetchFeaturedPlans,
  fetchPlanBySlug,
  fetchPlans,
  type PlanQuery,
} from "@/mocks/api";

export function useFeaturedPlans() {
  return useAsync((signal) => fetchFeaturedPlans(signal), []);
}

export function usePlans(filters: Omit<PlanQuery, "signal"> = {}) {
  const { query, category } = filters;
  const run = useCallback(
    (signal: AbortSignal) => fetchPlans({ query, category, signal }),
    [query, category],
  );
  return useAsync(run, [query, category]);
}

export function usePlan(slug: string | undefined) {
  const run = useCallback(
    (signal: AbortSignal) => {
      if (!slug) return Promise.reject(new Error("Missing plan id"));
      return fetchPlanBySlug(slug, signal);
    },
    [slug],
  );
  return useAsync(run, [slug]);
}
