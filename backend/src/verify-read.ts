import { makeProgram, loadKeypair } from "./preder";
(async () => {
  const { program } = makeProgram(loadKeypair("keys/keeper-devnet.json"));
  const communities = await (program.account as any).community.all();
  const markets = await (program.account as any).market.all();
  console.log("communities on-chain:", communities.length);
  communities.forEach((c: any) =>
    console.log("  -", c.account.name, "| members", c.account.memberCount.toString(), "| markets", c.account.marketCount.toString())
  );
  console.log("markets on-chain:", markets.length);
  markets.forEach((m: any) =>
    console.log("  - fixture", m.account.fixtureId.toString(), "| state", Object.keys(m.account.state)[0], "| min", m.account.minStake.toString())
  );
})().then(() => process.exit(0), (e) => { console.error(e); process.exit(1); });
