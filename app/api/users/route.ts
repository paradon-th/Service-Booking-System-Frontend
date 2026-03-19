import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ACCESS_TOKEN_COOKIE } from "@/lib/auth/constants";

export async function GET() {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await fetch(`${process.env.API_BASE_URL}/api/Users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      return NextResponse.json({ message: "Failed to fetch users" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data.data);
  } catch (error) {
    console.error("Fetch users error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
