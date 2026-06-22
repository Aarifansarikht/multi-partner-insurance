import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Minus,
  ShieldCheck,
  Star,
  X,
} from "lucide-react";
import type { PremiumQuote } from "@/types/plan";
import { usePlan } from "@/features/plans/hooks";
import { useAuth } from "@/features/auth/selectors";
import { PlanConfigurator } from "@/features/plans/components/PlanConfigurator";
import { PlanCategoryIcon } from "@/features/plans/components/PlanCategoryIcon";
import { PlanDetailSkeleton } from "@/features/plans/components/PlanDetailSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/feedback/ErrorState";
import { EmptyState } from "@/components/feedback/EmptyState";
import { NotFoundError } from "@/mocks/api";
import { ROUTES } from "@/lib/routes";

export default function PlanDetailPage() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { status, data: plan, error, refetch } = usePlan(planId);

  if (status === "loading") return <PlanDetailSkeleton />;

  if (status === "error") {
    if (error instanceof NotFoundError) {
      return (
        <div className="container py-12">
          <EmptyState
            title="Plan not found"
            description="This plan may have been removed or the link is incorrect."
            action={
              <Button asChild variant="outline" size="sm">
                <Link to={ROUTES.home}>Browse all plans</Link>
              </Button>
            }
          />
        </div>
      );
    }
    return (
      <div className="container py-12">
        <ErrorState title="Couldn’t load this plan" onRetry={refetch} />
      </div>
    );
  }

  if (!plan) return null;

  // Begin the purchase. If the user isn't logged in, send them to login with a
  // redirect back into the journey so they resume exactly here. (Capturing the
  // chosen quote into journey state is added with the journey slice.)
  const handleBuy = (_quote: PremiumQuote) => {
    if (isAuthenticated) {
      navigate(ROUTES.kyc);
    } else {
      navigate(`${ROUTES.login}?redirect=${encodeURIComponent(ROUTES.kyc)}`);
    }
  };

  return (
    <div className="container py-8 md:py-12">
      <Link
        to={ROUTES.home}
        className="inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> All plans
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
        {/* Details */}
        <div className="space-y-8">
          <header>
            <div className="flex items-start gap-3">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-sm bg-primary/10 text-primary">
                <PlanCategoryIcon category={plan.category} className="size-6" />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{plan.category}</Badge>
                  {plan.popular && <Badge variant="accent">Popular</Badge>}
                </div>
                <h1 className="mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl">
                  {plan.name}
                </h1>
                <p className="mt-1 text-muted-foreground">{plan.tagline}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              <span className="flex items-center gap-1.5">
                <Star className="size-4 fill-warning text-warning" />
                <span className="font-medium">{plan.rating}</span>
                <span className="text-muted-foreground">
                  ({plan.reviewCount.toLocaleString("en-IN")} reviews)
                </span>
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <ShieldCheck className="size-4 text-success" />
                {plan.claimSettlementRatio}% claims settled
              </span>
            </div>
          </header>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              About this plan
            </h2>
            <p className="mt-2 leading-relaxed text-foreground/90">
              {plan.description}
            </p>
          </section>

          {/* Highlights */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {plan.highlights.map((h) => (
              <div
                key={h.title}
                className="rounded-sm border border-border bg-surface p-4"
              >
                <p className="font-display text-sm font-semibold">{h.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {h.description}
                </p>
              </div>
            ))}
          </section>

          {/* Coverage */}
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              What’s covered
            </h2>
            <ul className="mt-3 divide-y divide-border rounded-sm border border-border">
              {plan.coverage.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center gap-3 px-4 py-3"
                >
                  <span
                    className={
                      item.included
                        ? "flex size-6 shrink-0 items-center justify-center rounded-full bg-success/12 text-success"
                        : "flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground"
                    }
                  >
                    {item.included ? (
                      <Check className="size-3.5" />
                    ) : (
                      <X className="size-3.5" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Benefits + exclusions */}
          <section className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Key benefits
              </h2>
              <ul className="mt-3 space-y-2">
                {plan.benefits.map((b) => (
                  <li key={b} className="flex gap-2 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-success" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Exclusions
              </h2>
              <ul className="mt-3 space-y-2">
                {plan.exclusions.map((e) => (
                  <li
                    key={e}
                    className="flex gap-2 text-sm text-muted-foreground"
                  >
                    <Minus className="mt-0.5 size-4 shrink-0" />
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        {/* Configurator (sticky on desktop) */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <PlanConfigurator plan={plan} onBuy={handleBuy} />
        </aside>
      </div>
    </div>
  );
}
