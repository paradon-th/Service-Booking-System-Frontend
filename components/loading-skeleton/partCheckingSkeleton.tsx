import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PartCheckingSkeleton() {
  return (
    <div className="space-y-6 px-4 pt-2 pb-6">
      <Skeleton className="h-8 w-48" />
      <Card className="w-full p-6 space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 flex-1">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-6 w-40" />
          <div className="rounded-lg border">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="grid grid-cols-4 gap-4 border-b px-4 py-3 last:border-none">
                {[...Array(4)].map((__, colIdx) => (
                  <Skeleton key={colIdx} className="h-4 w-full" />
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-6 w-56" />
          <div className="rounded-lg border">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="grid grid-cols-5 gap-4 border-b px-4 py-3 last:border-none">
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
