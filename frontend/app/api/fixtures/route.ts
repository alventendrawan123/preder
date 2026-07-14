import { NextResponse } from "next/server";
import { txlineGetCached } from "@/lib/txline";

export const dynamic = "force-dynamic";

// Live World Cup fixtures (competitionId 72), proxied + cached.
export async function GET() {
  try {
    const data = await txlineGetCached(`/fixtures/snapshot?competitionId=72`, 30_000);
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 502 });
  }
}
