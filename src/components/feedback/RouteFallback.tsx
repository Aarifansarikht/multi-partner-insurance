import { Skeleton } from "@/components/ui/skeleton";

/** Suspense fallback for lazily-loaded routes. */
export function RouteFallback() {
  return (
    <div className="container space-y-6 py-12" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading…</span>
      <Skeleton className="h-9 w-64" />
      <Skeleton className="h-5 w-full max-w-md" />
      <div className="grid grid-cols-1 gap-5 pt-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-56" />
        ))}
      </div>
    </div>
  );
}
