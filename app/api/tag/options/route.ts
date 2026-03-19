import { NextResponse } from "next/server";

import { apiClient } from "@/lib/api/client";
import { ApiError } from "@/lib/api/generated/core/ApiError";

function parsePositiveNumber(value: string | null, fallback: number) {
  const parsed = Number(value);
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }
  return fallback;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchTerm = url.searchParams.get("search") ?? undefined;
  const page = parsePositiveNumber(url.searchParams.get("page"), 1);
  const pageSize = parsePositiveNumber(url.searchParams.get("pageSize"), 50);

  try {
    const response = await apiClient.tag.getTag({
      page,
      pageSize,
      searchTerm
    });

    const statusCode = response.statusCode && response.statusCode >= 200 && response.statusCode < 600 ? response.statusCode : 200;

    return NextResponse.json(
      {
        message: response.message ?? "OK",
        data: (response.data?.items ?? []).map((item) => ({
          tagId: item.tagId,
          tagName: item.tagName,
          tagType: item.tagType
        })),
        pagination: response.data?.pagination
      },
      { status: statusCode }
    );
  } catch (error) {
    if (error instanceof ApiError) {
      const status = error.status ?? 500;
      const body = error.body as any;
      const message = body?.message ?? body?.errors?.general?.[0] ?? "Unable to load tags";
      return NextResponse.json({ message }, { status });
    }

    return NextResponse.json({ message: "Unable to load tags" }, { status: 500 });
  }
}
