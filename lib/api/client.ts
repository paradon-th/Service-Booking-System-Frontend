import { icubeApi } from "@/lib/api/generated";
import { getAccessTokenFromCookies } from "@/lib/auth/session";

const isServer = typeof window === "undefined";
const isProduction = process.env.NODE_ENV === "production";

if (!isProduction) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const fallbackBaseUrl = "http://localhost:8080";

export const apiClient = new icubeApi({
  BASE: process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE ?? fallbackBaseUrl,
  WITH_CREDENTIALS: true,
  HEADERS: async (options) => {
    const token = await getAccessTokenFromCookies();


    if (isServer && !isProduction) {
      const fingerprint = token ? `${token.slice(0, 8)}…` : "<none>";
      console.log(`[apiClient] ${options.method} ${options.url} Authorization ${fingerprint}`);
    }

    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  }
});
