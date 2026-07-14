// Shared Preder on-chain client (Node). Uses @coral-xyz/anchor 0.29 (legacy IDL).
import * as anchor from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import * as fs from "fs";
import * as path from "path";
import idl from "../../idl/preder.json";

export const PROGRAM_ID = new PublicKey("xa2YjaE4f8qyae8crkfDQZV7KiwzQMSBcx56jeanyHi");
export const DEVNET_RPC = process.env.ANCHOR_PROVIDER_URL || "https://api.devnet.solana.com";

// Text seeds — must match programs/preder/src/lib.rs exactly.
const enc = (s: string) => Buffer.from(s, "utf8");
const u64le = (n: number | bigint) => {
  const b = Buffer.alloc(8);
  b.writeBigUInt64LE(BigInt(n));
  return b;
};

export const pda = {
  config: () => PublicKey.findProgramAddressSync([enc("config")], PROGRAM_ID)[0],
  community: (creator: PublicKey, id: number | bigint) =>
    PublicKey.findProgramAddressSync([enc("community"), creator.toBuffer(), u64le(id)], PROGRAM_ID)[0],
  member: (community: PublicKey, user: PublicKey) =>
    PublicKey.findProgramAddressSync([enc("member"), community.toBuffer(), user.toBuffer()], PROGRAM_ID)[0],
  market: (community: PublicKey, fixtureId: number | bigint, nonce: number | bigint) =>
    PublicKey.findProgramAddressSync(
      [enc("market"), community.toBuffer(), u64le(fixtureId), u64le(nonce)],
      PROGRAM_ID
    )[0],
  stake: (market: PublicKey, user: PublicKey) =>
    PublicKey.findProgramAddressSync([enc("stake"), market.toBuffer(), user.toBuffer()], PROGRAM_ID)[0],
  vault: (market: PublicKey) =>
    PublicKey.findProgramAddressSync([enc("vault"), market.toBuffer()], PROGRAM_ID)[0],
};

export function loadKeypair(p: string): Keypair {
  const abs = path.isAbsolute(p) ? p : path.resolve(__dirname, "../../", p);
  return Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync(abs, "utf8"))));
}

export function makeProgram(wallet: Keypair) {
  const connection = new Connection(DEVNET_RPC, "confirmed");
  const provider = new anchor.AnchorProvider(connection, new anchor.Wallet(wallet), {
    commitment: "confirmed",
  });
  anchor.setProvider(provider);
  // 0.29-style constructor: (idl, programId, provider)
  const program = new anchor.Program(idl as anchor.Idl, PROGRAM_ID, provider);
  return { program, provider, connection };
}

// StatPredicateLeg builder (matches on-chain u8 encoding).
export type Leg = { kind: number; indexA: number; indexB: number; op: number; threshold: number; comparison: number };
export const single = (index: number, threshold: number, cmp: number): Leg => ({
  kind: 0, indexA: index, indexB: 0, op: 0, threshold, comparison: cmp,
});
export const binary = (a: number, b: number, op: number, threshold: number, cmp: number): Leg => ({
  kind: 1, indexA: a, indexB: b, op, threshold, comparison: cmp,
});
// comparison: 0=GT 1=LT 2=EQ ; op: 0=Add 1=Subtract
