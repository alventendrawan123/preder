import { NextResponse } from "next/server";
import { txlineGetCached } from "@/lib/txline";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { fixtureId: string } }) {
  try {
    const data = await txlineGetCached(`/scores/snapshot/${params.fixtureId}`, 8_000);
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 502 });
  }
}
