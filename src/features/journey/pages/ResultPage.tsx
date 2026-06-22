import { Link, Navigate, useNavigate } from "react-router-dom";
import { CheckCircle2, Home, RefreshCw, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useJourney } from "@/features/journey/selectors";
import { formatCompactCover, formatCurrency } from "@/lib/format";
import { ROUTES } from "@/lib/routes";

export default function ResultPage() {
  const navigate = useNavigate();
  const { selection, payment } = useJourney();

  // Nothing to show without a payment attempt — send the user back to review.
  if (!payment || !selection) return <Navigate to={ROUTES.home} replace />;

  const success = payment.status === "success";

  return (
    <div className="container max-w-xl py-12 md:py-16">
      <div className="rounded-sm border border-border bg-surface p-8 text-center shadow-sm">
        <div className="flex justify-center">
          <span
            className={
              success
                ? "flex size-16 items-center justify-center rounded-full bg-success/12 text-success"
                : "flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive"
            }
          >
            {success ? (
              <CheckCircle2 className="size-9" />
            ) : (
              <XCircle className="size-9" />
            )}
          </span>
        </div>

        <h1 className="mt-5 font-display text-2xl font-bold tracking-tight">
          {success ? "Payment successful" : "Payment failed"}
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
          {success
            ? `Your ${selection.planName} policy is now active. A confirmation has been sent to your email.`
            : "We couldn’t process your payment. No amount has been charged — you can try again."}
        </p>

        <div className="mt-6 rounded-sm border border-border bg-background/60 p-4 text-left">
          <dl className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">
                {success ? "Reference ID" : "Attempt ID"}
              </dt>
              <dd className="font-mono text-xs font-medium">
                {payment.referenceId}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Plan</dt>
              <dd className="font-medium">{selection.planName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Cover</dt>
              <dd className="font-medium">
                {formatCompactCover(selection.quote.coverAmount)}
              </dd>
            </div>
            <Separator className="my-1" />
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Amount</dt>
              <dd className="font-display text-base font-semibold">
                {formatCurrency(payment.amount)}
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {success ? (
            <Button asChild size="lg">
              <Link to={ROUTES.home}>
                <Home className="size-4" /> Back to home
              </Link>
            </Button>
          ) : (
            <>
              <Button size="lg" onClick={() => navigate(ROUTES.payment)}>
                <RefreshCw className="size-4" /> Retry payment
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to={ROUTES.home}>Back to home</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
