import { makeProgram, loadKeypair, pda } from "./preder";
import { PublicKey } from "@solana/web3.js";
(async () => {
  const { program } = makeProgram(loadKeypair("keys/keeper-devnet.json"));
  const m = await (program.account as any).market.fetch(new PublicKey("2PEoCzPsB6CaL7bH6XdhMkLgXRb9Mn8gMSddTsitYNMM"));
  console.log("state:", Object.keys(m.state)[0]);
  console.log("winningOutcome:", m.winningOutcome);
  console.log("settleSeq:", m.settleSeq.toString());
  console.log("settleTimestamp:", m.settleTimestamp.toString(), "->", new Date(Number(m.settleTimestamp) * 1000).toISOString());
  console.log("settledAt:", m.settledAt.toString());
  console.log("settleProofHash:", "0x" + Buffer.from(m.settleProofHash).toString("hex"));
})().then(() => process.exit(0), (e) => { console.error(e); process.exit(1); });
