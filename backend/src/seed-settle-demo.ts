// Create a past-dated market on a FINISHED fixture (18218149, ARG 2-1 NED) so the keeper can
// settle it now with a REAL TxLINE proof — proves the end-to-end keeper->proof->settle path.
// (Winner-claim lifecycle with real proof needs a LIVE match; see notes to user.)
import { SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { BN } from "bn.js";
import { makeProgram, loadKeypair, pda, binary } from "./preder";
import deployed from "../deployed.json";

const FIXTURE = 18218149;
const now = Math.floor(Date.now() / 1000);

async function main() {
  const keeper = loadKeypair("keys/keeper-devnet.json");
  const { program } = makeProgram(keeper);

  // Community 2 (Selecao Street) — next market nonce = its current market_count.
  const community2 = deployed.communities.find((c: any) => c.id === 2);
  const communityPda = pda.community(keeper.publicKey, 2);
  const comAcc = await (program.account as any).community.fetch(communityPda);
  const nonce = comAcc.marketCount.toNumber();
  const marketPda = pda.market(communityPda, FIXTURE, nonce);
  const vaultPda = pda.vault(marketPda);

  const yesLegs = [binary(0, 1, 1, 0, 0)]; // home - away > 0
  const noLegs = [binary(0, 1, 1, 1, 1)];  // home - away < 1

  try {
    await (program.account as any).market.fetch(marketPda);
    console.log("settle-demo market already exists:", marketPda.toBase58());
  } catch {
    await program.methods
      .createMarket(
        new BN(FIXTURE), yesLegs, noLegs,
        new BN(now - 31 * 86400), // staking_deadline (far past)
        new BN(now - 30 * 86400), // expected_settle_after (far past, <= real proof ts)
        new BN(1_000_000)
      )
      .accounts({
        creator: keeper.publicKey, community: communityPda, market: marketPda,
        usdcMint: deployed.usdcMint, vault: vaultPda,
        tokenProgram: TOKEN_PROGRAM_ID, systemProgram: SystemProgram.programId, rent: SYSVAR_RENT_PUBKEY,
      })
      .rpc();
    console.log("settle-demo market created:", marketPda.toBase58(), "(fixture", FIXTURE, "nonce", nonce + ")");
  }
  console.log("Now run: npm run keeper  (it will settle this market with a real proof)");
}

main().then(() => process.exit(0), (e) => { console.error(e); process.exit(1); });
