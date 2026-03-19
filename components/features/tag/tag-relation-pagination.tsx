"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";

export function TagRelationPagination({ currentPage, totalPages }: { currentPage: number; totalPages?: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  if (!totalPages || totalPages <= 1) {
    return null;
  }

  const buildHref = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }
    const query = params.toString();
    return `/tag/relation-configuration${query ? `?${query}` : ""}`;
  };

  const pushPage = (page: number) => {
    const href = buildHref(page);
    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            aria-disabled={currentPage <= 1 || isPending}
            onClick={(event) => {
              event.preventDefault();
              if (currentPage > 1 && !isPending) pushPage(currentPage - 1);
            }}
            href={buildHref(Math.max(1, currentPage - 1))}
          />
        </PaginationItem>
        <PaginationItem>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            aria-disabled={currentPage >= totalPages || isPending}
            onClick={(event) => {
              event.preventDefault();
              if (currentPage < totalPages && !isPending) pushPage(currentPage + 1);
            }}
            href={buildHref(Math.min(totalPages, currentPage + 1))}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
