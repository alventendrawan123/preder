// Server-side read-only on-chain fetchers (getProgramAccounts via anchor 0.29).
import * as anchor from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import idl from "./idl/preder.json";
import { PROGRAM_ID, DEVNET_RPC, FIXTURE_META } from "./solana-config";
import type { Community, Market, MarketState, Resolution } from "./types";

function readProgram() {
  const connection = new Connection(DEVNET_RPC, "confirmed");
  const wallet = {
    publicKey: PublicKey.default,
    signTransaction: async (t: any) => t,
    signAllTransactions: async (t: any) => t,
  } as any;
  const provider = new anchor.AnchorProvider(connection, wallet, { commitment: "confirmed" });
  return new anchor.Program(idl as anchor.Idl, new PublicKey(PROGRAM_ID), provider);
}

const n = (v: any): number => (typeof v?.toNumber === "function" ? v.toNumber() : Number(v));
const colorFor = (pk: string) => {
  const palette = ["#FF6B35", "#2563EB", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444"];
  let h = 0;
  for (const ch of pk) h = (h * 31 + ch.charCodeAt(0)) & 0xffff;
  return palette[h % palette.length];
};
function mapState(s: any): MarketState {
  const k = Object.keys(s)[0];
  return (k.charAt(0).toUpperCase() + k.slice(1)) as MarketState;
}
const hex = (bytes: number[]) => "0x" + Buffer.from(bytes).toString("hex");

function fixtureOf(fixtureId: number) {
  const meta = FIXTURE_META[fixtureId] ?? {
    home: `Fixture ${fixtureId}`, away: "", homeShort: `#${fixtureId}`, awayShort: "", competition: "World Cup",
  };
  return { fixtureId, ...meta, kickoff: 0, status: "scheduled" as const };
}

export async function fetchCommunitiesOnchain(): Promise<Community[]> {
  const program = readProgram();
  const rows = await (program.account as any).community.all();
  return rows.map((r: any) => {
    const a = r.account;
    const id = r.publicKey.toBase58();
    return {
      id,
      creator: a.creator.toBase58(),
      name: a.name,
      description: a.description,
      avatarColor: colorFor(id),
      memberCount: n(a.memberCount),
      marketCount: n(a.marketCount),
      createdAt: n(a.createdAt),
    } as Community;
  });
}

export async function fetchMarketsOnchain(): Promise<Market[]> {
  const program = readProgram();
  const connection = program.provider.connection;
  const rows = await (program.account as any).market.all();
  const configKeeper = await fetchKeeper(program).catch(() => "");

  return Promise.all(
    rows.map(async (r: any) => {
      const a = r.account;
      const id = r.publicKey.toBase58();
      const fixtureId = n(a.fixtureId);
      const state = mapState(a.state);
      const winning = a.winningOutcome === null ? undefined : a.winningOutcome;

      let resolution: Resolution | undefined;
      if (state === "Settled") {
        // Best-effort: latest signature touching this market = the settle tx.
        let settleTx = "";
        try {
          const sigs = await connection.getSignaturesForAddress(r.publicKey, { limit: 1 });
          settleTx = sigs[0]?.signature ?? "";
        } catch {}
        resolution = {
          fixtureId,
          statKeys: "1002,1007",
          seq: n(a.settleSeq),
          timestamp: n(a.settleTimestamp),
          proofHash: hex(a.settleProofHash),
          settleTx,
          keeper: configKeeper,
          verifiedBy: "keeper-attested, off-chain verified",
        };
      }

      const meta = FIXTURE_META[fixtureId];
      return {
        id,
        communityId: a.community.toBase58(),
        creator: a.creator.toBase58(),
        fixture: fixtureOf(fixtureId),
        template: "match_winner",
        title: meta ? `${meta.home} to beat ${meta.away}` : `Fixture ${fixtureId}`,
        yesLabel: meta ? `${meta.homeShort} wins` : "YES",
        noLabel: meta ? `Draw or ${meta.awayShort}` : "NO",
        stakingDeadline: n(a.stakingDeadline),
        expectedSettleAfter: n(a.expectedSettleAfter),
        minStake: n(a.minStake),
        state,
        totalYes: n(a.totalYes),
        totalNo: n(a.totalNo),
        winningOutcome: winning,
        resolution,
      } as Market;
    })
  );
}

async function fetchKeeper(program: anchor.Program): Promise<string> {
  const [configPda] = PublicKey.findProgramAddressSync([Buffer.from("config")], new PublicKey(PROGRAM_ID));
  const cfg = await (program.account as any).config.fetch(configPda);
  return cfg.keeper.toBase58();
}

// Used by /api/settle-proof/[marketPda] to look up which fixture a market settles on.
export async function fetchMarketFixtureId(marketPda: string): Promise<number> {
  const program = readProgram();
  const a: any = await (program.account as any).market.fetch(new PublicKey(marketPda));
  return n(a.fixtureId);
}
