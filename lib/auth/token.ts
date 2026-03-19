import { getAccessTokenFromCookies } from "@/lib/auth/session";

export type DecodedToken = {
  userId?: number;
  factoryId?: number;
  [key: string]: unknown;
};

export function decodeAccessToken(token?: string | null): DecodedToken | null {
  if (!token) return null;

  try {
    const [, payload] = token.split(".");
    if (!payload) return null;

    // Handle base64url decoding
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = Buffer.from(normalized, "base64").toString("utf8");
    return JSON.parse(json);
  } catch (error) {
    return null;
  }
}

export async function getCurrentTokenClaims() {
  const token = await getAccessTokenFromCookies();
  return decodeAccessToken(token ?? undefined);
}
