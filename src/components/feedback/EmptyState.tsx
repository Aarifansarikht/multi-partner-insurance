import { SearchX } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({
  title = "Nothing here yet",
  description,
  icon,
  action,
}: {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-sm border border-dashed border-border bg-surface/50 px-6 py-14 text-center">
      <span className="flex size-11 items-center justify-center rounded-sm bg-muted text-muted-foreground">
        {icon ?? <SearchX className="size-5" />}
      </span>
      <div className="space-y-1">
        <h3 className="font-display text-base font-semibold">{title}</h3>
        {description && (
          <p className="max-w-sm text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
