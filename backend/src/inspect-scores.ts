// Inspect scores + finalisation status + V3 proof availability for given fixtures.
import axios from "axios";
import * as fs from "fs";
import * as path from "path";

const API = "https://txline-dev.txodds.com/api";
const auth = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../preder-auth.json"), "utf8"));
const H = { Authorization: `Bearer ${auth.jwt}`, "X-Api-Token": auth.apiToken };

const FIXTURES = [18218149, 18209181, 18175981, 18237038, 18241006];

async function get(url: string) {
  const r = await axios.get(`${API}${url}`, { headers: H });
  return r.data;
}

(async () => {
  for (const f of FIXTURES) {
    try {
      const snap = await get(`/scores/snapshot/${f}`);
      const rows: any[] = Array.isArray(snap) ? snap : snap?.data ?? [];
      const actions = rows.map((r) => r.Action ?? r.action);
      const finalRec = rows.find((r) => (r.Action ?? r.action) === "game_finalised");
      console.log(`\n=== fixture ${f} === rows:${rows.length} actions:[${[...new Set(actions)].join(",")}]`);
      if (finalRec) {
        console.log("  game_finalised:", JSON.stringify({
          seq: finalRec.Seq ?? finalRec.seq,
          statusId: finalRec.StatusId ?? finalRec.statusId,
          period: finalRec.Period ?? finalRec.period,
          confirmed: finalRec.Confirmed ?? finalRec.confirmed,
          score: finalRec.Score ?? finalRec.score,
        }));
        const seq = finalRec.Seq ?? finalRec.seq;
        try {
          const proof = await get(`/scores/stat-validation-v3?fixtureId=${f}&seq=${seq}&statKeys=1002,1007`);
          console.log("  V3 proof OK — keys:", Object.keys(proof).join(","));
        } catch (e: any) {
          console.log("  V3 proof ERR:", e.response?.status, JSON.stringify(e.response?.data)?.slice(0, 120));
        }
      }
    } catch (e: any) {
      console.log(`\n=== fixture ${f} === ERR`, e.response?.status, JSON.stringify(e.response?.data)?.slice(0, 120));
    }
  }
})().catch((e) => { console.error(e); process.exit(1); });
