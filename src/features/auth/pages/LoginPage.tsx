import { useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2, Lock, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch } from "@/store/hooks";
import { setSession } from "@/features/auth/authSlice";
import { useAuth } from "@/features/auth/selectors";
import { useActivePartner } from "@/features/partner/selectors";
import { DEMO_OTP, requestOtp, verifyOtp } from "@/mocks/auth";
import { ROUTES } from "@/lib/routes";

const mobileSchema = z.object({
  mobile: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
});
const otpSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, "Enter the 6-digit code"),
});
type MobileForm = z.infer<typeof mobileSchema>;
type OtpForm = z.infer<typeof otpSchema>;

/** Only allow same-origin path redirects to avoid open-redirect issues. */
function safeRedirect(value: string | null): string {
  if (value && value.startsWith("/") && !value.startsWith("//")) return value;
  return ROUTES.home;
}

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const partner = useActivePartner();

  const redirect = safeRedirect(params.get("redirect"));
  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [mobile, setMobile] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const mobileForm = useForm<MobileForm>({
    resolver: zodResolver(mobileSchema),
    defaultValues: { mobile: "" },
  });
  const otpForm = useForm<OtpForm>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  // Already logged in — skip the form and honour the intended destination.
  if (isAuthenticated) return <Navigate to={redirect} replace />;

  const onSendOtp = mobileForm.handleSubmit(async ({ mobile: m }) => {
    setFormError(null);
    try {
      await requestOtp(m);
      setMobile(m);
      setStep("otp");
      otpForm.reset();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong");
    }
  });

  const onVerify = otpForm.handleSubmit(async ({ otp }) => {
    setFormError(null);
    try {
      const session = await verifyOtp(mobile, otp);
      dispatch(setSession(session));
      navigate(redirect, { replace: true });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong");
    }
  });

  return (
    <div className="container flex min-h-[calc(100dvh-4rem)] items-center justify-center py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="flex size-12 items-center justify-center rounded-sm bg-primary text-primary-foreground">
            <partner.Icon className="size-6" />
          </span>
          <h1 className="mt-4 font-display text-2xl font-bold tracking-tight">
            {step === "mobile" ? "Log in to continue" : "Verify your number"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {step === "mobile"
              ? "We’ll send a one-time password to your mobile."
              : `Enter the 6-digit code sent to +91 ${mobile}.`}
          </p>
        </div>

        <div className="rounded-sm border border-border bg-surface p-6 shadow-sm">
          {step === "mobile" ? (
            <form onSubmit={onSendOtp} noValidate className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="mobile" required>
                  Mobile number
                </Label>
                <div className="flex items-center gap-2">
                  <span className="flex h-10 items-center rounded-sm border border-input bg-muted px-3 text-sm text-muted-foreground">
                    +91
                  </span>
                  <div className="relative flex-1">
                    <Smartphone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="mobile"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      autoComplete="tel-national"
                      placeholder="98765 43210"
                      className="pl-9"
                      invalid={!!mobileForm.formState.errors.mobile}
                      aria-describedby="mobile-error"
                      {...mobileForm.register("mobile")}
                    />
                  </div>
                </div>
                {mobileForm.formState.errors.mobile && (
                  <p id="mobile-error" className="text-xs text-destructive">
                    {mobileForm.formState.errors.mobile.message}
                  </p>
                )}
              </div>

              {formError && (
                <p className="text-sm text-destructive" role="alert">
                  {formError}
                </p>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={mobileForm.formState.isSubmitting}
              >
                {mobileForm.formState.isSubmitting && (
                  <Loader2 className="size-4 animate-spin" />
                )}
                Send OTP
              </Button>
            </form>
          ) : (
            <form onSubmit={onVerify} noValidate className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="otp" required>
                  One-time password
                </Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    autoComplete="one-time-code"
                    placeholder="123456"
                    className="pl-9 tracking-[0.4em]"
                    invalid={!!otpForm.formState.errors.otp}
                    aria-describedby="otp-error otp-hint"
                    autoFocus
                    {...otpForm.register("otp")}
                  />
                </div>
                {otpForm.formState.errors.otp ? (
                  <p id="otp-error" className="text-xs text-destructive">
                    {otpForm.formState.errors.otp.message}
                  </p>
                ) : (
                  <p id="otp-hint" className="text-xs text-muted-foreground">
                    Demo code: <span className="font-medium">{DEMO_OTP}</span>
                  </p>
                )}
              </div>

              {formError && (
                <p className="text-sm text-destructive" role="alert">
                  {formError}
                </p>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={otpForm.formState.isSubmitting}
              >
                {otpForm.formState.isSubmitting && (
                  <Loader2 className="size-4 animate-spin" />
                )}
                Verify &amp; continue
              </Button>

              <button
                type="button"
                onClick={() => {
                  setStep("mobile");
                  setFormError(null);
                }}
                className="flex w-full items-center justify-center gap-1.5 rounded-sm py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="size-3.5" /> Change mobile number
              </button>
            </form>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          By continuing you agree to {partner.name}’s Terms &amp; Privacy Policy.
        </p>
      </div>
    </div>
  );
}
