import { NextResponse } from "next/server";

import { apiClient } from "@/lib/api/client";
import { ApiError } from "@/lib/api/generated/core/ApiError";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const response = await apiClient.tag.createTag({ body: payload });
    const statusCode = response.statusCode && response.statusCode >= 200 && response.statusCode < 600 ? response.statusCode : 200;

    return NextResponse.json(
      {
        message: response.message ?? "Tag created",
        data: response.data ?? null
      },
      { status: statusCode }
    );
  } catch (error) {
    if (error instanceof ApiError) {
      const status = error.status ?? 500;
      const body = error.body as any;
      const message = body?.message ?? body?.errors?.general?.[0] ?? "Unable to create tag";
      return NextResponse.json({ message }, { status });
    }

    return NextResponse.json({ message: "Unable to create tag" }, { status: 500 });
  }
}
