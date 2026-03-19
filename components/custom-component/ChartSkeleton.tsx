import React from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const ChartSkeleton = () => (
  <div className="w-full ">
    <div className="mb-3 flex flex-col gap-3 lg:flex-col lg:items-end lg:justify-between">
      <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm lg:justify-end">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-7 w-7" />
      </div>
    </div>
    <div className="w-full rounded-lg border">
      <div className="p-6 space-y-4">
        <div className="flex items-end justify-between gap-2 h-[375px]">
        <div className="flex flex-col justify-between h-full">
          <Skeleton className="h-4 w-13" />
          <Skeleton className="h-4 w-13" />
          <Skeleton className="h-4 w-13" />
          <Skeleton className="h-4 w-13" />
        </div>
          {[...Array(14)].map((_, i) => (
            <div key={i} className="flex-1 flex flex-col justify-end">
              <Skeleton className="w-full h-[370px]" />
            </div>
          ))}
        </div>
        <div className="flex items-end justify-between gap-2">
          <div className="mr-13"></div>
          {[...Array(14)].map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>
      </div>
    </div>
  </div>
);
