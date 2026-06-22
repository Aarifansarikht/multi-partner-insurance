import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import type { Plan } from "@/types/plan";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlanCategoryIcon } from "./PlanCategoryIcon";
import { calculatePremium } from "@/features/plans/premium";
import { formatCompactCover, formatCurrency } from "@/lib/format";
import { ROUTES } from "@/lib/routes";

export function PlanCard({ plan }: { plan: Plan }) {
  const startingQuote = calculatePremium(
    plan,
    plan.coverDefault,
    plan.terms[0],
  );

  return (
    <Card className="group flex h-full flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-within:shadow-md">
      <div className="flex items-start justify-between gap-3 p-5 pb-3">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-sm bg-primary/10 text-primary">
            <PlanCategoryIcon category={plan.category} />
          </span>
          <div>
            <Badge variant="secondary">{plan.category}</Badge>
          </div>
        </div>
        {plan.popular && <Badge variant="accent">Popular</Badge>}
      </div>

      <div className="flex flex-1 flex-col px-5">
        <h3 className="font-display text-lg font-semibold leading-snug tracking-tight">
          {plan.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {plan.tagline}
        </p>

        <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Star className="size-3.5 fill-warning text-warning" />
          <span className="font-medium text-foreground">{plan.rating}</span>
          <span>·</span>
          <span>{plan.claimSettlementRatio}% claims settled</span>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between gap-3 border-t border-border p-5">
        <div>
          <p className="text-2xs uppercase tracking-wide text-muted-foreground">
            Starting at
          </p>
          <p className="font-display text-xl font-semibold">
            {formatCurrency(startingQuote.totalPremium)}
            <span className="text-sm font-normal text-muted-foreground">
              {" "}
              /yr
            </span>
          </p>
          <p className="text-xs text-muted-foreground">
            Cover up to {formatCompactCover(plan.coverMax)}
          </p>
        </div>
        <Link
          to={ROUTES.planDetail(plan.slug)}
          className="inline-flex items-center gap-1 self-end rounded-sm text-sm font-medium text-primary transition-colors hover:text-primary/80"
          aria-label={`View details for ${plan.name}`}
        >
          Details
          <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </Card>
  );
}
