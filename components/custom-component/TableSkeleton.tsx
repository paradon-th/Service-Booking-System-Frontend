import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

export const TableSkeleton = () => (
  <div className="space-y-4 w-full">
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader className="bg-denso-dark">
          <TableRow>
            <TableHead className="w-[480px]">
              <Skeleton className="h-4 w-20" />
            </TableHead>
            {[...Array(12)].map((_, i) => (
              <TableHead key={i}>
                <Skeleton className="h-4 w-20" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={13} className="w-full bg-[#E0E0E0]">
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="py-1 lg:sticky lg:left-4 z-10 space-y-2">
                  <Skeleton className="h-4 w-40 bg-denso-dark" />
                  <Skeleton className="h-4 w-50 bg-denso-dark" />
                  <Skeleton className="h-4 w-30 bg-denso-dark" />
                  <Skeleton className="h-4 w-60 bg-denso-dark" />
                </div>
                <div className="ml-40 px-4 lg:sticky lg:left-107 z-10 space-y-2">
                  <Skeleton className="h-4 w-30 bg-denso-dark" />
                  <Skeleton className="h-4 w-40 bg-denso-dark" />

                </div>
              </div>
            </TableCell>
          </TableRow>


          {[...Array(10)].map((_, i) => (
            <TableRow key={i}>
              <TableCell className="w-[480px]">
                <Skeleton
                  className="h-4"
                  style={{ width: `${Math.floor(Math.random() * (240 - 120 + 1)) + 120}px` }}
                />
              </TableCell>
              {[...Array(12)].map((_, j) => (
                <TableCell key={j}>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
              ))}
            </TableRow>
          ))}

        </TableBody>
      </Table>
    </div>
  </div>
);
