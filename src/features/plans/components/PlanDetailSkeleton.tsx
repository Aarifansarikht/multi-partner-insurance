import { Skeleton } from "@/components/ui/skeleton";

export function PlanDetailSkeleton() {
  return (
    <div className="container py-8 md:py-12">
      <Skeleton className="h-4 w-24" />
      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Skeleton className="size-12" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-64" />
              <Skeleton className="h-4 w-80" />
            </div>
          </div>
          <Skeleton className="h-24 w-full" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
          <Skeleton className="h-56 w-full" />
        </div>
        <Skeleton className="h-[460px] w-full" />
      </div>
    </div>
  );
}
