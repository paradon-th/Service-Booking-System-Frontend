"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

type TagPaginationProps = {
  currentPage: number;
  totalPages?: number;
  pageSize?: number;
  totalRecords?: number;
};

export function TagPagination({ currentPage, totalPages, pageSize, totalRecords }: TagPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const totalLabel = typeof totalRecords === "number" ? new Intl.NumberFormat().format(totalRecords) : "";
  const totalPageCount = totalPages && totalPages > 0 ? totalPages : 1;

  const pushPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }
    const query = params.toString();
    startTransition(() => {
      router.push(`/tag/configuration${query ? `?${query}` : ""}`);
    });
  };

  return (
    <div className="flex items-center justify-end space-x-2 pt-4">
      <div className="text-muted-foreground flex-1 text-sm">
        Page {Math.min(currentPage, totalPageCount)} of {totalPageCount}
        {pageSize ? ` • ${pageSize} / page` : ""}
        {totalLabel ? ` • ${totalLabel} total` : ""}
      </div>
      <div className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => pushPage(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1 || isPending}>
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => pushPage(Math.min(totalPageCount, currentPage + 1))}
          disabled={currentPage >= totalPageCount || isPending}>
          Next
        </Button>
      </div>
    </div>
  );
}
