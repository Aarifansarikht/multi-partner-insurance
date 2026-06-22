import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/** Loading placeholder matching the real PlanCard layout. */
export function PlanCardSkeleton() {
  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-center justify-between p-5 pb-3">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10" />
          <Skeleton className="h-5 w-20" />
        </div>
      </div>
      <div className="flex-1 px-5">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="mt-2 h-4 w-full" />
        <Skeleton className="mt-1.5 h-4 w-2/3" />
        <Skeleton className="mt-4 h-4 w-1/2" />
      </div>
      <div className="mt-4 flex items-end justify-between border-t border-border p-5">
        <div className="space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-5 w-16" />
      </div>
    </Card>
  );
}
