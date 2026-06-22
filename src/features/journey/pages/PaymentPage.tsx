import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Info, Loader2, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { StepHeader, StepActions } from "@/features/journey/components/StepShell";
import { useAppDispatch } from "@/store/hooks";
import { useJourney } from "@/features/journey/selectors";
import { useAuth } from "@/features/auth/selectors";
import { useActivePartner } from "@/features/partner/selectors";
import { setPayment } from "@/features/journey/journeySlice";
import {
  isRazorpayConfigured,
  loadRazorpay,
  openRazorpayCheckout,
  razorpayKey,
} from "@/features/payment/razorpay";
import { createOrder, generateReferenceId } from "@/features/payment/orders";
import { readTokenAsHex } from "@/lib/color";
import { formatCurrency } from "@/lib/format";
import { ROUTES } from "@/lib/routes";
import type { PaymentResult } from "@/features/journey/types";

export default function PaymentPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selection, personal } = useJourney();
  const { user } = useAuth();
  const partner = useActivePartner();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!selection) return null;
  const amount = selection.quote.totalPremium;

  const finish = (result: PaymentResult) => {
    dispatch(setPayment(result));
    if (result.status === "success") {
      toast.success("Payment successful");
    } else {
      toast.error("Payment failed");
    }
    navigate(ROUTES.result);
  };

  const onSuccess = (referenceId: string, method?: string) =>
    finish({
      status: "success",
      referenceId,
      amount,
      at: Date.now(),
      method,
    });

  const onFailure = () =>
    finish({
      status: "failed",
      referenceId: generateReferenceId("FAIL"),
      amount,
      at: Date.now(),
    });

  const payWithRazorpay = async () => {
    setError(null);
    setProcessing(true);
    try {
      const order = await createOrder(amount);
      const loaded = await loadRazorpay();
      if (!loaded) {
        setProcessing(false);
        setError("Couldn’t reach the payment gateway. Please try again.");
        return;
      }
      openRazorpayCheckout({
        key: razorpayKey!,
        amount: order.amount,
        currency: order.currency,
        // NOTE: no `order_id` is sent. A real order_id must be created by a
        // backend via Razorpay's Orders API; passing a client-generated id makes
        // Checkout fail with "something went wrong". Without a backend we use the
        // "payment without order" test flow (amount + key), which works with
        // test cards. The mock order id is kept only for our own reference.
        name: partner.name,
        description: `${selection.planName} — annual premium`,
        prefill: {
          name: personal?.fullName,
          email: personal?.email,
          contact: user?.mobile,
        },
        notes: { plan: selection.planId, ref: order.orderId },
        theme: { color: readTokenAsHex("--primary") },
        handler: (res) => {
          setProcessing(false);
          onSuccess(res.razorpay_payment_id, "Razorpay");
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
            setError("Payment was cancelled. You can try again.");
          },
        },
      });
    } catch {
      setProcessing(false);
      setError("Something went wrong starting the payment.");
    }
  };

  const simulate = async (outcome: "success" | "failed") => {
    setError(null);
    setProcessing(true);
    await createOrder(amount);
    setProcessing(false);
    if (outcome === "success") {
      onSuccess(generateReferenceId("SIM"), "Simulated");
    } else {
      onFailure();
    }
  };

  return (
    <div>
      <StepHeader
        title="Payment"
        description="Securely pay your annual premium to activate the policy."
      />

      {/* Amount due */}
      <div className="flex items-center justify-between rounded-sm border border-border bg-surface p-5">
        <div>
          <p className="text-2xs uppercase tracking-wide text-muted-foreground">
            Amount payable
          </p>
          <p className="font-display text-3xl font-bold">
            {formatCurrency(amount)}
          </p>
          <p className="text-xs text-muted-foreground">
            {selection.planName} · annual premium (incl. GST)
          </p>
        </div>
        <span className="hidden size-12 items-center justify-center rounded-sm bg-primary-soft text-primary sm:flex">
          <ShieldCheck className="size-6" />
        </span>
      </div>

      {/* Mode-specific info */}
      <div className="mt-4 flex gap-2.5 rounded-sm border border-border bg-muted p-3.5 text-xs text-muted-foreground">
        <Info className="size-4 shrink-0 text-primary" />
        {isRazorpayConfigured ? (
          <p>
            Razorpay test mode — no real money is charged. Easiest: choose{" "}
            <span className="font-medium text-foreground">UPI</span> and enter{" "}
            <span className="font-medium text-foreground">success@razorpay</span>{" "}
            (use <span className="font-medium text-foreground">failure@razorpay</span>{" "}
            to test failure). Test cards may show “international cards not
            supported” unless International payments are enabled on the account.
          </p>
        ) : (
          <p>
            No Razorpay test key is configured, so checkout is{" "}
            <span className="font-medium text-foreground">simulated</span>. Add{" "}
            <code className="text-foreground">VITE_RAZORPAY_KEY_ID</code> to
            <code className="text-foreground"> .env</code> to use the real test
            widget. Use the buttons below to simulate an outcome.
          </p>
        )}
      </div>

      {error && (
        <p className="mt-4 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {/* Actions */}
      {isRazorpayConfigured ? (
        <Button
          size="lg"
          className="mt-5 w-full"
          onClick={payWithRazorpay}
          disabled={processing}
        >
          {processing ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <CreditCard className="size-4" />
          )}
          Pay {formatCurrency(amount)}
        </Button>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Button
            size="lg"
            onClick={() => simulate("success")}
            disabled={processing}
          >
            {processing && <Loader2 className="size-4 animate-spin" />}
            Simulate successful payment
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => simulate("failed")}
            disabled={processing}
          >
            Simulate failed payment
          </Button>
        </div>
      )}

      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <Lock className="size-3" /> Payments are processed securely by Razorpay.
      </p>

      <StepActions onBack={() => navigate(ROUTES.review)}>
        <span />
      </StepActions>
    </div>
  );
}
