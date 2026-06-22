import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import type { Plan, PremiumQuote } from "@/types/plan";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { calculatePremium, normaliseCover } from "@/features/plans/premium";
import { formatCompactCover, formatCurrency } from "@/lib/format";

/**
 * Cover + term configurator. The selection is held in the URL query string
 * (?cover=&term=) so the resulting premium is shareable and survives a refresh,
 * and so "Buy Now" can hand the exact configuration to the journey.
 */
export function PlanConfigurator({
  plan,
  onBuy,
}: {
  plan: Plan;
  onBuy: (quote: PremiumQuote) => void;
}) {
  const [params, setParams] = useSearchParams();

  const cover = normaliseCover(
    plan,
    Number(params.get("cover")) || plan.coverDefault,
  );
  const term = plan.terms.includes(Number(params.get("term")))
    ? Number(params.get("term"))
    : plan.terms[Math.floor(plan.terms.length / 2)];

  const quote = useMemo(
    () => calculatePremium(plan, cover, term),
    [plan, cover, term],
  );

  const update = (next: { cover?: number; term?: number }) => {
    const p = new URLSearchParams(params);
    if (next.cover !== undefined) p.set("cover", String(next.cover));
    if (next.term !== undefined) p.set("term", String(next.term));
    setParams(p, { replace: true });
  };

  return (
    <div className="rounded-sm border border-border bg-surface p-5 shadow-sm">
      <h3 className="font-display text-base font-semibold">
        Configure your cover
      </h3>
      <p className="mt-0.5 text-sm text-muted-foreground">
        Adjust the cover amount and term to see your premium update live.
      </p>

      <div className="mt-6 space-y-6">
        {/* Cover amount */}
        <div>
          <div className="flex items-baseline justify-between">
            <Label htmlFor="cover-slider">Cover amount</Label>
            <span className="font-display text-lg font-semibold text-primary">
              {formatCompactCover(cover)}
            </span>
          </div>
          <Slider
            id="cover-slider"
            className="mt-3"
            min={plan.coverMin}
            max={plan.coverMax}
            step={plan.coverStep}
            value={[cover]}
            onValueChange={([v]) => update({ cover: normaliseCover(plan, v) })}
            aria-label="Cover amount"
            aria-valuetext={formatCompactCover(cover)}
          />
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>{formatCompactCover(plan.coverMin)}</span>
            <span>{formatCompactCover(plan.coverMax)}</span>
          </div>
        </div>

        {/* Term */}
        <div className="space-y-2">
          <Label htmlFor="term-select">Policy term</Label>
          <Select
            value={String(term)}
            onValueChange={(v) => update({ term: Number(v) })}
          >
            <SelectTrigger id="term-select" className="max-w-[220px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {plan.terms.map((t) => (
                <SelectItem key={t} value={String(t)}>
                  {t} {t === 1 ? "year" : "years"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator className="my-5" />

      {/* Premium breakdown */}
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Base premium</dt>
          <dd className="font-medium">{formatCurrency(quote.basePremium)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">
            GST ({Math.round(quote.taxRate * 100)}%)
          </dt>
          <dd className="font-medium">{formatCurrency(quote.tax)}</dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-border pt-3">
          <dt className="font-medium">Total payable</dt>
          <dd className="font-display text-xl font-semibold">
            {formatCurrency(quote.totalPremium)}
            <span className="text-sm font-normal text-muted-foreground">
              {" "}
              /yr
            </span>
          </dd>
        </div>
      </dl>

      <Button
        size="lg"
        className="mt-5 w-full"
        onClick={() => onBuy(quote)}
      >
        <ShieldCheck className="size-4" /> Buy now
      </Button>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        You’ll be guided through KYC and payment next.
      </p>
    </div>
  );
}
