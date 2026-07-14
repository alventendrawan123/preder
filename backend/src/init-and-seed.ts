// One-shot: initialize Config + create a demo test-USDC mint + seed communities & markets.
// Run once the keeper wallet has devnet SOL:
//   cd scripts && npm i && npm run init-seed
import * as anchor from "@coral-xyz/anchor";
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY, Keypair } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, createMint, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import { BN } from "bn.js";
import * as fs from "fs";
import * as path from "path";
import { makeProgram, loadKeypair, pda, binary, single, Leg } from "./preder";

const KEYPAIR = process.env.ANCHOR_WALLET || "keys/keeper-devnet.json";
const now = () => Math.floor(Date.now() / 1000);

async function main() {
  const keeper = loadKeypair(KEYPAIR);
  const { program, connection } = makeProgram(keeper);
  console.log("Admin/Keeper:", keeper.publicKey.toBase58());
  const bal = await connection.getBalance(keeper.publicKey);
  console.log("Balance:", bal / 1e9, "SOL");
  if (bal < 0.2e9) throw new Error("Fund the keeper wallet with devnet SOL first (>=0.3 SOL).");

  // 1) Config (admin = keeper = same wallet for MVP automation).
  const configPda = pda.config();
  try {
    await (program.account as any).config.fetch(configPda);
    console.log("Config already initialized:", configPda.toBase58());
  } catch {
    await program.methods
      .initializeConfig(keeper.publicKey)
      .accounts({ admin: keeper.publicKey, config: configPda, systemProgram: SystemProgram.programId })
      .rpc();
    console.log("Config initialized:", configPda.toBase58());
  }

  // 2) Demo test-USDC mint (6 decimals) controlled by the keeper.
  const usdcMint = await createMint(connection, keeper, keeper.publicKey, null, 6);
  console.log("Test USDC mint:", usdcMint.toBase58());
  // Fund the keeper's own token account (for a self-stake demo later).
  const keeperAta = await getOrCreateAssociatedTokenAccount(connection, keeper, usdcMint, keeper.publicKey);
  await mintTo(connection, keeper, usdcMint, keeperAta.address, keeper, 1_000_000_000); // 1000 USDC
  console.log("Minted 1000 test-USDC to keeper ATA:", keeperAta.address.toBase58());

  // 3) Communities + markets.
  const out: any = { programId: program.programId.toBase58(), config: configPda.toBase58(), usdcMint: usdcMint.toBase58(), communities: [] };

  const communities = [
    { id: 1, name: "Global Picks", desc: "Neutral degens. Every match, every angle." },
    { id: 2, name: "Selecao Street", desc: "Brazil-first fan pool. Bold calls." },
  ];

  // match_winner: yes = P1-P2 > 0 ; no = P1-P2 < 1 (draw/away). (semantics illustrative — keeper-attested settle.)
  const yesLegs: Leg[] = [binary(0, 1, 1, 0, 0)]; // (goals[0]-goals[1]) GreaterThan 0
  const noLegs: Leg[] = [binary(0, 1, 1, 1, 1)]; // (goals[0]-goals[1]) LessThan 1

  const fixtures = [18218149, 18209181];

  for (let ci = 0; ci < communities.length; ci++) {
    const c = communities[ci];
    const communityPda = pda.community(keeper.publicKey, c.id);
    const membershipPda = pda.member(communityPda, keeper.publicKey);
    try {
      await (program.account as any).community.fetch(communityPda);
      console.log(`Community ${c.id} exists:`, communityPda.toBase58());
    } catch {
      await program.methods
        .createCommunity(new BN(c.id), c.name, c.desc, "")
        .accounts({ creator: keeper.publicKey, community: communityPda, membership: membershipPda, systemProgram: SystemProgram.programId })
        .rpc();
      console.log(`Community ${c.id} created:`, communityPda.toBase58());
    }

    const fixtureId = fixtures[ci];
    const marketPda = pda.market(communityPda, fixtureId, 0);
    const vaultPda = pda.vault(marketPda);
    let created = true;
    try {
      await (program.account as any).market.fetch(marketPda);
      console.log(`Market for fixture ${fixtureId} exists:`, marketPda.toBase58());
    } catch {
      await program.methods
        .createMarket(new BN(fixtureId), yesLegs, noLegs, new BN(now() + 7200), new BN(now() + 14400), new BN(1_000_000))
        .accounts({
          creator: keeper.publicKey,
          community: communityPda,
          market: marketPda,
          usdcMint,
          vault: vaultPda,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY,
        })
        .rpc();
      console.log(`Market for fixture ${fixtureId} created:`, marketPda.toBase58());
    }

    out.communities.push({
      id: c.id, name: c.name, pda: communityPda.toBase58(),
      market: { fixtureId, pda: marketPda.toBase58(), vault: vaultPda.toBase58() },
    });
  }

  // Persist addresses for the frontend + keeper.
  const write = (p: string) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, JSON.stringify(out, null, 2)); };
  write(path.resolve(__dirname, "../deployed.json"));
  write(path.resolve(__dirname, "../../frontend/lib/deployed.json"));
  console.log("\nSaved deployed.json (scripts/ + web/lib/). Done.");
}

main().then(() => process.exit(0), (e) => { console.error(e); process.exit(1); });
