import { useFeaturedPlans, usePlans } from "@/features/plans/hooks";
import { PlanCard } from "@/features/plans/components/PlanCard";
import { PlanCardSkeleton } from "@/features/plans/components/PlanCardSkeleton";
import {
  FeaturedCarousel,
  FeaturedCarouselSkeleton,
} from "@/features/plans/components/FeaturedCarousel";
import { ErrorState } from "@/components/feedback/ErrorState";
import { EmptyState } from "@/components/feedback/EmptyState";

export default function PlansPage() {
  const featured = useFeaturedPlans();
  const plans = usePlans();

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

      {/* Featured carousel */}
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

      {/* Full list */}
      <section aria-label="All plans">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground">
              Catalog
            </p>
            <h2 className="font-display text-xl font-semibold tracking-tight md:text-2xl">
              All insurance plans
            </h2>
          </div>
          {plans.status === "success" && plans.data && (
            <p className="text-sm text-muted-foreground">
              {plans.data.length} plans
            </p>
          )}
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
            title="No plans available"
            description="There are no plans to show right now. Please check back later."
          />
        )}

        {plans.status === "success" && plans.data && plans.data.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {plans.data.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
