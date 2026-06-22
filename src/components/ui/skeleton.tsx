import { cn } from "@/lib/utils";

/**
 * Shimmer skeleton. Composes the `.skeleton-shimmer` utility (defined in
 * index.css) over a muted base so loading placeholders match the shape of the
 * content they stand in for — never a bare spinner.
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-sm bg-muted skeleton-shimmer",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
