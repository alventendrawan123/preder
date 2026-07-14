// Server-side TxLINE client (backend proxy, spec §3). Holds the API token + a refreshable guest
// JWT, retries once on 401/403 by renewing the JWT. Small in-memory TTL cache for snapshots.
const BASE = process.env.TXLINE_API_BASE || "https://txline-dev.txodds.com";
const API = `${BASE}/api`;
const JWT_URL = `${BASE}/auth/guest/start`;

let jwt = process.env.TXLINE_JWT || "";
const apiToken = process.env.TXLINE_API_TOKEN || "";

async function renewJwt(): Promise<void> {
  const r = await fetch(JWT_URL, { method: "POST" });
  if (!r.ok) throw new Error(`guest JWT renew failed: ${r.status}`);
  jwt = (await r.json()).token;
}

export async function txlineGet(pathAndQuery: string): Promise<any> {
  if (!apiToken) throw new Error("TXLINE_API_TOKEN not configured");
  const hit = () =>
    fetch(`${API}${pathAndQuery}`, {
      headers: { Authorization: `Bearer ${jwt}`, "X-Api-Token": apiToken },
      cache: "no-store",
    });
  let res = await hit();
  if (res.status === 401 || res.status === 403) {
    await renewJwt();
    res = await hit();
  }
  if (!res.ok) throw new Error(`TxLINE ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return res.json();
}

const cache = new Map<string, { t: number; v: any }>();
export async function txlineGetCached(pathAndQuery: string, ttlMs = 15_000): Promise<any> {
  const c = cache.get(pathAndQuery);
  const now = Date.now();
  if (c && now - c.t < ttlMs) return c.v;
  const v = await txlineGet(pathAndQuery);
  cache.set(pathAndQuery, { t: now, v });
  return v;
}

// Find the game_finalised record (triple-condition confirmed, spec §3) for a fixture.
export function findFinalised(rows: any[]): any | null {
  const strict = rows.find(
    (r) =>
      (r.Action ?? r.action) === "game_finalised" &&
      Number(r.StatusId ?? r.statusId) === 100 &&
      Number(r.Period ?? r.period) === 100
  );
  return strict ?? rows.find((r) => (r.Action ?? r.action) === "game_finalised") ?? null;
}
