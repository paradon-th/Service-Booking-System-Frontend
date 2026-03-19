import { NextResponse } from "next/server";

import { apiClient } from "@/lib/api/client";
import { ApiError } from "@/lib/api/generated/core/ApiError";

function parseIds(searchParams: URLSearchParams) {
  const ids = searchParams.getAll("id");
  return Array.from(new Set(ids.map((value) => Number(value)).filter((id) => Number.isFinite(id) && id > 0))) as number[];
}

function parsePositiveNumber(value: string | null, fallback: number) {
  const parsed = Number(value);
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }
  return fallback;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const ids = parseIds(url.searchParams);
  const search = url.searchParams.get("search") ?? undefined;
  const page = parsePositiveNumber(url.searchParams.get("page"), 1);
  const pageSize = parsePositiveNumber(url.searchParams.get("pageSize"), 50);

  try {
    if (ids.length > 0) {
      const results = await Promise.all(
        ids.map(async (id) => {
          try {
            const response = await apiClient.group.getGroupById({ id });
            return response.data ?? null;
          } catch (error) {
            if (error instanceof ApiError && (error.status === 404 || error.status === 400)) {
              return null;
            }
            throw error;
          }
        })
      );

      return NextResponse.json({
        message: "OK",
        data: results.filter(Boolean)
      });
    }

    const response = await apiClient.group.getGroupByPaging({
      page,
      pageSize,
      searchTerm: search
    });

    const statusCode = response.statusCode && response.statusCode >= 200 && response.statusCode < 600 ? response.statusCode : 200;

    return NextResponse.json(
      {
        message: response.message ?? "OK",
        data: response.data?.items ?? [],
        pagination: response.data?.pagination
      },
      { status: statusCode }
    );
  } catch (error) {
    if (error instanceof ApiError) {
      const status = error.status ?? 500;
      const body = error.body as any;
      const message = body?.message ?? body?.errors?.general?.[0] ?? "Unable to load groups";
      return NextResponse.json({ message }, { status });
    }

    return NextResponse.json({ message: "Unable to load groups" }, { status: 500 });
  }
}
