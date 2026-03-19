import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const dataType = searchParams.get("type"); // "day241", "day31", "year241", "year31"

    if (!dataType) {
      return NextResponse.json(
        { error: "Missing 'type' parameter" },
        { status: 400 }
      );
    }

    // Map dataType to environment variable
    const envMap: Record<string, string | undefined> = {
      day241: process.env.NEXT_PUBLIC_API_PRODUCTION_LINE_DAY241,
      day31: process.env.NEXT_PUBLIC_API_PRODUCTION_LINE_DAY31,
      year241: process.env.NEXT_PUBLIC_API_PRODUCTION_LINE_YEAR241,
      year31: process.env.NEXT_PUBLIC_API_PRODUCTION_LINE_YEAR31,
    };

    const baseApiUrl = envMap[dataType];

    if (!baseApiUrl) {
      return NextResponse.json(
        { error: `API URL not configured for type: ${dataType}` },
        { status: 500 }
      );
    }

    const endpoint = `${baseApiUrl}/value`;

    // Build query params for proxy
    const params = new URLSearchParams({
      apiUrl: endpoint,
    });

    const proxyUrl = `/api/proxy?${params.toString()}`;
    
    // Make internal API call
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
    const fullProxyUrl = `${baseUrl}${proxyUrl}`;

    const response = await fetch(fullProxyUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.data && Array.isArray(result.data)) {
      return NextResponse.json({
        success: true,
        data: result.data,
        dataType,
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json(
        { error: "No data array found in response" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[Production Lines Data API] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch production line data", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
