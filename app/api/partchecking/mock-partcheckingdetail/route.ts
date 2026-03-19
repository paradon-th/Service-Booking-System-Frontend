import { NextResponse } from "next/server";
import partCheckingDetailData from "@/data/partCheckingDetail.json";

export async function GET() {
  return NextResponse.json(partCheckingDetailData);
}
