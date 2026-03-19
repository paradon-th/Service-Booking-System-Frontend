import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ManualInputProductionPlanSkeleton() {
  return (
    <div className="space-y-6 px-4 pt-2 pb-6">
      <Skeleton className="h-8 w-64" />
      <Card className="p-6 space-y-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          {[...Array(4)].map((_, idx) => (
            <Skeleton key={idx} className="h-12 w-full" />
          ))}
        </div>
        <div className="space-y-3">
          <Skeleton className="h-6 w-48" />
          <div className="overflow-x-auto rounded-lg border">
            {[...Array(6)].map((_, rowIdx) => (
              <div
                key={rowIdx}
                className="grid grid-cols-5 gap-4 border-b px-4 py-3 last:border-none"
              >
                {[...Array(5)].map((__, colIdx) => (
                  <Skeleton key={colIdx} className="h-4 w-full" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
