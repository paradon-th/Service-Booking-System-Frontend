import { NextRequest, NextResponse } from "next/server";

/**
 * Generic API Proxy Route
 * ใช้สำหรับ proxy requests ไปยัง external API โดยแนบ token ที่ปลอดภัย
 * 
 * Query Parameters:
 * - apiUrl: URL ของ API ที่ต้องการเรียก (required)
 * - starttime: เวลาเริ่มต้น (optional, default จาก env)
 * - endtime: เวลาสิ้นสุด (optional, default จาก env)
 * 
 * Example:
 * /api/proxy?apiUrl=https://api.example.com/data&starttime=*-1y&endtime=*
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // รับ API URL จาก query parameter
    const apiUrl = searchParams.get("apiUrl");
    
    if (!apiUrl) {
      return NextResponse.json(
        { error: "apiUrl parameter is required" },
        { status: 400 }
      );
    }

    // ใช้ค่า default จาก env หรือ override ด้วย query params
    const starttime = searchParams.get("starttime") || process.env.DEFAULT_START_TIME || "*-1y";
    const endtime = searchParams.get("endtime") || process.env.DEFAULT_END_TIME || "*";

    const token = process.env.TOKEN_PC_REFORMING;

    if (!token) {
      return NextResponse.json(
        { error: "Token not configured" },
        { status: 500 }
      );
    }

    // สร้าง URL พร้อม parameters
    const targetUrl = new URL(apiUrl);
    targetUrl.searchParams.set("starttime", starttime);
    targetUrl.searchParams.set("endtime", endtime);

    console.log("[API Proxy] Fetching:", targetUrl.toString());

    const response = await fetch(targetUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error("[API Proxy] Error:", response.status, response.statusText);
      return NextResponse.json(
        { 
          error: "Failed to fetch data from external API",
          status: response.status,
          statusText: response.statusText 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("[API Proxy] Success");

    return NextResponse.json(data);
  } catch (error) {
    console.error("[API Proxy] Exception:", error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
