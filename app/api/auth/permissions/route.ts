import { NextResponse } from "next/server";

import { apiClient } from "@/lib/api/client";
import { ApiError } from "@/lib/api/generated/core/ApiError";
import type { PermissionDto } from "@/lib/api/generated";
import { getAccessTokenFromCookies } from "@/lib/auth/session";

export async function GET() {
  const token = await getAccessTokenFromCookies();

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  console.log("[api/auth/permissions] Forwarding request with token", token.slice(0, 16));

  try {
    const response = await apiClient.auth.getUserPermissions();
    const { data, message, statusCode } = response;

    return NextResponse.json(
      {
        message: message ?? "OK",
        data: data ?? ([] as PermissionDto[])
      },
      { status: statusCode && statusCode >= 200 && statusCode < 600 ? statusCode : 200 }
    );
  } catch (error) {
    if (error instanceof ApiError) {
      const status = error.status ?? 500;
      const body = error.body as any;
      const message = body?.message ?? body?.errors?.general?.[0] ?? "Unable to load permissions";
      console.error("[api/auth/permissions] Backend error", {
        status,
        message,
        raw: body
      });
      return NextResponse.json({ message }, { status });
    }

    return NextResponse.json({ message: "Unable to load permissions" }, { status: 500 });
  }
}
