import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const baseApiUrl = process.env.NEXT_PUBLIC_API_OVERVIEW_CARD;
    
    if (!baseApiUrl) {
      return NextResponse.json(
        { error: 'API URL not configured' },
        { status: 500 }
      );
    }

    const endpoint = `${baseApiUrl}/value`;
    
    // Forward cookies และ headers จาก client
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    // Copy cookies จาก request
    const cookieHeader = request.headers.get('cookie');
    if (cookieHeader) {
      headers['Cookie'] = cookieHeader;
    }
    
    // Copy authorization header ถ้ามี
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const response = await fetch(endpoint, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `HTTP error! status: ${response.status}` },
        { status: response.status }
      );
    }

    const result = await response.json();

    if (result.data && Array.isArray(result.data)) {
      // สร้าง unique production line options
      const uniqueLines = Array.from(new Set(result.data.map((item: any) => 
        item.fields?.production_line
      ).filter(Boolean))) as string[];
      
      const options = uniqueLines.map((line: string) => ({
        label: line,
        value: line.toLowerCase().replace(/\s+/g, '_')
      }));
      
      return NextResponse.json({ options });
    }
    
    return NextResponse.json({ options: [] });
  } catch (error) {
    console.error('[API] Error fetching production lines:', error);
    return NextResponse.json(
      { error: 'Failed to fetch production lines' },
      { status: 500 }
    );
  }
}
