// Preder keeper (keeper-attested settlement, spec §7 + §1.4 poin 7).
// Watches TxLINE for match finalisation, fetches the Merkle proof, evaluates the market's
// predicate off-chain, and submits settle() on-chain. Runs the SSE reactive path AND a
// reconciliation loop (catches finalisation events missed during downtime).
//
// Auth comes from scripts/preder-auth.json (written by provision_min.ts): { jwt, apiToken }.
// Run: cd scripts && npm run keeper
import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { createHash } from "crypto";
import axios from "axios";
import * as fs from "fs";
import * as path from "path";
import { makeProgram, loadKeypair, pda } from "./preder";

const API = "https://txline-dev.txodds.com/api";
const KEYPAIR = process.env.ANCHOR_WALLET || "keys/keeper-devnet.json";
const AUTH_PATH = path.resolve(__dirname, "../preder-auth.json");
const LAST_EVENT_PATH = path.resolve(__dirname, "../.last-event-id");
const RECONCILE_MS = 60_000;

type Auth = { jwt: string; apiToken: string };
function loadAuth(): Auth {
  if (!fs.existsSync(AUTH_PATH)) throw new Error(`Missing ${AUTH_PATH} — run provision_min.ts first.`);
  return JSON.parse(fs.readFileSync(AUTH_PATH, "utf8"));
}
let auth = loadAuth();

async function renewJwt(): Promise<void> {
  // Guest JWT can expire on a different cycle than the API token (spec §2, 401-handling).
  const r = await axios.post("https://txline-dev.txodds.com/auth/guest/start");
  auth.jwt = r.data.token;
  fs.writeFileSync(AUTH_PATH, JSON.stringify(auth, null, 2));
  console.log("[auth] renewed guest JWT");
}

function headers() {
  return { Authorization: `Bearer ${auth.jwt}`, "X-Api-Token": auth.apiToken };
}

async function apiGet(url: string): Promise<any> {
  try {
    return (await axios.get(`${API}${url}`, { headers: headers() })).data;
  } catch (e: any) {
    if (e.response?.status === 401) {
      await renewJwt();
      return (await axios.get(`${API}${url}`, { headers: headers() })).data;
    }
    throw e;
  }
}

// The ONLY correct settlement trigger (spec §3 / memory §3): triple condition, confirmed only.
function isFinalised(ev: any): boolean {
  const action = ev.Action ?? ev.action;
  const statusId = ev.StatusId ?? ev.statusId;
  const period = ev.Period ?? ev.period;
  const confirmed = ev.Confirmed ?? ev.confirmed;
  return action === "game_finalised" && Number(statusId) === 100 && Number(period) === 100 && confirmed === true;
}

// Read final confirmed goals from a game_finalised record.
// Verified against the real devnet payload: Score.Participant{1,2}.Total.Goals (Participant1 = home
// when Participant1IsHome). Missing Goals means 0 (feed omits zero-value stats).
function finalGoals(record: any): { home: number; away: number } | null {
  const s = record?.Score ?? record?.score;
  if (!s) return null;
  const p1 = s.Participant1 ?? s.participant1;
  const p2 = s.Participant2 ?? s.participant2;
  if (!p1 || !p2) return null;
  const home = p1.Total?.Goals ?? 0;
  const away = p2.Total?.Goals ?? 0;
  return { home, away };
}

// Evaluate the market's YES predicate from its on-chain legs against final goals.
// MVP: single binary leg (goals[0]-goals[1]) vs threshold. Extend for multi-leg as needed.
function evalYes(market: any, goals: { home: number; away: number }): boolean {
  const leg = market.yesLegs[0];
  const lhs = leg.kind === 1 ? (goals.home - goals.away) : goals.home; // Subtract op assumed for binary
  const t = leg.threshold;
  switch (leg.comparison) {
    case 0: return lhs > t;   // GreaterThan
    case 1: return lhs < t;   // LessThan
    case 2: return lhs === t; // EqualTo
    default: return false;
  }
}

async function fetchProofV3(fixtureId: number, seq: number, statKeys = "1002,1007") {
  return apiGet(`/scores/stat-validation-v3?fixtureId=${fixtureId}&seq=${seq}&statKeys=${statKeys}`);
}

function hashProof(proof: any): number[] {
  const h = createHash("sha256").update(JSON.stringify(proof)).digest();
  return Array.from(h);
}

async function settleMarket(program: anchor.Program, keeper: PublicKey, marketPda: PublicKey, market: any) {
  const fixtureId = Number(market.fixtureId);
  // Get a real, final score record + its seq.
  const snap = await apiGet(`/scores/snapshot/${fixtureId}`);
  const rows: any[] = Array.isArray(snap) ? snap : snap?.data ?? [];
  const finalRec = rows.find(isFinalised) ?? rows.find((r) => (r.Action ?? r.action) === "game_finalised");
  if (!finalRec) { console.log(`[settle] fixture ${fixtureId}: no game_finalised record yet`); return; }
  const goals = finalGoals(finalRec);
  if (!goals) { console.log(`[settle] fixture ${fixtureId}: could not parse final goals`); return; }
  const seq = Number(finalRec.Seq ?? finalRec.seq);

  const claimedOutcome = evalYes(market, goals);
  const proof = await fetchProofV3(fixtureId, seq);
  const proofHash = hashProof(proof);
  const timestamp = Number(proof?.summary?.updateStats?.minTimestamp ?? Date.now());

  await program.methods
    .settle(claimedOutcome, {
      fixtureId: new anchor.BN(fixtureId),
      timestamp: new anchor.BN(Math.floor(timestamp / 1000)),
      seq: new anchor.BN(seq),
      proofHash,
    })
    .accounts({ keeper, config: pda.config(), market: marketPda })
    .rpc();
  console.log(`[settle] fixture ${fixtureId} -> ${goals.home}-${goals.away}, YES=${claimedOutcome}. Settled.`);
}

// Reconciliation: scan Open markets past expected_settle_after, settle any that are final.
async function reconcile(program: anchor.Program, keeper: PublicKey) {
  const now = Math.floor(Date.now() / 1000);
  const all = await (program.account as any).market.all();
  for (const m of all) {
    const market = m.account;
    const isOpen = market.state.open !== undefined; // anchor enum -> { open: {} }
    if (!isOpen) continue;
    if (now <= Number(market.expectedSettleAfter)) continue;
    try {
      await settleMarket(program, keeper, m.publicKey, market);
    } catch (e: any) {
      console.error(`[reconcile] ${m.publicKey.toBase58()}:`, e.message || e);
    }
  }
}

async function main() {
  const keeper = loadKeypair(KEYPAIR);
  const { program } = makeProgram(keeper);
  console.log("Keeper:", keeper.publicKey.toBase58());

  // Reactive SSE path + periodic reconciliation. (SSE wiring uses eventsource; reconciliation
  // is the safety net that guarantees settlement even if the stream is missed — spec §2.)
  await reconcile(program, keeper.publicKey);
  if (process.env.ONCE) { console.log("ONCE mode: reconcile complete, exiting."); process.exit(0); }
  setInterval(() => reconcile(program, keeper.publicKey).catch((e) => console.error(e)), RECONCILE_MS);
  console.log(`Reconciliation loop every ${RECONCILE_MS / 1000}s. (SSE reactive path: attach eventsource to ${API}/scores/stream with Last-Event-ID from ${LAST_EVENT_PATH}.)`);
}

main().catch((e) => { console.error(e); process.exit(1); });
