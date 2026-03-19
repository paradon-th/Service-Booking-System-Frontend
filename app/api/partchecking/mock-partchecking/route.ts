import { NextResponse } from "next/server";
import partCheckingData from "@/data/partChecking.json";

export async function GET() {
  return NextResponse.json(partCheckingData);
}
