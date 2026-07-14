import { NextResponse } from "next/server";
import { txlineGet, findFinalised } from "@/lib/txline";
import { fetchMarketFixtureId } from "@/lib/chain";

export const dynamic = "force-dynamic";

// Fetch the settlement proof for a market (spec §3). The keeper hits this to obtain the V3
// Merkle proof + finalisation record for the market's fixture.
export async function GET(_req: Request, { params }: { params: { marketPda: string } }) {
  try {
    const fixtureId = await fetchMarketFixtureId(params.marketPda);
    const snap = await txlineGet(`/scores/snapshot/${fixtureId}`);
    const rows: any[] = Array.isArray(snap) ? snap : snap?.data ?? [];
    const fin = findFinalised(rows);
    if (!fin) return NextResponse.json({ fixtureId, finalised: false });

    const seq = fin.Seq ?? fin.seq;
    const proof = await txlineGet(`/scores/stat-validation-v3?fixtureId=${fixtureId}&seq=${seq}&statKeys=1002,1007`);
    return NextResponse.json({
      fixtureId,
      finalised: true,
      seq,
      score: fin.Score ?? fin.score,
      statusId: fin.StatusId ?? fin.statusId,
      period: fin.Period ?? fin.period,
      proof,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 502 });
  }
}
