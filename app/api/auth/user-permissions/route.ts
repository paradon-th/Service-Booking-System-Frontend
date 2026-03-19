import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ACCESS_TOKEN_COOKIE } from "@/lib/auth/constants";

export async function GET() {
  // Allow self-signed certificates for local development HTTPS
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const apiUrl = `${process.env.API_BASE_URL}/api/Auth/user-permissions`;
    console.log(`[Frontend] Fetching permissions from: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store"
    });

    const responseText = await response.text();
    console.log(`[Frontend] Full response from Backend (Status ${response.status}):`, responseText.substring(0, 500)); // Log first 500 chars

    let data: any;
    try {
        data = JSON.parse(responseText);
    } catch (e) {
        console.error(`[Frontend ERROR] Backend did not return JSON. Status: ${response.status}`);
        console.error(`[Frontend ERROR] Response Content was: ${responseText.substring(0, 1000)}`); // Show more content for debugging
        return NextResponse.json({ message: "Backend returned non-JSON response (See Server Logs)" }, { status: 500 });
    }

    if (!response.ok) {
      console.error(`[Frontend] Backend error ${response.status}:`, data);
      return NextResponse.json({ message: data.message ?? "Failed to fetch permissions" }, { status: response.status });
    }

    return NextResponse.json(data.data);
  } catch (error) {
    console.error("[Frontend] user-permissions route error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
