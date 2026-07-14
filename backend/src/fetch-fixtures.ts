// Inspect the live TxLINE World Cup fixtures (competitionId 72) using the activated auth.
import axios from "axios";
import * as fs from "fs";
import * as path from "path";

const API = "https://txline-dev.txodds.com/api";
const auth = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../preder-auth.json"), "utf8"));

(async () => {
  const res = await axios.get(`${API}/fixtures/snapshot?competitionId=72`, {
    headers: { Authorization: `Bearer ${auth.jwt}`, "X-Api-Token": auth.apiToken },
  });
  const rows: any[] = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
  console.log("live fixtures (competitionId 72):", rows.length);
  console.log(JSON.stringify(rows, null, 2).slice(0, 4000));
})().catch((e) => { console.error(e.response?.status, e.response?.data || e.message); process.exit(1); });
