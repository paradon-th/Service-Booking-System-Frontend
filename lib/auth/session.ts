import { cookies } from "next/headers";

import { ACCESS_TOKEN_COOKIE, AUTH_COOKIE_OPTIONS, REFRESH_TOKEN_COOKIE } from "@/lib/auth/constants";

export async function setAuthCookies({
  accessToken,
  refreshToken,
  remember
}: {
  accessToken: string;
  refreshToken?: string | null;
  remember?: boolean;
}) {
  const cookieStore = await cookies();

  const options = {
    ...AUTH_COOKIE_OPTIONS,
    maxAge: remember ? 30 * 24 * 60 * 60 : undefined // 30 days if remember is true
  };

  cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, options);

  if (refreshToken) {
    cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, options);
  }
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
}

export async function getAccessTokenFromCookies() {
  try {
    const cookieStore = await cookies();
    return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
  } catch {
    return null;
  }
}

export async function getRefreshTokenFromCookies() {
  try {
    const cookieStore = await cookies();
    return cookieStore.get(REFRESH_TOKEN_COOKIE)?.value ?? null;
  } catch {
    return null;
  }
}
