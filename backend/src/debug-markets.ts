import { makeProgram, loadKeypair } from "./preder";
const now = Math.floor(Date.now() / 1000);
(async () => {
  const { program } = makeProgram(loadKeypair("keys/keeper-devnet.json"));
  const rows = await (program.account as any).market.all();
  console.log("now:", now, "| markets:", rows.length);
  for (const r of rows) {
    const a = r.account;
    const stateKey = Object.keys(a.state)[0];
    const esa = Number(a.expectedSettleAfter);
    console.log({
      market: r.publicKey.toBase58().slice(0, 8),
      fixture: a.fixtureId.toString(),
      state: stateKey,
      isOpen: a.state.open !== undefined,
      expectedSettleAfter: esa,
      past: now > esa,
      totalYes: a.totalYes.toString(),
      totalNo: a.totalNo.toString(),
    });
  }
})().then(() => process.exit(0), (e) => { console.error(e); process.exit(1); });
