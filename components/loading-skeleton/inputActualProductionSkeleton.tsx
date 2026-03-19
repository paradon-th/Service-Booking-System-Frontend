import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function InputActualProductionSkeleton() {
  return (
    <div className="space-y-6 px-4 pt-2 pb-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2 w-full md:max-w-xl">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
          <Skeleton className="h-10 w-full col-span-2" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      <Card className="p-4 space-y-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          {[...Array(4)].map((_, idx) => (
            <Skeleton key={idx} className="h-12 w-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[...Array(2)].map((_, idx) => (
            <Skeleton key={idx} className="h-32 w-full" />
          ))}
        </div>
        <div className="space-y-3">
          <Skeleton className="h-6 w-40" />
          <div className="overflow-x-auto">
            {[...Array(5)].map((_, rowIdx) => (
              <div
                key={rowIdx}
                className="grid grid-cols-6 gap-3 border-b px-2 py-3 text-xs sm:text-sm last:border-none"
              >
                {[...Array(6)].map((__, colIdx) => (
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
