import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Star } from "lucide-react";
import type { Plan } from "@/types/plan";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PlanCategoryIcon } from "./PlanCategoryIcon";
import { calculatePremium } from "@/features/plans/premium";
import { formatCompactCover, formatCurrency } from "@/lib/format";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function FeaturedCarousel({ plans }: { plans: Plan[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: plans.length > 1,
    align: "start",
  });
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (emblaApi) setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect).on("reInit", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  if (plans.length === 0) return null;

  return (
    <section aria-label="Featured plans" className="relative">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-2xs font-semibold uppercase tracking-widest text-primary">
            Featured
          </p>
          <h2 className="font-display text-xl font-semibold tracking-tight md:text-2xl">
            Handpicked plans for you
          </h2>
        </div>
        <div className="hidden gap-2 sm:flex">
          <Button
            variant="outline"
            size="icon"
            onClick={() => emblaApi?.scrollPrev()}
            aria-label="Previous featured plan"
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => emblaApi?.scrollNext()}
            aria-label="Next featured plan"
          >
            <ChevronRight />
          </Button>
        </div>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {plans.map((plan) => (
            <FeaturedSlide key={plan.id} plan={plan} />
          ))}
        </div>
      </div>

      {snaps.length > 1 && (
        <div className="mt-4 flex justify-center gap-1.5">
          {snaps.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => emblaApi?.scrollTo(i)}
              aria-label={`Go to featured plan ${i + 1}`}
              aria-current={i === selected}
              className={cn(
                "h-1.5 rounded-full transition-all duration-200",
                i === selected
                  ? "w-6 bg-primary"
                  : "w-1.5 bg-border hover:bg-muted-foreground",
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function FeaturedSlide({ plan }: { plan: Plan }) {
  const quote = calculatePremium(plan, plan.coverDefault, plan.terms[0]);
  return (
    <article className="min-w-0 flex-[0_0_88%] sm:flex-[0_0_70%] lg:flex-[0_0_48%]">
      <div className="flex h-full flex-col justify-between rounded-sm border border-border border-l-4 border-l-primary bg-surface p-5 shadow-md sm:p-6">
        <div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-sm bg-primary-soft text-primary">
                <PlanCategoryIcon category={plan.category} className="size-5" />
              </span>
              <span className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground">
                {plan.category}
              </span>
            </div>
            {plan.popular && <Badge variant="accent">Popular</Badge>}
          </div>
          <h3 className="mt-4 font-display text-xl font-semibold leading-tight sm:text-2xl">
            {plan.name}
          </h3>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            {plan.tagline}
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Star className="size-3.5 fill-warning text-warning" />
            <span className="font-medium text-foreground">{plan.rating}</span>
            <span>·</span>
            <span>Cover up to {formatCompactCover(plan.coverMax)}</span>
          </div>
        </div>

        <div className="mt-6 flex items-end justify-between gap-3">
          <div>
            <p className="text-2xs uppercase tracking-wide text-muted-foreground">
              Starting at
            </p>
            <p className="font-display text-2xl font-semibold">
              {formatCurrency(quote.totalPremium)}
              <span className="text-sm font-normal text-muted-foreground">
                {" "}
                /yr
              </span>
            </p>
          </div>
          <Button asChild>
            <Link to={ROUTES.planDetail(plan.slug)}>
              View plan <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

export function FeaturedCarouselSkeleton() {
  return (
    <section aria-hidden>
      <div className="mb-4 space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-7 w-64" />
      </div>
      <div className="flex gap-4">
        {[0, 1].map((i) => (
          <Skeleton
            key={i}
            className="h-56 min-w-0 flex-[0_0_92%] sm:flex-[0_0_70%] lg:flex-[0_0_48%]"
          />
        ))}
      </div>
    </section>
  );
}
