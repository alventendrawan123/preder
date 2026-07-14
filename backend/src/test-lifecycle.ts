// Full-lifecycle integration test on devnet with REAL SPL tokens. Exercises the fund-critical
// instructions that seeding didn't: join, stake (both sides), settle-with-winner, claim
// (u128 proportional payout), and the zero-winner -> Refundable -> emergency_refund path.
// Run: cd scripts && npx ts-node src/test-lifecycle.ts
import { Keypair, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY, LAMPORTS_PER_SOL, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, getOrCreateAssociatedTokenAccount, mintTo, getAccount } from "@solana/spl-token";
import { BN } from "bn.js";
import { makeProgram, loadKeypair, pda, binary } from "./preder";
import deployed from "../deployed.json";

const USDC = new PublicKey(deployed.usdcMint);
const now = () => Math.floor(Date.now() / 1000);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const yesLegs = [binary(0, 1, 1, 0, 0)];
const noLegs = [binary(0, 1, 1, 1, 1)];
let pass = 0, fail = 0;
const check = (name: string, cond: boolean, detail = "") => {
  console.log(`${cond ? "PASS" : "FAIL"}: ${name} ${detail}`);
  cond ? pass++ : fail++;
};

async function ensureCommunity(program: any, keeper: Keypair, id: number, name: string) {
  const communityPda = pda.community(keeper.publicKey, id);
  try {
    await program.account.community.fetch(communityPda);
  } catch {
    await program.methods
      .createCommunity(new BN(id), name, "lifecycle test", "")
      .accounts({ creator: keeper.publicKey, community: communityPda, membership: pda.member(communityPda, keeper.publicKey), systemProgram: SystemProgram.programId })
      .rpc();
  }
  return communityPda;
}

async function createMarket(program: any, keeper: Keypair, communityPda: PublicKey, fixtureId: number, deadline: number, esa: number) {
  const comAcc = await program.account.community.fetch(communityPda);
  const nonce = comAcc.marketCount.toNumber();
  const marketPda = pda.market(communityPda, fixtureId, nonce);
  await program.methods
    .createMarket(new BN(fixtureId), yesLegs, noLegs, new BN(deadline), new BN(esa), new BN(1_000_000))
    .accounts({ creator: keeper.publicKey, community: communityPda, market: marketPda, usdcMint: USDC, vault: pda.vault(marketPda), tokenProgram: TOKEN_PROGRAM_ID, systemProgram: SystemProgram.programId, rent: SYSVAR_RENT_PUBKEY })
    .rpc();
  return marketPda;
}

async function stake(userKp: Keypair, marketPda: PublicKey, communityPda: PublicKey, outcome: boolean, amount: number) {
  const { program } = makeProgram(userKp);
  const ata = await getOrCreateAssociatedTokenAccount(program.provider.connection, userKp, USDC, userKp.publicKey);
  await program.methods
    .stake(outcome, new BN(amount))
    .accounts({
      user: userKp.publicKey, market: marketPda, membership: pda.member(communityPda, userKp.publicKey),
      stake: pda.stake(marketPda, userKp.publicKey), userTokenAccount: ata.address, vault: pda.vault(marketPda),
      tokenProgram: TOKEN_PROGRAM_ID, systemProgram: SystemProgram.programId,
    })
    .rpc();
  return ata.address;
}

async function main() {
  const keeper = loadKeypair("keys/keeper-devnet.json");
  const { program, connection } = makeProgram(keeper);
  console.log("Keeper:", keeper.publicKey.toBase58());

  // Second staker B — fund SOL + test-USDC + membership.
  const B = Keypair.generate();
  console.log("Staker B:", B.publicKey.toBase58());
  {
    const tx = new Transaction().add(
      SystemProgram.transfer({ fromPubkey: keeper.publicKey, toPubkey: B.publicKey, lamports: 0.25 * LAMPORTS_PER_SOL })
    );
    await sendAndConfirmTransaction(connection, tx, [keeper]);
  }
  const bAta = await getOrCreateAssociatedTokenAccount(connection, keeper, USDC, B.publicKey);
  await mintTo(connection, keeper, USDC, bAta.address, keeper, 200_000_000); // 200 USDC to B
  const keeperAta = await getOrCreateAssociatedTokenAccount(connection, keeper, USDC, keeper.publicKey);

  // ============ SCENARIO 1: winner + proportional claim ============
  console.log("\n--- Scenario 1: settle-with-winner + claim ---");
  const com1 = await ensureCommunity(program, keeper, 100, "Lifecycle A");
  const m1 = await createMarket(program, keeper, com1, 18218149, now() + 70, now() + 70);
  // B joins.
  const { program: pB } = makeProgram(B);
  await pB.methods.joinCommunity().accounts({ user: B.publicKey, community: com1, membership: pda.member(com1, B.publicKey), systemProgram: SystemProgram.programId }).rpc();
  // A(keeper) YES 50 ; B NO 30.
  await stake(keeper, m1, com1, true, 50_000_000);
  await stake(B, m1, com1, false, 30_000_000);
  const m1a = await (program.account as any).market.fetch(m1);
  check("pool accumulated", m1a.totalYes.toNumber() === 50_000_000 && m1a.totalNo.toNumber() === 30_000_000, `yes=${m1a.totalYes} no=${m1a.totalNo}`);

  console.log("waiting for expected_settle_after…");
  await sleep(72_000);
  // Keeper-attested settle: YES wins. timestamp = now (>= esa).
  await program.methods
    .settle(true, { fixtureId: new BN(18218149), timestamp: new BN(now()), seq: new BN(1087), proofHash: Array(32).fill(7) })
    .accounts({ keeper: keeper.publicKey, config: pda.config(), market: m1 })
    .rpc();
  const m1b = await (program.account as any).market.fetch(m1);
  check("market Settled", Object.keys(m1b.state)[0] === "settled", `state=${Object.keys(m1b.state)[0]}`);
  check("winner = YES", m1b.winningOutcome === true);

  // A claims — should receive whole pool (only YES staker): 50 -> 80.
  const before = Number((await getAccount(connection, keeperAta.address)).amount);
  await program.methods.claim().accounts({ user: keeper.publicKey, market: m1, stake: pda.stake(m1, keeper.publicKey), userTokenAccount: keeperAta.address, vault: pda.vault(m1), tokenProgram: TOKEN_PROGRAM_ID }).rpc();
  const after = Number((await getAccount(connection, keeperAta.address)).amount);
  check("claim payout = whole pool (80 USDC)", after - before === 80_000_000, `delta=${(after - before) / 1e6}`);
  // Double-claim must fail.
  let dbl = false;
  try { await program.methods.claim().accounts({ user: keeper.publicKey, market: m1, stake: pda.stake(m1, keeper.publicKey), userTokenAccount: keeperAta.address, vault: pda.vault(m1), tokenProgram: TOKEN_PROGRAM_ID }).rpc(); dbl = true; } catch {}
  check("double-claim rejected", !dbl);
  // Loser B claim must fail.
  let loser = false;
  try { await pB.methods.claim().accounts({ user: B.publicKey, market: m1, stake: pda.stake(m1, B.publicKey), userTokenAccount: bAta.address, vault: pda.vault(m1), tokenProgram: TOKEN_PROGRAM_ID }).rpc(); loser = true; } catch {}
  check("loser claim rejected", !loser);

  // ============ SCENARIO 2: zero-winner -> Refundable -> emergency_refund ============
  console.log("\n--- Scenario 2: zero-winner refund ---");
  const com2 = await ensureCommunity(program, keeper, 101, "Lifecycle B");
  const m2 = await createMarket(program, keeper, com2, 18209181, now() + 40, now() + 40);
  await stake(keeper, m2, com2, false, 40_000_000); // only NO
  console.log("waiting…");
  await sleep(42_000);
  // Keeper settles YES -> total_yes == 0 -> Refundable.
  await program.methods
    .settle(true, { fixtureId: new BN(18209181), timestamp: new BN(now()), seq: new BN(1114), proofHash: Array(32).fill(9) })
    .accounts({ keeper: keeper.publicKey, config: pda.config(), market: m2 })
    .rpc();
  const m2a = await (program.account as any).market.fetch(m2);
  check("market Refundable (zero winner)", Object.keys(m2a.state)[0] === "refundable", `state=${Object.keys(m2a.state)[0]}`);
  const rb = Number((await getAccount(connection, keeperAta.address)).amount);
  await program.methods.emergencyRefund().accounts({ user: keeper.publicKey, market: m2, stake: pda.stake(m2, keeper.publicKey), userTokenAccount: keeperAta.address, vault: pda.vault(m2), tokenProgram: TOKEN_PROGRAM_ID }).rpc();
  const ra = Number((await getAccount(connection, keeperAta.address)).amount);
  check("refund returns 100% of stake (40 USDC)", ra - rb === 40_000_000, `delta=${(ra - rb) / 1e6}`);

  console.log(`\n==== ${pass} passed, ${fail} failed ====`);
  process.exit(fail === 0 ? 0 : 1);
}

main().catch((e) => { console.error(e); process.exit(1); });
