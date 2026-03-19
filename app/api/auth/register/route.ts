import { NextResponse } from "next/server";
import { apiClient } from "@/lib/api/client";
import { ApiError } from "@/lib/api/generated/core/ApiError";

export async function POST(request: Request) {
  let payload: Record<string, unknown>;

  try {
    payload = await request.json();
  } catch (error) {
    return NextResponse.json({ message: "Invalid JSON payload" }, { status: 400 });
  }

  const body = {
    username: (payload.firstName && payload.lastName) 
      ? `${payload.firstName} ${payload.lastName}` 
      : (payload.email as string),
    email: typeof payload.email === "string" ? payload.email : undefined,
    password: typeof payload.password === "string" ? payload.password : undefined,
  };

  if (!body.email || !body.password) {
    return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
  }

  try {
    // Note: If your generated client doesn't have register, you'll need to add it or use raw fetch.
    // Based on my previous check, I didn't see register in AuthService.ts. 
    // Let's check if it exists in the backend AuthController. Yes it does: /api/Auth/register.
    
    const response = await fetch(`${process.env.API_BASE_URL}/api/Auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok) {
        return NextResponse.json({ message: data.message ?? "Registration failed" }, { status: response.status });
    }

    return NextResponse.json({ message: data.message ?? "Registration success" });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ message: "Registration failed" }, { status: 500 });
  }
}
