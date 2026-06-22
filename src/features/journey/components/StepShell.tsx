import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Heading block shared by every journey step. */
export function StepHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <header className="mb-6">
      <h1 className="font-display text-2xl font-bold tracking-tight">{title}</h1>
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
