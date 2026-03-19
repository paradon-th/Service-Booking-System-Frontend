import { NextResponse } from "next/server";

import { apiClient } from "@/lib/api/client";
import { ApiError } from "@/lib/api/generated/core/ApiError";
import { getRefreshTokenFromCookies, setAuthCookies } from "@/lib/auth/session";

export async function POST() {
  const refreshToken = await getRefreshTokenFromCookies();

  if (!refreshToken) {
    return NextResponse.json({ message: "Missing refresh token" }, { status: 401 });
  }

  try {
    const serviceMainId = Number(process.env.SERVICE_MAIN_ID ?? process.env.NEXT_PUBLIC_SERVICE_MAIN_ID ?? 1);
    const response = await apiClient.auth.refreshToken({ body: { refreshToken, serviceMainId } });
    const { data, message, statusCode, errors } = response;

    if (!data?.accessToken) {
      const fallback =
        message ??
        errors?.general?.[0] ??
        errors?.refreshToken?.[0] ??
        "Unable to refresh session";
      return NextResponse.json({ message: fallback }, { status: statusCode && statusCode >= 400 ? statusCode : 401 });
    }

    await setAuthCookies({ accessToken: data.accessToken, refreshToken: data.refreshToken ?? refreshToken });

    return NextResponse.json({ message: message ?? "Session refreshed" });
  } catch (error) {
    if (error instanceof ApiError) {
      const status = error.status ?? 500;
      const body = error.body as any;
      const message =
        body?.message ?? body?.errors?.general?.[0] ?? body?.errors?.refreshToken?.[0] ?? "Unable to refresh session";
      return NextResponse.json({ message }, { status });
    }

    return NextResponse.json({ message: "Unable to refresh session" }, { status: 500 });
  }
}
