import { useActivePartner } from "@/features/partner/selectors";
import { useJourney } from "@/features/journey/selectors";
import { formatCompactCover, formatCurrency } from "@/lib/format";
import { PlanCategoryIcon } from "@/features/plans/components/PlanCategoryIcon";

/** Compact, always-visible reminder of what the user is buying. */
export function JourneySummary() {
  const { selection } = useJourney();
  const partner = useActivePartner();
  if (!selection) return null;

  const { quote } = selection;

  return (
    <aside className="rounded-sm border border-border bg-surface p-5 shadow-sm">
      <p className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground">
        Your selection
      </p>
      <div className="mt-3 flex items-start gap-3">
        <span className="flex size-9 items-center justify-center rounded-sm bg-primary-soft text-primary">
          <PlanCategoryIcon category={selection.category} className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="truncate font-display font-semibold">
            {selection.planName}
          </p>
          <p className="text-xs text-muted-foreground">
            via {partner.name}
          </p>
        </div>
      </div>

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Cover</dt>
          <dd className="font-medium">
            {formatCompactCover(quote.coverAmount)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Term</dt>
          <dd className="font-medium">
            {quote.term} {quote.term === 1 ? "year" : "years"}
          </dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-border pt-2.5">
          <dt className="font-medium">Premium</dt>
          <dd className="font-display text-lg font-semibold">
            {formatCurrency(quote.totalPremium)}
            <span className="text-xs font-normal text-muted-foreground">
              {" "}
              /yr
            </span>
          </dd>
        </div>
      </dl>
    </aside>
  );
}
