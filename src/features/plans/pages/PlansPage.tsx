import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { useFeaturedPlans, usePlans } from "@/features/plans/hooks";
import { PlanCard } from "@/features/plans/components/PlanCard";
import { PlanCardSkeleton } from "@/features/plans/components/PlanCardSkeleton";
import {
  FeaturedCarousel,
  FeaturedCarouselSkeleton,
} from "@/features/plans/components/FeaturedCarousel";
import { ErrorState } from "@/components/feedback/ErrorState";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { PLAN_CATEGORIES } from "@/mocks/api";
import type { PlanCategory } from "@/types/plan";
import { cn } from "@/lib/utils";

export default function PlansPage() {
  const [params, setParams] = useSearchParams();
  const category = (params.get("category") as PlanCategory | "All") ?? "All";
  const [search, setSearch] = useState(params.get("q") ?? "");
  const debouncedSearch = useDebouncedValue(search, 300);

  // Keep the debounced query + category in the URL so the view is shareable and
  // survives a refresh.
  useEffect(() => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (debouncedSearch) next.set("q", debouncedSearch);
        else next.delete("q");
        return next;
      },
      { replace: true },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const setCategory = (value: PlanCategory | "All") => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value === "All") next.delete("category");
        else next.set("category", value);
        return next;
      },
      { replace: true },
    );
  };

  const featured = useFeaturedPlans();
  const plans = usePlans({ query: debouncedSearch || undefined, category });
  const isFiltering = !!debouncedSearch || category !== "All";

  return (
    <div className="container space-y-12 py-8 md:py-12">
      {/* Hero */}
      <section className="max-w-2xl animate-fade-in-up">
        <h1 className="font-display text-3xl font-bold leading-tight tracking-tight md:text-4xl">
          Insurance that fits your life
        </h1>
        <p className="mt-3 text-base text-muted-foreground md:text-lg">
          Compare protection plans across life, health, motor and travel — then
          buy in minutes with a guided, fully digital journey.
        </p>
      </section>

      {/* Featured carousel — hidden while actively filtering to keep focus */}
      {!isFiltering && (
        <>
          {featured.status === "loading" && <FeaturedCarouselSkeleton />}
          {featured.status === "error" && (
            <ErrorState
              title="Couldn’t load featured plans"
              onRetry={featured.refetch}
            />
          )}
          {featured.status === "success" && featured.data && (
            <FeaturedCarousel plans={featured.data} />
          )}
        </>
      )}

      {/* Full list */}
      <section aria-label="All plans">
        <div className="mb-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground">
              Catalog
            </p>
            <h2 className="font-display text-xl font-semibold tracking-tight md:text-2xl">
              Browse all plans
            </h2>
          </div>

          {/* Search + filters */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search plans…"
                aria-label="Search plans"
                className="pl-9"
              />
            </div>
            <div
              className="-mx-4 flex gap-2 overflow-x-auto px-4 no-scrollbar lg:mx-0 lg:px-0"
              role="group"
              aria-label="Filter by category"
            >
              {PLAN_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  aria-pressed={category === cat}
                  className={cn(
                    "shrink-0 rounded-sm border px-3 py-1.5 text-sm font-medium transition-colors",
                    category === cat
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-surface text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {plans.status === "loading" && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <PlanCardSkeleton key={i} />
            ))}
          </div>
        )}

        {plans.status === "error" && (
          <ErrorState title="Couldn’t load plans" onRetry={plans.refetch} />
        )}

        {plans.status === "success" && plans.data?.length === 0 && (
          <EmptyState
            title="No plans match your search"
            description="Try a different keyword or category."
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                }}
              >
                Clear filters
              </Button>
            }
          />
        )}

        {plans.status === "success" && plans.data && plans.data.length > 0 && (
          <>
            <p className="mb-4 text-sm text-muted-foreground">
              {plans.data.length} {plans.data.length === 1 ? "plan" : "plans"}
              {category !== "All" && ` in ${category}`}
            </p>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {plans.data.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
