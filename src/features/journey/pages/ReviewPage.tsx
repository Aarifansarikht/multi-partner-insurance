import { Link, useNavigate } from "react-router-dom";
import { useState, type ReactNode } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StepHeader, StepActions } from "@/features/journey/components/StepShell";
import { useAppDispatch } from "@/store/hooks";
import { useJourney } from "@/features/journey/selectors";
import { confirmReview } from "@/features/journey/journeySlice";
import { relationLabel } from "@/features/journey/constants";
import { formatCompactCover, formatCurrency } from "@/lib/format";
import { ROUTES } from "@/lib/routes";

function ReviewBlock({
  title,
  editTo,
  children,
}: {
  title: string;
  editTo: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-sm border border-border">
      <div className="flex items-center justify-between border-b border-border bg-muted px-4 py-2.5">
        <h3 className="text-sm font-semibold">{title}</h3>
        <Button asChild variant="ghost" size="sm" className="h-7 px-2 text-xs">
          <Link to={editTo}>
            <Pencil className="size-3" /> Edit
          </Link>
        </Button>
      </div>
      <dl className="divide-y divide-border">{children}</dl>
    </section>
  );
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-2.5 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}

export default function ReviewPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selection, kyc, personal, nominee } = useJourney();
  const [confirmed, setConfirmed] = useState(false);

  if (!selection || !kyc || !personal || !nominee) return null;

  const { quote } = selection;

  const proceed = () => {
    dispatch(confirmReview());
    navigate(ROUTES.payment);
  };

  return (
    <div>
      <StepHeader
        title="Review your application"
        description="Please confirm everything looks right before payment."
      />

      <div className="space-y-4">
        <ReviewBlock title="Plan & cover" editTo={ROUTES.planDetail(selection.planSlug)}>
          <Row label="Plan" value={selection.planName} />
          <Row label="Category" value={selection.category} />
          <Row label="Cover amount" value={formatCompactCover(quote.coverAmount)} />
          <Row
            label="Policy term"
            value={`${quote.term} ${quote.term === 1 ? "year" : "years"}`}
          />
        </ReviewBlock>

        <ReviewBlock title="Identity (KYC)" editTo={ROUTES.kyc}>
          <Row label="PAN" value={kyc.panNumber} />
          <Row label="Name" value={kyc.fullName} />
          <Row label="Date of birth" value={kyc.dateOfBirth} />
        </ReviewBlock>

        <ReviewBlock title="Personal details" editTo={ROUTES.personal}>
          <Row label="Name" value={personal.fullName} />
          <Row label="Email" value={personal.email} />
          <Row label="Gender" value={<span className="capitalize">{personal.gender}</span>} />
          <Row
            label="Address"
            value={
              <span className="block max-w-[16rem]">
                {[
                  personal.addressLine1,
                  personal.addressLine2,
                  `${personal.city}, ${personal.state} ${personal.pincode}`,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            }
          />
        </ReviewBlock>

        <ReviewBlock title="Nominee" editTo={ROUTES.nominee}>
          <Row label="Name" value={nominee.fullName} />
          <Row label="Relationship" value={relationLabel(nominee.relation)} />
          <Row label="Date of birth" value={nominee.dateOfBirth} />
          <Row label="Benefit share" value={`${nominee.sharePercentage}%`} />
        </ReviewBlock>

        {/* Premium summary */}
        <section className="rounded-sm border border-border bg-surface p-4">
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
            <Separator className="my-1" />
            <div className="flex items-baseline justify-between">
              <dt className="font-semibold">Total payable</dt>
              <dd className="font-display text-xl font-bold">
                {formatCurrency(quote.totalPremium)}
                <span className="text-sm font-normal text-muted-foreground">
                  {" "}
                  /yr
                </span>
              </dd>
            </div>
          </dl>
        </section>

        {/* Confirmation */}
        <label className="flex cursor-pointer items-start gap-2.5 rounded-sm border border-border bg-surface p-4 text-sm">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-0.5 size-4 accent-primary"
          />
          <span className="text-muted-foreground">
            I confirm the details above are accurate and agree to the policy
            terms and conditions.
          </span>
        </label>
      </div>

      <StepActions onBack={() => navigate(ROUTES.nominee)}>
        <Button type="button" size="lg" disabled={!confirmed} onClick={proceed}>
          Confirm &amp; pay {formatCurrency(quote.totalPremium)}
        </Button>
      </StepActions>
    </div>
  );
}
