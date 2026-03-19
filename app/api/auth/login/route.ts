import { NextResponse } from "next/server";

import { apiClient } from "@/lib/api/client";
import { ApiError } from "@/lib/api/generated/core/ApiError";
import { setAuthCookies } from "@/lib/auth/session";

export async function POST(request: Request) {
  let payload: Record<string, unknown>;

  try {
    payload = await request.json();
  } catch (error) {
    return NextResponse.json({ message: "Invalid JSON payload" }, { status: 400 });
  }

  const serviceMainId = Number(process.env.SERVICE_MAIN_ID ?? process.env.NEXT_PUBLIC_SERVICE_MAIN_ID ?? 1);

  const body = {
    email: typeof payload.email === "string" ? payload.email : undefined,
    password: typeof payload.password === "string" ? payload.password : undefined,
    remember: typeof payload.remember === "boolean" ? payload.remember : undefined,
    serviceMainId
  };

  if (!body.email || !body.password) {
    return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
  }

  try {
    const response = await apiClient.auth.login({ body });
    const { data, message, statusCode, errors } = response;

    if (!data?.accessToken) {
      const fallback =
        message ??
        errors?.general?.[0] ??
        errors?.email?.[0] ??
        errors?.password?.[0] ??
        "Login failed";
      return NextResponse.json({ message: fallback }, { status: statusCode && statusCode >= 400 ? statusCode : 401 });
    }

    await setAuthCookies({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken ?? null,
      remember: !!body.remember
    });

    return NextResponse.json({ message: message ?? "Login success" });
  } catch (error) {
    if (error instanceof ApiError) {
      const status = error.status ?? 500;
      const body = error.body as any;
      const message =
        body?.message ?? body?.errors?.general?.[0] ?? body?.errors?.email?.[0] ?? body?.errors?.password?.[0] ?? "Login failed";
      return NextResponse.json({ message }, { status });
    }

    return NextResponse.json({ message: "Login failed" }, { status: 500 });
  }
}
