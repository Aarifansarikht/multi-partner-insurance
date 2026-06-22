import { cn } from "@/lib/utils";

/**
 * Loading placeholder. A simple pulsing muted block (no gradient) sized to match
 * the content it stands in for — never a bare spinner.
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-sm bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
