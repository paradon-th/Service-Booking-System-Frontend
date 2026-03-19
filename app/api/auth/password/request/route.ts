import { NextResponse } from "next/server";

import { apiClient } from "@/lib/api/client";
import { ApiError } from "@/lib/api/generated/core/ApiError";
import type { ForgotPasswordRequest } from "@/lib/api/generated";

export async function POST(request: Request) {
  let payload: ForgotPasswordRequest;

  try {
    payload = await request.json();
  } catch (error) {
    return NextResponse.json({ message: "Invalid JSON payload" }, { status: 400 });
  }

  if (!payload?.email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  try {
    const response = await apiClient.user.requestChangePassword({ body: payload });
    const { message, statusCode, errors } = response;
    const fallback = message ?? errors?.general?.[0] ?? "Reset instructions sent";

    return NextResponse.json({ message: fallback }, {
      status: statusCode && statusCode >= 200 && statusCode < 600 ? statusCode : 200
    });
  } catch (error) {
    if (error instanceof ApiError) {
      const status = error.status ?? 500;
      const body = error.body as any;
      const message = body?.message ?? body?.errors?.general?.[0] ?? "Unable to process request";
      return NextResponse.json({ message }, { status });
    }

    return NextResponse.json({ message: "Unable to process request" }, { status: 500 });
  }
}
