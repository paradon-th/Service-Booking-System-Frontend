import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function UserManagementSkeleton() {
  return (
    <div className="px-4 pt-2 pb-6 space-y-4">
      <Skeleton className="h-8 w-56" />
      <Card className="p-6 space-y-4">
        <div className="flex flex-wrap gap-4">
          {[...Array(3)].map((_, idx) => (
            <Skeleton key={idx} className="h-10 w-full sm:w-48" />
          ))}
        </div>
        <div className="space-y-3">
          {[...Array(6)].map((_, rowIdx) => (
            <div key={rowIdx} className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((__, colIdx) => (
                <Skeleton key={colIdx} className="h-4 w-full" />
              ))}
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-3">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </Card>
    </div>
  );
}
