import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn’t load this right now. Please try again.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 rounded-sm border border-dashed border-destructive bg-destructive-soft px-6 py-12 text-center"
    >
      <span className="flex size-11 items-center justify-center rounded-sm bg-destructive-soft text-destructive">
        <AlertTriangle className="size-5" />
      </span>
      <div className="space-y-1">
        <h3 className="font-display text-base font-semibold">{title}</h3>
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-1">
          <RefreshCw className="size-4" /> Try again
        </Button>
      )}
    </div>
  );
}
