import { useEffect, useRef, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Heading block shared by every journey step. Moves keyboard/screen-reader focus
 * to the step title on mount so navigating between steps announces the new step
 * and lands focus in the right place.
 */
export function StepHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <header className="mb-6">
      <h1
        ref={ref}
        tabIndex={-1}
        className="font-display text-2xl font-bold tracking-tight outline-none"
      >
        {title}
      </h1>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      )}
    </header>
  );
}

/** Sticky-feeling footer with consistent Back / Continue actions. */
export function StepActions({
  onBack,
  backLabel = "Back",
  submitLabel = "Continue",
  submitting = false,
  children,
}: {
  onBack?: () => void;
  backLabel?: string;
  submitLabel?: string;
  submitting?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-5">
      {onBack ? (
        <Button type="button" variant="ghost" onClick={onBack}>
          <ArrowLeft className="size-4" /> {backLabel}
        </Button>
      ) : (
        <span />
      )}
      {children ?? (
        <Button type="submit" size="lg" disabled={submitting}>
          {submitting && <Loader2 className="size-4 animate-spin" />}
          {submitLabel}
          {!submitting && <ArrowRight className="size-4" />}
        </Button>
      )}
    </div>
  );
}
