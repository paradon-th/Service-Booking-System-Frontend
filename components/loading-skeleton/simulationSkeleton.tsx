import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartSkeleton } from "../custom-component/ChartSkeleton";
import { TableSkeleton } from "../custom-component/TableSkeleton";

export function SimulationPageSkeleton() {
  return (
    <div className="space-y-6 px-4 pt-2">
      <Skeleton className="w-70 h-8" />

      <div className="rounded-lg border w-full">
        <div className="flex flex-col lg:flex-row gap-2 justify-between w-full pt-4 px-4">
          <div className="flex flex-col lg:flex-row">
            <Skeleton className="h-[50px] w-full lg:w-50" />
            <Skeleton className="h-[50px] w-full lg:w-50" />
            <Skeleton className="h-[50px] w-full lg:w-50" />
            <Skeleton className="h-[50px] w-full lg:w-50" />
          </div>
          <div>
            <Skeleton className="h-9 w-full lg:w-40" />
          </div>
        </div>

        <div className="flex justify-between py-5 px-4 items-end">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:flex lg:flex-row lg:flex-1 lg:items-end lg:gap-4">
            <div className="space-y-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-9 w-full lg:w-56" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-9 w-56 lg:w-56" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-9 w-56 lg:w-56" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-9 w-56 lg:w-56" />
            </div>
          </div>
          <div>
            <Skeleton className="h-9 w-60" />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 lg:flex-row">
          <div className="w-full lg:w-[400px]">
            <Card className="h-full">
              <CardHeader>
              <div>
                <CardTitle >
                  <Skeleton className="h-4 w-20" />
                </CardTitle>
                <CardDescription className="mt-2 space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-full" />
                </CardDescription>
              </div>
              <CardContent></CardContent>
              </CardHeader>
            </Card>
          </div>
          <div className="flex-1 min-w-0">
            <ChartSkeleton/>
          </div>
        </div>

        <div className="mt-10">
          <TableSkeleton/>
        </div>


      </div>
    </div>
  );
}
