import { NextResponse } from "next/server";
import { AUTH_COOKIE_OPTIONS, ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/lib/auth/constants";

export async function POST(request: Request) {
  const { accessToken, refreshToken } = await request.json();

  if (!accessToken || !refreshToken) {
    return new Response("Access token and refresh token are required", { status: 400 });
  }

  const response = new NextResponse(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });

  response.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, AUTH_COOKIE_OPTIONS);
  response.cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, AUTH_COOKIE_OPTIONS);

  return response;
}
