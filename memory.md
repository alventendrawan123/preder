# TxODDS World Cup Hackathon — Research Memory

Last updated: 2026-07-12 (day ~7 of 8 remaining before submission close)

---

## 1. Hackathon overview

- **Host:** Superteam Earn (Solana ecosystem) · **Partner/sponsor:** TxODDS
- **Listing:** https://superteam.fun/earn/hackathon/world-cup
- **Total pool:** $50,000 USDT across 3 tracks
- **Timeline:**
  - Submissions open: June 24, 2026, 15:00 UTC
  - Submissions close: **July 19, 2026, 23:59 UTC**
  - Winner announcement: July 29, 2026, 15:00 UTC
- **Data access:** Free, direct access to live World Cup match feeds (all 104 games). TxODDS is waiving all commercial data fees and the token payment requirement for this event.
- **Eligibility:** Individuals, teams (max 3 members), and AI agents — BUT submission must be owned by a real person/team/entity eligible to receive prizes via Superteam Earn. ⚠️ One community member flagged: Hackathon T&C §5.1 reportedly says entries must be human-created/submitted and may be DQ'd if "materially controlled by agents" — unresolved tension with "AI agents welcome" framing. Don't submit something purely agent-controlled without a clear human owner.
- **No formal "enter" step** — just submit directly on Superteam Earn when ready.
- **Submitting to multiple tracks:** allowed to enter all 3, but "doesn't mean you can win all tracks" (Alex, unconfirmed exact policy on same product across multiple tracks).
- **Edits after submission:** likely allowed before deadline ("I think so" — Alex, not 100% firm).
- **Currency to use in-product (SOL/USDC/USDT):** asked by a user in Discord, **never answered**. Open question.
- **"Ideas to get started" in each track listing are partly AI/marketing-generated**, not gospel — TxODDS team explicitly said they're open to any direction, "pursue any avenue truly without fear of significant collision."
- Only World Cup data should be used — no other datasets (intentional; may open other leagues/sports post-WC, no ETA).

---

## 2. The three tracks

| Track | Prize (1st/2nd/3rd) | Submissions (LIVE, per section 32, 2026-07-13) | Listing URL |
|---|---|---|---|
| **Prediction Markets and Settlement** | $18,000 (12k/4k/2k) | 70 | https://superteam.fun/earn/listing/prediction-markets-and-settlement/ |
| **Trading Tools and Agents** | $16,000 (10k/4k/2k) | 58 | https://superteam.fun/earn/listing/trading-tools-and-agents/ |
| **Consumer and Fan Experiences** | $16,000 (10k/4k/2k) | 59 (smallest of the 3, but gap narrowed a lot since first snapshot) | not captured — URL not confirmed, don't guess it; same domain pattern as the other two rows |

(Original snapshot was 42/36/27 — superseded, kept here only as history. Counts will keep rising; re-check live before submission if timing allows.)

### Track: Prediction Markets and Settlement
- Open-ended backend structure. Two paths:
  - **Data-Driven Web3 Platforms** — use TxLINE's high-speed SSE stream to power frontend, trigger prediction resolutions.
  - **Experimental Verification Layer (optional, valued by judges)** — use TxLINE's Merkle proofs (scores validation primitive) to verify match data signatures; custom check gates/validation logic scored highly.
- **Architecture rules:**
  - No P2P asset transfers of the internal TxLINE credit token — that token is locked to data-authorization only, cannot be used for staking/wagering/wallet transfers by contestants.
  - Teams encouraged to build trustless P2P wagering pools, smart contract escrows, decentralized AMMs using **other coins (e.g. USDC)**, settled via TxLINE Merkle proofs.
  - Contracts should CPI (Cross-Program Invocation) into TxLINE's **`validate_stat`** instruction to confirm match outcomes trustlessly and auto-release funds.
- Ideas: Full-Tournament Auto-Market, Verifiable Resolution UI (show the Merkle proof receipt), Prediction Market Viewer (dashboard), Decentralized Prediction Markets & AMMs (escrow + keeper-triggered CPI settlement), Parametric Sports Insurance/Prop Bets (PDA collateral released on verified TxLINE proof).
- **Judging:** Core Functionality (data ingestion) · UX & Use Case · Code Quality & Logic (deterministic, well-documented).
- **Eligibility:** deployed (mainnet OR devnet), demo video + public repo, TxLINE as primary data source, working build (not concept/wireframe).

### Track: Trading Tools and Agents
- For builders who want autonomous agents operating on TxLINE's granular, fast feed.
- Ideas: **Sharp Movement Detector** (monitor odds every 60s, flag significant shifts, log + track prediction accuracy), **Agent vs Agent Arena** (two agents, same feed, opposite strategies, positions settle on-chain, better strategy wins over the tournament), **In-Play Market Maker** (quotes buy/sell on in-play outcomes, adjusts as match evolves).
- **Judging:** Core Functionality & Data Ingestion · **Autonomous Operation** (must run fully automated, no manual intervention once deployed) · Logic & Code Architecture (deterministic, defensible) · Innovation & Novelty · **Production Readiness** (could a real trading team/market operator deploy this).
- **Eligibility:** must be a running agent/tool (live or devnet) that ingests TxLINE feeds and executes a defined strategy. "Clear logic and a working system beats a polished demo with neither." Must integrate TxLINE as live input.

### Track: Consumer and Fan Experiences
- For builders targeting mainstream fans (phone-first).
- Ideas: **Group Sweepstake** (live leaderboard from TxLINE data), **AI Pundit Bot** (Telegram bot, alerts on goals/cards/odds shifts with explanation, bonus TTS), **Hi-Lo Stats Game** (guess if next stat is higher/lower, streak game, replayable across 104 games).
- **Judging:** Fan Accessibility & UX · Real-Time Responsiveness · Originality & Value Creation · Commercial/Monetization Path · Completeness & Execution.
- **Eligibility:** live product (mainnet or devnet) that works during a match, functional not mockup, must use TxLINE as live input AND sign up through Solana.

### Common submission requirements (all tracks)
- **Demo video, ≤5 minutes** (Loom/YouTube) — ABSOLUTE requirement to pass initial screening. **Heavily weighted** since matches end before judging — judges can't see live activity, so the video must clearly show the problem, live walkthrough, and how TxLINE powers the backend.
- **Public GitHub repo.**
- **Working deployed link** OR functional API/devnet endpoint for judges to test.
- **Brief technical documentation** — core idea, business/technical highlights, list of specific TxLINE endpoints used.
- **Feedback section** — team's experience using the TxLINE API (what worked, where friction was).
- Pitch decks / wireframes / mockups / non-working concepts = **automatic disqualification**.
- Post-close process: shortlist → live interview rounds → winner announcement → prize distribution + possible engineering/ecosystem support.

---

## 3. TxLINE technical facts (ground truth, from official Discord + docs)

### What TxLINE is
High-performance data layer: real-time sports scores + consensus betting odds, normalised JSON schema across competitions. Every data update is **cryptographically signed and anchored on Solana** — tamper-evident audit trail. Internal credit token is locked to data-authorization only (not usable for P2P wagering).

### Mandatory auth flow (this IS the "Solana interaction" requirement — not optional)
Confirmed sequence (corrected by community member "koocha", validated by TxODDS team):
1. **Get JWT** — `/auth/guest/start` (try via https://txline-dev.txodds.com/docs)
2. **Subscribe** to a Service Level — **Free tier = Level 1 on DevNet, Level 12 on MainNet** (different numbers per network!)
3. **Activate token** — sign a payload (containing the JWT) with your wallet keypair → `/token/activate` → returns API Token
4. **Every request** must include BOTH JWT and API Token, both valid

Example working command (from Alex｜TxLINE directly):
```
TOKEN_MINT_ADDRESS=4Zao8ocPhmMgq7PdsYWyxvqySMGx7xb9cMftPMkEokRG ANCHOR_PROVIDER_URL="https://api.devnet.solana.com" ANCHOR_WALLET="./_keys/testuser-wallet-1.json" ts-node examples/devnet/scripts/subscription_free_tier.ts
```
Run `yarn install` first. Wallet needs devnet SOL (faucet, free) for tx fees.

Reference repo (the primary support channel — team repeatedly redirects here): **https://github.com/txodds/tx-on-chain**
- `examples/devnet/` and `examples/mainnet/` — end-to-end flow scripts
- `examples/mainnet/scripts/historical_scores.ts` — historical data example (devnet equivalent exists too)

### DevNet vs MainNet — NOT mandatory to use mainnet
- **Official track listing text says "mainnet or devnet" is fine for ALL 3 tracks.**
- Alex explicit clarification when asked directly: *"I was not trying to set or update any rules. You can use devnet... There is certainly no risk of disqualification—I was just saying this thinking from the point of view of convenience and stability."*
- Why they recommend mainnet anyway: devnet is TxODDS's own testing ground → higher frequency of breaking changes + regression risk. Real incidents: feed outage on 2026-07-08 ("issue in the latest update, had to revert"), a data bug in an Argentina match.
- **DECISION MADE (this project): full devnet.** Free, no real SOL needed, officially sanctioned, zero DQ risk.
- ⚠️ Spec is actively changing mid-hackathon: `validate_stat_v3` + new endpoint `stat-validation-v3` announced ~July 9-10, reduces risk of hitting an MTU (transaction size) limit on the older `validate_stat`. IDL/types updated to **v1.5.6** as of ~July 11. **Check IDL version before building — don't hardcode against a stale spec.**

### Data quality gotchas — CRITICAL for any settlement/trigger logic

**Bug 1 — `StatusId: 100` can appear on non-terminal/transport events.**
Reported case: `{"Action":"disconnected","StatusId":100,"Confirmed":true}` fired while match clock was still running (91'). StatusId 100 = the `game_finalised` marker. TxODDS response: *"Agreed, will schedule a fix"* — status of the fix is unconfirmed/unknown as of last check.
→ **Mitigation: never trust `StatusId===100` alone. Filter on `Action === "game_finalised"` specifically** for any match-end / settlement trigger.

**Bug 2 — `Score.Total.Goals` (aggregate) can flicker without a confirmed goal.**
Reported: went 0→1→0 with no `Confirmed` goal/penalty_outcome action behind it. TxODDS response: *"expected behaviour with possible goals."*
→ **Golden rule (TxODDS's own words): "the confirmed stats encoded for compact blockchain representation are based on confirmed events only and should be used in preference."** Never trust the raw aggregate score field for anything that triggers money movement — use confirmed (`Confirmed: true`) events only.

**Full-time / settlement signal (confirmed correct pattern):**
Alex: *"If you want to settle on the final result, it is period/statusId=100 for game_finalised"* — combined with Bug 1, the correct check is: **`Action === "game_finalised"` AND `StatusId === 100`**, not StatusId alone.

**Player attribution requires `action_amend`.**
Goal/card events may NOT include `playerId` at first emission. A later `action_amend` message fills in full details (playerId + method of scoring). Must listen for amend events, not just the initial action, if player-level data matters.

**Lineups — efficient retrieval.**
Don't replay the whole stream from the start. Call **`/scores/snapshot`** — returns all last events by action for a given fixture in one call, including lineups.

**Position ID mapping (community-crowdsourced, NOT yet officially confirmed by TxODDS dev team as of last check):**
Under `unitId = 0`: **34 = GK, 35 = DEF, 36 = MID, 37 = FWD**. Reverse-engineered by cross-referencing 14 WC starting XIs against named players (evidence: 34 appears exactly once per XI and is always the keeper; counts sum to a clean 4-3-3, etc). Caveats from the finder: verified only on competitionId 72 (World Cup), male competitions; likely a coarse grouping — finer position codes might exist under other unitIds.

**Odds are ALSO independently verifiable on-chain (not just scores).**
Endpoint: `getApiOddsValidation` — https://txline-dev.txodds.com/docs/#/Odds/getApiOddsValidation. Relevant for Prediction Markets track if building something that needs to verify odds movement, not just match outcomes.

**Historical data 404 gotcha.**
A user got 404s on `/scores/historical` for a specific match — root cause: URL wasn't being interpolated (needs to be an f-string/template, not literal). Reportedly **the official API reference docs example has the same bug** (non-interpolated URL) — expect to hit this, fix by properly parameterizing the endpoint URL.

### Team / support
- **Alex｜TxLINE** — most active technical responder in Discord.
- **Edgar｜TxLINE [EMM]** — described as "the boss."
- Primary support = the GitHub examples repo; team redirects there constantly.
- **koocha** (community member) built an **open-source TypeScript SDK** for the soccer data, offered to share via DM (not yet publicly linked in the channel, pending TxODDS validation). Alex's response: "if there is an SDK of sorts and it works, who are we to say no." → **Worth DMing koocha** to potentially save integration time, but it's unofficial/unvetted.
- No dedicated channel yet for testing programs against each other (as of last check).

---

## 4. DreamTend reusability assessment (honest correction)

Initial claim ("DreamTend ~70% reusable for Trading Tools & Agents") was **overclaimed** and corrected after reading the actual DreamTend code (`D:\dreamtend`).

**What DreamTend actually is:** EVM (Somnia chain) trading bot using ethers.js, calling a specific DreamDEX `SpotPool` contract directly — `placeOrder(...)` with a 9-argument signature and an event topic hash empirically reverse-engineered from Somnia mainnet tx receipts (`safe-broadcast.ts`). Strategies (`MarketMakerStrategy`, `MomentumStrategy`) are deterministic (spread-based quoting, drift-threshold IOC firing) with a thin LLM meta-layer (`decision-engine.ts`, Ollama) that only picks from a 6-action enum — it does not make individual trade decisions.

**What does NOT transfer (0% code reuse):**
- Different chain entirely: DreamTend = EVM/ethers.js (Somnia); TxODDS = Solana (needs `@solana/web3.js`/Anchor).
- No equivalent "SpotPool" exists for sports odds — TxLINE gives a data feed + a verification program (`validate_stat`), not a ready-made exchange/orderbook to trade against. Building an actual market (AMM/escrow) means writing a new Solana program.
- The specific `placeOrder` ABI + event topic are 100% DreamDEX-specific.

**What DOES transfer (pattern/discipline, not code):**
- Simulate-before-broadcast discipline (avoid firing txs that will revert).
- `Strategy` base-class abstraction (start/stop/onTick/onWsEvent) for orchestrating multiple strategies.
- Threshold + cooldown trigger pattern (exactly the shape of "Sharp Movement Detector": monitor every 60s, flag significant shifts).
- Dry-run mode + metrics + structured logging discipline.

**Conclusion:** A TxODDS submission would be written mostly from scratch (new chain, new SDK), carrying over engineering discipline/shape from DreamTend, not code.

---

## 5. Open questions / unresolved

- [ ] What currency should the product use (SOL/USDC/USDT)? — asked in Discord, never answered. (Prize payout currency is separately confirmed as "stablecoin designated by TxODDS", but that's not the same as what currency the PRODUCT should use internally.)
- [x] ~~Exact policy on submitting the same product to multiple tracks.~~ **RESOLVED (section 27, official Hackathon T&C §8): can enter multiple tracks, but can win MAX ONE PRIZE TOTAL.**
- [x] ~~Whether AI-agent-built/controlled entries are eligible~~ **RESOLVED (section 27, official Hackathon T&C §5): entries must be human-created/developed/submitted. The PRODUCT can be an autonomous agent; the ACT OF SUBMITTING and core development must be human-driven. Do not automate the submission step itself.**
- [ ] Official confirmation of the position ID mapping (34/35/36/37).
- [ ] Status of the `StatusId: 100` transport-event bug fix (was "scheduled," not confirmed fixed).
- [ ] Exact SOL amount needed if going mainnet later (not needed now — full devnet decided).
- [ ] Whether to DM "koocha" for the community TS SDK.

## 6. Decisions made

- **Full devnet** for this project (confirmed allowed, zero DQ risk, saves real SOL).
- Track not yet chosen — still researching (as of this save).

## 7a. STANDING INSTRUCTION
Always save every TxODDS/TxLINE-related research finding to this file (D:\apple\txodds\memory.md), going forward, for every conversation.

## 8. TxLINE Quickstart docs — full read (https://txline.txodds.com/documentation/quickstart)

### Overview
Hybrid Solana on-chain + TxODDS off-chain system. Two access paths:
1. **Free World Cup tier** — no TxL purchase required, instant access to World Cup + International Friendlies data.
2. **Paid subscription path** — purchase TxL tokens, subscribe on-chain, activate API credentials.

### Network configuration table (verbatim)

| Environment | Program ID | TxL Mint | Guest Auth Host | API Base |
|---|---|---|---|---|
| **Mainnet** | `9ExbZjAapQww1vfcisDmrngPinHTEfpjYRWMunJgcKaA` | `Zhw9TVKp68a1QrftncMSd6ELXKDtpVMNuMGr1jNwdeL` | `https://txline.txodds.com/auth/guest/start` | `https://txline.txodds.com/api/` |
| **Devnet** | `6pW64gN1s2uqjHkn1unFeEjAwJkPGHoppGvS715wyP2J` | `4Zao8ocPhmMgq7PdsYWyxvqySMGx7xb9cMftPMkEokRG` | `https://txline-dev.txodds.com/auth/guest/start` | `https://txline-dev.txodds.com/api/` |

⚠️ Must pick ONE network and use it consistently across every step (matching IDL/program ID).

### Full flow (5 stages)

**1. Select network + init program** — exact code:
```typescript
import * as anchor from "@coral-xyz/anchor";
import type { Txoracle } from "./types/txoracle"; // Use the matching mainnet/devnet type
import txoracleIdl from "./idl/txoracle.json"; // Use the matching mainnet/devnet IDL
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import axios from "axios";
import nacl from "tweetnacl";

const NETWORK: "mainnet" | "devnet" = "mainnet";

const CONFIG = {
  mainnet: {
    rpcUrl: "https://api.mainnet-beta.solana.com",
    apiOrigin: "https://txline.txodds.com",
    programId: new PublicKey("9ExbZjAapQww1vfcisDmrngPinHTEfpjYRWMunJgcKaA"),
    txlTokenMint: new PublicKey("Zhw9TVKp68a1QrftncMSd6ELXKDtpVMNuMGr1jNwdeL"),
  },
  devnet: {
    rpcUrl: "https://api.devnet.solana.com",
    apiOrigin: "https://txline-dev.txodds.com",
    programId: new PublicKey("6pW64gN1s2uqjHkn1unFeEjAwJkPGHoppGvS715wyP2J"),
    txlTokenMint: new PublicKey("4Zao8ocPhmMgq7PdsYWyxvqySMGx7xb9cMftPMkEokRG"),
  },
} as const;

const { rpcUrl, apiOrigin, programId, txlTokenMint } = CONFIG[NETWORK];
const apiBaseUrl = `${apiOrigin}/api`;

const connection = new Connection(rpcUrl, "confirmed");
const provider = new anchor.AnchorProvider(connection, wallet, {
  commitment: "confirmed",
});
anchor.setProvider(provider);

const program = new anchor.Program<Txoracle>(
  txoracleIdl as Txoracle,
  provider
);

if (!program.programId.equals(programId)) {
  throw new Error(
    `Loaded IDL program ${program.programId.toBase58()} does not match ${NETWORK} program ${programId.toBase58()}`
  );
}
```
Note: `wallet` is assumed to already exist (Keypair or wallet adapter) — not shown in this snippet.

**2. Purchase TxL — OPTIONAL, skip if using free World Cup tier.** Two steps:

Step 1 — request quote:
```typescript
// Get guest JWT
const authResponse = await axios.post(`${apiOrigin}/auth/guest/start`);
const jwt = authResponse.data.token;

// Request purchase quote
const txlineAmount = 50; // Amount of TxL tokens to purchase

const quoteResponse = await fetch(`${apiBaseUrl}/guest/purchase/quote`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwt}`
  },
  body: JSON.stringify({
    buyerPubkey: wallet.publicKey.toBase58(),
    txlineAmount: txlineAmount
  })
});

const quoteData = await quoteResponse.json();
console.log(`Base Cost: ${quoteData.baseUsdtCost} USDT`);
console.log(`Premium Fee: ${quoteData.feeUsdtAmount} USDT`);
console.log(`Total: ${quoteData.totalUsdtCharged} USDT`);
```

Step 2 — deserialize/sign/broadcast:
```typescript
// Deserialize the transaction from the quote
const txBuffer = Buffer.from(quoteData.transactionBase64, "base64");
const transaction = anchor.web3.Transaction.from(txBuffer);

// Verify transaction safety locally (recommended)
// This ensures the transaction matches what you requested

// Sign the transaction with either a local Keypair or a wallet adapter
const signedTransaction =
  "secretKey" in wallet
    ? (transaction.partialSign(wallet), transaction)
    : await wallet.signTransaction(transaction);

// Broadcast to Solana
const txSignature = await connection.sendRawTransaction(signedTransaction.serialize(), {
  skipPreflight: false,
  preflightCommitment: "confirmed"
});

// Confirm transaction
await connection.confirmTransaction(txSignature, "confirmed");
console.log("Purchase successful:", txSignature);
```
Note: USDT funding required for paid path; Jupiter exchange can facilitate swaps. **Not needed for the free World Cup tier.**

**3. Subscribe on-chain** — derive PDAs first (shared by both subscription types):
```typescript
const [tokenTreasuryPda] = PublicKey.findProgramAddressSync(
  [Buffer.from("token_treasury_v2")],
  program.programId
);

const tokenTreasuryVault = getAssociatedTokenAddressSync(
  txlTokenMint,
  tokenTreasuryPda,
  true,
  TOKEN_2022_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID
);

const [pricingMatrixPda] = PublicKey.findProgramAddressSync(
  [Buffer.from("pricing_matrix")],
  program.programId
);

const userTokenAccount = getAssociatedTokenAddressSync(
  txlTokenMint,
  provider.wallet.publicKey,
  false,
  TOKEN_2022_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID
);
```

Then ONE of two subscribe calls:

**Standard subscription** (service level + duration, no custom leagues):
```typescript
const SERVICE_LEVEL_ID = 1;
const DURATION_WEEKS = 4;
const SELECTED_LEAGUES: number[] = []; // Standard bundle

const txSig = await program.methods
  .subscribe(SERVICE_LEVEL_ID, DURATION_WEEKS)
  .accounts({
    user: provider.wallet.publicKey,
    pricingMatrix: pricingMatrixPda,
    tokenMint: txlTokenMint,
    userTokenAccount,
    tokenTreasuryVault,
    tokenTreasuryPda,
    tokenProgram: TOKEN_2022_PROGRAM_ID,
    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    systemProgram: SystemProgram.programId,
  })
  .rpc();
```

**Custom leagues subscription** (pick specific league IDs):
```typescript
const SERVICE_LEVEL_ID = 3;
const DURATION_WEEKS = 4;
const SELECTED_LEAGUES = [500001]; // Your league IDs

const txSig = await program.methods
  .subscribe(SERVICE_LEVEL_ID, DURATION_WEEKS)
  .accounts({
    user: provider.wallet.publicKey,
    pricingMatrix: pricingMatrixPda,
    tokenMint: txlTokenMint,
    userTokenAccount,
    tokenTreasuryVault,
    tokenTreasuryPda,
    tokenProgram: TOKEN_2022_PROGRAM_ID,
    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    systemProgram: SystemProgram.programId,
  })
  .rpc();
```
⚠️ IMPORTANT (cross-checked with the free World Cup tier note from the hackathon listing): free World Cup access = Service Level **1** on DevNet, Service Level **12** on MainNet (per Discord, Alex｜TxLINE). The quickstart's generic example uses `SERVICE_LEVEL_ID = 1` for "Standard" and `= 3` for "Custom leagues" — these are illustrative, not necessarily the exact free-tier IDs. **Use Service Level 1 (devnet) for the hackathon free World Cup tier**, per Discord confirmation.

**4. Activate API token** (after on-chain subscribe tx confirms):
```typescript
// Get guest JWT
const authResponse = await axios.post(`${apiOrigin}/auth/guest/start`);
const jwt = authResponse.data.token;

// Sign the subscription transaction
const messageString = `${txSig}:${SELECTED_LEAGUES.join(",")}:${jwt}`;
const message = new TextEncoder().encode(messageString);

// For SELECTED_LEAGUES = [], this signs `${txSig}::${jwt}`.
async function signActivationMessage(message: Uint8Array): Promise<Uint8Array> {
  if ("signMessage" in wallet && wallet.signMessage) {
    return wallet.signMessage(message);
  }

  const localPayer = (provider.wallet as anchor.Wallet & {
    payer?: anchor.web3.Keypair;
  }).payer;

  if (localPayer) {
    return nacl.sign.detached(message, localPayer.secretKey);
  }

  throw new Error("Wallet must support signMessage, or run with a local Anchor payer.");
}

const signatureBytes = await signActivationMessage(message);
const walletSignature = Buffer.from(signatureBytes).toString("base64");

// Activate API access
const activationResponse = await axios.post(
  `${apiBaseUrl}/token/activate`,
  {
    txSig,
    walletSignature,
    leagues: SELECTED_LEAGUES,
  },
  { headers: { Authorization: `Bearer ${jwt}` } }
);

const apiToken = activationResponse.data.token || activationResponse.data;
```
Note the exact message format signed: `${txSig}:${SELECTED_LEAGUES.join(",")}:${jwt}` — for empty leagues array this becomes `${txSig}::${jwt}` (double colon, empty middle field).

**5. Credential usage for data requests** — TWO headers required on every request:
- **Guest JWT** → `Authorization: Bearer <jwt>` header (from `/auth/guest/start`, same network)
- **API Token** → `X-Api-Token` header (from `/api/token/activate`)

**Error handling:**
- `401` on data request → renew guest JWT (it expired)
- `403` on activation → verify wallet, signature, and network alignment (mismatched network = common cause)

### Additional resources linked from quickstart
- Complete API Reference documentation
- Subscription Tiers page (pricing/plan details)
- Runnable Devnet Examples (end-to-end integration samples — matches the `tx-on-chain` GitHub repo)
- Troubleshooting guide
- Full documentation index: `https://txline-docs.txodds.com/llms.txt`

### 🗺️ Discovery: the FULL docs site is much bigger than quickstart
`llms.txt` is an INDEX to the entire docs site, not a raw text dump. It revealed 5 major categories (not yet individually read in full — next research targets):
1. **Documentation** — onboarding + subscription flows (quickstart lives here), World Cup access tiers
2. **Odds Resources** — StablePrice data, coverage details, competition info across soccer leagues
3. **Scores Resources** — feeds for soccer, American football, basketball; schedule + encoding docs
4. **Solana Programs** — blockchain integration details, separate mainnet/devnet program addresses + validation accounts
5. **Examples** — snapshot fetching, event streaming, on-chain validation, devnet testing scripts, troubleshooting
- Plus: a full **OpenAPI spec (YAML)** for the REST API.

⚠️ Not yet read in full: Odds Resources, Scores Resources, Solana Programs, Examples, OpenAPI spec. Next research targets if continuing.

## 8a. Quickstart — additional callouts (from manually-pasted verbatim docs, supplements section 8)
- **Warning**: Do NOT activate a devnet transaction on `https://txline.txodds.com` (mainnet host), and do NOT activate a mainnet transaction on `https://txline-dev.txodds.com` (devnet host). `apiOrigin` must match the network used for the `subscribe` tx.
- **Note**: `wallet` variable = your signing wallet. Browser app → wallet adapter's pubkey/`signTransaction`/`signMessage`. Local Anchor script → `ANCHOR_WALLET` + `ANCHOR_PROVIDER_URL` env vars load the payer wallet.
- Runnable Devnet Examples (`/documentation/examples/devnet-examples`) include: free-tier activation, odds + scores streams, fixture validation, and **`validateStatV2`** examples (not just v1/legacy `validateStat`).
- TxODDS **may require KYC** for TxL purchases (paid path only, N/A for free World Cup tier) per compliance requirements.
- Full Next Steps links: API Reference (`/api-reference/authentication/start-a-new-guest-session`), Subscription Tiers, World Cup Free Tier, Runnable Devnet Examples, Troubleshooting.

## 9. Subscription Tiers (https://txline.txodds.com/documentation/subscription-tiers)

**Conversion rate: 1 USD = 1,000 TxL.** All subscriptions include Scores + StablePrice Odds.

### Mainnet tiers
| ID | Bundle | Delay | Price/28 Days |
|---|---|---|---|
| **1** | World Cup & Int Friendlies | 60 seconds | **Free** |
| **12** | World Cup & Int Friendlies | Real-time | **Free** |
| 2 | 10 Leagues | 60 seconds | 500,000 TxL ($500) |
| 3 | 25 Leagues | 60 seconds | 750,000 TxL ($750) |
| 4 | 50 Leagues | 60 seconds | 1,000,000 TxL ($1,000) |
| 5 | 100 Leagues | 60 seconds | 1,250,000 TxL ($1,250) |
| 6 | All Leagues | 60 seconds | 2,500,000 TxL ($2,500) |
| 7 | 10 Leagues | Real-time | 5,000,000 TxL ($5,000) |
| 8 | 25 Leagues | Real-time | 7,500,000 TxL ($7,500) |
| 9 | 50 Leagues | Real-time | 10,000,000 TxL ($10,000) |
| 10 | 100 Leagues | Real-time | 12,500,000 TxL ($12,500) |
| 11 | All Leagues | Real-time | 25,000,000 TxL ($25,000) |

### Devnet tiers
| ID | Bundle | Delay | Price/28 Days |
|---|---|---|---|
| **1** | World Cup & Int Friendlies | 0 seconds | **Free** |

- Subscriptions must be purchased in **multiples of 4 weeks (28 days)**, minimum term 4 weeks.
- Pricing can change; **active subscriptions honor terms at time of purchase**.
- Verify current pricing on-chain (code):
```typescript
const [pricingMatrixPda] = anchor.web3.PublicKey.findProgramAddressSync(
  [Buffer.from("pricing_matrix")],
  program.programId
);
const matrix = await program.account.pricingMatrix.fetch(pricingMatrixPda);
matrix.rows.forEach((row) => {
  console.log({
    serviceLevel: row.rowId,
    tokensPerWeek: row.pricePerWeekToken,
    samplingInterval: row.samplingIntervalSec,
    leagueBundle: row.leagueBundleId,
    marketBundle: row.marketBundleId
  });
});
```

## 10. World Cup Free Tier (https://txline.txodds.com/documentation/worldcup) — THE key page for this hackathon

- Free = no TxL payment. **Still need SOL** on selected network for tx fees + rent (devnet: request airdrop first).
- **Mainnet**: Service Level `1` = 60s delay, Service Level `12` = real-time.
- **Devnet**: Service Level `1` only; current row reports `samplingIntervalSec = 0` (i.e., devnet free tier is effectively real-time / no delay per the live pricing matrix).
- Historical replay: full access included.
- Prerequisites checklist: Solana wallet on selected network + SOL funded + matching TxLINE IDL/types + matching `apiOrigin`/`programId`.
- Install: `npm install @coral-xyz/anchor @solana/web3.js @solana/spl-token axios tweetnacl`
- ⚠️ **Runnable Devnet Examples require Node.js 20+** (because of the SSE client dependency in the lockfile).
- **Devnet config snippet sets `NETWORK: "mainnet" | "devnet" = "devnet"`** (confirms devnet is the documented default path for this guide, not an afterthought).
- Recommended devnet free-tier subscribe config:
```typescript
const SERVICE_LEVEL_ID = 1;  // Devnet: samplingIntervalSec = 0; mainnet: 60 seconds
// const SERVICE_LEVEL_ID = 12; // Mainnet real-time World Cup & Int Friendlies
const DURATION_WEEKS = 4;
const SELECTED_LEAGUES: number[] = [];
```
- Activation flow identical to quickstart (same JWT + signed message `${txSig}::${jwt}` + POST `/api/token/activate`).
- **Do not share your guest JWT or activated API token in public support channels** (explicit warning in docs).
- Available endpoints after activation: **Fixtures** (upcoming/current metadata), **Odds** (snapshots, historical, StablePrice stream), **Scores** (snapshots, historical, score event stream), **Validation Proofs** (fixture/odds/score proofs for on-chain validation).

### World Cup Free Tier FAQ (verbatim, accordion)
- **Renew free subscription?** Any duration in multiples of 4 weeks, up to 12 months. Re-subscribe when expired, no cost to renew.
- **Upgrade free → paid?** Yes, anytime, takes effect immediately.
- **Rate limit on free tier?** **No rate limits on API calls.** Mainnet L1 = 60s delay, L12 = real-time. Devnet L1 currently `samplingIntervalSec = 0`.
- **Need SOL for free tier?** Yes — no TxL needed, but SOL required for the on-chain subscribe tx + rent.
- **What if I don't renew?** API access expires; re-subscribe anytime to regain access.
- **Commercial use allowed on free tier?** **Yes.** (Recommend real-time paid tier for production UX, but commercial use of free tier is explicitly permitted.)

## 11. Odds — Overview (https://txline.txodds.com/documentation/odds)

- Powered by **Stable Price** — TxODDS' consensus pricing engine, published to Solana, every data point cryptographically verifiable on-chain (audit any price anytime, no intermediary).
- Aggregates lines across **global operators including sharp books absent from standard Western feeds**.
- **Defensive logic**: filters outliers, stale lines, bad data before reaching your app (de-margining + outlier filtering).
- Access: pay in TxL to unlock throughput tier, generate API key instantly — "entirely permissionless."
- Performance tiers named: **"Build tier"** = 60-second batch updates, **"Scale tier"** = sub-second real-time streams. (Maps to the delay column in Subscription Tiers: Build≈60s levels, Scale≈real-time levels.)

## 12. Odds — StablePrice Feed / coverage (https://txline.txodds.com/documentation/odds/stableprice-feed)

- **Soccer**: full supported-league list is a downloadable CSV: `https://txodds.github.io/tx-on-chain/assets/SoccerSupportedLeagues.csv`
- **NCAAB (College Basketball)**: competition ID `300043` (all NCAA Basketball conferences).
- **NCAAF (College Football)**: competition IDs `550001` (NCAA D-I FCS), `10005930` (NCAA Extra Matches), `500005` (NCAA D-I FBS), `10005302` (NCAA D-I Women's).
- ⚠️ **Don't assume a market exists** (both-teams-to-score, cards, corners, bookings, player props) unless it actually appears in the odds API response (`/api/odds/snapshot/{fixtureId}` or `/api/odds/updates/...`) for that specific fixture/network. Inspect the returned `SuperOddsType` + market params live — don't hardcode a market catalog.

## 13. Scores — Overview (https://txline.txodds.com/documentation/scores) — ⭐ CRITICAL for settlement logic

- Scores feed validated against **on-chain Merkle roots**. Covers soccer, US football, basketball. Deterministic stat-key encoding, batches with roots anchored on Solana.
- On-chain validation: legacy `validateStat` AND the newer **`validateStatV2`** (multi-stat strategy) — both have runnable devnet example scripts.

> **🔑 OFFICIAL SETTLEMENT RULE (resolves the Discord StatusId-100 ambiguity from section 3):**
> *"For final match outcome settlement, scores records with `action=game_finalised` use `statusId=100` and `period=100` on the current devnet and mainnet releases. That gives integrations a single final-outcome marker independent of whether the match ended in regulation, extra time, penalties, or abandonment."*
>
> → **The correct, docs-confirmed check is the TRIPLE condition: `action === "game_finalised"` AND `statusId === 100` AND `period === 100`.** This is stricter than just checking `Action === "game_finalised"` alone (what Discord implied) — **also verify `period === 100`**. Combined with the known bug (`StatusId:100` can appear on a `"disconnected"` transport action mid-match), this triple-check is the safe pattern for any settlement/CPI trigger logic.
> Cross-reference: the buggy fixture Tobirama reported (id `18187298`, Brazil v Norway) matches exactly the **World Cup > 8th Finals, July 5, 2026, 20:00 UTC** fixture in the official Schedule (section 14 below) — confirms this was a real live match, not a test artifact.

- Built for **settlement & micro-markets**: deterministic encoding (fixed cryptographic key + period multipliers), documented layout schemas for automated smart-contract settlement/validation proofs, network-aware access (mainnet creds↔mainnet API, devnet creds↔devnet API).
- Data collection: **scout-sourced, direct-from-stadium** (removes broadcast lag/delay vulnerability). High-availability redundant pipelines for peak tournament load.
- If a live stream connects but no messages arrive: check the Schedule (no fixture currently live), or use historical endpoints for completed fixtures.
- Sub-pages: [Soccer Feed](#soccer-feed), American Football Feed, Basketball Feed (not yet pasted).

## 14. Scores — Schedule (https://txline.txodds.com/documentation/scores/schedule)

Full confirmed World Cup 2026 fixture list for TxLINE coverage (all times UTC). Reproduced in full below for reference when picking a fixture to build/test against.

**Group Stage** (Jun 21 – Jun 28, 2026): 32 fixtures across International competition, fixtureIds 17588229–17926766 range. Includes e.g. Tunisia v Japan (17588310, Jun21 04:00), Spain v Saudi Arabia (17588232), Brazil v Scotland reversed as Scotland v Brazil (17588398, Jun24 22:00), Argentina v Austria (17588389, Jun22 17:00), USA v Turkey reversed as Turkey v USA (17926593, Jun26 02:00), Jordan v Argentina (17588325, Jun28 02:00), Algeria v Austria (17588326, Jun28 02:00), full list saved verbatim in raw paste (not fully re-transcribed here — see chat history 2026-07-12 for full table if needed).

**Round of 32** (Jun 28 – Jul 4, 2026): 16 fixtures. Key ones: South Africa v Canada (18167317), Brazil v Japan (18172489), Germany v Paraguay (18175983), Netherlands v Morocco (18172260), France v Sweden (18175981), Mexico v Ecuador (18179759), England v Congo DR (18179764), Belgium v Senegal (18179550), USA v Bosnia & Herzegovina (18172379), Spain v Austria (18179551), Portugal v Croatia (18179763), Switzerland v Algeria (18179552), Australia v Egypt (18176123), Argentina v Cape Verde (18175918), Colombia v Ghana (18179549).

**8th Finals** (Jul 4 – Jul 7, 2026):
| fixtureId | Date | Time UTC | Home | Away |
|---|---|---|---|---|
| 18185036 | Jul 4 | 17:00 | Canada | Morocco |
| 18188721 | Jul 4 | 21:03 | Paraguay | France |
| **18187298** | **Jul 5** | **20:00** | **Brazil** | **Norway** | ← the fixture with the confirmed StatusId-100 bug (Discord)
| 18192996 | Jul 6 | 00:00 | Mexico | England |
| 18198205 | Jul 6 | 19:00 | Portugal | Spain |
| 18193785 | Jul 7 | 00:00 | USA | Belgium |
| 18202701 | Jul 7 | 16:00 | Argentina | Egypt | ← matches example fixtureId used in an odds payload sample in Discord
| 18202783 | Jul 7 | 20:00 | Switzerland | Colombia |

**Quarter-finals** (from Jul 9, 2026):
| fixtureId | Date | Time UTC | Home | Away |
|---|---|---|---|---|
| 18209181 | Jul 9 | 20:00 | France | Morocco |

(Only 1 quarter-final listed at time of paste — more likely to appear as the schedule page updates; re-check closer to submission if relevant to the build.)

Note: schedule is described as "subject to change" — use the live fixtures snapshot API for current availability rather than hardcoding this table into a build.

## 15. Scores — Soccer Feed (https://txline.txodds.com/documentation/scores/soccer-feed) — ✅ COMPLETE

### Game Phase Encoding (soccer) — full table
| Name | ID | Description |
|---|---|---|
| NS | 1 | Not started |
| H1 | 2 | First half in play |
| HT | 3 | Halftime |
| H2 | 4 | Second half in play |
| F | 5 | Ended (finished) |
| WET | 6 | Waiting for Extra Time |
| ET1 | 7 | Extra Time first half in play |
| HTET | 8 | Extra Time halftime |
| ET2 | 9 | Extra Time second half in play |
| FET | 10 | Ended after Extra Time |
| WPE | 11 | Waiting for Penalty Shootout |
| PE | 12 | Penalty Shootout in progress |
| FPE | 13 | Ended after Penalty Shootout |
| I | 14 | Interrupted |
| A | 15 | Abandoned |
| C | 16 | Cancelled |
| TXCC | 17 | TX Coverage Cancelled |
| TXCS | 18 | TX Coverage Suspended |
| **P** | **19** | **Postponed** |

### ⭐ Stat Period Encoding — THE decoder ring for the `Stats{...}` object
Formula: **stat key = period_prefix + base_key**. This decodes every numeric key seen in raw payloads (e.g. the `"1001":0, "6006":0...` blobs from Discord, section 3).

**Full Game Stats base keys (1-8):**
| Key | Statistic |
|---|---|
| 1 | Participant 1 Total Goals |
| 2 | Participant 2 Total Goals |
| 3 | Participant 1 Total Yellow Cards |
| 4 | Participant 2 Total Yellow Cards |
| 5 | Participant 1 Total Red Cards |
| 6 | Participant 2 Total Red Cards |
| 7 | Participant 1 Total Corners |
| 8 | Participant 2 Total Corners |

**Period Prefixes:**
| Prefix | Period | Example |
|---|---|---|
| 0 | Total | `8` = Participant 2 total corners |
| 1000 | H1 | `1001` = Participant 1 H1 goals |
| 2000 | HT | `2001` = Participant 1 halftime goals |
| 3000 | H2 | `3001` = Participant 1 H2 goals |
| 4000 | ET1 | `4001` = Participant 1 ET1 goals |
| 5000 | ET2 | `5001` = Participant 1 ET2 goals |
| 6000 | PE (penalty shootout) | `6001` = Participant 1 penalty shootout goals |
| 7000 | ETTotal | `7008` = Participant 2 ETTotal corners |

Usage: required for validating score data against on-chain Merkle roots, creating trading offers, or settling trades with cryptographic proofs.

### Integrator Notes (edge cases — important for correct parsing)
- **Hydration breaks** = a `comment` action with `Data.Text = "Water-drinking break"`. **Not** a numeric Stats key, not a dedicated action type.
- **Fouls have no dedicated action type.** Use `free_kick` with `Data.FreeKickType != "Offside"` for foul/free-kick handling. Offside = `free_kick` with `Data.FreeKickType = "Offside"`.
- **Documented enums:**
  - `shot.Data.Outcome`: `OnTarget`, `OffTarget`, `Woodwork`, `Blocked`
  - `Data.FreeKickType`: `Safe`, `Attack`, `Danger`, `HighDanger`, `Offside`
  - `var.Data.Type`: `Goal`, `Penalty`, `RedCard`, `SecondYellowCard`, `CornerKick`, `MistakenIdentity`, `Other`
  - `var_end.Data.Outcome`: `Stands`, `Overturned`
  - Penalty outcomes: `Scored`, `Missed`, `Retake`

### Version 1.1 Soccer Feed PDF updates (integrator-facing)
- **Substitution messages** can include `FollowsAction`, linking a confirmed substitution to the originating unconfirmed action.
- **Action Amend** can include `Participant`, identifying the team related to the original action being amended (relevant to the `action_amend` player-attribution pattern from Discord, section 3).
- **`halftime_finalised`** indicates halftime data has been reviewed/verified — **may be sent more than once** for the same halftime period (don't assume it's a one-shot event).

Full PDF spec downloadable via a "Download" card on the page (no direct URL captured — check page live if the full PDF is needed).

## 16. Scores — American Football Feed (https://txline.txodds.com/documentation/scores/football-feed)

### Game Phase Encoding — Standard
| Name | ID | Description |
|---|---|---|
| NS | 1 | Not started |
| Q1 | 2 | Quarter 1 in play |
| Q1B | 3 | Quarter 1 break |
| Q2 | 4 | Quarter 2 in play |
| HT | 5 | Halftime |
| Q3 | 6 | Quarter 3 in play |
| Q3B | 7 | Quarter 3 break |
| Q4 | 8 | Quarter 4 in play |
| F | 9 | Ended (finished) |
| WO | 10 | Waiting for Overtime |
| OT | 11 | Overtime |
| OB | 12 | Overtime Break |
| FO | 13 | Ended after Overtime |
| I | 14 | Interrupted |
| A | 15 | Abandoned |
| C | 16 | Cancelled |
| TXCC | 17 | TX Coverage Cancelled |
| TXCS | 18 | TX Coverage Suspended |

### Game Phase Encoding — Overtime (extends beyond OT1)
| Name | ID | Description |
|---|---|---|
| OT1 | 1011 | Overtime 1 |
| OB1 | 1012 | Overtime 1 break |
| OT2 | 2011 | Overtime 2 |
| OB2 | 2012 | Overtime 2 break |
| ... | ... | (continues to OT12) |

### Stat Period Encoding
Formula: `(half * 1000 OR quarter * 10000) + base_key`

**Full Game Stats base keys (1-16):**
| Key | Statistic |
|---|---|
| 1 | Participant 1 Total Score |
| 2 | Participant 2 Total Score |
| 3 | Participant 1 Total Touchdowns |
| 4 | Participant 2 Total Touchdowns |
| 5 | Participant 1 Total Field Goals |
| 6 | Participant 2 Total Field Goals |
| 7 | Participant 1 Total 1pt Conversions |
| 8 | Participant 2 Total 1pt Conversions |
| 9 | Participant 1 Total 2pt Conversions |
| 10 | Participant 2 Total 2pt Conversions |
| 11 | Participant 1 Total Safeties |
| 12 | Participant 2 Total Safeties |
| 13 | Participant 1 Total 1pt Safeties |
| 14 | Participant 2 Total 1pt Safeties |
| 15 | Participant 1 Total Defensive 2pt Conversions |
| 16 | Participant 2 Total Defensive 2pt Conversions |

**Period multipliers:** H1 +1000, H2 +2000, Q1 +10000, Q2 +20000, Q3 +30000, Q4 +40000. (e.g. `1001` = P1 1st Half Score, `10001` = P1 Q1 Score)

Not relevant to World Cup soccer track but noted for completeness.

## 17. Scores — Basketball Feed (https://txline.txodds.com/documentation/scores/basketball-feed)

### Game Phase Encoding (note: differs by competition type — NBA vs NCAA)
| Name | ID | Description | Competition Type |
|---|---|---|---|
| NS | 1 | Not started | All |
| Q1 | 2 | Quarter 1 | NBA |
| Q1B | 3 | Quarter 1 break | NBA |
| Q2 | 4 | Quarter 2 | NBA |
| HT | 5 | Halftime | All |
| Q3 | 6 | Quarter 3 | NBA |
| Q3B | 7 | Quarter 3 break | NBA |
| Q4 | 8 | Quarter 4 | NBA |
| F | 9 | Ended | All |
| WO | 10 | Waiting for Overtime | All |
| OT | 11 | Overtime | All |
| OB | 12 | Overtime Break | All |
| FO | 13 | Ended after Overtime | All |
| H1 | 19 | First half | NCAA |
| H2 | 20 | Second half | NCAA |

### Stat Period Encoding — base keys 1-36 (much larger than soccer/football)
Formula: `(half * 1000 OR quarter * 10000) + base_key`
| Key | Statistic | Key | Statistic |
|---|---|---|---|
| 1 | P1 Total Score | 2 | P2 Total Score |
| 3 | P1 Total Fouls | 4 | P2 Total Fouls |
| 5 | P1 Total Personal Fouls | 6 | P2 Total Personal Fouls |
| 7 | P1 Total Blocks | 8 | P2 Total Blocks |
| 9 | P1 Total Rebounds | 10 | P2 Total Rebounds |
| 11 | P1 Total FT made | 12 | P2 Total FT made |
| 13 | P1 Total 2pt made | 14 | P2 Total 2pt made |
| 15 | P1 Total 3pt made | 16 | P2 Total 3pt made |
| 17 | P1 Total FT missed | 18 | P2 Total FT missed |
| 19 | P1 Total 2pt missed | 20 | P2 Total 2pt missed |
| 21 | P1 Total 3pt missed | 22 | P2 Total 3pt missed |
| 23 | P1 Total FT attempts | 24 | P2 Total FT attempts |
| 25 | P1 Total 2pt attempts | 26 | P2 Total 2pt attempts |
| 27 | P1 Total 3pt attempts | 28 | P2 Total 3pt attempts |
| 29 | P1 Total Assists | 30 | P2 Total Assists |
| 31 | P1 Total Turnovers | 32 | P2 Total Turnovers |
| 33 | P1 Total Steals | 34 | P2 Total Steals |
| 35 | P1 Total Used timeouts | 36 | P2 Total Used timeouts |

Period multipliers same as football (H1+1000, H2+2000, Q1+10000...Q4+40000). Not relevant to World Cup track but noted for completeness.

## 18. Solana Programs — Program Addresses (https://txline.txodds.com/documentation/solana/program-addresses) — ⭐ canonical reference

### Network Consistency Checklist (THE master table — use this to avoid network-mismatch bugs)
| Network | Solana RPC | Program ID | TxL Mint | Guest JWT URL | Activation URL |
|---|---|---|---|---|---|
| Mainnet | `https://api.mainnet-beta.solana.com` | `9ExbZjAapQww1vfcisDmrngPinHTEfpjYRWMunJgcKaA` | `Zhw9TVKp68a1QrftncMSd6ELXKDtpVMNuMGr1jNwdeL` | `https://txline.txodds.com/auth/guest/start` | `https://txline.txodds.com/api/token/activate` |
| Devnet | `https://api.devnet.solana.com` | `6pW64gN1s2uqjHkn1unFeEjAwJkPGHoppGvS715wyP2J` | `4Zao8ocPhmMgq7PdsYWyxvqySMGx7xb9cMftPMkEokRG` | `https://txline-dev.txodds.com/auth/guest/start` | `https://txline-dev.txodds.com/api/token/activate` |

⚠️ **"The transaction signature, guest JWT, activation endpoint, and program ID must all come from the same row. If any one value comes from a different row, activation can fail even when the on-chain transaction itself confirmed."**

### Public Validation Accounts (PDAs)
| Account | Seed(s) | Purpose |
|---|---|---|
| Daily scores roots | `daily_scores_roots` + epochDay (u16 LE) | Score proof validation |
| Daily batch roots | `daily_batch_roots` + epochDay (u16 LE) | Odds proof validation |
| Ten daily fixtures roots | `ten_daily_fixtures_roots` + aligned epoch day (u16 LE) | Fixture proof validation |

⚠️ **Derive epoch day from the EXACT timestamp in the proof response, NEVER from `Date.now()`.** Source per proof type:
- Scores → `validation.summary.updateStats.minTimestamp`
- Fixtures → `validation.snapshot.Ts`
- Odds → `validation.odds.Ts`
Recompute for every proof (don't cache/reuse).

### PDA derivation code (canonical, mainnet example — swap programId for devnet)
```typescript
import { PublicKey } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";

const programId = new PublicKey("9ExbZjAapQww1vfcisDmrngPinHTEfpjYRWMunJgcKaA");
// For devnet, replace programId with: 6pW64gN1s2uqjHkn1unFeEjAwJkPGHoppGvS715wyP2J

function epochDayFromProofTimestamp(proofTimestampMs: number): number {
  if (!Number.isSafeInteger(proofTimestampMs) || proofTimestampMs < 0) {
    throw new Error("Expected a non-negative proof timestamp in milliseconds");
  }
  const epochDay = Math.floor(proofTimestampMs / 86400000);
  if (epochDay > 0xffff) {
    throw new Error("Proof timestamp is outside the u16 epoch-day range");
  }
  return epochDay;
}

function deriveDailyValidationPda(
  seed: "daily_scores_roots" | "daily_batch_roots",
  proofTimestampMs: number
): PublicKey {
  const epochDay = epochDayFromProofTimestamp(proofTimestampMs);
  return PublicKey.findProgramAddressSync(
    [Buffer.from(seed), new BN(epochDay).toArrayLike(Buffer, "le", 2)],
    programId
  )[0];
}

function deriveTenDailyFixturesPda(fixtureProofTimestampMs: number): PublicKey {
  const epochDay = epochDayFromProofTimestamp(fixtureProofTimestampMs);
  const alignedEpochDay = Math.floor(epochDay / 10) * 10;
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("ten_daily_fixtures_roots"),
      new BN(alignedEpochDay).toArrayLike(Buffer, "le", 2),
    ],
    programId
  )[0];
}
```

### Activation message (canonical, repeated across pages — confirmed consistent)
```
${txSig}:${selectedLeagues.join(",")}:${jwt}
```
For standard free bundle (`selectedLeagues = []`): `${txSig}::${jwt}`. Send `walletSignature` as base64 detached signature; `Authorization: Bearer <jwt>` from matching network.

## 19-20. Solana Programs — Program Reference (Mainnet + Devnet)

Both pages are structurally identical (values differ per network — see the Network Consistency table in section 18). Additional info not in section 18:

### Score Validation endpoint shapes (both networks)
| API request | On-chain method | Use case |
|---|---|---|
| `/scores/stat-validation?fixtureId=...&seq=...&statKey=...` | `validateStat` | Single-stat or legacy two-stat validation |
| `/scores/stat-validation?fixtureId=...&seq=...&statKeys=1,2,...` | `validateStatV2` | Multi-stat validation, indexed strategies |

⚠️ Use a REAL `seq` value from an observed score record. For V2, keep requested `statKeys` order stable — strategy indexes refer to those same positions.

Related guides linked from these pages: Quickstart, World Cup Free Tier, On-Chain Validation, Streaming Data, Runnable Devnet Examples (devnet only), Troubleshooting.

## 21. Examples — Fetching Snapshots (https://txline.txodds.com/documentation/examples/fetching-snapshots)

Prerequisites: completed activation (jwt + apiToken in hand).

### Fixtures snapshot
```typescript
import axios from "axios";

const httpClient = axios.create({
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${jwt}`,
    "X-Api-Token": apiToken
  },
  baseURL: "https://txline.txodds.com", // txline-dev.txodds.com for devnet
});

const fixturesResponse = await httpClient.get("/api/fixtures/snapshot", {
  params: { competitionId: 500005 }, // omit for all fixtures
});
const fixtures = fixturesResponse.data;

fixtures.slice(0, 3).forEach((fixture, index) => {
  const homeTeam = fixture.Participant1IsHome ? fixture.Participant1 : fixture.Participant2;
  const awayTeam = fixture.Participant1IsHome ? fixture.Participant2 : fixture.Participant1;
  console.log(`${index + 1}. ${homeTeam} vs ${awayTeam}`);
  console.log(`   ID: ${fixture.FixtureId}, Start: ${new Date(fixture.StartTime).toISOString()}`);
  console.log(`   GameState: ${fixture.GameState ?? fixture.gameState}`);
});
```
⚠️ `Participant1IsHome` is a **feed convention, not a venue guarantee** — for neutral competitions like World Cup, `true` just means P1 is listed as home for feed purposes, regardless of actual match location.
⚠️ `GameState`: `1` = scheduled, `6` = cancelled (backward-compatible format).

### Odds snapshot
```typescript
const fixtureOddsResponse = await httpClient.get(`/api/odds/snapshot/${fixtureId}`);
// time-period query:
const updatesResponse = await httpClient.get(`/api/odds/updates/${epochDay}/${hourOfDay}/${interval}`);
```

### Scores snapshot
```typescript
const snapshotScoresResponse = await httpClient.get(`/api/scores/snapshot/${fixtureId}`);
const liveScoresResponse = await httpClient.get(`/api/scores/updates/${fixtureId}`);
const historicalUpdatesResponse = await httpClient.get(`/api/scores/updates/${epochDay}/${hourOfDay}/${interval}`);
```

## 22. Examples — Streaming Data (https://txline.txodds.com/documentation/examples/streaming-data)

### Stream expectations
An open SSE connection = credentials accepted, **NOT** a guarantee data is flowing right now. If only heartbeats: check Schedule for live fixture windows, use `/api/scores/historical/{fixtureId}` for completed matches, confirm correct network host.
`401` on stream → renew guest JWT, reconnect with same `X-Api-Token`. `403` → check API token network/bundle match.

### Runnable devnet stream scripts (in repo)
| Script | Coverage |
|---|---|
| `subscription_free_tier.ts` | Odds snapshots + odds SSE stream |
| `subscription_scores.ts` | Scores snapshots, validation, scores SSE stream |
| `subscription_scores_v2.ts` | Scores stream + V2 score validation |

### SSE parsing helper — full reusable implementation
```typescript
type SseMessage = { id?: string; event?: string; data: string; retry?: number };

function parseSseBlock(block: string): SseMessage | null {
  const message: SseMessage = { data: "" };
  for (const rawLine of block.split(/\r?\n/)) {
    if (!rawLine || rawLine.startsWith(":")) continue;
    const separatorIndex = rawLine.indexOf(":");
    const field = separatorIndex === -1 ? rawLine : rawLine.slice(0, separatorIndex);
    const value = separatorIndex === -1 ? "" : rawLine.slice(separatorIndex + 1).replace(/^ /, "");
    if (field === "data") message.data += `${value}\n`;
    if (field === "event") message.event = value;
    if (field === "id") message.id = value;
    if (field === "retry") message.retry = Number(value);
  }
  message.data = message.data.replace(/\n$/, "");
  return message.data || message.event || message.id ? message : null;
}

async function* readSseMessages(response: Response): AsyncGenerator<SseMessage> {
  if (!response.body) throw new Error("Stream response has no body");
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let separator = buffer.match(/\r?\n\r?\n/);
      while (separator?.index !== undefined) {
        const block = buffer.slice(0, separator.index);
        buffer = buffer.slice(separator.index + separator[0].length);
        const message = parseSseBlock(block);
        if (message) yield message;
        separator = buffer.match(/\r?\n\r?\n/);
      }
    }
    buffer += decoder.decode();
    const message = parseSseBlock(buffer);
    if (message) yield message;
  } finally {
    reader.releaseLock();
  }
}

function parseSseData(data: string) {
  try { return JSON.parse(data); } catch { return data; }
}
```

### Stream odds / scores usage
```typescript
const streamResponse = await fetch("https://txline.txodds.com/api/odds/stream", { // or /api/scores/stream
  headers: {
    Authorization: `Bearer ${jwt}`,
    "X-Api-Token": apiToken,
    Accept: "text/event-stream",
    "Cache-Control": "no-cache",
  },
});
if (!streamResponse.ok) throw new Error(`Stream failed: ${streamResponse.status}`);
for await (const message of readSseMessages(streamResponse)) {
  console.log(message.event ?? "message", parseSseData(message.data));
}
```
Devnet: use `https://txline-dev.txodds.com/api/{odds,scores}/stream`.
⚠️ Scores stream messages usable as validation input — **use the message's REAL observed `Seq`/`seq` value**, never `0` or synthetic.

### Historical scores + compression tip
```typescript
const historicalScores = await httpClient.get(`/api/scores/historical/${fixtureId}`);
// each record: { seq, ts, gameState, ... }
```
⚠️ **Historical availability window: only fixtures with start time between 2 weeks and 6 hours ago.** Outside that window = no data.
💡 **Bandwidth tip**: add `"Accept-Encoding": "gzip"` header → up to 70-80% bandwidth reduction. Must decompress with `gunzipSync()` from Node's `zlib` before decoding.

## 23. Examples — On-Chain Validation (https://txline.txodds.com/documentation/examples/onchain-validation) — ⭐⭐ MOST BUILD-CRITICAL PAGE

### Validation checklist (pre-flight, before calling validateStat)
- Proof came from same API host as activated subscription
- Program ID matches proof's network
- `daily_scores_roots` derived from the SAME timestamp passed into `validateStat`
- Epoch day encoded as u16 little-endian
- Every proof hash decoded to exactly 32 bytes
- Fixture ID + sequence number match the score update being validated
- For V2: each strategy index refers to the same position in the requested `statKeys` array

### Setup code
```typescript
import * as anchor from "@coral-xyz/anchor";
import { PublicKey, ComputeBudgetProgram } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import axios from "axios";

const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);
const program = anchor.workspace.Txoracle as anchor.Program<Txoracle>;

const httpClient = axios.create({
  timeout: 30000,
  headers: { "Content-Type": "application/json", "Authorization": `Bearer ${jwt}`, "X-Api-Token": apiToken },
  baseURL: "https://txline.txodds.com", // txline-dev.txodds.com for devnet
});

function toBytes32(value: string | number[] | Uint8Array): number[] {
  const bytes = Array.isArray(value) ? Uint8Array.from(value)
    : value instanceof Uint8Array ? value
    : value.startsWith("0x") ? Buffer.from(value.slice(2), "hex")
    : Buffer.from(value, "base64");
  if (bytes.length !== 32) throw new Error(`Expected 32 bytes, received ${bytes.length}`);
  return Array.from(bytes);
}

function toProofNodes(nodes: Array<{ hash: string | number[] | Uint8Array; isRightSibling: boolean }>) {
  return nodes.map((node) => ({ hash: toBytes32(node.hash), isRightSibling: node.isRightSibling }));
}
```

### ⚠️ Score sequence rule (CRITICAL, strict)
> *"The `seq` parameter is not a placeholder. Use the sequence value from a real score record... **Do not call `/api/scores/stat-validation` with `seq=0`.** Score sequences start at **1** for a fixture and increment as new score records are produced."*
```typescript
const scoreRecord = updates.data[0];
const seq = scoreRecord.Seq ?? scoreRecord.seq; // field casing varies
if (!Number.isInteger(seq) || seq < 1) {
  throw new Error("Use a real score record sequence; seq=0 is not valid");
}
```
Get real `seq` from: `/api/scores/snapshot/{fixtureId}`, `/api/scores/updates/...`, `/api/scores/historical/{fixtureId}`, or `/api/scores/stream`.

### Phase and Status Semantics (settlement correctness — 3rd confirmation of the rule)
> *"Pick the score record whose game phase matches the condition you want to prove... If you validate an in-running first-half record, the predicate means the condition was true at that observed moment. That is different from proving the final first-half result."*
>
> **"For final match outcome settlement on the current devnet and mainnet releases, use a scores record with `action=game_finalised`. These finalisation records set `statusId` and `period` to `100`, so the same final-outcome validation path covers regulation-time wins, extra-time wins, penalty wins, and abandoned matches."**

### Single-Stat Validation — full code
```typescript
const response = await httpClient.get("/api/scores/stat-validation", {
  params: { fixtureId: 17952170, seq: 941, statKey: 1002 }
});
const validation = response.data;

const fixtureSummary = {
  fixtureId: new BN(validation.summary.fixtureId),
  updateStats: {
    updateCount: validation.summary.updateStats.updateCount,
    minTimestamp: new BN(validation.summary.updateStats.minTimestamp),
    maxTimestamp: new BN(validation.summary.updateStats.maxTimestamp),
  },
  eventsSubTreeRoot: toBytes32(validation.summary.eventStatsSubTreeRoot),
};
const fixtureProof = toProofNodes(validation.subTreeProof);
const mainTreeProof = toProofNodes(validation.mainTreeProof);
const stat1 = {
  statToProve: validation.statToProve,
  eventStatRoot: toBytes32(validation.eventStatRoot),
  statProof: toProofNodes(validation.statProof),
};
const predicate = { threshold: 0, comparison: { greaterThan: {} } };
// exact-equality sanity check alternative:
// const predicate = { threshold: validation.statToProve.value, comparison: { equalTo: {} } };

const targetTs = validation.summary.updateStats.minTimestamp;
const epochDay = Math.floor(targetTs / (24 * 60 * 60 * 1000));
const [dailyScoresPda] = PublicKey.findProgramAddressSync(
  [Buffer.from("daily_scores_roots"), new BN(epochDay).toArrayLike(Buffer, "le", 2)],
  program.programId
);

const computeBudgetIx = ComputeBudgetProgram.setComputeUnitLimit({ units: 1_400_000 });

const isValid = await program.methods
  .validateStat(new BN(targetTs), fixtureSummary, fixtureProof, mainTreeProof, predicate, stat1, null, null)
  .accounts({ dailyScoresMerkleRoots: dailyScoresPda })
  .preInstructions([computeBudgetIx])
  .view(); // read-only simulation, no tx cost
```

### Two-Stat Validation (comparison between two stats, e.g. score differential)
```typescript
const response2 = await httpClient.get("/api/scores/stat-validation", {
  params: { fixtureId: 17952170, seq: 941, statKey: 1002, statKey2: 1003 }
});
const validation2 = response2.data;
const stat2 = {
  statToProve: validation2.statToProve2,
  eventStatRoot: toBytes32(validation2.eventStatRoot),
  statProof: toProofNodes(validation2.statProof2),
};
const op = { subtract: {} };
const predicate2 = { threshold: 5, comparison: { lessThan: {} } };

const isValid2 = await program.methods
  .validateStat(new BN(targetTs), fixtureSummary, fixtureProof, mainTreeProof, predicate2, stat1, stat2, op)
  .accounts({ dailyScoresMerkleRoots: dailyScoresPda })
  .preInstructions([computeBudgetIx])
  .view();
```

### V2 Multi-Stat Validation (current/preferred path — arbitrary number of stats, indexed strategies)
```typescript
const responseV2 = await httpClient.get("/api/scores/stat-validation", {
  params: { fixtureId: 18175981, seq: 991, statKeys: "1,2,3001" }
});
const validationV2 = responseV2.data;
const targetTsV2 = validationV2.summary.updateStats.minTimestamp;
const epochDayV2 = Math.floor(targetTsV2 / (24 * 60 * 60 * 1000));
const [dailyScoresPdaV2] = PublicKey.findProgramAddressSync(
  [Buffer.from("daily_scores_roots"), new BN(epochDayV2).toArrayLike(Buffer, "le", 2)],
  program.programId
);

const payload = {
  ts: new BN(targetTsV2),
  fixtureSummary: {
    fixtureId: new BN(validationV2.summary.fixtureId),
    updateStats: {
      updateCount: validationV2.summary.updateStats.updateCount,
      minTimestamp: new BN(validationV2.summary.updateStats.minTimestamp),
      maxTimestamp: new BN(validationV2.summary.updateStats.maxTimestamp),
    },
    eventsSubTreeRoot: toBytes32(validationV2.summary.eventStatsSubTreeRoot),
  },
  fixtureProof: toProofNodes(validationV2.subTreeProof),
  mainTreeProof: toProofNodes(validationV2.mainTreeProof),
  eventStatRoot: toBytes32(validationV2.eventStatRoot),
  stats: validationV2.statsToProve.map((stat: unknown, index: number) => ({
    stat,
    statProof: toProofNodes(validationV2.statProofs[index]),
  })),
};

// strategy: indexes refer to POSITION in requested statKeys array (0="1", 1="2", 2="3001")
const strategy = {
  geometricTargets: [],
  distancePredicate: null,
  discretePredicates: [
    { binary: { indexA: 0, indexB: 1, op: { subtract: {} }, predicate: { threshold: 0, comparison: { equalTo: {} } } } },
    { single: { index: 2, predicate: { threshold: 0, comparison: { greaterThan: {} } } } },
  ],
};

const isValidV2 = await program.methods
  .validateStatV2(payload, strategy)
  .accounts({ dailyScoresMerkleRoots: dailyScoresPdaV2 })
  .preInstructions([computeBudgetIx])
  .view();
```
⚠️ **`IncompleteStatCoverage` error**: every entry in `payload.stats` must be referenced EXACTLY ONCE by a discrete predicate or geometric target, or the on-chain program rejects it.

### Common Validation Errors (troubleshooting table)
| Symptom | Fix |
|---|---|
| `InvalidMainTreeProof` | Use same `targetTs` for `validateStat` + PDA derivation. Confirm proof hashes are exactly 32 bytes, not reversed. Confirm fixture ID + seq match returned proof payload. |
| Account integrity passes but proof fails | PDA is right network, but timestamp/interval/proof payload mismatch. Recompute `epochDay = Math.floor(targetTs / 86400000)`. |
| Predicate returns false | Test with exact predicate against returned stat value first, then swap in your real predicate. |
| `IncompleteStatCoverage` | Every entry in `payload.stats` must be covered exactly once by a strategy. |
| V2 strategy validates wrong stat | Confirm `statKeys` order matches positional strategy indexes — `index: 0` = first REQUESTED key, not smallest stat key number. |
| 401/403 from proof endpoint | Renew guest JWT; confirm both credentials from same network host. |

### Validation use cases (documented)
Trading Settlement (prove score outcomes for bet settlement) · Conditional Logic (smart contract logic based on verified stats) · Dispute Resolution (cryptographic proof of game data) · Automated Markets (settle prediction markets on-chain) · Score Differentials (validate margins/differences for complex betting).

## 24. Examples — Runnable Devnet Examples (https://txline.txodds.com/documentation/examples/devnet-examples)

- Repo path: `examples/devnet`, uses devnet IDL/types at `examples/devnet/idl/txoracle.json` + `examples/devnet/types/txoracle.ts`. **Mainnet integrations use the ROOT `idl/txoracle.json` + `types/txoracle.ts` instead** (different path than devnet).

### Requirements
- Node.js **20+** (lockfile resolves `eventsource@4.1.0`, requires `node >=20.0.0`)
- Funded devnet wallet for `ANCHOR_WALLET`
- `ANCHOR_PROVIDER_URL="https://api.devnet.solana.com"`
- `TOKEN_MINT_ADDRESS=4Zao8ocPhmMgq7PdsYWyxvqySMGx7xb9cMftPMkEokRG`

### Script Index (what's already built in the repo)
| Script | What it demonstrates |
|---|---|
| `subscription_free_tier.ts` | Free-tier activation, odds snapshot fetches, odds SSE streams |
| `subscription_scores.ts` | Scores snapshots, recent score scanning, legacy `validateStat` w/ `statKey`, scores SSE streams |
| `subscription_scores_1stat.ts` | V2 validation, ONE requested `statKeys` entry, `validateStatV2` |
| `subscription_scores_v2.ts` | V2, two stats, binary predicates + geometric distance predicates |
| `subscription_scores_v2a.ts` | V2, RICH multi-leg validation, `statKeys=1,2,3001,3002`, two/three/four-leg strategies |
| `fixture_validation_view_only.ts` | Fixture proof validation by simulation (fixture endpoint + on-chain PDA) |

### Shared helpers (`examples/devnet/common`)
| File | Purpose |
|---|---|
| `config.ts` | Devnet API + guest JWT hosts |
| `users.ts` | Wallet setup, free-tier subscription, activation signing, JWT renewal, API client, tx safety helpers |

### V2 pattern reference (fixture 18175981, matches the World Cup schedule — real match example)
```typescript
const url = "/scores/stat-validation?fixtureId=18175981&seq=991&statKeys=1,2,3001,3002";
const val = (await users.apiClient.get(url)).data;
const payload = {
  ts: new BN(val.summary.updateStats.minTimestamp),
  fixtureSummary,
  fixtureProof: mapProof(val.subTreeProof),
  mainTreeProof: mapProof(val.mainTreeProof),
  eventStatRoot: Array.from(val.eventStatRoot),
  stats: val.statsToProve.map((statObj, index) => ({
    stat: statObj,
    statProof: mapProof(val.statProofs[index]),
  })),
};
```
⚠️ Example scripts use FIXED demo `fixtureId`/`seq` pairs. **In production, derive these from an observed score record** (snapshot/updates/historical/stream), never hardcode.

### Final Outcome (4th confirmation, verbatim)
> *"On the current devnet and mainnet releases, final scores records use `action=game_finalised` with `statusId=100` and `period=100`. Use those records when validating or settling the final match outcome, regardless of whether the match ended after regulation time, extra time, penalties, or abandonment."*

Fixture `GameState` (backward-compatible): `1`=Scheduled, `6`=Cancelled.

## 25. Examples — Troubleshooting (https://txline.txodds.com/documentation/examples/troubleshooting) — ✅ COMPLETE

### Before You Debug — 4 common root causes of integration issues
1. Mixing devnet and mainnet values
2. Signing the wrong activation message
3. Using an expired or missing guest JWT
4. Deriving validation PDAs from a timestamp that doesn't match the proof payload

Network table repeated (same as section 18). **Never share guest JWT, activated API token, wallet secret key, or unredacted request headers in public support channels** (matches the Discord "maskarad" joke about sharing private keys — this is an official rule, not just banter).

### Activation Checklist
- `subscribe(serviceLevelId, durationWeeks)` tx is confirmed
- `txSig` is from same network as activation endpoint
- Guest JWT from same network host
- Signing wallet = same wallet that submitted `subscribe` tx
- `walletSignature` is base64-encoded detached signature
- `leagues` is `[]` for standard free World Cup/Int Friendlies bundle
- Message signed: `${txSig}:${selectedLeagues.join(",")}:${jwt}` (or `${txSig}::${jwt}` for empty leagues)

### Runnable Example Checklist
- Node.js 20+ (`eventsource@4.1.0` requires it)
- `ANCHOR_PROVIDER_URL` → `https://api.devnet.solana.com`
- `TOKEN_MINT_ADDRESS` → devnet mint `4Zao8ocPhmMgq7PdsYWyxvqySMGx7xb9cMftPMkEokRG`
- Script imports devnet IDL/types from `examples/devnet/idl` and `examples/devnet/types`
- `ANCHOR_WALLET` wallet has enough devnet SOL for subscription tx + rent
- Fixed `fixtureId`/`seq` in example scripts are demo values — derive real ones for production
- Final match outcome settlement → `action=game_finalised`, `statusId=100`, `period=100` (5th confirmation)
- Fixture examples: `GameState` `1`=scheduled, `6`=cancelled

### Common Errors (symptom → cause → fix table) ⭐ full reference
| Symptom | Likely cause | What to check |
|---|---|---|
| Example script fails before connecting to TxLINE | Node runtime or env vars mismatch | Node.js 20+, set `ANCHOR_PROVIDER_URL`/`ANCHOR_WALLET`/`TOKEN_MINT_ADDRESS`, run from repo root |
| `504 Gateway Timeout` from `/api/token/activate` | Network mismatch (devnet tx → mainnet host) or backend timeout | Confirm `txSig`, guest JWT, program ID, activation URL ALL same network |
| `403 signature verification failed` | Wrong signing preimage/wallet/encoding/JWT host | Sign exact message string, use subscribe wallet, base64 detached sig, matching network JWT |
| `401 Unauthorized` on data endpoints | Missing/expired guest JWT | Fresh guest JWT, retry with same `X-Api-Token` |
| `403 Access denied` on data endpoints | Invalid API token, expired sub, wrong network token, insufficient permissions | Confirm `X-Api-Token` from same network + subscription bundle |
| `Invalid public key input` | Placeholder not replaced with real Solana pubkey | Replace ALL placeholders (program ID, TxL mint, wallet pubkey) for selected network |
| SSE connects but no data messages | Stream healthy but no covered fixture actively producing updates | Check Schedule, keep stream open, or use historical endpoints |
| `/api/scores/stat-validation` called with `seq=0` or random seq | Seq treated as placeholder instead of real record | Get a real record from snapshot/updates/historical/stream, use its observed `Seq`/`seq` |
| `InvalidMainTreeProof` during validation | Timestamp/epoch-day PDA/proof decoding/fixture-update mismatch | Derive `daily_scores_roots` from SAME timestamp passed to `validateStat`, decode hashes to exactly 32 bytes, verify fixture+seq intended |
| `validateStatV2` strategy checks wrong value | `statKeys` order vs positional strategy indexes mixed up | Keep requested order aligned; `index`/`indexA`/`indexB`/`statIndex` refer to `statsToProve[0..N]` POSITION, not the numeric stat key |
| Final outcome settlement uses wrong phase | Selected in-running/period-specific record instead of finalisation record | Use record with `action=game_finalised`, `statusId=100`, `period=100` |

### Auth Headers (reference)
| Header | Value |
|---|---|
| `Authorization` | `Bearer <guest-jwt>` from `/auth/guest/start` |
| `X-Api-Token` | Activated API token from `/api/token/activate` |
If guest JWT expires → request new one from SAME network host. **Don't need to reactivate the API token** unless the subscription/token itself is invalid (JWT and API token have independent lifecycles).

### Stream Debugging checklist
- Use matching host (`txline.txodds.com` mainnet / `txline-dev.txodds.com` devnet)
- Send BOTH `Authorization` + `X-Api-Token`
- Set `Accept: text/event-stream`
- **An open connection with heartbeats = live, not necessarily a data failure**
- Check Schedule for active/upcoming fixtures
- Use `/api/scores/historical/{fixtureId}` for full replay of historical (within window) fixtures

### Validation Debugging (consolidated, matches section 23 patterns)
- Keep API proof, PDA derivation, and on-chain call ALIGNED on the same `targetTs`
- Every proof hash decoded to exactly 32 bytes before passing to Anchor
- Real score record sequence required; `seq=0` invalid
- For period-result settlement: choose a record whose phase/status represents the COMPLETED period — an in-running record only proves the condition at that moment, not the final period result
- Final match outcome → `action=game_finalised` records (statusId=period=100)
- V2: keep `statKeys` order stable across `statsToProve`/`statProofs`/strategy predicates
- Sanity-check pattern: start with an exact-equality predicate against the known value, THEN swap to your real application predicate:
```typescript
const predicate = { threshold: validation.statToProve.value, comparison: { equalTo: {} } };
```

### Support Template (what to include when filing a ticket)
Network (mainnet/devnet) · endpoint path + HTTP status · program ID · service level ID + duration · redacted tx sig prefix/suffix · for activation: selected leagues array + whether signed message was `txSig::jwt` · for validation: fixture ID, seq, stat key, timestamp, epoch day, PDA · for V2: full `statKeys` list + strategy indexes · for final-outcome validation: whether record had `action=game_finalised`+`statusId=100`+`period=100` · for fixture validation: the `GameState` value · response body with secrets removed.
**Never include**: guest JWT, X-Api-Token, wallet secret key, full private request logs with auth headers.

## 26. Legal — API Terms and Conditions (https://txline.txodds.com/documentation/legal/terms) — general TxODDS/TxLINE service terms (not hackathon-specific)

Legal entity: **TXODDS SERVICES, LLC** (Illinois). Governing law: **England and Wales**.

Key clauses relevant to building on the API (not exhaustive — full legal text not reproduced, summary of load-bearing points only):
- **§1.3**: Services are for **business/commercial use only** — "Consumer, personal or domestic use is prohibited." (Note: World Cup Free Tier FAQ explicitly says "Can I use this for commercial projects? Yes!" — hackathon/product-building use fits the commercial framing, not "personal/domestic" use.)
- **§4 TxLINE token**: proprietary access mechanism only, usable within TXODDS ecosystem only, **NOT redeemable for fiat/crypto/any asset**, no ownership/governance/dividend rights, **personal to the user — cannot be sold/transferred/sublicensed** (any purported transfer is void).
- **§6 Acceptable Use — prohibited actions**: resell/redistribute/sublicense Data · publish/disseminate Data publicly · **create competing services/products/databases** · reverse-engineer/derive source methodologies · scrape outside authorized API · circumvent rate limits · unlawful/sanctioned/fraudulent use · shared/proxy/pass-through access · cache/mirror Data without authorization · remove proprietary notices · **use in connection with unlawful gambling/wagering/betting activity**.
- **§7-8**: Data is inherently dynamic/may be delayed/inaccurate/corrected; provided for informational/infra purposes; **user bears all risk**; no refunds for interruptions/outages/inaccuracies except where law requires.
- **§9 Compliance**: TXODDS can reject/suspend/freeze transactions, require KYC, screen wallets/sanctions, throttle access, restrict jurisdictions — at their sole discretion, anytime.
- **§10 IP**: all rights in Services/Data/APIs/TxLINE remain with TXODDS. No implied licenses.
- **§11 Feedback**: any feedback you give becomes TXODDS's exclusive property immediately, no compensation.
- **§12-13**: Services "AS IS", all warranties disclaimed. **Liability cap (general, non-hackathon): greater of (fees paid in past 12mo) or USD $1,000.**

## 27. Legal — World Cup Hackathon Terms and Conditions (https://txline.txodds.com/documentation/legal/hackathon-terms) — ⭐⭐ CRITICAL, hackathon-specific, READ BEFORE BUILDING/SUBMITTING

Legal entity: **TXODDS Services LLC** (Illinois). Governing law: **England**. This is IN ADDITION to Superteam Earn's own terms (both apply).

### ⚠️⚠️ Eligibility — human-only submission rule (RESOLVES the Discord ambiguity from section 1)
> **§5: "The Hackathon is open only to natural persons. Entries must be created, developed and submitted by human participants. Automated systems, bots, autonomous agents, scripts or other non-human entities may not register for, participate in or submit entries to the Hackathon. TxODDS reserves the right to require participants to verify their identity and involvement in the creation of a submission. Any submission which, in TxODDS' reasonable opinion, has been generated, submitted or materially controlled by a bot, autonomous agent or other non-human process may be disqualified."**

**Practical read for this project**: this creates real tension with the "Trading Tools and Agents" track's own branding (which explicitly invites autonomous agents, "Agent vs Agent Arena," etc., and whose eligibility line separately says "Open to individuals, teams... and AI agents"). Reconciling: the **product/tool you build CAN be an autonomous agent** (that's literally the track's point) — but the **hackathon ENTRY (the submission act itself, the repo, the writeup) must be created and submitted by a human, with clear human involvement**, not an AI operating unsupervised end-to-end including the submission step. Given this project is human-directed (Alven building with AI-assisted tooling, not an autonomous agent self-submitting), this should be fine — but **do not automate the actual submission process itself**, and be ready to demonstrate human involvement if asked.

### Eligibility (general)
- 18+, legally able to participate in their jurisdiction
- **Excluded**: TxODDS employees/contractors/directors/officers, affiliates, immediate family/same-household of such persons
- **Teams**: max 3 members, all must individually meet eligibility, must designate ONE team leader as point of contact

### ⭐ Prizes — max ONE prize total, even across multiple tracks
> **§8: "Participants can enter multiple tracks but cannot win more than one prize in total."** (RESOLVES the "unclear multi-track policy" open question from section 1/5.)
- Prizes paid in **"the stablecoin designated by TxODDS"** (not the participant's choice) — resolves that this is TxODDS's call, though the exact stablecoin still isn't named here (likely USDT given listing headline figures, but not 100% confirmed by this clause alone).
- Winner solely responsible for providing a compatible wallet address; TxODDS not liable for wrong address, lost wallet access, network failure, de-pegging, etc.
- Gas fees to transfer the prize are deducted from the prize unless stated otherwise.
- Prize payments may come from Superteam Earn (not necessarily directly from TxODDS).
- Judges' decisions are **final and binding**.
- If a team wins, ONE nominated member receives the prize — team responsible for internal distribution, TxODDS not involved in team disputes.
- Winner notified via email; may need to sign an eligibility/liability/publicity affidavit within 30 days or forfeit (alternate winner selected).

### Originality / conduct
- Projects must be **original work created during the Hackathon period**. Pre-existing code/components allowed ONLY if publicly available + properly attributed (open-source libs, APIs). **"Significant portions of the project must be developed during the Hackathon."**
  - ⚠️ Relevant to this project: reusing DreamTend/Stax as INSPIRATION/pattern reference is fine (that's normal engineering practice + these are the user's own prior projects, not third-party IP concerns), but the actual TxODDS-hackathon submission's core logic should be genuinely built during the hackathon window, not a re-skinned copy-paste of a pre-existing unrelated project.
- No cheating/plagiarism/submitting others' work → immediate disqualification.
- Must comply with all applicable laws incl. gambling-related regulations in participant's jurisdiction; TxODDS may exclude participants from restricted/prohibited jurisdictions.

### Submission & judging mechanics
- **Judges must be able to test WITHOUT incurring any fee/cost**: *"TxODDS shall not be required to purchase any software, subscription, licence, token, cryptocurrency, digital asset or third-party service, nor establish any blockchain wallet or account with a third party, in order to assess or test a submission. Submissions may be disqualified should this requirement not be met."* → **Practical build implication: don't require judges to fund a wallet or buy anything to test your product.** Provide a pre-configured demo/test path (matches the earlier "demo video is heavily weighted" pattern from the Discord/listing — video + a testable devnet endpoint judges can hit for free is the safe path).
- TxODDS does not operate/control/guarantee Solana blockchain or any third-party wallet/validator/RPC/exchange/bridge — no liability for blockchain-related losses, network issues, exploits, etc. **Participant bears all gas/tx fees.**

### IP & branding
- Participant **retains ownership** of their submitted project/code.
- Grants TxODDS a broad license to showcase/use for hackathon promotion (website, social, internal review, demos to stakeholders) — non-exclusive but perpetual/irrevocable for that purpose.
- **⚠️ No FIFA branding**: *"Nothing in the Hackathon grants any right to use FIFA branding, logos, marks or intellectual property. Participants must not imply any sponsorship, endorsement or affiliation with FIFA or any tournament organiser."* → Don't put FIFA logos/marks in the product or its marketing/demo.
- TxODDS does **not** guarantee submission confidentiality — assume anything submitted may become public.

### Data license (hackathon-specific — narrower than general API terms)
- Data licensed **solely for hackathon participation**; **license automatically terminates when the hackathon concludes**.
- Cannot redistribute/publish/sublicense/sell/share the Data.
- **Cannot attempt to extract, reconstruct, replicate, or create competing products using the Data, APIs, methodologies or systems.**
- Data/APIs/infra provided "as is" — TxODDS disclaims all warranties.

### Liability
- Hackathon-specific liability cap: **TxODDS total aggregate liability ≤ USD $500** (lower than the general API terms' $1,000 cap).
- No liability for indirect/consequential damages, third-party conduct, blockchain-related losses.

## 28. API Reference tab — structure/index (separate from Documentation tab; this is the endpoint-level REST reference, not an SDK)

18 endpoints across 4 categories. Tracker below — check off as pasted/read in detail:

**Authentication**
- [x] POST — Start a new guest session (`/auth/guest/start`)
- [x] POST — Activate subscription and retrieve API token (`/api/token/activate`)

**Purchase**
- [x] POST — Request a partially signed purchase quote given wallet pubkey + required TxLINE amount in whole units (`/api/guest/purchase/quote`)

### API Reference detail — Authentication + Purchase (precise, from API Reference tab)

**`POST /auth/guest/start`**
- Initiates anonymous guest session, returns JWT for `Authorization: Bearer` header on subsequent calls.
- ⚠️ **New precise fact: guest JWT expires after 30 days** (not previously stated with a number — earlier docs only said "renew if 401").
- Response `200 application/json`: `{ token: string }` (required).

**`POST /api/token/activate`**
- Activates subscription, issues long-lived API token.
- ⚠️ **Supports 3 explicit modes** (new precise detail):
  1. **Legacy subscriptions** — pass empty `leagues` array
  2. **Standard matrix subscriptions** — pass empty `leagues` array (this is what the free World Cup tier uses)
  3. **Custom matrix subscriptions** — pass requested league IDs, up to the purchased limit
  - "The entire request intent must be cryptographically signed by the user's wallet."
- Headers: `Authorization: Bearer <session-jwt>` required.
- Body (`application/json`): `txSig` (string, required), `walletSignature` (string, required), `leagues` (int32[], optional).
- ⚠️ **Response `200` is `text/plain`, NOT JSON** — the response body IS the token string directly (not `{token: "..."}`). This explains why the Quickstart code defensively does `activationResponse.data.token || activationResponse.data` — handles both shapes safely.

**`POST /api/guest/purchase/quote`** (paid path only — NOT needed for free World Cup tier)
- Generates a partially-signed Solana tx for purchasing TxL utility tokens.
- **Pricing**: Base rate **1,000 TxL = 1 USDT** (matches Subscription Tiers conversion). Premium/markup **currently 0 basis points (0%)**.
- **Prerequisites**: `buyerPubkey` wallet must already hold an active Associated Token Account (ATA) for USDT, and have sufficient USDT balance for the total quoted cost.
- Headers: `Authorization: Bearer <guest-jwt>` required.
- Body: `buyerPubkey` (string, required), `txlineAmount` (int64, required, **range 1 ≤ x ≤ 100,000,000** — i.e. max 100,000 USDT equivalent per quote).
- Response `200 application/json`: `transactionBase64` (string), `baseUsdtCost` (number, raw cost before fees), `feeUsdtAmount` (number, currently 0), `totalUsdtCharged` (number, final amount) — all required. Returned tx must be signed by user's wallet before broadcast (see Quickstart Step 2 code, section 8).

**Fixtures**
- [x] GET — Latest snapshot of fixtures, optionally starting at/within 30 days after a given epoch day (`/api/fixtures/snapshot`)
- [x] GET — All fixture updates for a single fixture on a given day
- [x] GET — Merkle proof for a specific fixture update
- [x] GET — Merkle proof for an entire hourly batch of fixtures

**Odds**
- [x] GET — Snapshots of latest odds for a fixture (`/api/odds/snapshot/{fixtureId}`)
- [x] GET — Currently live odds updates for a single fixture
- [x] GET — JSON array of all odds updates from a specific historical 5-minute interval (`/api/odds/updates/{epochDay}/{hourOfDay}/{interval}`)
- [x] GET — Real-time SSE stream of odds updates (`/api/odds/stream`)
- [x] GET — Merkle proof for a specific odds update (ties to `daily_batch_roots` PDA)

**Scores**
- [x] GET — Snapshots for each action in the latest score events for a fixture (`/api/scores/snapshot/{fixtureId}`)
- [x] GET — JSON array of all score updates from a specific historical 5-minute interval (no live data)
- [x] GET — Sequence of score updates for a single fixture WITHIN THE CURRENT 5-min interval
- [x] GET — FULL sequence of score updates for a single fixture
- [x] GET — Real-time SSE stream of scores updates (`/api/scores/stream`)
- [x] GET — Merkle proof for fixture statistics (`/api/scores/stat-validation`)

### ✅✅ API REFERENCE TAB: 18/18 ENDPOINTS COMPLETE

## 29. API Reference — Fixtures endpoints (4/4 complete)

All 4 use headers `Authorization: Bearer <jwt>` + `X-Api-Token: <token>` (both required, every endpoint from here on — not repeated below).

**`GET /api/fixtures/snapshot`** — latest fixtures snapshot
- Query: `startEpochDay` (int, optional, default = current UTC day — fixtures starting at/within 30 days after this day), `competitionId` (int32, optional filter)
- Response `200 application/json`, fields (all required): `Ts` (int64), `StartTime` (int64), `Competition` (string), `CompetitionId` (int32), `FixtureGroupId` (int32), `Participant1Id` (int32), `Participant1` (string), `Participant2Id` (int32), `Participant2` (string), `FixtureId` (int64), `Participant1IsHome` (boolean)

**`GET /api/fixtures/updates/{epochDay}/{hourOfDay}`** — fixture updates for a given hour
- Path: `epochDay` (int, required, days since Unix epoch), `hourOfDay` (int, required, 0-23)
- Response: same schema as snapshot above. Returns empty list if no updates found.

**`GET /api/fixtures/validation`** — Merkle proof for a SPECIFIC fixture update
- Query: `fixtureId` (int64, required), `timestamp` (int64, optional Unix ms, defaults to now)
- Explains the mechanism: "Each fixture... is part of an hourly batch... Blockchain holds the Merkle root... of each fixture belonging to that batch. This endpoint returns the Merkle proof... up to but not inclusive of that Merkle root." Feed this + the fixture record into the on-chain validation call.
- Response: `snapshot` (Fixture object), `summary` (FixtureBatchSummary object), `subTreeProof` (ProofNode[]), `mainTreeProof` (ProofNode[]) — all required. This is the source data for the `fixture_validation_view_only.ts` devnet script (section 24) and the `deriveTenDailyFixturesPda` PDA pattern (section 18).

**`GET /api/fixtures/batch-validation`** — Merkle proof for an ENTIRE hourly batch
- Query: `epochDay` (int, required), `hourOfDay` (int, required, UTC 0-23)
- Explains: validates the batch METADATA itself (not one fixture) — "the metadata for the specified hourly batch, along with a Merkle proof... to verify against a higher-level tree or commitment."
- Response: `metadata` (BatchMetadata object), `proof` (ProofNode[]) — both required.

## 30. API Reference — Odds endpoints (5/5 complete)

Common response schema (odds record — used identically across snapshot/live-updates/historical-updates endpoints), all required unless noted:
`FixtureId` (int64), `MessageId` (string), `Ts` (int64), `Bookmaker` (string), `BookmakerId` (int32), `SuperOddsType` (string), `InRunning` (boolean), `GameState` (string, optional), `MarketParameters` (string, optional), `MarketPeriod` (string, optional), `PriceNames` (string[], optional), `Prices` (int32[], optional), `Pct` (string[], optional — **strictly 3 decimal places, or `"NA"` for quarter handicap lines; regex `^(NA|\d+\.\d{3})$`**).

**`GET /api/odds/snapshot/{fixtureId}`** — latest odds per unique market line
- Query: `asOf` (int64, optional Unix ms — historical snapshot at that point; omit for live current-5min snapshot)
- Returns the odds record schema above.

**`GET /api/odds/updates/{fixtureId}`** — live odds updates
- "All available odds offers... from the current, **in-memory 5-minute cache**." (No query params beyond the path.)
- Same odds record schema.

**`GET /api/odds/updates/{epochDay}/{hourOfDay}/{interval}`** — historical odds for a specific 5-min interval
- Path: `epochDay` (int, required), `hourOfDay` (int, required 0-23), `interval` (int, required, **0-indexed 5-minute interval within the hour, 0-11**)
- Query: `fixtureId` (int64, optional filter)
- Same odds record schema.

**`GET /api/odds/stream`** — SSE stream
- Query: `fixtureId` (int64, optional filter for single fixture)
- Header (optional): `Last-Event-ID` (string) — resume stream from a specific event.
- **2 event types**: (1) Data messages — `id` format is `timestamp:index`, `data` = JSON odds record; (2) **Heartbeats** — `event: heartbeat`, may carry `data: {"Ts": 12345}`.
- Response `text/event-stream`: `id`, `event`, `data` (OddsPayload object).

**`GET /api/odds/validation`** — Merkle proof for ONE odds update
- Query: `messageId` (string, required — the unique message ID), `ts` (int64, required — timestamp of the odds message)
- Response: `odds` (Odds object), `summary` (OddsBatchSummary object), `subTreeProof` (ProofNode[]), `mainTreeProof` (ProofNode[]) — all required. This is what feeds `daily_batch_roots` PDA validation (section 18) — the odds-equivalent of scores' `validateStat`.

## 31. API Reference — Scores endpoints (6/6 complete — header was stale, content below already covers all 6)

**`GET /api/scores/snapshot/{fixtureId}`** — snapshots for each action in the latest score events

⚠️⚠️ **TWO IMPORTANT DISCREPANCIES TO VERIFY EMPIRICALLY BEFORE WRITING A PARSER:**

1. **Field casing mismatch vs. raw stream payloads.** This REST snapshot endpoint's documented schema uses **camelCase** (`fixtureId`, `gameState`, `startTime`, `statusId`, `action`, `seq`, etc.) — but the RAW SSE stream payload samples pasted from Discord (section 3) used **PascalCase** (`"FixtureId":18187298`, `"StatusId":100`, `"Action":"disconnected"`), matching the PascalCase style also seen in the Fixtures/Odds REST schemas (section 29-30). **This could mean**: (a) the interactive schema-doc tool renders field names lowercase as a display convention while the actual JSON is PascalCase, (b) the snapshot endpoint genuinely differs in casing from the stream endpoint, or (c) a docs inconsistency. **Action: log one real response from `/api/scores/snapshot/{fixtureId}` early during build and check actual casing before hardcoding field access.**

2. **`statusSoccerId` enum includes an undocumented `"END"` value.** The enum list here is: `A, C, END, ET1, ET2, F, FET, FPE, H1, H2, HT, HTET, I, NS, P, PE, TXCC, TXCS, WET, WPE` (20 values) — but the Soccer Feed page's Game Phase Encoding table (section 15) only documents 19 phases with NO `"END"` value (it has `F`=5="Ended (finished)" instead). **`END` is not explained anywhere in the docs read so far.** Possibly a duplicate/alias for `F`, a newer/different phase, or a schema-generator artifact. **Flag as unresolved — worth asking in TxODDS Discord if this matters for the build, or just defensively handle both `F` and `END` as "ended" states if encountered.**

### Full field list (top-level, `/api/scores/snapshot/{fixtureId}` response)
Query: `asOf` (int64, optional Unix ms — historical snapshot up to that time; omit for live).

Required: `fixtureId` (int32), `gameState` (string), `startTime` (int64), `isTeam` (boolean), `fixtureGroupId` (int32), `competitionId` (int32), `countryId` (int32), `sportId` (int32), `participant1IsHome` (boolean), `participant2Id` (int32), `participant1Id` (int32), `action` (string), `id` (int32), `ts` (int64), `connectionId` (int64), `seq` (int32).

Optional: `coverageSecondaryData` (bool), `coverageType` (string).

**Status enums (3 separate fields!):**
- `statusId` — generic/combined enum. Values: `A, C, F, FO, HT, I, NS, OB, OB1..OB11(skipping some), OT, OT1..OT12, Q1, Q1B, Q2, Q3, Q3B, Q4, TXCC, TXCS, WO`. **This is shaped like the American Football phase encoding** (section 16 — OB1-12/OT1-12 overtime naming matches football exactly), suggesting `statusId` may default to the football-style taxonomy or is sport-agnostic/generic.
- `statusBasketballId` — sport-specific. Values: `A, C, F, FO, H1, H2, HT, I, NS, OB, OT, Q1, Q1B, Q2, Q3, Q3B, Q4, TXCC, TXCS, WO`.
- `statusSoccerId` — sport-specific. Values: `A, C, END, ET1, ET2, F, FET, FPE, H1, H2, HT, HTET, I, NS, P, PE, TXCC, TXCS, WET, WPE` (⚠️ includes undocumented `END`, see discrepancy #2 above). **For soccer/World Cup building, use `statusSoccerId`, not the generic `statusId`.**

**`type`** enum: `Basketball | Soccer | UsFootball` (which sport this record is for).
**`confirmed`** (boolean, optional) — matches the `Confirmed:true` field seen in Discord raw payloads (section 3); this IS the "use confirmed events only" field TxODDS told the community to prefer.

**Nested sport-specific objects** (all optional, populated based on `type`): `clock` (UsFootballFixtureClock), `down` (UsFootballFixtureDown), `inPlayInfo` (InPlayInfo), `kickoffInfo` (KickoffInfo), `score`/`data` (UsFootball-specific), `scoreBasketball`/`dataBasketball`, `scoreSoccer`/`dataSoccer`, `stats` (Map_ScoreStatKey — **this is the `Stats{...}` object decoded via section 15's period-encoding formula**), `participant` (int32), `kickoff` (KickoffDetails), `lineups` (LineupData[]), `possession` (int32), `possessionType` (enum: `AttackPossession | DangerPossession | HighDangerPossession | SafePossession`), `parti1StateSoccer`/`parti1StateUsFootball`/`parti1StateBasketball`, `parti2StateSoccer`/`parti2StateUsFootball`/`parti2StateBasketball`, `possibleEventSoccer`/`possibleEventUsFootball`, `playerStatsSoccer`/`playerStatsUsFootball`.

### Remaining 5 Scores endpoints — full detail

**`GET /api/scores/updates/{epochDay}/{hourOfDay}/{interval}`** — historical 5-min interval, NO live data
- Path: `epochDay`, `hourOfDay` (0-23), `interval` (0-11) — all required.
- Query: `fixtureId` (int32, optional filter — ⚠️ typed **int32** here, vs `int64` used for fixtureId elsewhere; minor docs inconsistency, not a practical issue since fixture IDs like `18209181` fit in int32 range).
- Response: identical full schema to `/api/scores/snapshot/{fixtureId}` (section 31 above — camelCase, 3 status enums, nested sport objects).

**`GET /api/scores/updates/{fixtureId}`** — sequence WITHIN THE CURRENT 5-min interval, WITH live data
- Path: `fixtureId` (int64, required).
- "Return a json array of all score updates for a single fixture included within the current 5-minute interval **with live data if it exists**." — this is the narrow/current-window variant (distinct from `/historical/{fixtureId}` below).
- Response: same full schema as snapshot.

**`GET /api/scores/historical/{fixtureId}`** — FULL sequence for a fixture
- Path: `fixtureId` (int64, required).
- "Return a json array of all score updates for a single fixture **provided its start time is between two weeks and six hours in the past** from current time." — reconfirms the historical availability window from section 22.
- Response: same full schema as snapshot.

**`GET /api/scores/stream`** — SSE, real-time
- Same pattern as odds stream (section 30): `Last-Event-ID` header optional (resume), `fixtureId` query optional filter.
- 2 event types: data messages (`id` = `timestamp:index`, `data` = JSON Scores record) and heartbeats (`event: heartbeat`, `data: {"Ts": ...}`).
- Response `text/event-stream`: `id`, `event`, `data` (Scores object).

**`GET /api/scores/stat-validation`** — ⭐ Merkle proof for fixture statistics (deepest endpoint, powers section 23's validateStat/V2 code)

> **3-level Merkle hierarchy, explicitly documented here for the first time:**
> 1. A **main batch** contains summaries for multiple fixtures.
> 2. Each **fixture summary** is the root of a sub-tree of all score update EVENTS for that fixture.
> 3. Each **score update event** is the root of a sub-tree of all the individual STATISTICS it contains.
>
> This endpoint returns the full proof chain connecting the stat(s) all the way to the main batch root published on-chain.

- **Two mutually exclusive request modes** (confirmed explicitly, matches section 23's Legacy/V2 split):
  - **Legacy Mode** (`statKey`, optional `statKey2`) → returns `ScoresStatValidation` payload, proofs for 1-2 specific stats.
  - **V2 Mode** (`statKeys`, comma-separated) → returns `ScoresStatValidationV2` payload, dynamic N-dimensional proofs across ANY number of requested stats.
- Query: `fixtureId` (int32, required — ⚠️ again int32 here vs int64 in path-param style endpoints), `seq` (int32, required — the sequence number, must be real/≥1 per section 23-25's repeated warnings), `statKey` (int32, optional, legacy — example given: "1 for 'Participant1_Score'"), `statKey2` (int32, optional, legacy two-stat), `statKeys` (string, optional, V2 comma-separated list).
- Response `200 application/json` (Legacy shape shown, V2 adds/differs per `ScoresStatValidationV2`):
  - `ts` (int64, required)
  - `statToProve` (ScoreStat object, required)
  - `eventStatRoot` (typed as `file`, required — i.e. returned as raw/encoded bytes, matching the `toBytes32()` helper in section 23 that accepts base64/hex/array)
  - `summary` (ScoresBatchSummary object, required)
  - `statProof` (ProofNode[], required)
  - `subTreeProof` (ProofNode[], required)
  - `mainTreeProof` (ProofNode[], required)
  - `statToProve2` (ScoreStat object, **optional** — only present for legacy two-stat mode)
  - `statProof2` (ProofNode[], **optional** — only present for legacy two-stat mode)
- On-chain execution: "the user can execute an on-chain transaction to validate that a supplied strategy holds against the extracted stats" — e.g. score > threshold, or a binary condition between two stats. This is exactly `validateStat`/`validateStatV2` from section 23.

---

## 📋 API Reference read status: **18/18 endpoints — 100% COMPLETE.** Combined with Documentation tab (27 sections, also complete except low-priority FAQ-Overview which 404'd/skipped), the TxLINE documentation research is now comprehensively done. Ready to start building.

Note: several of these already have partial coverage from Documentation > Examples (sections 21-24) — API Reference should give the PRECISE param/schema/response detail Documentation's narrative examples didn't fully spell out (e.g. exact query param names, required vs optional, response field types). Overwrite/supplement the relevant sections above as each endpoint is pasted.

## 7. Key links

- Hackathon: https://superteam.fun/earn/hackathon/world-cup
- Prediction Markets track: https://superteam.fun/earn/listing/prediction-markets-and-settlement/
- Trading Tools & Agents track: https://superteam.fun/earn/listing/trading-tools-and-agents/
- TxODDS company site: https://txodds.net/
- TxLINE docs: https://txline-dev.txodds.com/docs
- Odds validation endpoint: https://txline-dev.txodds.com/docs/#/Odds/getApiOddsValidation
- Reference repo (devnet + mainnet examples): https://github.com/txodds/tx-on-chain

---

## 32. Live re-verification pass — 2026-07-13 (repo + API hit directly, not just docs reading)

Today is **2026-07-13**, 6 days before submission close (2026-07-19 23:59 UTC). Went back to the source (GitHub API + a live curl against devnet) instead of re-reading cached docs, specifically to check what's changed since the docs were last pasted in and to close open questions from section 5.

### ⭐⭐ NEW: `validateStatV3` is live on-chain NOW — not yet in prose docs, only in code
Confirmed via the devnet IDL (`examples/devnet/idl/txoracle.json`, instruction list includes `validate_stat_v3` alongside `validate_stat`/`validate_stat_v2`) and a brand-new example script `examples/devnet/scripts/subscription_scores_v3c.ts` (added by commit **"NOJIRA Update devnet types and IDL and add V3 validation example"**, 2026-07-11 13:50 UTC — i.e. **2 days old** as of this research).

- **New REST endpoint**: `GET /scores/stat-validation-v3?fixtureId=...&seq=...&statKeys=...` (parallel to the existing legacy/V2 `stat-validation` endpoint, separate path).
- **New on-chain instruction**: `validateStatV3(payload: StatValidationInputV3, strategy: NDimensionalStrategy) -> bool`. `strategy` reuses the same `NDimensionalStrategy` type as V2 (geometricTargets/distancePredicate/discretePredicates — nothing new there).
- **What's actually new — the proof shape.** V2's `StatValidationInput` gives each stat its own full `statProof: ProofNode[]` (one complete Merkle path per stat). V3's `StatValidationInputV3` replaces that with:
  ```
  leaves: StatLeaf[]            // { stat: ScoreStat, statProof: ProofNode[] } — still per-leaf proof to the event root
  multiproofHashes: ProofNode[] // ONE shared multiproof covering ALL requested leaves together
  leafIndices: number[]         // position of each leaf in the multiproof
  ```
  i.e. V3 adds a **Merkle multiproof** layer on top — instead of N independent proof-to-root chains for N stats, it's leaf-proofs-to-event-root (unchanged) PLUS one shared, deduplicated proof from event-root up to the main batch root. This is a **direct, confirmed fix for the MTU/tx-size risk** flagged as a rumor in section 3 (`validate_stat_v3... reduces risk of hitting an MTU limit on the older validate_stat`) — the more stats you validate at once, the more V3's shared multiproof saves vs V2's N-independent-proofs, because Solana tx size is the actual bottleneck (`ComputeBudgetProgram.setComputeUnitLimit({ units: 1_400_000 })` is set in every example — compute isn't the constraint, tx payload SIZE is).
- **Not yet documented in prose**: grepped `documentation/programs/{devnet,mainnet}.mdx` and `documentation/examples/onchain-validation.mdx` for "v3"/"multiproof" — zero hits in any of them. The only source of truth for V3 right now is the IDL + the example script. **This is a live opportunity**: a submission that visibly uses `validateStatV3` and explains the multiproof-vs-per-stat-proof tradeoff would be demonstrating deeper TxLINE engagement than the prose docs even provide yet — genuinely hard for another team to casually copy since it's 2 days old and undocumented.
- Demo script validates the SAME `game_finalised` record with V2 (5 strategies) and V3 (5 strategies) side-by-side for direct comparison — fixture `18218149`, `seq=1087`, stat keys `1002,1007,2007,1` (goals-related, per section 15's key scheme).

### Repo activity — very fresh, actively syncing mainnet to devnet parity
Recent commits (all 2026-07-09 through 2026-07-11, i.e. within the last 4 days of this check):
- 2026-07-11: 3 separate commits adding **mainnet** example scripts — 1-stat scores validation, odds subscription+streaming, fixture validation (previously devnet-only in the docs I'd read).
- 2026-07-11: devnet IDL/types updated + V3 example added (see above).
- 2026-07-10: PR merged clarifying devnet activation/validation troubleshooting; a commit note *"Using mainnet idl (retaining devnet address for devnet)"* — IDL itself is now shared/unified between networks, only the deployed program address differs per network.
- 2026-07-09: several `docs:` commits — soccer stat prefixes clarified, soccer feed v1.1 reference updated, final-outcome/fixture-state notes added, validation docs synced with latest examples, score sequence + phase validation clarified.
→ **Practical read**: spec churn flagged as a risk in section 3 is real and ongoing, but it's converging (mainnet catching up to devnet, docs syncing to examples) rather than diverging. Re-check the IDL instruction list before final build in case V3 gains docs or a V4 shows up.

### Confirmed still-open (checked specifically, found nothing new)
- **Position ID mapping (unitId=0: 34=GK/35=DEF/36=MID/37=FWD)** — grepped `documentation/scores/soccer-feed.mdx` for "unitId"/"position" — zero hits. Still community-crowdsourced only, not officially documented.
- **`statusSoccerId` undocumented `"END"` value** (section 31 discrepancy) — same grep, zero hits. Still unresolved.
- **StatusId:100 transport-event bug** (section 3, `disconnected` action carrying `StatusId:100`) — no changelog/commit message matching "StatusId" or "disconnected" bugfix found in the last 15 commits. Status unknown — the official settlement rule (section 13/23/25: triple-check `action==="game_finalised"` AND `statusId===100` AND `period===100`) is the correct mitigation regardless of whether the underlying bug was ever fixed, so this doesn't block building, just: keep the triple-check, don't relax it.
- **Currency question** — re-read `faq-overview.mdx` in full (it only covers TxL-purchase currency: USDT→TxL, 1 USD=1,000 TxL). Still no explicit statement on what currency a CONTESTANT'S product should use for user-facing wagering/settlement. Track 1's own rules (section 2) already answer this in practice: build wagering pools in USDC (or similar), not the TxL credit token — that guidance stands.

### Live connectivity check (devnet, right now)
- `POST https://txline-dev.txodds.com/auth/guest/start` → **200, live**, returns `{"token": "<JWT>"}` exactly as documented. API is up and responsive as of this check.
- `GET /api/fixtures/snapshot` with JWT but no API token → `403 "Missing API token"` (as expected — didn't attempt full activation, that needs a funded devnet wallet + on-chain subscribe tx, out of scope for a docs/API research pass).
- **Schedule doc (`documentation/scores/schedule.mdx`) is stale**: still lists only 1 quarter-final fixture (France v Morocco, `18209181`, Jul 9) as the latest confirmed entry — same as what was captured in section 14 days ago. But the new V3 example script references **fixture `18218149`** (higher ID, i.e. later match) with a `game_finalised` record already available — meaning the real tournament has progressed further than the static schedule page shows. **Don't hardcode the schedule table for the build — always hit the live `/api/fixtures/snapshot` endpoint.**

### ⚠️ Timing risk — the World Cup final and the submission deadline are the same day
Public knowledge: 2026 World Cup final is **2026-07-19** — the exact submission close date (23:59 UTC). Schedule doc confirms quarterfinals started 2026-07-09; standard bracket timing puts **semifinals around 2026-07-14 to 2026-07-15** (not yet listed in the static schedule doc, but should appear via the live fixtures endpoint soon). **Practical implication: the semifinals are the last tournament stage with enough runway after the match to actually record/edit/polish a "live" demo video before the deadline.** A demo built around the final itself has zero slack — the match and the deadline land on the same day. Plan the demo-recording match around a semifinal, not the final.

### Reconsidered — Predit's actual track fit (2026-07-13, after re-reading verbatim live Superteam Earn track pages)

User pasted the full live listing pages for all 3 tracks (verbatim, current). Two things this corrected:

1. **Submission counts are much higher now than the earlier snapshot** (section 2's table is stale): **Prediction Markets and Settlement = 70** submissions, **Consumer and Fan Experiences = 59**, **Trading Tools and Agents = 58**. (Earlier snapshot had 42/27/36 — all three roughly doubled since that research pass; 6 days remain as of this check.) Update any "least competition" reasoning accordingly — Consumer is still the smallest of the three (59), but the gap to the others has narrowed a lot.
2. **Independent confirmation of the WC-final-on-deadline-day finding**: a comment on the Trading Tools listing (Nico Chikuji, ~16 days before this check) asks *"the World Cup finishes on the same day that this submission closes. Is this intended?"* — matches the timing risk already flagged in this file from the schedule.mdx research (final = July 19 = submission close). Independently corroborated by a community member, not just inferred.
3. **Predit's track fit, re-examined against the verbatim track text**: earlier framing in this file called Predit primarily a Track 1 match ("Prediction Market Viewer") with Track 2 as secondary. Re-reading Predit's own tagline — *"a creator-based platform built to **engage communities** using on-chain prediction markets"* — and its actual mechanic (creators publish picks → followers **follow/fade** in social threads → reputation/leaderboard for **both** creator and audience → optional CHZ staking/monetization, with actual fund custody/settlement **delegated externally to Polymarket**, not a custom-built trustless AMM/escrow) — the honest read is that Predit's distinctive, load-bearing product surface is the **community/creator engagement + leaderboard + monetization layer**, not a from-scratch on-chain settlement engine. Track 1's own ideas ("Decentralized Prediction Markets & AMMs", "Parametric Sports Insurance") are specifically about building the escrow/AMM/CPI-into-`validate_stat` fund-custody plumbing — that's NOT what made Predit distinctive; Predit's Prediction Registry is closer to an activity/reputation log than a funds-holding settlement contract. Track 2's judging criteria — "Originality & Value Creation: genuinely new consumer experience or **fan interaction model**", "Commercial & Monetization Path" — map onto Predit's actual core mechanic (follow/fade, creator+audience leaderboard, monetization) more directly than Track 1's settlement-engine framing does. **Corrected verdict: a Predit-inspired build is a stronger substantive fit for Track 2 (Consumer and Fan Experiences)** than Track 1 — Track 1 elements (outcome logging reconciled against `validate_stat`) can still be a supporting piece, but the primary track should be Track 2.

### Sources for this pass
- `https://github.com/txodds/tx-on-chain` (GitHub REST API: `/contents/...`, `/commits`) — repo structure, recent commit log, raw file fetches (`raw.githubusercontent.com/txodds/tx-on-chain/main/...`).
- `examples/devnet/idl/txoracle.json` — authoritative instruction/type list (parsed with `node -e`, not just grep — IDL is JSON, not text).
- `examples/devnet/scripts/subscription_scores_v3c.ts` — only usage example of V3 anywhere.
- `documentation/scores/schedule.mdx`, `documentation/programs/{devnet,mainnet}.mdx`, `documentation/examples/onchain-validation.mdx`, `faq-overview.mdx` — grepped directly for gaps, not just re-read.
- Live curl against `https://txline-dev.txodds.com` (guest auth + an intentionally-incomplete fixtures call to confirm the auth-layering error shape).

---

## 33. Predit repo full codebase audit — D:\ethglobal (2026-07-13, every non-vendor file read)

User cloned the actual Predit hackathon repo locally to `D:\ethglobal`. Read every non-vendor/non-build file across `contracts/`, `cre/lock-market/`, `ui/` (active Next.js app), `frontend/` (legacy app, per its own README "reference-only"), and root docs — 13 clusters, ~290 files total, via parallel sub-agents (each agent actually called Read on every file in its cluster, 288 total Read calls across the pass). Full reports below, one section per cluster.

### Root planning/meta docs

Cluster ini berisi 8 file dokumentasi/meta-planning di root repo `D:\ethglobal` (proyek **Predít/Predit** — prediction market komunitas berbasis Chiliz + Polymarket + Chainlink CRE untuk **Chainlink Hackathon**, https://chain.link/hackathon). Semua file sudah dibaca penuh.

**1. `AGENTS.md` — panduan kontributor/struktur repo.**
Mendefinisikan tiga modul: `contracts/` (Foundry Solidity — kontrak inti **`PredictionHub`**, **`Market`**, **`NetworkConfig`**, folder `ABI/` untuk artifact yang dikonsumsi frontend), `frontend/` (Next.js 15 + TypeScript, dengan `app/`, `src/components`, `src/hooks`, `src/lib`), dan `cre/lock-market/` (Chainlink CRE workflow: `main.ts`, `workflow.yaml`, config JSON). Command penting: `forge build`, `npm test`/`npm run test:gas`/`npm run coverage`, `npm run extract-abi`, `npm run dev`/`npm run build`/`npm run lint` (frontend), `bun install` (CRE), dan `cre workflow simulate ./cre/lock-market --target=staging-settings` dari root. Menetapkan style Solidity (`forge fmt --check`, explicit revert message) dan naming convention (PascalCase komponen, `useX.ts` hooks, `route.ts` untuk API handler). Merujuk metodologi **ExecPlan** ke path **`.agent/PLANS.md`** — tapi file `PLANS.md` yang sebenarnya ada di root repo, bukan di folder `.agent/`, jadi ada **mismatch path** antara referensi dan lokasi file nyata.

**2. `FRONTEND_HANDOFF.md` — handoff singkat untuk kerja frontend.**
Isinya sangat ringkas: arahkan pembaca ke `MIGRATION_PLAN.md`, instruksi "kerja hanya di `ui/`", pakai ABI dari `contracts/ABI/`. Ada blok terkomentari (`<!-- -->`) berisi `cd /Users/viniciusassis/Developer/ethglobal/contracts && forge test` — **hardcoded absolute path macOS milik developer lama**, tidak relevan/portable di environment Windows `D:\ethglobal` saat ini. Alur test lokal yang aktif: jalankan `anvil` di terminal 1, lalu `forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --broadcast` di terminal 2, copy address hasil deploy ke config kontrak UI, lalu test full flow: **create community → create/import market → stake → trigger → settle → claim**.

**3. `HACKATHON_DELIVERY_PLAN.md` — ExecPlan utama hackathon (dibuat 2026-02-23, mengikuti format `PLANS.md`).**
Big picture: creator import market Polymarket → komunitas stake **CHZ** ke outcome → creator panggil `triggerExecution(outcome)` → bet dieksekusi di chain native Polymarket → pemenang klaim reward proporsional. Detail teknis kunci:
- Chain ID: **Chiliz mainnet 88888**, **testnet Spicy 88882**.
- `PredictionHub.sol` = factory pendaftaran creator + pembuatan market; `Market.sol` = market individual dengan staking **tiga outcome (A/B/Draw)**; `NetworkConfig.sol` = konfigurasi multi-chain.
- Kontrak saat ini **mock** return Polymarket lewat fungsi **`mockPolymarketReturn`** — belum ada integrasi nyata.
- CRE workflow jalan cron-schedule, memanggil endpoint Next.js **`/api/market/lock`**, pakai `cacheSettings` supaya cuma satu node DON yang benar-benar HTTP call (hindari eksekusi duplikat) — dinyatakan eksplisit **"currently broken"** menurut feedback user, root cause belum diketahui saat plan ditulis (Phase 3 hanya daftar generik "common failure modes").
- Progress checklist: nyaris semua item **belum dicentang** (`[ ]`), hanya satu yang selesai: pembuatan `V0_PROMPTS.md` (2026-02-23). Section `Surprises & Discoveries`, `Decision Log`, `Outcomes & Retrospective` semuanya masih placeholder `(To be populated...)` — **ExecPlan ini tidak dijaga sebagai living document** sesuai tuntutan `PLANS.md` sendiri.
- Keputusan CHZ: **Option A (simple) — direkomendasikan**: terima stake CHZ native, tahan sampai trigger, tampilkan nilai USD equivalent saat trigger (vs Option B: convert ke USDC tiap stake, lebih mahal gas+slippage). Keputusan ini **tidak pernah muncul dikonfirmasi ulang** di Live Decisions Log `README.md`, jadi statusnya ambigu — final atau masih terbuka.
- **Bug numbering**: ada **dua section berlabel "Phase 3"** (satu untuk "CRE Workflow Diagnosis and Fix", satu lagi untuk "Polymarket Execution Layer") — cacat dokumentasi.
- **Kontradiksi visual style**: Phase 2 menetapkan sistem warna putih/oranye (lihat `V0_PROMPTS.md`), tapi Phase 4 dalam file yang sama menulis "Use Chiliz brand colors (**red and black**)" — dua arahan desain yang bertentangan dalam satu dokumen.
- Interface kunci yang diminta ditambahkan: event `ExecutionTriggered(Outcome outcome, uint256 amountCHZ, string polymarketOrderId)` di `Market.sol`, fungsi `triggerExecution(Outcome outcome) external onlyCreator`; endpoint baru `frontend/app/api/polymarket/execute/route.ts` (POST `{marketAddress, outcome, amountCHZ}` → return `{success, txHash, polymarketOrderId}`); `frontend/src/lib/contracts.ts` mengekspor `PREDICTION_HUB_ADDRESS`, `PREDICTION_HUB_ABI` pakai wagmi `useContractRead`/`useContractWrite`.
- Berulang kali memakai **hardcoded absolute path mac** `/Users/viniciusassis/Developer/ethglobal/...` di banyak concrete steps.
- Testing plan (Phase 5) mendefinisikan E2E manual: deploy ke Chiliz Spicy, register creator, market dengan deadline pendek (5 menit), multi-user stake, trigger via CRE, simulasi Polymarket return, klaim reward, verifikasi balance/event — namun tidak ada bukti eksekusi nyata (section Artifacts kosong).

**4. `MIGRATION_PLAN.md` — "UI Integration Plan (ui/ only)" (update 2026-02-24, lebih baru dan menggantikan porsi frontend dari plan #3).**
17 langkah integrasi live data ke folder **`ui/`** (bukan `frontend/` lama). Stack: **wagmi + viem + @rainbow-me/rainbowkit + @tanstack/react-query**, chain config Chiliz Spicy **88882**. Hook standar: `useContractRead`, `useContractReads`, `useContractWrite` (return shape: loading/error/tx hash/receipt/canWrite). Endpoint API yang harus ada: `POST /api/market/lock`, `POST /api/market/submit-results`, `GET/POST /api/comments`, `GET /api/polymarket/events/[slug]`. Detail penting per langkah:
- Step 2: menyebut kompatibilitas **Next 16 + React 19** — **kontradiksi versi** dengan `AGENTS.md` yang bilang frontend pakai Next.js 15 (mengonfirmasi `ui/` memang app terpisah/lebih baru dari `frontend/` lama, bukan sekadar rename folder).
- Step 3: file baru `ui/lib/chains.ts`, `ui/lib/wagmi.ts`, `ui/lib/contracts.ts`, `ui/lib/abis/*` (disalin dari `contracts/ABI`).
- Step 4: `ui/app/providers.tsx` bungkus `WagmiProvider` → `QueryClientProvider` → `RainbowKitProvider`, dipasang di `ui/app/layout.tsx`.
- Step 7-9: baca `communityCount`, `communities(i)` dari `PredictionHub`; tulis `joinCommunity`/`leaveCommunity`; market detail baca metadata/deadline/state/pools/outcome/user stake, tulis `stake(outcome)` (payable) + `claim()`.
- **Step 10 — temuan penting yang eksplisit di dokumen**: protokol on-chain support **A/B/Draw**, tapi UI saat ini kebanyakan cuma render **YES/NO** — perlu "explicit mapping layer" dan secara eksplisit diperingatkan **"Ensure Draw flow is not dropped"**. Ini dikonfirmasi silang dengan `V0_PROMPTS.md` (lihat di bawah) yang justru men-desain UI biner YES/NO — jadi gap ini **belum diselesaikan** di titik dokumen ditulis.
- Step 14: env var sensitif — `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`, **`CREATOR_PRIVATE_KEY`**, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`. Server memegang private key untuk sign `triggerExecution`/lock — **risiko sentralisasi custody** untuk produk yang mengklaim "onchain transparan"; dokumen cuma bilang "jangan expose ke client" tanpa detail hardening (rotasi key, rate limiting endpoint, dsb).
- Step 1 menyebut output **`PARITY_CHECKLIST.md`** sebagai deliverable — file ini **tidak termasuk dalam cluster RootDocs** dan tidak diverifikasi ada/tidaknya.
- Step 17: hapus/karantina `ui/lib/data/mock-*` — menandakan sampai saat ini UI masih jalan di atas mock data.
- Estimasi effort: MVP live integration **5-7 hari**, full parity+polish **7-10 hari**. Non-goals eksplisit: tidak redesign arsitektur kontrak, tidak redesign visual besar-besaran selama fase integrasi.

**5. `PLANS.md` — spesifikasi meta tentang cara menulis "ExecPlan" (Codex Execution Plans).**
Bukan plan produk, tapi **template/aturan wajib** yang dipakai `HACKATHON_DELIVERY_PLAN.md`. Mewajibkan tiap ExecPlan punya section `Progress` (checklist bertimestamp), `Surprises & Discoveries`, `Decision Log`, `Outcomes & Retrospective`, plus `Context and Orientation`, `Plan of Work`, `Concrete Steps`, `Validation and Acceptance`, `Idempotence and Recovery`, `Artifacts and Notes`, `Interfaces and Dependencies`. Aturan format ketat: ExecPlan harus jadi satu fenced code block ` ```md ` kecuali ditulis langsung sebagai file `.md` tersendiri (dalam hal ini boleh tanpa backtick) — `HACKATHON_DELIVERY_PLAN.md` comply dengan aturan pengecualian ini. Menekankan self-contained (novice-readable tanpa context lain), harus punya "observable outcome" yang bisa diverifikasi manusia, dan wajib idempotent/aman diulang.

**6. `README.md` — "LIVE README", update 2026-02-24 (paling baru & jadi sumber kebenaran saat ini).**
Konsep produk: chat untuk koordinasi keyakinan → stake bareng → eksekusi satu posisi kolektif di Polymarket yang diimpor. **Product Decision** yang eksplisit dan penting secara desain:
- Creator (community owner) punya **keputusan final** soal outcome mana yang dieksekusi.
- **Fallback otomatis**: kalau owner tidak memutuskan, eksekusi terpicu otomatis **T-10 menit** sebelum Polymarket market berakhir.
- Ada aksi **cancel** untuk kesalahan menit-terakhir, dengan syarat: time-limited, auditable (event log + reason), abuse-resistant (misal satu cancel per market / rate limit) — namun mekanisme konkretnya belum dijelaskan di sini, hanya prinsip.
Stack terkini menegaskan `ui/` (bukan `frontend/`) sebagai **active implementation surface**; `frontend/` lama jadi reference-only. Live Decisions Log (2026-02-23 s/d 2026-02-24) mencatat progres nyata:
- Owner-first decision model + fallback T-10 + cancel diadopsi.
- UI baru "direcreate" di `ui/` — catatan lucu/penting: disebut **sama folder dengan "UI"** karena filesystem case-insensitive (mengonfirmasi dev pakai macOS) — status saat itu: **visual-only, masih mock data**.
- `MIGRATION_PLAN.md` ditambahkan sebagai plan integrasi.
- Ditegaskan ulang: kerja aktif cuma di `ui/`, `frontend/` legacy hanya referensi cepat.
- Review kesiapan kontrak: arsitektur "good for MVP" tapi **settlement accounting dan execution timing perlu diperbaiki sebelum demo/public**.
- Hardening pass di `Market.sol` diklaim selesai: **min stake enforcement**, **post-deadline execution guard**, **payout/value consistency**, **deterministic claim accounting**, timing-aware test update.
- Settlement API divalidasi untuk menerima **explicit zero-payout loss submission** (`payout = 0`).
- Klaim akhir: Foundry test suite **75/75 passing**, ekstraksi ABI selesai di `contracts/ABI/` — namun klaim ini **tidak disertai bukti/log terlampir** di dokumen manapun dalam cluster, jadi tidak terverifikasi hanya dari RootDocs.

**7. `V0_PROMPTS.md` — kumpulan prompt literal untuk v0.dev (deliverable Phase 2 dari `HACKATHON_DELIVERY_PLAN.md`, tercatat selesai 2026-02-23).**
Design system: warna **putih (#FFFFFF)** primer, **oranye (#FF6B35 primer, #FF8F5C light, #E55A2B dark)** aksen, teks abu gelap (#1A1A1A/#6B7280), success **#10B981**, danger **#EF4444**, warning **#F59E0B**, border **#E5E7EB**; font **Inter** (UI) + **Bebas Neue** (display/hero). 7 prompt komponen konkret: (1) Tailwind config, (2) Landing Hero — headline "Predict Together, Win Together", badge "Powered by Chainlink & Chiliz", CTA "Explore Communities"/"Connect Wallet", **stat kartu hardcoded/fabricated: "1,247 Active Bettors" dan "$127K Total Volume"** — ini instruksi eksplisit untuk menaruh angka fiktif di UI, risiko kalau ke-ship sebagai data asli; (3) Market Detail Page — tombol **YES/NO (hijau/merah)**, ini **kontradiksi langsung** dengan model kontrak tiga-outcome A/B/Draw yang dikonfirmasi di `HACKATHON_DELIVERY_PLAN.md` dan diflag sebagai gap terbuka di `MIGRATION_PLAN.md` step 10; (4) Creator Dashboard — stat cards (Total Communities, Active Markets, Total Volume, Win Rate), tabel market sortable, activity feed; (5) Community Page — filter chip, grid market card; (6) Staking Modal — tipe TypeScript literal `{ side: 'yes' | 'no', currentOdds: number, maxAmount: number, onStake: (amount: number) => Promise<void> }` (lagi-lagi biner, bukan enum A/B/Draw); (7) Navigation Header — logo teks hardcoded **"STACKBET"** — **nama brand berbeda** dari "Predít"/"Predit" yang dipakai di semua dokumen lain, menunjukkan proses rename (yang menurut Phase 1 `HACKATHON_DELIVERY_PLAN.md` masih harus dibrainstorm: StakeVerse, FanBet Collective, PredictClub, BetTogether, CrowdCall) tidak pernah difinalisasi secara konsisten. Instruksi integrasi di akhir file menaruh komponen ke **`frontend/src/components/`** — path lama, menandakan file ini ditulis sebelum keputusan migrasi ke `ui/`-only (`README.md`/`MIGRATION_PLAN.md` 2026-02-24), jadi **stale relatif terhadap arah proyek saat ini**.

**8. `.gitmodules` — satu-satunya git submodule di repo.**
Hanya mendaftarkan `contracts/lib/forge-std` → `https://github.com/foundry-rs/forge-std`, library standar testing Foundry. Tidak ada submodule lain (misal OpenZeppelin) terdaftar — kalau `contracts/src/*.sol` memakai library eksternal selain forge-std, dependency-nya tidak terlihat dari cluster ini (perlu cek `remappings.txt`/`package.json` di luar cluster).

**Hubungan antar file & alur historis:**
`PLANS.md` (aturan format) → dipakai `HACKATHON_DELIVERY_PLAN.md` (ExecPlan besar 2026-02-23, target `frontend/`) → menghasilkan `V0_PROMPTS.md` (prompt UI, masih target `frontend/`) → tapi arah proyek lalu **pivot** ke `ui/`-only, ditandai `README.md` (LIVE, 2026-02-24) dan `MIGRATION_PLAN.md` (2026-02-24) yang menyatakan `frontend/` legacy/reference-only. `FRONTEND_HANDOFF.md` adalah jembatan pendek yang mengarahkan siapa pun yang mengerjakan frontend untuk ikut `MIGRATION_PLAN.md` dan kerja di `ui/`. `AGENTS.md` tetap mendeskripsikan struktur lama (`frontend/` sebagai modul resmi) sehingga **belum diupdate mengikuti pivot** ke `ui/` — ini sendiri suatu inkonsistensi antar dokumen dalam cluster. `.gitmodules` berdiri sendiri, hanya terhubung tipis sebagai dependency build `contracts/` yang dipakai command di `AGENTS.md`/`FRONTEND_HANDOFF.md`.

**Ringkasan temuan mencurigakan/tidak lengkap (eksplisit):**
- Hardcoded absolute path macOS developer lama (`/Users/viniciusassis/Developer/ethglobal/...`) di `FRONTEND_HANDOFF.md` dan berulang kali di `HACKATHON_DELIVERY_PLAN.md`, tidak relevan di environment saat ini.
- Path referensi salah: `AGENTS.md` menunjuk `.agent/PLANS.md`, padahal `PLANS.md` ada di root repo.
- Duplikasi label "Phase 3" di `HACKATHON_DELIVERY_PLAN.md`.
- Kontradiksi skema warna: putih/oranye (Phase 2 & `V0_PROMPTS.md`) vs merah/hitam Chiliz brand (Phase 4), dalam dokumen yang sama.
- Kontradiksi model outcome: kontrak = A/B/Draw (tiga outcome), tapi seluruh UI prompt (`V0_PROMPTS.md`) dan tipe TypeScript StakingModal didesain biner `yes`/`no` — flagged sebagai gap terbuka di `MIGRATION_PLAN.md` step 10, belum ada bukti sudah diselesaikan.
- `mockPolymarketReturn` — eksekusi Polymarket masih mock/placeholder, dan Phase 3 bahkan mengizinkan opsi "demo mode" mock service permanen kalau API asli tidak tersedia — inti value proposition hackathon berisiko tetap palsu.
- Stat UI hardcoded/fabricated ("1,247 Active Bettors", "$127K Total Volume") diinstruksikan langsung di prompt desain.
- Nama brand tidak konsisten: "Predít"/"Predit" di dokumen resmi vs "STACKBET" hardcoded di prompt Header — proses rename (Phase 1) tidak pernah terkonfirmasi selesai di Decision Log manapun.
- CRE workflow dinyatakan "currently broken" tanpa root cause diketahui saat plan ditulis; langkah diagnosis masih berupa daftar generik kemungkinan penyebab.
- Private key server-side (`CREATOR_PRIVATE_KEY`) untuk signing eksekusi — risiko custody/sentralisasi, hanya diberi catatan keamanan minimal.
- Keputusan strategi CHZ (Option A native vs Option B stable-convert) direkomendasikan di `HACKATHON_DELIVERY_PLAN.md` tapi tidak pernah dikonfirmasi ulang di `README.md` Live Decisions Log — status akhir ambigu.
- Klaim "Foundry 75/75 passing" dan ABI-extraction selesai di `README.md` tidak disertai bukti/log terlampir dalam cluster ini.
- `PARITY_CHECKLIST.md` disebut sebagai output wajib `MIGRATION_PLAN.md` step 1 tapi tidak ada dalam cluster RootDocs — belum bisa dipastikan sudah dibuat.
- Inkonsistensi versi framework: `AGENTS.md` bilang Next.js 15, `MIGRATION_PLAN.md` menargetkan Next 16 + React 19 untuk `ui/` — mengonfirmasi `ui/` adalah rebuild terpisah, bukan sekadar rename dari `frontend/`.
- Progress checklist `HACKATHON_DELIVERY_PLAN.md` nyaris seluruhnya kosong dan section wajib living-document (`Surprises & Discoveries`, `Decision Log`, `Outcomes & Retrospective`) tidak pernah diisi — melanggar aturan `PLANS.md` sendiri yang mewajibkan pembaruan berkelanjutan.

### Solidity contracts (src/) and tests (test/)

**`contracts/src/Market.sol`** — Kontrak inti per-market (di-deploy ulang oleh `PredictionHub` untuk tiap market baru, bukan clone/proxy — full bytecode deploy tiap kali). Mendefinisikan interface lokal `IPredictionHub` (`isCommunityMember`, `getMarketCommunity`) yang dipakai buat callback ke hub. Enum `Outcome {A, B, Draw}` (3-outcome market) dan `MarketState {Open, Locked, MockBridged, MockTrading, Settled, Completed}`. State kunci: `creator`, `hub` (di-set `msg.sender` saat construct — artinya hub selalu jadi deployer), `polymarketId`, `metadata`, `stakingDeadline`, `minStake`, mapping `stakes[outcome][user]`, `totalStakes[outcome]`, `chosenOutcome`, `winningOutcome`, `executedAmount`, `totalPayout`, `totalClaimed`, `claimedWinningStake`, `hasClaimed`. Event penting: `Staked`, `ExecutionTriggered`, `ExecutionTransferred`, `MockBridged`, `MockTrading`, `MarketSettled`, `Claimed`, `MarketCompleted`.

Alur fungsi:
- `stake(Outcome)` — payable, hanya saat `MarketState.Open` dan sebelum `stakingDeadline`, wajib `msg.value >= minStake`, dan **wajib member komunitas** (verifikasi via external call balik ke `hub.isCommunityMember` + `hub.getMarketCommunity`) — ini titik kopling erat Market↔PredictionHub.
- `triggerExecution(Outcome)` — `onlyCreator`, setelah deadline, harus ada stake pada outcome yang dipilih. **Yang mencurigakan/berisiko besar**: fungsi ini langsung mengirim **seluruh pool** (`getTotalPool()`) ke alamat `creator` via low-level `call{value: totalPool}("")`, lalu otomatis mem-chain `_mockBridge()` → `_mockTrading()` dalam **transaksi yang sama** (state `Locked` dan `MockBridged` cuma "kelewat" sekejap, tidak pernah persist antar-tx — dikonfirmasi test `testTriggerExecution` yang expect state langsung `MockTrading`). Jadi 2 dari 6 enum state itu praktis dekoratif/tidak pernah teramati on-chain di luar event log.
- `mockPolymarketReturn(Outcome, uint256)` — payable, hanya `creator` atau `hub` yang boleh panggil (tapi tidak ada fungsi apa pun di `PredictionHub.sol` yang benar-benar memanggil ini — cabang `msg.sender == hub` **dead code/unreachable** di codebase saat ini). Validasi `msg.value == _payout` dan kalau outcome kalah wajib `_payout == 0`. **Bug/risiko trust besar**: karena dana sudah ditransfer keluar ke `creator` saat `triggerExecution`, tidak ada apa pun yang memaksa creator memanggil fungsi ini atau mengembalikan dana — creator bisa mendeklarasikan payout 0 seenaknya atau tidak pernah menyelesaikan market sama sekali, dan **tidak ada mekanisme refund/recovery** setelah eksekusi ter-trigger (fungsi `emergencyWithdraw` hanya berlaku saat state masih `Open` dan pool masih 0). Ini rug-risk / single point of failure yang harus dicatat sebagai temuan kritis untuk MVP hackathon ini.
- `claim()` — hanya saat `Settled`, hanya user yang stake di `chosenOutcome` dan itu = `winningOutcome`. Reward proporsional `(userStake * totalPayout) / totalWinningStake`, dengan **logic dust-handling**: claimant terakhir (`claimedWinningStake + userStake == totalWinningStake`) menerima sisa `totalPayout - totalClaimed` supaya tidak ada dust tertinggal akibat pembulatan. Market otomatis pindah ke `Completed` begitu semua winning stake sudah claim.
- View helper: `getStake`, `getPoolInfo`, `getTotalPool`, `getPotentialReward`, `canClaim`, `getMarketSummary`.
- `emergencyWithdraw()` — `onlyCreator`, hanya jika state `Open` **dan** `block.timestamp > stakingDeadline + 7 days` **dan** pool kosong. Catatan: namanya menyesatkan — tidak ada dana yang benar-benar ditarik (pool memang harus 0), fungsinya cuma menutup market kosong jadi `Completed`.
- `receive()` kosong, dipakai buat terima payout balik dari mock Polymarket.

**`contracts/src/MockPolymarket.sol`** — Simulasi oracle Polymarket, eksplisit didokumentasikan sebagai placeholder ("di produksi akan diganti Chainlink CRE + integrasi Polymarket asli"). Struct `MarketResolution {resolved, winningOutcome, timestamp}`, mapping `resolutions[marketAddress]`. Ownership manual sederhana (bukan pakai OZ `Ownable`) via `owner` + `onlyOwner`. Fungsi `resolveMarket(address, Outcome)` di-declare **`internal`** — artinya tidak bisa dipanggil langsung dari luar, satu-satunya jalur masuk adalah lewat `quickResolve()` (external, `onlyOwner`) yang menghitung outcome lawan secara sederhana (kalau creator pilih A dan kalah → B menang; kalau pilih Draw dan kalah → default A menang, disebut eksplisit "simplified logic" di komentar). `calculatePayout()` cuma membaca `marketAddress.balance` dan mengembalikan seluruh saldo sebagai payout — sangat naif, disebut sendiri "simplified calculation... in reality Polymarket has complex odds". Events `MarketResolved`, `OwnershipTransferred`. **Temuan penting**: kontrak ini **tidak pernah diimpor/dipanggil oleh `Market.sol`** — tidak ada wiring on-chain antara `MockPolymarket` dan `Market`. Di semua 4 file test, `MockPolymarket` di-deploy di `setUp()` tapi resolusi market selalu dilakukan lewat pemanggilan langsung `market.mockPolymarketReturn(...)` oleh `creator`, bukan lewat `mockPolymarket.resolveMarket/quickResolve`. Jadi kontrak ini kelihatannya **kode yatim/belum terintegrasi** — infrastruktur yang disiapkan tapi belum benar-benar dipakai dalam flow saat ini.

**`contracts/src/NetworkConfig.sol`** — Provider konfigurasi per-chain, dipanggil `PredictionHub.createMarket()` untuk ambil `minStake` dan `maxStakingDuration`. Struct `ChainConfig {wrappedNative, minStake, maxStakingDuration}`. Constant chain ID: `ANVIL_CHAIN_ID = 31337`, `CHILIZ_TESTNET_CHAIN_ID = 88882` (Chiliz Spicy testnet), `CHILIZ_MAINNET_CHAIN_ID = 88888`. Default: `DEFAULT_MIN_STAKE = 0.01 ether`, `DEFAULT_MAX_DURATION = 30 days`; mainnet override `minStake = 1 ether` (lebih tinggi). Chain tak dikenal fallback ke config Anvil. **Catatan mencurigakan/TODO eksplisit**: `wrappedNative` **selalu `address(0)`** di semua tiga config, dengan komentar TODO literal di kode — `"TODO: Add actual WCHZ testnet address when available"` dan `"TODO: Add actual WCHZ mainnet address"` — jadi field WCHZ (Wrapped Chiliz) belum diisi sama sekali. Lebih jauh, field `wrappedNative` ini **tidak dipakai di mana pun** oleh `Market.sol` atau `PredictionHub.sol` (staking selalu native currency/CHZ via `msg.value`, bukan token wrapped) — kemungkinan field vestigial/belum dipakai. Helper `isTestnet()`, `getChainName()`.

**`contracts/src/PredictionHub.sol`** — Factory + registry utama. Import `Market.sol` dan `NetworkConfig.sol`, konstruktor menerima address `NetworkConfig` yang sudah di-deploy. State: `networkConfig`, `owner`, `marketCount`, `communityCount`, registry creator (`isCreator`, `creatorMarkets`, `allCreators`), registry market (`allMarkets`, `isMarket`), dan struct `Community {id, name, description, metadataURI, creator, createdAt, memberCount, marketCount, isActive}` plus mapping-mapping pendukungnya (`communityMembers`, `communityMarkets`, `creatorCommunities`, `userCommunities`, `marketCommunity`). Struct `CreatorProfile {name, metadataURI, marketCount, registeredAt}`.

Fungsi utama: `registerCreator(name, metadataURI)`; `createCommunity(...)` — creator otomatis jadi member pertama (`memberCount=1`); `joinCommunity`/`leaveCommunity` (creator komunitas dilarang leave; penghapusan dari `userCommunities` pakai swap-and-pop); `createMarket(communityId, polymarketId, metadata, stakingDeadline)` — hanya community creator, validasi durasi `<= config.maxStakingDuration` dari `NetworkConfig`, lalu **deploy kontrak `Market` baru** (`new Market(msg.sender, polymarketId, metadata, stakingDeadline, config.minStake)`) dan daftarkan ke semua registry terkait. Implementasi `IPredictionHub` yang dipakai balik oleh `Market.sol`: `isCommunityMember(communityId, user)` dan `getMarketCommunity(marketAddress)`.

View lain: `getCreatorMarkets`, `getCommunityMarkets`, `getUserCommunities`, `getCreatorCommunities`, `getCommunity`, `getActiveCommunities`, `getAllCreators`, `getAllMarkets`, `getCreatorProfile`, `updateCreatorMetadata`, `updateCommunity`, `toggleCommunityStatus`, `transferOwnership`. **Potensi masalah skalabilitas**: `getActiveMarkets()`, `getMarketsByState()`, `getTotalValueLocked()`, dan `getHubStats()` semuanya melakukan **loop O(n) atas `allMarkets`** dengan external call `market.state()` atau baca `.balance` per market — makin banyak market, makin mahal gas-nya (khas shortcut MVP hackathon, berpotensi out-of-gas kalau jumlah market besar).

**Hubungan antar file dalam cluster**: `PredictionHub.sol` adalah pusat orkestrasi — mengimpor `NetworkConfig.sol` (untuk `minStake`/`maxStakingDuration` saat `createMarket`) dan `Market.sol` (untuk deploy instance market baru via factory pattern). `Market.sol` punya dependensi balik (callback) ke `PredictionHub` lewat interface `IPredictionHub` untuk cek keanggotaan komunitas saat `stake()` — pola sirkular: hub men-deploy Market, Market memanggil balik ke hub. `MockPolymarket.sol` berdiri sendiri, **tidak diimpor** oleh `Market.sol` maupun `PredictionHub.sol` — hanya disebut secara konseptual (di docstring `Market.sol`: "In production, only MockPolymarket or CRE would call this") dan dipakai di test hanya sebagai kontrak yang di-deploy tapi tak pernah benar-benar dipanggil untuk resolve market sungguhan.

**`contracts/test/Community.t.sol`** (`CommunityTest`) — unit test untuk lapisan komunitas di `PredictionHub`: pembuatan komunitas (`test_CreateCommunity`, auto-join creator), multi-komunitas, revert kalau non-creator/nama kosong, join/leave (termasuk revert creator-tidak-bisa-leave, revert double-join, revert join komunitas non-aktif), pembuatan market di dalam komunitas (termasuk revert kalau bukan community creator), staking khusus member komunitas (`test_CommunityMemberCanStake`, `test_RevertWhen_NonMemberTriesToStake` — memverifikasi guard `"Market: must be community member to stake"`), update/toggle status komunitas, dan query (`getActiveCommunities`, `getUserCommunities`, `getCreatorCommunities`, `getHubStats`).

**`contracts/test/Integration.t.sol`** (`IntegrationTest`) — 4 skenario end-to-end dengan akun hardcoded `address(0x1..0x4)` (creator/alice/bob/charlie, masing-masing di-`vm.deal` 100 ether): `testCompleteFlowCreatorWins` (full flow register→community→market→stake 3 outcome→trigger→`mockPolymarketReturn` 15 ether payout 50% profit→Alice claim 100% karena satu-satunya di outcome A menang), `testCompleteFlowCreatorLoses` (creator pilih salah, payout 0, semua user tidak bisa claim), `testMultipleMarketsAndCreators` (isolasi antar creator/komunitas), `testDrawOutcome` (outcome Draw menang, hanya Bob claim). Deploy `mockPolymarket` di `setUp()` tapi **tidak pernah dipakai** dalam flow assertion manapun — resolusi selalu lewat `market.mockPolymarketReturn()` langsung, menguatkan temuan bahwa `MockPolymarket.sol` belum terintegrasi.

**`contracts/test/Market.t.sol`** (`MarketTest`) — unit test paling granular untuk `Market.sol`: state awal, staking (single/multi outcome, multi-stake user sama, revert di bawah minimum, revert setelah deadline), `triggerExecution` (sukses, revert non-creator, revert tanpa stake, revert sebelum deadline, revert outcome tanpa dukungan), `mockPolymarketReturn` (sukses, revert mismatch value/payout via `"Market: payout/value mismatch"`), `claim` (proporsional — termasuk `testProportionalRewardDistribution` 20%/80% split dan `testWinnerClaim` 3/5 split, revert double-claim, revert loser claim dengan **pesan generik `"Market: invalid state"`** karena market kalah berubah ke `Completed` bukan `Settled` — jadi modifier `inState(Settled)` yang menolak, agak membingungkan secara UX pesan error karena tidak menjelaskan alasan sebenarnya "creator's choice lost"), `getPotentialReward`, `canClaim`, `getMarketSummary`.

**`contracts/test/PredictionHub.t.sol`** (`PredictionHubTest`) — unit test untuk `PredictionHub.sol`: state awal (`owner`, `networkConfig`, `marketCount`), `registerCreator` (sukses, revert daftar dua kali, revert nama kosong), `createMarket` (sukses beserta verifikasi field Market yang di-deploy, revert non-creator, revert polymarketId kosong, revert deadline masa lalu, revert durasi terlalu panjang — dites langsung terhadap `networkConfig.getActiveConfig().maxStakingDuration`), query (`getCreatorMarkets`, `getAllMarkets`, `getActiveMarkets`, `getMarketsByState`, `getTotalValueLocked`, `getHubStats`), `updateCreatorMetadata` (termasuk revert non-registered-creator), `transferOwnership` (sukses, revert non-owner, revert ke zero-address).

**Ringkasan temuan mencurigakan/perlu perhatian:**
1. **Fund-custody risk kritis** di `Market.triggerExecution()` — seluruh pool langsung ditransfer ke EOA `creator` tanpa mekanisme paksa/refund kalau creator tidak pernah menyelesaikan (`mockPolymarketReturn`) — tidak ada timeout/recovery path setelah trigger.
2. `MockPolymarket.sol` **tidak terhubung** ke `Market.sol`/`PredictionHub.sol` sama sekali di source maupun test — kode yatim/placeholder yang belum diintegrasikan ke alur nyata; fungsi `resolveMarket` bahkan `internal` sehingga cuma bisa dipanggil lewat `quickResolve`.
3. `NetworkConfig.wrappedNative` selalu `address(0)` dengan **TODO literal di komentar** untuk alamat WCHZ testnet & mainnet — belum diisi, dan field ini tidak dipakai di mana pun di codebase (kemungkinan vestigial).
4. Cabang otorisasi `msg.sender == hub` pada `mockPolymarketReturn()` **tidak pernah dipicu** oleh kode apa pun di `PredictionHub.sol` — dead code, kemungkinan disiapkan untuk integrasi Chainlink CRE via hub di masa depan tapi belum diwire.
5. State `Locked` dan `MockBridged` pada `MarketState` enum praktis tidak pernah teramati on-chain di luar event log karena `triggerExecution` mem-chain seluruh transisi state dalam satu transaksi yang sama.
6. Fungsi `emergencyWithdraw()` namanya menyesatkan — tidak benar-benar menarik dana apa pun (mensyaratkan pool = 0), cuma menutup market kosong.
7. Beberapa view function di `PredictionHub` (`getActiveMarkets`, `getMarketsByState`, `getTotalValueLocked`, `getHubStats`) melakukan loop O(n) dengan external call per market — potensi masalah gas/skalabilitas kalau jumlah market membesar.
8. Semua kontrak pakai `pragma solidity ^0.8.13` dan bergantung pada `forge-std/Test.sol` (Foundry) untuk testing — tidak ada dependency OZ (`Ownable`, `ReentrancyGuard`, dll.) yang diimpor; ownership dan reentrancy-guard (kalau ada) semuanya diimplementasi manual (mis. pola check-effects-interaction di `claim()` sudah benar: state di-update sebelum external call `.call{value: reward}`).

### Contract deployment/tooling (script/, shell scripts, docs, config)

**`script/Deploy.s.sol`** — kontrak Foundry `Deploy` (extends `Script`) yang men-deploy 3 kontrak berurutan dalam satu `vm.startBroadcast(deployerPrivateKey)` block: `NetworkConfig` → `MockPolymarket` → `PredictionHub(address(networkConfig))`. Private key deployer diambil dari env var **`PRIVATE_KEY`** via `vm.envUint`. Setelah deploy, memanggil `networkConfig.getActiveConfig()` dan `getChainName()` untuk log info chain (min stake, max staking duration). Fungsi `_saveDeploymentInfo()` **hanya mencetak JSON ke console via `console.log`, TIDAK benar-benar menulis file ke disk** meski komentarnya bilang "Save deployment information" — jadi proses menyimpan address hasil deploy ke `deployment.json` untuk frontend sepenuhnya manual (harus copy-paste dari log), berbeda dari `extractABI.js` yang memang menulis file fisik. Ini gap konkret yang layak dicatat.

**`script/Seed.s.sol`** — kontrak `Seed` untuk mengisi data demo ke `PredictionHub` yang sudah di-deploy. Alamat hub default fallback **hardcoded**: `0x3C216a0d69d98d0b7C7644a94b4b7E5F1A81476D` (via `vm.envOr("PREDICTION_HUB", ...)`), dipakai juga sebagai contoh alamat di `SEEDING_README.md`. Memakai 8 akun test (`creator1-3`, `user1-5`) yang private key-nya dimuat dari env var terpisah (`CREATOR1_PRIVATE_KEY`, dst) dan address-nya diturunkan via `vm.addr()`. Struktur eksekusi modular: `run()` menjalankan 7 fase berurutan (register creators → create communities → users join → create active markets → stake → create & complete sample market → print summary), plus entry-point terpisah per-fase (`runCreators()`, `runCommunities()`, `runUsers()`, `runMarkets()`, `runStakes()`, `runComplete()`) agar bisa di-retry granular. Semua fase bersifat **idempotent** — cek `hub.isCreator()`, `hub.getCreatorCommunities()`, `hub.getCommunityMarkets()` sebelum broadcast tx baru. Data yang di-seed: 3 creator (**Elite Sports Analyst**/`ipfs://QmSportsAnalyst123`, **Crypto Prophet**/`ipfs://QmCryptoProphet456`, **Political Oracle**/`ipfs://QmPoliticalOracle789`), 3 community (**Sports Predictions**, **Crypto Markets**, **Political Events**, masing-masing dengan deskripsi + metadata IPFS), 6 market aktif dengan `polymarketId` string seperti `"polymarket-champions-league-final"`, `"polymarket-nba-finals"`, `"polymarket-btc-100k"`, `"polymarket-eth-etf"`, `"polymarket-us-elections"`, `"polymarket-policy-decision"` dibuat via `hub.createMarket(communityId, polymarketId, metadata, deadline)` — **signature 4-parameter ini berbeda dari yang didokumentasikan di `README.md` dan `ABI/README.md`** yang hanya menyebut 3 parameter (`polymarketId, metadata, stakingDeadline`, tanpa `communityId`) — dokumentasi stale. Staking pakai `market.stake{value: X ether}(Market.Outcome.A/B)` dengan komentar log menyebut "CHZ" (karena target chain Chiliz, satuan `ether` di Solidity = native CHZ). Di `_createAndCompleteMarkets`, sebuah market dibuat dengan deadline 1 jam, di-stake 2 user, lalu `creator.triggerExecution(Outcome.A)`, `market.mockPolymarketReturn{value:0.15 ether}(Outcome.A, 0.15 ether)`, dan `user1.claim()` — simulasi full lifecycle. `_printSummary()` memanggil `hub.getHubStats()` dan mendestrukturisasi **4 nilai** `(totalCreators, totalMarkets, totalCommunities, tvl)` — **ini kontradiksi langsung dengan `README.md` dan `CAST_COMMANDS.md` yang mendokumentasikan `getHubStats()` mengembalikan hanya 3 nilai** `(totalCreators, totalMarkets, tvl)`, tanda dokumentasi belum di-update setelah fitur community ditambahkan ke kontrak. Catatan lain: di `runStakes()`, market index genap (`markets[1]`, `markets[3]`, `markets[5]`) diambil tapi sengaja tidak dipakai untuk staking (komentar "not used in staking, but needed for array") — bukan bug, tapi desain agak janggal.

**`script/extractABI.js`** — Node.js script (bukan bagian dari kontrak Solidity) untuk ekstrak ABI dari hasil compile Foundry. Baca artifact dari `./out/<Contract>.sol/<Contract>.json` untuk daftar `CONTRACTS = ['NetworkConfig','MockPolymarket','Market','PredictionHub']`, ambil field `.abi`, tulis ke `./ABI/<Contract>.json`. Juga ekstrak bytecode (`bytecode.object`, `deployedBytecode.object`) ke `<Contract>.bytecode.json`. Fungsi `createSummary()` menulis `ABI/contracts.json` berisi deskripsi tiap kontrak + info network (`anvil` chainId **31337**, `chiliz_testnet` chainId **88882** rpc `https://spicy-rpc.chiliz.com`, `chiliz_mainnet` chainId **88888** rpc `https://rpc.chiliz.com`). `createTypeScriptTypes()` dan `createDeploymentTemplate()` masing-masing menulis `ABI/contracts.d.ts` dan `ABI/deployment.template.json` — **isi kedua file ini identik persis dengan yang sudah dibaca langsung dari `ABI/contracts.d.ts` dan `ABI/deployment.template.json`**, mengonfirmasi keduanya adalah output auto-generated dari script ini, bukan file yang di-maintain manual. Dijalankan via `node script/extractABI.js` atau `npm run extract-abi` (lihat `package.json`).

**`CAST_COMMANDS.md`** — cheat sheet referensi (bukan log commands yang benar-benar dijalankan) untuk `cast` CLI Foundry. Mendokumentasikan env var setup (`ANVIL_RPC`, `CHILIZ_TESTNET_RPC=https://spicy-rpc.chiliz.com`, `CHILIZ_MAINNET_RPC=https://rpc.chiliz.com`, `HUB_ADDRESS`, `MARKET_ADDRESS`, dll), command untuk `registerCreator(string,string)`, `createMarket(string,string,uint256)` (3-param — sama dengan `README.md`, sama-sama stale terhadap `Seed.s.sol`), `isCreator`, `getAllCreators`, `getAllMarkets`, `getActiveMarkets`, `getCreatorMarkets`, `marketCount`, dan **`getHubStats()(uint256,uint256,uint256)`** (3-value lagi — konsisten dengan `README.md` tapi tetap bertentangan dengan pemakaian 4-value di `Seed.s.sol`/`SEEDING_README.md`). Untuk `Market`: `stake(uint8)` (0=A,1=B,2=Draw), `triggerExecution(uint8)` (onlyCreator), dan detail penting — komentar `state()(uint8)` mendaftar **6 state**: `0=Open, 1=Locked, 2=MockBridged, 3=MockTrading, 4=Settled, 5=Completed`. Ini satu-satunya tempat di cluster ini yang mengungkap state machine `Market` selengkap itu. Juga daftar event signature: `CreatorRegistered(address,string,uint256)`, `MarketCreated(address,address,string,uint256,uint256)`, `Staked(address,uint8,uint256)`, `ExecutionTriggered(address,uint8,uint256)`, `MarketSettled(uint8,uint256)`, `Claimed(address,uint256)`, `MarketCompleted()` — konsisten dengan daftar event di `ABI/README.md`. Berisi juga contoh workflow lengkap register→create→stake→trigger→mock-settle→claim, serta command debugging (`cast run --trace`, `cast receipt --json`).

**`CAST_COMMANDS_USED.md`** — **file kosong (0 baris)**. Namanya menyiratkan dimaksudkan untuk mencatat command `cast` aktual yang dijalankan selama development/seeding di testnet, tapi tidak pernah diisi — placeholder yang ditinggalkan.

**`complete_markets.sh`** — bash script idempotent untuk memastikan minimal 1 market berstatus "completed" (demo purpose). RPC hardcoded `https://spicy-rpc.chiliz.com`. Load `.env` + `.env.seed`, wajib argumen `$1` = alamat `PREDICTION_HUB`. `get_gas_price()` menghitung gas price = current gwei × 1.5, di-cap **min 1000 / max 5000 gwei**. `fund_if_needed()` mengirim CHZ via `cast send --value ...ether --legacy --gas-price` ke akun yang saldonya kurang dari target (Creator1, User1, User2 masing-masing ditarget 10 CHZ). `is_market_completed()` mengecek `status()(uint8)`, `isExecuted()(bool)`, `isSettled()(bool)` pada kontrak Market, dianggap selesai jika **`status == 2 || status == 3`** atau salah satu bool true — **ini bertentangan dengan state enum di `CAST_COMMANDS.md`** yang menyebut state 2=`MockBridged` dan 3=`MockTrading` (bukan status "selesai"), sementara status 4=`Settled` dan 5=`Completed` yang seharusnya jadi indikator selesai — potensi bug logika threshold status. Hanya mengambil market dari **community ID 1** (hardcoded, single community), lalu jika `COMPLETED_COUNT < 1` menjalankan `forge script script/Seed.s.sol --sig "runComplete()" --broadcast --legacy`.

**`create_communities.sh`** — mem-fund 3 creator masing-masing target 10 CHZ, lalu cek eksistensi community **langsung by ID 0, 1, 2** (0-indexed) via `cast call ... "communities(uint256)(uint256,string,string,string,address,uint256,uint256,uint256,bool)"` — memberi bocoran struktur struct `Community`: `id(uint256), name(string), description(string), metadataURI(string), creator(address)`, lalu 3 field `uint256` tambahan dan flag `bool` (kemungkinan `createdAt`/`memberCount`/`marketCount` + `active`). **Catatan penting: script ini pakai indexing 0,1,2 untuk community ID**, sedangkan `create_markets.sh`, `create_stakes.sh`, dan `complete_markets.sh` semuanya query community dengan ID **1, 2, 3** (1-indexed) — inkonsistensi indexing antar sibling script yang layak dicurigai sebagai bug (bisa jadi salah satu asumsi salah). Jika ada community yang belum ada, jalankan `forge script Seed.s.sol --sig "runCommunities()"`.

**`create_markets.sh`** — mem-fund 3 creator, warn jika saldo deployer < 20 CHZ (arahkan ke faucet `https://spicy-faucet.chiliz.com`). Mengambil `COMMUNITY_ID_1/2/3` secara dinamis dari `getCreatorCommunities(address)` lalu parsing string array dengan `tr`/`grep`, dipakai untuk logging jumlah market saat ini — **tapi keputusan aktual untuk menjalankan `runMarkets()` memakai ulang query hardcoded ID 1,2,3** (`COMMUNITY1_MARKETS = get_community_markets 1`, dst), bukan `COMMUNITY_ID_1/2/3` yang sudah dihitung — dua sumber ID komunitas berbeda dipakai dalam satu script untuk tujuan yang seharusnya sama, potensi bug nyata. Threshold: tiap community harus punya ≥2 market, kalau kurang jalankan `forge script Seed.s.sol --sig "runMarkets()"`.

**`create_stakes.sh`** — mem-fund 5 user (User1-5) masing-masing 10 CHZ. `has_staked()` mengecek `totalStaked()(uint256)` pada Market lalu `stakes(address)(uint256)` — **kemungkinan ABI assumption yang salah**: berdasarkan `README.md`/`ABI/README.md`, getter stake yang benar adalah `getStake(address user, Outcome outcome)` (2 argumen, per-outcome), bukan mapping sederhana `stakes(address)` 1 argumen — call ini kemungkinan revert atau salah data di kontrak asli. Juga hanya mengecek `MARKETS1` dan `MARKETS2` (Sports & Crypto) untuk menentukan `STAKES_NEEDED`, **`MARKETS3` (Politics) tidak pernah dicek** — gap logika, staking di community Politics bisa luput dari verifikasi idempotency. Community ID dipakai 1,2,3 (konsisten dengan `create_markets.sh`/`complete_markets.sh`, tapi tidak dengan `create_communities.sh`). Jika perlu, jalankan `forge script Seed.s.sol --sig "runStakes()"`.

**`deploy_fresh.sh`** — script deploy "darurat" untuk transaksi macet. Komentar bilang "uses `--resume` flag to handle stuck nonces" **tapi command aktual TIDAK memakai `--resume` sama sekali** — malah pakai `--with-gas-price 10000gwei` (sangat tinggi, 10000 gwei) + `--skip-simulation` + `--legacy` untuk memaksa replace tx stuck. Komentar dan implementasi tidak sinkron — dicatat sebagai inkonsistensi dokumentasi-inline. Cek saldo deployer (warn jika < 20 CHZ, arahkan ke faucet), cek nonce via `cast nonce`, lalu jalankan `forge script script/Deploy.s.sol --rpc-url https://spicy-rpc.chiliz.com --broadcast --private-key $PRIVATE_KEY --legacy --with-gas-price 10000gwei --skip-simulation`. Di akhir menyuruh jalankan `./check_deployment.sh` untuk verifikasi — **script ini tidak ada di cluster yang diberikan/dibaca**, referensi menggantung (dangling reference).

**`seed.sh`** — orkestrator utama seeding ("One script to rule them all"), berisi CLI multi-fase. `RPC_URL="https://spicy-rpc.chiliz.com"`, `CHAIN_ID=88882`. Wajib `.env` (private key deployer) + `.env.seed` (8 key test account), di-source dengan `set -a`/`set +a` agar auto-export ke child process (dipakai `forge script`). Argumen: `$1`=alamat `PREDICTION_HUB`, `$2`=`PHASE` (default `"all"`). Phase yang didukung: `all, fund, creators, communities, users, markets, stakes, complete, status`. `check_status()` mencetak saldo semua akun + status `isCreator()` tiap creator. `fund_accounts()` mem-fund dengan target spesifik: **Creator1=5 CHZ, Creator2=4, Creator3=4, User1=2, User2=2, User3=1, User4=1, User5=1** (total ~20 CHZ), warn jika deployer < 25 CHZ. `run_phase(phase)` memanggil `forge script script/Seed.s.sol --sig "run${phase}()"` (mem-format nama fungsi capitalisasi mengikuti fungsi publik di `Seed.s.sol`, mis. `"Creators"` → `runCreators()`), atau `run_all_phases()` tanpa `--sig` (menjalankan `run()` default) untuk phase `"all"`. Semua broadcast pakai `--legacy --with-gas-price ${GAS_PRICE}gwei` dengan `GAS_PRICE` dihitung sama seperti script lain (current × 1.5, cap 1000–5000 gwei).

**`SEEDING.md`** — dokumentasi utama sistem seeding (`seed.sh` + `Seed.s.sol`). Tabel biaya per-fase: creators ~1.5 CHZ, communities ~2.0, users ~1.0, markets ~3.0, stakes ~1.5, complete ~2.0, **total all ~20-25 CHZ** — konsisten dengan angka fund di `seed.sh`. Menjelaskan cara reset: `rm -rf broadcast/Seed.s.sol/88882/*` (konfirmasi chain ID 88882 dipakai konsisten di seluruh sistem). Menyebut gas price di-cap 5000 gwei untuk safety.

**`SEEDING_README.md`** — dokumen ringkasan/"selesai" yang tampak ditulis lebih awal (sebelum fitur Community ditambahkan). **Berkontradiksi langsung dengan `SEEDING.md`**: menyebut total cost hanya **"~5-10 CHZ"** (vs 20-25 CHZ di `SEEDING.md`), dan mereferensikan file dokumentasi `docs/SEEDING_GUIDE.md` yang **tidak ada dalam cluster/kemungkinan tidak pernah dibuat** (nama beda dari `SEEDING.md` yang aktual). Namun contoh verifikasi di sini memakai `getHubStats()(uint256,uint256,uint256,uint256)` (**4-value**, cocok dengan kode `Seed.s.sol`) — mengindikasikan file ini kemungkinan draft campuran: sebagian sudah diupdate (signature getHubStats), sebagian belum (estimasi biaya, referensi phase communities/users yang belum disebut eksplisit di ringkasannya). Juga mengonfirmasi hardcoded default hub address `0x3C216a0d69d98d0b7C7644a94b4b7E5F1A81476D` yang sama dengan fallback di `Seed.s.sol`, dan menyebut `Solidity Version: 0.8.30`, `EVM Compatibility: Paris` — cocok dengan `foundry.toml`.

**`foundry.toml`** — config Foundry: `src="src"`, `out="out"`, `libs=["lib"]`, `remappings=["forge-std/=lib/forge-std/src/"]`, **`solc_version = "0.8.30"`**, `optimizer=true`, `optimizer_runs=200`, `via_ir=false`, **`evm_version="paris"`** dengan komentar eksplisit *"Chiliz doesn't support Cancun (MCOPY opcode) yet"* — constraint teknis konkret yang menjelaskan kenapa EVM version di-pin ke Paris, bukan versi terbaru.

**`package.json`** — nama paket `prediction-hub-contracts` v1.0.0. Script: `build` (`forge build`), `test`/`test:verbose`/`test:gas` semuanya memakai flag **`--offline`** (mencegah forge fetch dependency dari network saat test), `coverage` (`forge coverage`), `extract-abi` (`node script/extractABI.js`), `deploy:local` (Deploy.s.sol ke `http://localhost:8545`), `deploy:testnet` (Deploy.s.sol ke `spicy-rpc.chiliz.com` dengan flag `--verify` **tapi tanpa `--etherscan-api-key`** — berbeda dari instruksi deploy mainnet di `README.md` yang eksplisit menyertakan `--etherscan-api-key`; verifikasi kontrak di testnet lewat command npm ini kemungkinan gagal/incomplete tanpa API key), `build-and-extract` (kombinasi build + extract-abi). `devDependencies` kosong `{}`. `repository.url` masih **placeholder** `"https://github.com/yourusername/prediction-hub"` — jelas belum diisi, sisa template yang tidak dibersihkan.

**`README.md`** (contracts root) — overview arsitektur 4 kontrak inti: `PredictionHub.sol` (factory untuk registrasi creator & deploy market), `Market.sol` (market individual, 3-outcome A/B/Draw), `MockPolymarket.sol` (oracle testing), `NetworkConfig.sol` (config multi-chain). **Secara eksplisit menyatakan bahwa `mockPolymarketReturn` di production nanti digantikan oleh Chainlink CRE** — mengonfirmasi bahwa integrasi CRE yang disebut di deskripsi proyek belum diimplementasikan di cluster ini, masih rencana. Bagian "Security Considerations" self-flag 2 warning eksplisit: MockPolymarket cuma untuk testing, dan tidak ada bridging asli di MVP (disimulasikan lewat state changes). Bagian "Future Enhancements (Not in MVP)" mendaftar checklist yang **semuanya belum dicentang**: real Hyperlane cross-chain bridging, Chainlink CRE automation, real Polymarket CLOB integration, creator fee mechanism, platform fee treasury, emergency pause functionality, time-weighted staking bonus, creator reputation system — konfirmasi eksplisit dari tim sendiri bahwa kontrak saat ini **tidak punya mekanisme fee, tidak ada pause/circuit-breaker, dan bridging masih simulasi** — gap production-readiness yang signifikan dan sudah di-dokumentasikan sendiri (bukan temuan baru, tapi layak ditegaskan). Interface `createMarket(string polymarketId, string metadata, uint256 stakingDeadline)` yang didokumentasikan di sini **hilang parameter `communityId`** dibanding pemanggilan aktual di `Seed.s.sol` — dokumentasi stale (poin sama seperti di `ABI/README.md`). `getHubStats()` didokumentasikan 3-return-value (kontradiksi vs `Seed.s.sol`/`SEEDING_README.md` yang 4-value — sudah dibahas di atas). Tabel network: Anvil/31337, Chiliz Spicy Testnet/88882, Chiliz Mainnet/88888 — konsisten dengan `extractABI.js` dan file lain.

**`ABI/README.md`** — panduan integrasi frontend untuk hasil ekstraksi ABI (contoh pakai **ethers.js**, **wagmi** React hook `useContractWrite`, dan **viem** dengan `chilizSpicy` chain dari `viem/chains`). Mengulang daftar Key Contract Functions dan Events yang **konsisten** dengan `CAST_COMMANDS.md` (event: `CreatorRegistered`, `MarketCreated`, `Staked`, `ExecutionTriggered`, `MarketSettled`, `Claimed`, `MarketCompleted`). Sama seperti `README.md` induk, contoh `createMarket()` di sini juga cuma 3 argumen — mengulangi gap dokumentasi yang sama (tidak menyebut `communityId`). Instruksi manual: copy `deployment.template.json` → `deployment.json` lalu isi address deploy secara manual — mengonfirmasi memang tidak ada automasi penulisan file deployment (selaras dengan temuan `_saveDeploymentInfo()` di `Deploy.s.sol` yang cuma console.log).

**`ABI/deployment.template.json`** — file placeholder kosong: `network:"anvil"`, `chainId:31337`, `deployedAt:null`, `deployer:null`, `contracts:{NetworkConfig,MockPolymarket,Market,PredictionHub: null semua}` — persis output dari fungsi `createDeploymentTemplate()` di `extractABI.js`, mengonfirmasi file ini auto-generated bukan hand-written.

**`ABI/contracts.d.ts`** — definisi TypeScript (`ContractABI`, `NetworkConfig`, `Contracts`, `Networks`, `ContractInfo`, `DeployedAddresses`) — isinya identik byte-per-byte dengan yang dihasilkan fungsi `createTypeScriptTypes()` di `extractABI.js`, mengonfirmasi generator dan output-nya sinkron/tidak drift (satu-satunya pasangan file di cluster ini yang konsisten sempurna).

---

**Hubungan antar file & alur kerja end-to-end:** `foundry.toml` + `package.json` men-define environment build (`solc 0.8.30`, EVM Paris, target Chiliz) → `Deploy.s.sol` (dipanggil via `package.json` script `deploy:local`/`deploy:testnet`, `README.md` instructions, atau `deploy_fresh.sh` untuk kasus stuck-nonce) men-deploy 3 kontrak inti → `extractABI.js` (`npm run extract-abi`) membaca `./out` hasil `forge build` lalu menulis seluruh isi folder `ABI/` (termasuk `contracts.d.ts` dan `deployment.template.json` yang sudah dibaca dan match persis) → hasil deploy (address `PredictionHub`) dipakai sebagai argumen wajib ke seluruh script seeding: baik lewat orkestrator tunggal `seed.sh` (yang membungkus `Seed.s.sol` dengan mode `--sig runX()` per fase) maupun lewat 4 script idempotent yang tampaknya **duplikat/paralel** dengan phase mode `seed.sh` (`create_communities.sh`→`runCommunities()`, `create_markets.sh`→`runMarkets()`, `create_stakes.sh`→`runStakes()`, `complete_markets.sh`→`runComplete()`) — kedua jalur memanggil entry-point `Seed.s.sol` yang sama, mengindikasikan dua sistem pengecekan idempotency yang tumpang-tindih dan berpotensi tidak konsisten satu sama lain (terutama soal indexing community ID 0-based vs 1-based yang sudah disebut di atas). `CAST_COMMANDS.md` berfungsi sebagai referensi manual paralel untuk operasi yang sama (tidak terhubung otomatis ke script manapun), sementara `CAST_COMMANDS_USED.md` yang harusnya jadi log real dari command tersebut dibiarkan kosong. `SEEDING.md` dan `SEEDING_README.md` sama-sama mendokumentasikan sistem seeding tapi saling kontradiksi pada estimasi biaya CHZ dan referensi nama file panduan — kuat indikasi `SEEDING_README.md` adalah draft lama yang belum di-retire/disinkronkan setelah `Seed.s.sol` berkembang menambah fase Community.

**Ringkasan hal mencurigakan/tidak lengkap yang perlu ditindaklanjuti:** (1) `getHubStats()` didokumentasikan dengan **3 tanda tangan return-value berbeda** di 3 tempat (`README.md`/`CAST_COMMANDS.md` = 3 value, `Seed.s.sol`/`SEEDING_README.md` = 4 value); (2) `createMarket()` didokumentasikan tanpa parameter `communityId` di `README.md` dan `ABI/README.md`, padahal `Seed.s.sol` memanggilnya dengan 4 parameter termasuk `communityId`; (3) indexing community ID **tidak konsisten** — `create_communities.sh` pakai 0,1,2 sedangkan `create_markets.sh`/`create_stakes.sh`/`complete_markets.sh` pakai 1,2,3; (4) `create_markets.sh` menghitung dua set community ID berbeda (dinamis vs hardcoded) untuk keputusan yang sama; (5) `create_stakes.sh` memanggil `stakes(address)` yang kemungkinan bukan ABI getter yang benar (seharusnya `getStake(address,uint8)`), dan tidak pernah mengecek community Politics (`MARKETS3`); (6) `complete_markets.sh` menganggap `status == 2 || 3` sebagai "completed", padahal menurut `CAST_COMMANDS.md` state 2/3 = MockBridged/MockTrading, bukan Settled/Completed (4/5) — kemungkinan bug threshold; (7) `deploy_fresh.sh` komentarnya menyebut `--resume` tapi implementasinya justru pakai `--with-gas-price 10000gwei --skip-simulation`, dan mereferensikan `check_deployment.sh` yang tidak ada di cluster; (8) `Deploy.s.sol._saveDeploymentInfo()` tidak benar-benar menyimpan file (hanya console.log), membuat proses pengisian `deployment.json` sepenuhnya manual; (9) `package.json` masih punya `repository.url` placeholder (`yourusername`) dan `deploy:testnet` tidak menyertakan `--etherscan-api-key` untuk `--verify`; (10) `CAST_COMMANDS_USED.md` kosong total; (11) `SEEDING_README.md` mereferensikan `docs/SEEDING_GUIDE.md` yang tampaknya tidak eksis/salah nama, dan angka biaya CHZ-nya bertentangan dengan `SEEDING.md`.

Good — that's enough concrete evidence for the report.

### Chainlink CRE workflow (cre/lock-market/)

**main.ts** — Entry point workflow yang dijalankan CRE (Chainlink Runtime Environment) node. Definisi:
- **`configSchema`** (zod object): `apiUrl` (harus URL valid), `schedule` (cron string), `marketAddress` (string), `outcome` (int, **min 0 max 2** — 0=A, 1=B, 2=Draw).
- **`postData(sendRequester, config)`**: bikin request POST — body `{ marketAddress, outcome }` di-`JSON.stringify` → `TextEncoder` → **base64-encode** lewat `Buffer.from(...).toString("base64")`, header `Content-Type: application/json`. Pakai **`cacheSettings: { readFromCache: true, maxAgeMs: 60000 }`** — ini kunci "single-execution pattern": biar cuma 1 node di DON (Decentralized Oracle Network) yang benar-benar hit API, node lain re-use cache (≤60 detik) supaya tidak terjadi duplicate POST ke endpoint yang trigger perubahan state (locking market). Response di-decode dari `Uint8Array`→string→`JSON.parse` jadi `LockMarketResponse` (`success`, `txHash`, `blockNumber`, `status`).
- **`onCronTrigger(runtime)`**: pakai `cre.capabilities.HTTPClient` lalu `httpClient.sendRequest(runtime, postData, consensusIdenticalAggregation<PostResponse>())` — artinya seluruh node DON harus mencapai **byte-identical consensus** atas response sebelum dianggap valid. Kalau `result.response.success` true → log TX hash & block number, return string sukses; kalau false → `throw new Error` (workflow gagal, retry sesuai schedule berikutnya).
- **`initWorkflow(config)`**: register satu handler — `cre.capabilities.CronCapability().trigger({ schedule: config.schedule })` → `onCronTrigger`. Jadi workflow ini murni **cron-triggered**, tidak ada trigger on-chain event/log.
- **`main()`**: `Runner.newRunner<Config>({ configSchema })` lalu `runner.run(initWorkflow)` — pola standar CRE SDK bootstrap.
- Dependency: `@chainlink/cre-sdk` (import `cre`, `ok`, `consensusIdenticalAggregation`, `Runner`, tipe `Runtime`/`HTTPSendRequester`) + `zod` buat validasi config.

**Catatan penting**: workflow ini **tidak menyentuh smart contract langsung** — dia cuma POST ke API off-chain Next.js (`/api/market/lock`), dan API itulah yang (diasumsikan) melakukan transaksi on-chain untuk lock market di kontrak Polymarket-bridge. Jadi trust assumption: kepercayaan penuh dipindah ke backend Next.js, CRE di sini cuma "cron caller" yang consensus-kan bahwa API call sukses — bukan yang menandatangani/broadcast transaksi. Untuk hackathon project yang katanya "prediction market" berbasis Chainlink CRE, ini agak lemah dari sisi decentralization narrative karena eksekusi on-chain sesungguhnya ada di backend terpusat, bukan dilakukan langsung oleh CRE workflow via `EVMClient`/write capability (padahal SDK yang di-bundle di `tmp.js` sebenarnya punya `ClientCapability` untuk EVM — capability ID `evm@1.0.0` — tapi tidak dipakai di `main.ts`).

**workflow.yaml** — CRE CLI workflow-settings file, mendefinisikan 2 target/environment:
- `staging-settings`: workflow-name **`lock-market-staging`**, entry `./main.ts`, config `./config.staging.json`, `secrets-path: ""` (kosong).
- `production-settings`: workflow-name **`lock-market-production`**, entry sama, config `./config.production.json`, `secrets-path: ""` juga.
Kedua target pakai file `main.ts` yang sama, cuma beda config JSON. `secrets-path` kosong di keduanya berarti workflow ini **tidak eksplisit reference file secrets.yaml** dari level workflow (padahal secrets.yaml ada di project root `cre/`), jadi kemungkinan secrets di-load lewat mekanisme lain (env var `CRE_ETH_PRIVATE_KEY` disebut di README) atau memang belum di-wire — berpotensi jadi gap konfigurasi.

**config.production.json** — `apiUrl: "https://your-nextjs-app-url.vercel.app/api/market/lock"` (placeholder, **belum diganti ke URL production asli** — jelas TODO/hardcoded placeholder yang lolos ke repo), `schedule: "*/30 * * * * *"` (tiap 30 detik), `marketAddress: "0x0000...0000"` (**zero address placeholder**, bukan address kontrak real), `outcome: 0`.

**config.staging.json** — `apiUrl: "https://f6b37fac8a50.ngrok-free.app/api/market/lock"` — ini **URL ngrok tunnel temporer** yang di-commit ke repo (mencurigakan: ngrok free URL berumur pendek, hardcode begini gampang expired/basi, dan berpotensi expose dev environment kalau masih aktif). `schedule` sama (`*/30 * * * * *`), `marketAddress` juga zero-address placeholder, `outcome: 0`.

Kedua config file konsisten strukturnya dengan `configSchema` di `main.ts`. **Masalah nyata**: baik production maupun staging config sama-sama pakai `marketAddress: 0x000...000` — kalau workflow ini benar-benar dijalankan tanpa update dulu, dia akan mencoba lock market di address nol, jadi ini wajib diisi manual sebelum deploy (konsisten dengan instruksi README).

**README.md** — Dokumentasi workflow. Menjelaskan: cron-triggered call ke `/api/market/lock`, pakai `cacheSettings` untuk single-execution pattern (dijelaskan ulang: node pertama request+cache, node lain reuse cache, cuma 1 HTTP call actual tapi semua node tetap consensus). Setup steps: (1) isi `.env` dengan `CRE_ETH_PRIVATE_KEY` — disebutkan eksplisit boleh pakai **dummy key** `0000...0001` kalau workflow tidak melakukan on-chain write (sesuai temuan di main.ts — memang tidak ada on-chain write langsung); (2) install pakai **`bun install`** (butuh Bun runtime, bukan npm/yarn); (3) update config `apiUrl`/`marketAddress`/`outcome`; (4) simulate pakai `cre workflow simulate ./cre/lock-market --target=staging-settings` dari root project. Juga dokumentasikan expected API request/response shape — cocok 1:1 dengan tipe `LockMarketRequest`/`LockMarketResponse` di main.ts.

**package.json** — nama paket `lock-market-workflow`, versi 1.0.0, private, entry `dist/main.js` (artinya ada build step yang menghasilkan `dist/main.js` — konsisten dengan `tmp.js` yang tampaknya hasil bundle serupa tapi ditinggal di root, bukan di `dist/`). Script `postinstall: "bunx cre-setup"` — auto-run CRE setup tool setelah install. Dependencies: `@chainlink/cre-sdk ^1.0.0`, `zod ^3.22.4`. Dev dependency: `@types/bun`. License `UNLICENSED`.

**tsconfig.json** — target `esnext`, module `ESNext`, `moduleResolution: bundler`, `outDir: ./dist`, `strict: true`, `esModuleInterop`, `skipLibCheck`, `forceConsistentCasingInFileNames`. Hanya include `main.ts`. Konfigurasi standar untuk Bun/modern ESM bundler build.

**tmp.js** — File **503.5 KB**, terlalu besar untuk dibaca penuh (di atas limit 256KB), jadi dibaca via offset/grep bertarget. Ini adalah **hasil bundle/compile dari `main.ts`** (bukan source terpisah) — berisi seluruh `@chainlink/cre-sdk` yang di-inline (protobuf runtime lengkap: `ScalarType` enum, `varint64read`/`varint64write`, `int64FromString`, dsb.), termasuk data table besar `mainnetBySelector`, `mainnetByName`, `mainnetBySelectorByFamily`, `mainnetByNameByFamily` (chain-selector registry Chainlink CCIP-style, baris ~8144–8926) — jauh lebih besar dari yang dibutuhkan workflow sesederhana ini. Ditemukan definisi capability class dengan `CAPABILITY_ID` konkret: `evm@1.0.0` (`ClientCapability`, punya banyak method chain-selector-aware tapi **tidak dipakai** oleh main.ts), `http-actions@1.0.0-alpha`, `http-trigger@1.0.0-alpha`, `cron-trigger@1.0.0` (dipakai — `CronCapability`), dan `consensus@1.0.0-alpha`. Bagian akhir file (baris ~14031–14097) adalah salinan identik (post-transpile) dari logic `main.ts` — `configSchema`, `postData`, `onCronTrigger`, `initWorkflow`, `main()`. **Ini kemungkinan besar adalah artefak build sementara yang tidak sengaja ke-commit** (namanya literal "tmp.js", tidak direferensikan oleh `workflow.yaml`/`package.json` manapun sebagai entry resmi) — patut dicurigai sebagai leftover/junk file, bukan bagian workflow yang disengaja, apalagi ukurannya setengah megabyte di repo hackathon.

**project.yaml** (`cre/project.yaml`) — CRE project-settings level di atas `lock-market/`. Dua target RPC: `staging-settings` dan `production-settings`, **keduanya** memakai chain yang sama: `ethereum-testnet-sepolia` via RPC publik `https://ethereum-sepolia-rpc.publicnode.com`. Catatan: **production-settings memakai testnet Sepolia**, bukan mainnet — konsisten dengan proyek hackathon (belum deploy ke mainnet), tapi juga berarti nama "production" di sini menyesatkan/misleading kalau dibaca literal (ini production *config* tapi environment-nya tetap testnet). Tidak ada `workflow-owner-address` yang di-set (kosong, cuma contoh di komentar).

**secrets.yaml** (`cre/secrets.yaml`) — Struktur:
```
secretsNames:
    SECRET_ADDRESS:
        - SECRET_ADDRESS_ALL
```
Hanya berisi **key-name mapping**, tidak ada value rahasia aktual di file ini (tidak ada real secret value yang perlu di-redact — isinya cuma nama secret `SECRET_ADDRESS` dengan scope/label `SECRET_ADDRESS_ALL`, mengikuti konvensi CRE secrets-name registry untuk dirujuk workflow lain, bukan menyimpan value-nya langsung).

**.gitignore** (`cre/.gitignore`) — cuma 1 baris: `*.env` — artinya semua file `.env` (termasuk yang menyimpan `CRE_ETH_PRIVATE_KEY` sesuai instruksi README) di-exclude dari git di level folder `cre/`. Ini bagus untuk mencegah private key bocor, TAPI perlu dicatat: **`tmp.js` (503KB) tidak ter-cover oleh .gitignore ini** dan kemungkinan besar sudah ke-commit — kalau ada secret ke-bake ke bundle itu (misalnya lewat env var), berisiko bocor; sebaiknya diperiksa/dihapus dan ditambahkan pattern build-artifact (`dist/`, `tmp.js`) ke `.gitignore`.

**Hubungan antar file**: `workflow.yaml` (level `lock-market/`) mereferensikan `main.ts` sebagai entry + `config.staging.json`/`config.production.json` sebagai config source, sesuai `configSchema` yang didefinisikan di `main.ts`. `project.yaml` (level `cre/`, parent) menyuplai RPC settings per chain untuk target yang sama (staging/production), dipakai kalau workflow butuh baca on-chain data (saat ini tidak dipakai karena main.ts murni HTTP-based). `secrets.yaml` (level `cre/`) menyediakan nama secret (`SECRET_ADDRESS`) yang berpotensi dirujuk lewat `secrets-path` di `workflow.yaml`, tapi `workflow.yaml` di cluster ini punya `secrets-path: ""` kosong untuk kedua target — jadi **secrets.yaml sebenarnya tidak ter-link ke workflow lock-market ini**, kemungkinan dipakai workflow CRE lain di proyek yang sama. `tmp.js` adalah derivative/build-output dari `main.ts` + `@chainlink/cre-sdk`, tidak independen secara logic. `package.json`+`tsconfig.json` mendefinisikan toolchain (Bun + TypeScript strict) yang menghasilkan build seperti `tmp.js`/`dist/main.js`. `.gitignore` melindungi `.env` yang disebut di `README.md` sebagai tempat `CRE_ETH_PRIVATE_KEY`.

**Ringkasan temuan mencurigakan/TODO**:
1. `apiUrl` di **production** config masih placeholder `your-nextjs-app-url.vercel.app` — belum di-deploy/diisi.
2. `apiUrl` di **staging** config pakai URL ngrok temporer yang di-hardcode ke repo.
3. `marketAddress` **zero-address** (`0x000...000`) di kedua config — belum diisi kontrak real, kalau dijalankan apa adanya akan gagal/nge-lock alamat kosong.
4. `tmp.js` 503KB tampak seperti build artifact/junk yang tidak sengaja ter-commit, tidak di-reference dari manapun secara resmi.
5. `secrets-path` kosong di `workflow.yaml` untuk kedua target — `secrets.yaml` project-level jadi tidak terpakai oleh workflow ini (disconnect konfigurasi).
6. Nama target "production-settings" di `project.yaml` tetap memakai **testnet Sepolia**, bukan mainnet — penamaan berpotensi membingungkan.
7. Trust-model: eksekusi on-chain sesungguhnya (lock market) didelegasikan penuh ke API Next.js off-chain, CRE workflow hanya memverifikasi lewat consensus bahwa API call sukses — bukan CRE yang sign/broadcast transaksi via EVM capability yang sebenarnya tersedia di SDK (`ClientCapability`/`evm@1.0.0`).

### ui/ (active Next.js app) -- routes, types, mock data

**Ringkasan umum**: Cluster ini adalah *thin routing layer* + *type definitions* + *mock data* dari aplikasi Next.js "Predit". Pola yang konsisten di semua 5 file route (`page.tsx`, `communities/page.tsx`, `community/[slug]/page.tsx`, `dashboard/page.tsx`, `market/[id]/page.tsx`): **setiap route hanyalah wrapper 5 baris** yang import satu komponen "Page"-suffixed dari `@/components/...` (mis. `HomePage`, `CommunitiesListPage`, `CommunityLanding`, `CreatorDashboard`, `MarketDetailPage`) dan langsung render tanpa props, tanpa data fetching, tanpa `params`/`searchParams` handling sama sekali -- termasuk di route dinamis `community/[slug]/page.tsx` dan `market/[id]/page.tsx`, yang **tidak membaca `params.slug` / `params.id` dari Next.js sama sekali**. Artinya slug/id dari URL **tidak pernah dipakai** untuk memilih data; komponen anak kemungkinan besar hardcode ke satu mock object (`mockCommunity`, `mockMarket`) terlepas dari URL yang diakses. Ini bug/gap signifikan untuk app yang katanya multi-community/multi-market.

- **`app/page.tsx`**: render `<HomePage />` (landing/homepage).
- **`app/layout.tsx`**: root layout Next.js App Router. Setup 3 font Google via `next/font/google`: `Inter` (var `--font-inter`), `Bebas_Neue` (weight 400, var `--font-bebas-neue`), `Geist_Mono` (var `--font-geist-mono`) -- semua di-assign ke `className` `<html>` tapi variabelnya bernama `_inter`, `_bebasNeue`, `_geistMono` (prefix underscore, gaya "unused-but-actually-used" konvensi lint). `metadata` export: `title: 'Sports Predictions'`, `description: 'AI-powered sports prediction platform'`, `generator: 'v0.app'` (mengonfirmasi UI ini di-generate/di-scaffold pakai **Vercel v0**), icon config light/dark (`/icon-light-32x32.png`, `/icon-dark-32x32.png`, `/icon.svg`, `/apple-icon.png` -- file-file ini tidak diverifikasi ada di cluster ini). Body wrap: `<NavHeader />` (dari luar cluster) + `{children}` + `<Toaster richColors position="top-center" />` (sonner) + `<Analytics />` (`@vercel/analytics/next`). **Catatan mencurigakan**: metadata title/description sama sekali tidak menyebut "prediction market komunitas", "Polymarket", "Chainlink CRE", atau staking bareng -- brandingnya generik "Sports Predictions / AI-powered", tidak mencerminkan pitch project yang sebenarnya (mismatch antara metadata dan konsep hackathon).
- **`app/globals.css`**: design system Tailwind v4 (`@import 'tailwindcss'` + `@import 'tw-animate-css'`, `@custom-variant dark (&:is(.dark *))`, `@theme inline` block). Warna primer **orange `#FF6B35`** (light) / `#FF8F5C` (dark), lengkap dengan token `--primary-light/-dark/-foreground`, `--background`, `--card`, `--popover`, `--secondary`, `--muted`, `--accent`, `--destructive` (`#EF4444`/`#DC2626`), `--success` (`#10B981`/`#059669`), `--warning` (`#F59E0B`/`#D97706`), `--border/--input/--ring`, 5 warna chart (`--chart-1`..`--chart-5`), dan token sidebar terpisah (`--sidebar`, `--sidebar-primary`, dst). `--radius: 0.5rem` jadi basis `--radius-sm/md/lg/xl` via `calc()`. Class `.dark` override semua token untuk dark mode. `@layer base` set default `border-border`, `outline-ring/50`, `bg-background text-foreground`. Tidak ada CSS aneh/bug, murni design tokens shadcn-style (`baseColor: neutral` cocok dengan `components.json`).
- **`app/communities/page.tsx`**: render `<CommunitiesListPage />` -- daftar komunitas.
- **`app/community/[slug]/page.tsx`**: render `<CommunityLanding />` -- **tidak menerima/meneruskan `params.slug`** (lihat catatan bug di atas).
- **`app/dashboard/page.tsx`**: render `<CreatorDashboard />` -- dashboard untuk creator/pembuat market.
- **`app/market/[id]/page.tsx`**: render `<MarketDetailPage />` -- **tidak menerima/meneruskan `params.id`** (bug yang sama).

**Types (`lib/types/`)**:
- **`market.ts`**: `MarketStatus = "open" | "closing_soon" | "closed" | "resolved"`. `Market` interface: `id, title, communityName, communitySlug, status, closesAt (ISO), totalBets, totalVolume (komentar eksplisit "in CHZ" -- konfirmasi token Chiliz sebagai unit currency), yesPercentage, noPercentage, yesPool, noPool, polymarketUrl, resolvedOutcome?`. Field `polymarketUrl` mengonfirmasi integrasi/link ke Polymarket sesuai konsep project. `UserStake`: `yesAmount, noAmount, totalStaked, potentialPayout, yesPercentageOfTotal, noPercentageOfTotal`. `ClaimReward`: `amount, claimed`. `Comment`: struktur nested reply (`replies?: Comment[]`) dengan `upvotes/downvotes/userVote`, `betPosition?: "yes"|"no"|null`, `betAmount?`, `isOP?`, `edited?` -- desain comment section ala Reddit/forum dengan atribusi taruhan. `StakeFormData`: `side, amount, walletBalance, currentOdds, poolAmount, estimatedPayout` -- bentuk form untuk UI staking (belum ada validasi/schema Zod terlihat di sini meski `zod` ada di dependency).
- **`community.ts`**: import `MarketStatus` dari `./market` (menunjukkan coupling antar type file). `Community` interface: `id, name, slug, description, verified, membersCount, activeMarkets, totalVolume, joined, avatarUrl?, avatarInitials?, bannerColor?, sport?`. `SportCategory = "all"|"football"|"basketball"|"tennis"|"motorsport"|"cycling"` (catatan: daftar ini **tidak lengkap** dibanding sport yang muncul di mock data seperti "MMA", "Golf", "Cricket" -- lihat below, potential type-mismatch bug). `SortOption = "newest"|"most_bets"|"highest_volume"|"closing_soon"`. `CommunityMarket`: mirip `Market` tapi field lebih ringkas (`sport: SportCategory`, `communityBadge`).
- **`dashboard.ts`**: import `MarketStatus` dari `./market` juga. `DashboardStats`: `totalCommunities, activeMarkets, totalVolume, winRate`. `CreatorMarket`: `id, title, community, status, closesAt, totalStaked, totalBets`. `ActivityItem`: `type: "stake"|"execution"|"win"|"new_market"`, `message, timestamp, unread`. Field `type: "execution"` mengindikasikan event terkait eksekusi on-chain/Chainlink CRE tapi tidak ada detail lebih lanjut di cluster ini (kemungkinan diproses di cluster lain, mis. contracts atau CRE workflow).

**Mock data (`lib/data/`)** -- semua 100% hardcoded, tidak ada fetch/API call apa pun di seluruh cluster ini:
- **`mock-communities-list.ts`**: 12 `CommunityListItem` (superset dari `Community` + `roi7d, activity24h, trending`) untuk berbagai sport: Football, Basketball, Motorsport, Tennis, MMA, Golf, Cricket, Cycling -- **sport string ini ("MMA", "Golf", "Cricket") tidak match dengan union type `SportCategory` di `community.ts`** yang cuma punya `all|football|basketball|tennis|motorsport|cycling`. Ini inkonsistensi type vs data yang nyata (field `sport` di `CommunityListItem` bertipe `string` bebas, bukan `SportCategory`, jadi lolos type-check tapi filter UI berbasis `SportCategory` kemungkinan tidak bisa menjangkau community MMA/Golf/Cricket). Data lain: `bannerColor` hex per komunitas (mis. `#3D195B` utk Premier League Predictors, `#E10600` utk F1), `totalVolume` s.d. 584200, `roi7d` desimal (14.2, dst).
- **`mock-community.ts`**: `mockCommunity` (single hardcoded object, slug `"premier-league-predictors"`) + `mockCommunityMarkets` (12 `CommunityMarket`, id `cm1`..`cm12`, closesAt/createdAt dihitung relatif pakai `Date.now() + N * 24*60*60*1000` dsb -- jadi tanggal selalu relatif terhadap waktu render, bukan tanggal statis). Karena `community/[slug]/page.tsx` tidak baca `params.slug`, mock ini kemungkinan **selalu** yang ditampilkan apa pun slug di URL.
- **`mock-dashboard.ts`**: `mockDashboardStats` (`totalCommunities: 12, activeMarkets: 34, totalVolume: 127450, winRate: 72`), `mockCreatorMarkets` (7 market, termasuk komunitas **"Cycling Predictions"** pada item `m7` -- nama ini **tidak match** dengan nama komunitas cycling manapun di `mock-communities-list.ts` yang justru bernama "Tour de France Tippers". Inkonsistensi naming antar mock file), `mockActivityFeed` (7 `ActivityItem` dengan pesan hardcoded pakai handle seperti `@CryptoKicker`, `@BettingPro99`).
- **`mock-home.ts`**: definisi type tambahan `TopCommunity`, `UserBet`, `UserBetsSummary`, `TrendingMarket` (harusnya idealnya di `lib/types/` tapi malah didefinisikan langsung di file data -- inkonsistensi struktur project/tidak mengikuti pola pemisahan types vs data yang dipakai file lain). Data: `mockTopCommunities` (5, dengan `rank` manual 1-5), `mockUserBetsSummary` (`roi: 46.4`, `streak: 5`, `streakType: "win"`), `mockUserBets` (6 taruhan dengan `odds` desimal seperti `1.54`, `2.38`), `mockTrendingMarkets` (6, dengan flag `hot: boolean`).
- **`mock-market.ts`**: `mockMarket` (single object, id `"market-001"`) -- **`communitySlug: "premier-league"`**, ini **tidak match** dengan slug komunitas yang dipakai di tempat lain (`"premier-league-predictors"` di `mock-community.ts` dan `mock-communities-list.ts`). Bug/inkonsistensi data lintas file yang jelas. `polymarketUrl: "https://polymarket.com"` -- **hardcoded ke homepage generik Polymarket, bukan URL market spesifik** (placeholder/TODO yang belum diisi link nyata, padahal core value prop project ini adalah stake terhadap event Polymarket spesifik). `mockUserStake`, `mockClaimReward` (`amount: 2450, claimed: false`), dan `mockComments` -- struktur komentar bersarang sampai 3 level (`c1 → c1-r1 → c1-r1-r1`) dengan konten panjang hardcoded termasuk analisis palsu ("xG numbers", "Rodri back from injury") -- murni dummy/fixture data untuk demo UI, bukan dari backend.

**Util & config**:
- **`lib/utils.ts`**: satu fungsi `cn(...inputs: ClassValue[])` = `twMerge(clsx(inputs))`, util standar shadcn untuk merge className Tailwind.
- **`components.json`**: config shadcn/ui -- `style: "new-york"`, `rsc: true`, `tsx: true`, `tailwind.css: "app/globals.css"`, `baseColor: "neutral"`, `cssVariables: true`, `prefix: ""`, alias `@/components`, `@/lib/utils`, `@/components/ui`, `@/lib`, `@/hooks`, `iconLibrary: "lucide"`.
- **`next.config.mjs`**: **`typescript: { ignoreBuildErrors: true }`** -- build akan lolos meski ada type error, ini konfigurasi mencurigakan/berisiko untuk production (kemungkinan sisa dari scaffold v0.app supaya cepat iterasi, tapi berbahaya kalau dibawa ke deployment nyata karena bisa menyembunyikan bug type termasuk inkonsistensi yang sudah disebut di atas). `images: { unoptimized: true }` -- image optimization Next.js dimatikan (biasanya dipakai untuk static export atau supaya kompatibel dengan hosting yang tidak support Next Image Optimization API).
- **`package.json`**: nama package generik `"my-project"` (bukan "predit" -- sisa scaffold default, belum di-rename). Framework: **Next.js 16.1.6**, **React 19.2.4**/React-DOM 19.2.4, TypeScript 5.7.3. UI stack: hampir seluruh **Radix UI primitives** (accordion, dialog, dropdown-menu, popover, select, tabs, toast, tooltip, dll -- набор lengkap shadcn/ui), `class-variance-authority`, `cmdk`, `vaul` (drawer), `embla-carousel-react`, `recharts` (untuk chart, cocok dengan `--chart-1..5` tokens di CSS), `sonner` (toast), `react-hook-form` + `@hookform/resolvers` + `zod` (form validation stack), `date-fns`, `next-themes` (dark mode), `@vercel/analytics`. Tailwind v4 (`tailwindcss ^4.2.0` + `@tailwindcss/postcss`) + `tw-animate-css`. **Temuan penting: TIDAK ADA satu pun dependency web3** (tidak ada `wagmi`, `viem`, `ethers`, `@rainbow-me/rainbowkit`, `walletconnect`, dsb) di `package.json` ini. Untuk project yang katanya smart-contract-driven (Foundry/Solidity + Chainlink CRE) dan ada field `walletBalance` di `StakeFormData`, ketiadaan wallet/web3 library di UI cluster ini adalah gap besar -- mengindikasikan **frontend di cluster ini murni presentation/mock-data layer, belum terhubung sama sekali ke on-chain data atau wallet connection**, atau integrasi web3 ditempatkan di cluster/file lain yang tidak termasuk daftar baca ini.

**Hubungan antar file dalam cluster**: Route files (`page.tsx` x5) → import komponen dari `@/components/*` (di luar cluster ini, tidak dibaca) → komponen tersebut (diasumsikan) konsumsi `lib/types/*.ts` untuk tipe dan `lib/data/mock-*.ts` untuk data statis. `lib/types/community.ts` dan `lib/types/dashboard.ts` sama-sama import `MarketStatus` dari `lib/types/market.ts`, jadi `market.ts` adalah source-of-truth type di cluster ini. `lib/utils.ts` (`cn`) dipakai lintas semua komponen UI shadcn (tidak terlihat langsung di cluster ini tapi jadi dependency pola shadcn). `components.json` mengonfirmasi alias `@/lib/utils` dan `@/components/ui` yang dipakai layout/route files. `globals.css` menyediakan CSS variable yang dikonsumsi lewat Tailwind utility class di komponen (di luar cluster). Karena **tidak ada satu file pun di cluster ini yang benar-benar memakai `params` dari route dinamis**, tidak bisa dipastikan dari cluster ini saja apakah `CommunityLanding`/`MarketDetailPage` (di luar cluster) menerima slug/id via hook client-side lain (`useParams`) -- perlu cross-check ke cluster "components" untuk konfirmasi apakah bug ini nyata atau ditangani di layer lain.

### ui/components/ -- communities, community, dashboard (project-specific)

**Cluster ini murni UI/prototype berbasis mock data** — tidak ada satupun file yang memanggil wallet, smart contract, atau Chainlink CRE secara nyata. Semua "aksi on-chain" (create community, join, import market, trigger execution) disimulasikan pakai `setTimeout` + local state, atau bahkan tombol tanpa `onClick` sama sekali. Detail per file:

**Sub-cluster `communities/` (listing semua komunitas):**
- **`communities-list-page.tsx`** — komponen `CommunitiesListPage` ("use client"), halaman utama daftar komunitas. Fetch data disimulasikan via `useEffect(() => setTimeout(..., 900))` mengubah state `loading`. Sumber data `mockCommunitiesList` dari `@/lib/data/mock-communities-list` (juga meng-export type `CommunityListItem`, `CommunitySortOption`). Ada `SPORT_FILTERS` (9 item termasuk "All Sports", MMA, Cricket, Golf, Cycling) dan `SORT_OPTIONS` (`trending`/`most_active`/`highest_roi`). Fungsi `sortCommunities()` mengurutkan berdasarkan `trending` flag lalu `activity24h`, atau `activity24h`/`roi7d` langsung. State `search`, `sport`, `sort`, `viewMode` ("list"/"compact") — filtering dilakukan via `useMemo`. **Bug/inkonsistensi**: agregat stats (`totalMembers`, `totalMarkets`, `totalVolume`) dihitung dari `mockCommunitiesList` mentah, bukan dari `filtered`, jadi badge header tidak berubah walau user sudah filter/search. Toggle "compact" view (`LayoutGrid` icon) cuma mengubah `grid-cols`, tapi tetap merender komponen `CommunityListCard` yang sama (bukan versi ringkas) — jadi mode "compact" sebenarnya tidak lebih compact secara konten. Volume ditampilkan dalam satuan **CHZ**.
- **`community-card-skeleton.tsx`** — `CommunityCardSkeleton` (placeholder shadcn `Skeleton` meniru layout satu card) dan `CommunitiesListSkeleton({count=6})` yang me-loop-nya; dipakai `communities-list-page.tsx` saat `loading===true`.
- **`community-list-card.tsx`** — `CommunityListCard({community, index})`, `Link` ke `/community/${community.slug}`. Banner strip pakai `community.bannerColor` inline, avatar ring pakai trik `style={{ ["--tw-ring-color" as string]: community.bannerColor }}` (workaround TypeScript untuk custom CSS var). Menampilkan badge `verified` (CheckCircle2), `trending` (Zap), sport badge, deskripsi (`line-clamp-1`), stats (members, activeMarkets, activity24h "bets/24h"), kolom kanan ROI 7 hari (warna `text-success`/`text-destructive` tergantung tanda) + `totalVolume` CHZ. Fungsi lokal `formatNumber()` (K/M formatter) — **duplikat**, logic identik muncul lagi di 3 file lain di cluster ini. `style={{animationDelay}}` di-set tapi tidak ada class `animate-in` yang menggunakannya di file ini sendiri — kemungkinan dead style / animasi tidak jalan.
- **`create-community-dialog.tsx`** — `CreateCommunityDialog`, dialog wizard 3 langkah (`Step`: `"details" | "branding" | "review"`). `SPORT_OPTIONS` (10 olahraga + emoji unicode escape) **berbeda daftarnya** dari `SPORT_FILTERS` di `communities-list-page.tsx` maupun `filter-bar.tsx` — tiga taksonomi sport yang tidak disatukan dalam satu sumber. `BANNER_COLORS` — 12 hex warna hardcoded (mis. `#3D195B` Purple, `#FF6B35` "Primary"/default). Validasi `validateDetails()`: nama 3–40 karakter, sport wajib dipilih, deskripsi minimal 10 karakter — **tidak ada validasi batas atas** meski counter UI berubah merah di >160 karakter sedangkan `Textarea` punya `maxLength={200}` — ambang cosmetic (160) tidak match dengan hard limit (200) dan tidak divalidasi sama sekali di `validateDetails`. `handleAvatarUpload()`: validasi tipe file (`image/*`) dan ukuran (maks 2MB / `2*1024*1024`), pakai `FileReader.readAsDataURL()` — hasil cuma disimpan sebagai base64 preview di state lokal, **tidak ada upload ke storage/backend**. `handleSubmit()`: `await new Promise(r => setTimeout(r, 1800))` lalu `toast.success(...)` dari **`sonner`** — tidak ada API call nyata; jadi "Create Community" sepenuhnya kosmetik/mock.

**Sub-cluster `community/` (halaman detail satu komunitas):**
- **`community-header.tsx`** — `CommunityHeader({community}: {community: Community})` dari `@/lib/types/community`. State `joined` (init dari `community.joined`), `copied`. `handleShare()` pakai `navigator.clipboard.writeText(window.location.href)`, reset `copied` via `setTimeout(2000)` tanpa cleanup saat unmount (potensi minor leak/warning kalau user pindah halaman <2 detik). Tombol "Join Community" hanya `setJoined(true)` — **tidak ada transaksi on-chain / wallet call**, dan tidak persist (refresh halaman = balik ke status awal). Banner fallback warna `"#FF6B35"` (brand orange, sama dengan default di create-community-dialog).
- **`community-landing.tsx`** — `CommunityLanding`, halaman utama komunitas yang merakit `CommunityHeader` + `FilterBar` + `MarketGrid` (+ skeleton/error state). Data dari `mockCommunity`, `mockCommunityMarkets` (`@/lib/data/mock-community`). `LoadState` = `"loading"|"success"|"error"` — **`"error"` sebenarnya tidak pernah pernah di-trigger** di mana pun (hanya `"loading"→"success"` via `setTimeout(1200)`; `handleRetry()` cuma reset ke `loading`), jadi `ErrorState` yang di-import jadi dead code path secara praktis. `sortMarkets()`: `newest`/`most_bets`/`highest_volume`/`closing_soon` (untuk closing_soon, item yang sudah lewat closesAt didorong ke akhir list). State filter `activeStatus` (`MarketStatus|"all"`), `activeSport` (`SportCategory`), `activeSort`.
- **`empty-state.tsx`** — `EmptyState({onClearFilters, hasActiveFilters})`. Kalau tidak ada filter aktif, tampil tombol **"Create First Market" tanpa `onClick` handler** — tombol mati/tidak berfungsi.
- **`error-state.tsx`** — `ErrorState({onRetry})`, `role="alert"`, tombol "Retry". Sudah benar secara implementasi tapi (seperti dicatat di atas) tidak pernah benar-benar dipicu di `community-landing.tsx`.
- **`filter-bar.tsx`** — `FilterBar`, controlled component sticky (`top-0`). `STATUS_FILTERS` (all/open/closing_soon/closed), `SPORT_FILTERS` (all + 5 sport — **daftar ketiga** yang beda dari dua file lain), `SORT_OPTIONS` (newest/most_bets/highest_volume/closing_soon). `scrollRef` (`useRef`) dideklarasikan dan dipasang ke div scrollable tapi **tidak pernah dipakai** untuk logic apapun (dead ref, tidak ada scrollIntoView dsb).
- **`import-polymarket-dialog.tsx`** — `ImportPolymarketDialog`, dialog simulasi import market dari Polymarket. `PolymarketPreview` interface (`title, volume, participants, yesPrice, noPrice, endDate, category, sourceUrl`). `MOCK_PREVIEWS` — data fabrikasi hardcoded untuk key `"default"`/`"nba"`/`"f1"` (mis. "Will Manchester City win the Premier League 2025/26?" $1.2M volume, 4832 participants, yesPrice 0.64; Celtics NBA $890K; Verstappen F1 $2.1M, url contoh `https://polymarket.com/event/...`). `isValidPolymarketUrl()` cek `new URL(input).hostname.includes("polymarket.com")`. `handleFetch()`: delay palsu 1500ms lalu pilih mock preview berdasar substring URL (`nba`/`celtics`/`basketball` → nba; `f1`/`verstappen`/`formula` → f1; selain itu default) — **bukan pemanggilan API Polymarket asli** (tidak ada `fetch`/endpoint `gamma-api.polymarket.com` dsb). `handleImport()`: delay 2000ms lalu `toast.success`. Teks penting di UI: *"The market resolution will track the original Polymarket outcome via Chainlink oracle"* — satu-satunya referensi ke Chainlink dalam cluster ini, tapi cuma copy teks, tidak ada wiring oracle sungguhan di komponen ini. `FetchState` = `idle/fetching/preview/importing/success/error` — **`"error"` juga tidak pernah di-set** (validasi URL gagal cuma set `errorMsg` dan tetap di state `"idle"`), sama seperti pola dead-error-state di `community-landing.tsx`.
- **`market-card-skeleton.tsx`** — `MarketCardSkeleton` + `MarketGridSkeleton({count=6})`, dipakai saat `loadState==="loading"` di `community-landing.tsx`.
- **`market-card.tsx`** — `MarketCard({market, index})`. `formatVolume()` — **duplikat lagi** dari formatter K/M yang sama. `getTimeRemaining(closesAt)` menghitung string countdown (`Xd Yh` / `Xh Ym` / `Ym`, atau `"Closed"` jika lewat). `statusConfig` map untuk `open/closing_soon/closed/resolved`. Constant `NEW_THRESHOLD_MS = 24*60*60*1000` (24 jam) menentukan badge "NEW" berdasar `market.createdAt`. `useEffect` dengan `setInterval(..., 60000)` untuk update `timeLeft` live tiap 60 detik, **dibersihkan dengan benar** via `clearInterval` di cleanup — salah satu bagian kode yang solid. Odds bar YES/NO pakai `market.yesPercentage`/`noPercentage` langsung tanpa clamping/validasi bahwa totalnya 100%. Link ke `/market/${market.id}`.
- **`market-grid.tsx`** — `MarketGrid({markets, hasActiveFilters, onClearFilters})`. `PAGE_SIZE = 6`, pagination client-side via `visibleCount` + `.slice()`. `handleLoadMore()` — delay palsu 600ms sebelum menambah `visibleCount` (bukan pagination API sungguhan). Merender `EmptyState` bila `markets.length===0`.

**Sub-cluster `dashboard/` (creator dashboard):**
- **`creator-dashboard.tsx`** — `CreatorDashboard`, halaman utama dashboard creator. Fetch palsu via `setTimeout(800)` yang mengisi `mockDashboardStats`, `mockCreatorMarkets`, `mockActivityFeed` dari `@/lib/data/mock-dashboard`. Layout: `StatsCards` → `QuickActions` → grid `xl:grid-cols-[1fr_380px]` berisi `MarketsTable` + `ActivityFeed`.
- **`dashboard-skeleton.tsx`** — `DashboardSkeleton`: skeleton untuk 4 stat card, quick-actions row, dan table (search bar + 5 baris). **Tidak menyediakan skeleton untuk panel `ActivityFeed`** di kolom kanan, padahal layout asli (`creator-dashboard.tsx`) selalu merender `ActivityFeed` di samping `MarketsTable` — berpotensi menyebabkan layout shift saat transisi loading→loaded karena skeleton tidak mereservasi ruang kolom kanan.
- **`markets-table.tsx`** — `MarketsTable({markets})`. `SortKey` (`title/totalStaked/totalBets/closesAt`), `toggleSort()` membalik arah bila kolom sama diklik lagi. `statusConfig` — **duplikat ketiga** dari style status market (beda sedikit class Tailwind dari versi di `market-card.tsx`, tidak berbagi satu sumber). `formatCountdown()` — formatter waktu lain lagi (mengembalikan `"Ended"`, **berbeda istilah** dari `"Closed"` yang dipakai `market-card.tsx` untuk kondisi serupa). `MobileMarketCard` untuk breakpoint `<md`. `MarketActions` — dropdown menu (`DropdownMenu` shadcn) dengan item "View Details", **"Trigger Execution"** (mengacu ke istilah Chainlink CRE / automation), "Edit", "Close Market" — **semua item ini tidak punya `onClick` handler**, murni dekoratif. Tombol **"Download CSV"** di `CardAction` juga tanpa `onClick`. Struktur `Tabs`: me-`.map()` 4 tab value (`all/open/closing_soon/closed`) tapi tiap `TabsContent` merender `filtered` yang sama (sudah difilter oleh state `tab` tunggal) — jadi isi antar tab konten sebenarnya identik/duplikatif secara struktur (4x mounting DOM dengan data sama), desainnya agak janggal walau secara visual Radix Tabs cuma menampilkan satu yang aktif.
- **`quick-actions.tsx`** — `QuickActions`: 3 tombol statis ("Create Market", "Import from Polymarket", "Manage Communities") — **semuanya tanpa `onClick`**, padahal fungsi setara (`CreateCommunityDialog`, `ImportPolymarketDialog`) sudah ada dan berfungsi (dengan dialog/step) di file lain dalam cluster ini — komponen ini tidak me-reuse dialog tersebut, hanya meniru tampilannya secara kosong.
- **`stats-cards.tsx`** — `StatsCards({stats})`. `statConfig` array 4 entri (`totalCommunities`, `activeMarkets`, `totalVolume`, `winRate`) dengan `format` masing-masing. **Bug/inkonsistensi konkret**: `totalVolume` diformat `` `$${v.toLocaleString()}` `` (pakai simbol dolar) sekaligus diberi `suffix: "CHZ"` — jadi angka besar tampil dengan prefix `$` tapi label bawahnya "CHZ", padahal file-file lain di cluster ini (community-header, community-list-card) konsisten menampilkan volume sebagai `"X CHZ"` tanpa simbol `$` — indikasi kuat sisa template berbasis USD yang belum sepenuhnya disesuaikan ke token CHZ.
- **`activity-feed.tsx`** — `ActivityFeed({items}: {items: ActivityItem[]})` dari `@/lib/types/dashboard`. `typeConfig` map `stake/execution/win/new_market` → icon (`Coins/Zap/Trophy/PlusCircle`) + warna (termasuk `text-chart-3`/`bg-chart-3/10` CSS var). `formatTime()` — formatter waktu relatif ("Just now"/"Xm ago"/"Xh ago"/"Xd ago"), **duplikat pola** lagi (formatter waktu ada 3 varian berbeda di cluster: `getTimeRemaining` di market-card, `formatCountdown` di markets-table, `formatTime` di sini — tidak dibagi dari satu util bersama). Unread item ditandai dot absolut + font-weight beda.

**Hubungan antar file dalam cluster:**
`communities-list-page.tsx` → merender `community-card-skeleton`, `community-list-card`, `create-community-dialog`; `community-list-card` link ke `/community/[slug]` yang kemungkinan merender `community-landing.tsx`. `community-landing.tsx` merakit `community-header`, `filter-bar`, `market-grid` (yang merakit `market-card` + `empty-state`), `market-card-skeleton`, `error-state`, `import-polymarket-dialog`. Cluster dashboard (`creator-dashboard.tsx`) merakit `stats-cards`, `quick-actions`, `markets-table`, `activity-feed`, `dashboard-skeleton`. Semua file konsisten pakai primitif shadcn/ui dari `@/components/ui/*` (Button, Input, Badge, Card, Select, Dialog, Avatar, Textarea, Label, Separator, Tabs, Table, DropdownMenu, Skeleton) dan helper `cn()` dari `@/lib/utils`; notifikasi UI konsisten pakai `toast` dari **`sonner`** (di `create-community-dialog` dan `import-polymarket-dialog`).

**Ringkasan temuan mencurigakan/berpotensi bug:**
1. Seluruh cluster berjalan di atas mock data lokal (`mock-communities-list`, `mock-community`, `mock-dashboard`) dengan delay `setTimeout` palsu (900ms/1200ms/800ms/600ms/1500ms/1800ms/2000ms tersebar di berbagai file) — belum ada integrasi API/backend/kontrak sungguhan di lapisan UI ini.
2. Banyak tombol aksi penting tanpa `onClick`: "Create First Market" (empty-state.tsx), "Trigger Execution"/"View Details"/"Edit"/"Close Market"/"Download CSV" (markets-table.tsx), semua 3 tombol QuickActions (quick-actions.tsx).
3. Dua `LoadState`/`FetchState` union punya member `"error"` yang tidak pernah benar-benar dicapai (community-landing.tsx, import-polymarket-dialog.tsx) — `ErrorState` jadi praktis tidak teruji lewat UI normal.
4. Statistik agregat di header `communities-list-page.tsx` tidak ikut ter-filter (selalu dihitung dari data mentah, bukan `filtered`).
5. Inkonsistensi satuan: `stats-cards.tsx` pakai prefix `$` untuk nilai yang berlabel CHZ, berbeda dari file-file lain yang konsisten memakai suffix "CHZ" saja.
6. Tiga daftar sport (`SPORT_FILTERS` di communities-list-page, `SPORT_FILTERS` di filter-bar, `SPORT_OPTIONS` di create-community-dialog) tidak sinkron/tidak dari satu sumber.
7. Formatter angka (`formatNumber`/`formatVolume`) diduplikasi minimal 4x, dan formatter waktu (`getTimeRemaining`/`formatCountdown`/`formatTime`) diduplikasi 3x dengan istilah tidak konsisten ("Closed" vs "Ended") — peluang refactor ke `lib/utils` bersama.
8. `statusConfig` untuk status market diduplikasi terpisah di `market-card.tsx` dan `markets-table.tsx` dengan class Tailwind yang berbeda meski merepresentasikan status yang sama.
9. Validasi panjang deskripsi di `create-community-dialog.tsx` tidak konsisten: counter UI merah di >160 char, `maxLength` HTML 200, tapi `validateDetails()` sama sekali tidak mengecek batas atas.
10. `scrollRef` di `filter-bar.tsx` dan `style={{animationDelay}}` tanpa class animasi di `community-list-card.tsx` adalah kode sisa yang tidak berefek.
11. `dashboard-skeleton.tsx` tidak menyediakan placeholder untuk kolom `ActivityFeed`, berpotensi layout shift saat data selesai dimuat.
12. `handleShare()` di `community-header.tsx` men-set `setTimeout` reset `copied` tanpa cleanup — potensi state-update-after-unmount jika user berpindah halaman dalam <2 detik.

### ui/components/ -- home, market, showcase, root-level (project-specific)

**Sub-cluster `home/` (landing/dashboard utama)**

- **`home-hero.tsx`** -- Komponen `HomeHero`, menerima prop `platformStats: { totalVolume, activeBettors, liveCommunities }`. Render badge live "**Chiliz Mainnet**" dengan animasi `animate-ping`, headline "PREDICT. STAKE. WIN." pakai font-serif (Bebas Neue), dan 3 stat inline (Volume/Bettors/Communities) pakai icon `DollarSign`, `Users`, `Activity` dari `lucide-react`. **Bug kecil**: import `Zap` dari lucide-react tapi tidak dipakai sama sekali di JSX -- unused import/dead code.
- **`home-page.tsx`** -- `HomePage`, client component, orkestrator utama halaman home. Pakai `useState(loading=true)` + `useEffect` dengan `setTimeout(600ms)` buat simulasi fetch (fake loading, bukan network call sungguhan) lalu render `HomeSkeleton`. Setelah loading selesai, compose `HomeHero`, `TopCommunities`, `YourBetsDashboard` (grid `lg:grid-cols-5`, 3:2 split), lalu `TrendingMarkets`. Data diambil dari `@/lib/data/mock-home` (`mockTopCommunities`, `mockUserBetsSummary`, `mockUserBets`, `mockTrendingMarkets`) -- semua **hardcoded mock**, termasuk `platformStats` yang di-inline langsung di JSX (`totalVolume: "$1.2M"`, `activeBettors: 4821`, `liveCommunities: 38`), tidak fetch dari on-chain/API.
- **`home-skeleton.tsx`** -- `HomeSkeleton`, murni presentational, meniru struktur layout `home-page.tsx` (hero strip, grid Top Communities + Your Bets, trending cards) pakai komponen `Skeleton` dari shadcn. Tidak ada logic.
- **`top-communities.tsx`** -- `TopCommunities` + subkomponen `CommunityRow`. Helper `formatVolume()` format angka jadi K/M. Constant `rankColors: Record<number, string>` untuk gradient warna rank 1-3 (emas/perak/perunggu style). Row link ke `/community/${community.slug}`, avatar fallback dari inisial nama (maks 2 huruf), badge "Verified" (`CheckCircle2`) dan "Hot" (`Zap` icon, kali ini terpakai). ROI 7 hari diwarnai hijau/merah pakai `cn()`. Tombol "View All" **hardcoded** ke `/community/premier-league-predictors` (bukan halaman daftar komunitas generik) -- berpotensi bug routing.
- **`trending-markets.tsx`** -- `TrendingMarkets` + `TrendingCard`. Punya `formatVolume()` sendiri (**duplikat** dari `top-communities.tsx`) dan `getTimeRemaining(closesAt)` yang dihitung ulang tiap 60 detik via `setInterval`. Card link ke `/market/${market.id}`, tampilkan odds bar YES/NO, badge "Hot"/"Closing Soon". Scroll horizontal pakai `id="trending-scroll"` dan tombol panah kiri/kanan yang manipulasi DOM langsung lewat `document.getElementById(...)?.scrollBy(...)` -- pola tidak idiomatik React (harusnya pakai `ref`), tapi berfungsi.
- **`your-bets-dashboard.tsx`** -- `YourBetsDashboard` dengan subkomponen `StatPill`, `BetRow`, `TabButton`. Lagi-lagi mendefinisikan ulang `formatVolume()` dan `getTimeRemaining()` (**duplikat ketiga**, function sama persis muncul di 3 file berbeda -- jelas pelanggaran DRY, seharusnya di-extract ke `lib/utils`). State tab lokal `"open" | "settled"` buat filter `bets` by `status`. Statistik ringkas: Open/Settled/ROI/Streak. Tombol "Browse Markets" saat kosong juga **hardcoded** ke `/community/premier-league-predictors` (sama seperti di `top-communities.tsx`).

**Sub-cluster `market/` (halaman detail market & taruhan)**

- **`market-detail-page.tsx`** -- `MarketDetailPage`, orkestrator. Custom hook `useMarketData()` simulasi fetch via `setTimeout(800ms)` lalu set state dari mock (`mockMarket`, `mockUserStake`, `mockClaimReward`, `mockComments` dari `@/lib/data/mock-market`). Render `StickyHeader` (subkomponen lokal) yang listen `window scroll` (passive) dan muncul jika `scrollY > 200`, menampilkan judul market + odds ringkas. Layout utama: `MarketHeader` → `MarketStatsBar` → grid `lg:grid-cols-3` (kolom kiri: `BettingInterface` + `ClaimRewards` conditional; kolom kanan: `UserStakes` conditional jika `userStake.totalStaked > 0`) → `DiscussionSection` full width di bawah. Fallback `MarketSkeleton` saat loading.
- **`market-header.tsx`** -- `MarketHeader`. Custom hook `useCountdown(targetDate)` menghitung days/hours/minutes/seconds dan update tiap 1 detik (`setInterval(1000ms)`). Fungsi `getStatusConfig(status: MarketStatus)` switch-case memetakan status (`open`/`closing_soon`/`closed`/`resolved`) ke label+className badge. `isUrgent` flag (days===0 && hours<6) mewarnai countdown jadi warna primary. Breadcrumb: Markets > `communityName` > title market.
- **`market-skeleton.tsx`** -- `MarketSkeleton`, skeleton loading meniru struktur `MarketDetailPage` (header, stats bar, betting interface, discussion). Presentational murni.
- **`market-stats-bar.tsx`** -- `MarketStatsBar`. Punya `formatNumber()` sendiri lagi (**duplikat keempat** dari fungsi K/M formatter yang sama). Grid 2x4: Total Bets, Total Volume (CHZ), Current Odds (bar visual YES/NO), dan link "**View on Polymarket**" (`market.polymarketUrl`, `target="_blank"`) -- ini satu-satunya titik integrasi Polymarket yang eksplisit terlihat di cluster ini, tapi sifatnya cuma link keluar (external), tidak ada call on-chain ke Polymarket dari UI.
- **`betting-interface.tsx`** -- `BettingInterface`. Constant `MOCK_WALLET_BALANCE = 5000` **hardcoded** (bukan dari saldo wallet asli). Tombol YES/NO besar menampilkan odds + pool bar (`yesPool`/`noPool`), klik membuka `StakeDialog` (state `stakeDialogOpen`, `selectedSide`). `handleStake` cuma `await new Promise(setTimeout(1800ms))` dengan **komentar eksplisit** `// In a real app, call your contract / API here` -- konfirmasi bahwa staking belum terhubung ke smart contract sungguhan, murni simulasi UI.
- **`claim-rewards.tsx`** -- `ClaimRewards`. State lokal `claiming`/`claimed`. `handleClaim` simulasi `setTimeout(2000ms)` lalu set `claimed = true` -- **tidak ada call on-chain claim sungguhan**, murni mock. Kalau `claimed`, tampilkan state sukses hijau; kalau belum, tampilkan card gradient primary dengan CTA "Claim Rewards".
- **`discussion-section.tsx`** -- file terbesar & paling kompleks di cluster ini. `DiscussionSection` mengelola thread komentar gaya Reddit dengan nested reply (`CommentThread` rekursif, `maxDepth = 4`). Helper: `timeAgo()`, `getInitials()`, `getAvatarColor()` (hash sederhana `userId` → index warna dari array `AVATAR_COLORS` 5 warna), `formatVotes()`, `countAllReplies()` (rekursif hitung total komentar+reply), `sortComments()` (mode `hot`/`new`/`top`; mode "hot" pakai formula `score + replies.length*2`). Subkomponen: `VoteButtons` (vertikal, top-level), `InlineVoteButtons` (horizontal, nested reply), `BetFlair` (badge YES/NO + jumlah stake user di komentar, pakai `Tooltip`), `CommentComposer` (textarea dengan expand-on-focus), `CommentThread` (collapse/expand thread). `handleVote` & `handleReply` update state React murni via immutable tree traversal (`updateVoteInTree`, `addReplyInTree`) -- **tidak ada persist ke backend**, comment baru (`id: c-${Date.now()}`) akan hilang saat refresh. **UI item non-fungsional**: menu dropdown "Save"/"Copy text"/"Report" tidak punya `onClick` handler (kecuali "Copy text" sebenarnya tidak ada action juga -- cek ulang: hanya tombol "Share" di action bar yang benar-benar `navigator.clipboard.writeText`), link "Continue this thread →" di depth>4 pakai `href="#"` dengan `e.preventDefault()` (dead link, pagination reply belum diimplementasi), dan tombol "View more comments" juga tanpa `onClick` (dead button).
- **`stake-dialog.tsx`** -- `StakeDialog` (wrapper responsif: `Drawer` di mobile via hook `useIsMobile()` dari `@/hooks/use-mobile`, `Dialog` shadcn di desktop) + `StakeForm` (logic inti). Constant `MIN_STAKE = 0.01` CHZ hardcoded. State `phase: "idle"|"loading"|"success"|"error"`. Validasi: `amount < MIN_STAKE` atau `amount > maxAmount` (maxAmount datang dari `MOCK_WALLET_BALANCE` di `betting-interface.tsx`). Kalkulasi payout: `estimatedPayout = amount * (100 / currentOdds)` dan `potentialReturn = (estimatedPayout - amount) / amount * 100` -- **formula naive**, cuma inverse dari persentase odds implied, tidak merefleksikan mekanisme AMM/pool-based staking yang disebut sendiri di info banner ("Your bet will be pooled with the community and executed 2 hours before market close via Chainlink") -- berpotensi payout estimate di UI tidak akurat vs mekanisme riil kontrak. `handleStake` panggil prop `onStake` (yang di level atas cuma mock delay), pakai toast dari dependency **`sonner`** untuk notifikasi sukses, auto-close dialog 2 detik setelah sukses (`autoCloseTimer` di-cleanup di `useEffect` unmount). Footer eksplisit menyebut "**Powered by Chainlink**" -- konfirmasi tekstual keterkaitan ke Chainlink CRE untuk eksekusi stake, tapi implementasinya tidak ada di layer UI ini.
- **`user-stakes.tsx`** -- `UserStakes`, presentational murni, menampilkan breakdown YES/NO stake user (`yesAmount`/`noAmount`, `yesPercentageOfTotal`/`noPercentageOfTotal`), total staked, dan potential payout. Tidak ada logic/state.

**Sub-cluster `showcase/` + `design-system-showcase.tsx` (style guide, bukan bagian dari flow user)**

- **`button-styles.tsx`**, **`card-examples.tsx`**, **`color-palette.tsx`**, **`spacing-grid.tsx`**, **`status-badges.tsx`**, **`typography-scale.tsx`** -- semua komponen statis tanpa props/state, murni dokumentasi visual design system. Detail teknis konkret yang tercatat:
  - **Warna** (`color-palette.tsx`): primary-light `#FF8F5C`, primary `#FF6B35`, primary-dark `#E55A2B`; background `#FFFFFF`, background-alt `#FAFAFA`, muted `#F3F4F6`, foreground `#1A1A1A`; success `#10B981`, warning `#F59E0B`, destructive `#EF4444`.
  - **Tipografi** (`typography-scale.tsx`): font display/hero = **Bebas Neue** (token `font-serif`), font UI/body = **Inter** (token `font-sans`), skala weight 400-800.
  - **Spacing** (`spacing-grid.tsx`): grid basis 4px (1=4px s/d 16=64px), radius scale sm/md/lg/xl/full, shadow scale sm/default/md/lg, container max-width 1280px (`px-4` mobile → `px-8` desktop) -- disebutkan di teks deskripsi.
  - **`button-styles.tsx`** & **`card-examples.tsx`** memakai `<button>`/`<div>` mentah dengan className manual, **bukan** komponen `Button`/`Card` dari shadcn yang dipakai di komponen produksi lain (nav-header, market, home) -- inkonsistensi/duplikasi sumber kebenaran styling.
  - **`card-examples.tsx`** & **`status-badges.tsx`** berisi data contoh bertema **NFL/NBA/MLB/NHL/MLS/UFC** (KC vs BUF 24-17, Alex Rivera, dst) yang tidak match domain aplikasi sebenarnya (Predit = prediction market komunitas terhubung Polymarket via Chainlink, bukan platform stats liga Amerika) -- indikasi kuat file-file showcase ini adalah **boilerplate/template generik yang belum di-adaptasi** ke domain Predit, atau sisa dari starter kit lain.
- **`design-system-showcase.tsx`** -- `DesignSystemShowcase`, halaman yang menggabungkan seluruh 6 komponen showcase di atas (`ColorPalette`, `TypographyScale`, `ButtonStyles`, `StatusBadges`, `CardExamples`, `SpacingGrid`) jadi satu style-guide page dengan hero header sendiri ("Sports Predictions" design system). Ini murni halaman referensi developer, tidak terhubung ke flow user (home/market).

**Root-level (`components/*.tsx`)**

- **`hero-section.tsx`** -- `HeroSection`, komponen hero landing terpisah dengan `FloatingCard` (animasi fade-in tertunda via `useState`+`useEffect`+`setTimeout`, delay bertingkat 600ms/800ms). Badge "Powered by Chainlink & Chiliz", headline "Predict Together, Win Together" pakai gradient text, subheading eksplisit menyebut "execute bets collectively on **Polymarket**". Statistik floating card **hardcoded**: "1,247 Active Bettors" dan "$127K Total Volume" -- **berbeda dari angka hardcoded di `home-hero.tsx`** ("$1.2M" volume, 4821 bettors) yang notabene juga tampil di halaman lain. Ini indikasi kuat **`hero-section.tsx` tidak dipakai/di-import oleh `home-page.tsx`** (home-page pakai `home-hero.tsx`), kemungkinan komponen yatim (dead/orphan code) atau versi landing page lama yang belum dibersihkan. Tombol CTA "Explore Communities" dan "Connect Wallet" di sini juga **tidak punya `onClick` handler** -- dekoratif saja.
- **`nav-header.tsx`** -- `NavHeader`, header situs utama (sticky, shrink saat scroll). `Logo` component menampilkan teks brand **"STACKBET"** (`STACK` + `BET` berwarna primary) -- **mismatch nama brand**: task/deskripsi proyek menyebut nama proyek adalah "**Predit**", tapi kode menampilkan "STACKBET" sebagai logo/nama produk yang terlihat user. Ini layak dicatat sebagai inkonsistensi branding/sisa nama proyek lama. `NAV_LINKS` constant: Home (`/`), Communities (`/communities`), Dashboard (`/dashboard`). `NetworkBadge` menampilkan chip "Chiliz" dengan animasi warning ping jika `!isCorrectNetwork`, tapi `isCorrectNetwork` di-**hardcode `true`** di `NavHeader` -- tidak benar-benar mengecek chain ID wallet. `WalletDropdown`/`MobileMenu` menampilkan address **hardcoded** `"0x1234567890abcdef1234567890abcdef12345678"` dan balance **hardcoded** `"2,450.00"` CHZ -- `isConnected` cuma toggle boolean lokal via `ConnectButton onClick={() => setIsConnected(true)}`, **tidak ada integrasi wallet sungguhan** (tidak ada wagmi/viem/ethers terlihat dipakai). Item menu "Copy Address" berfungsi (`navigator.clipboard.writeText`), tapi "View on Explorer" tidak punya `href`/`onClick` -- dead item. Helper `truncateAddress()` format `0x1234...5678`.
- **`theme-provider.tsx`** -- `ThemeProvider`, wrapper tipis di atas `next-themes` (`ThemeProvider as NextThemesProvider`), meneruskan semua props (`ThemeProviderProps`) apa adanya. Kemungkinan dipasang di root layout app (tidak termasuk file yang dibaca) untuk mendukung dark/light mode di seluruh aplikasi.

**Keterkaitan antar file dalam cluster ini**

- `home-page.tsx` adalah orkestrator top-level untuk home: memanggil `home-hero.tsx`, `top-communities.tsx`, `your-bets-dashboard.tsx`, `trending-markets.tsx`, dengan `home-skeleton.tsx` sebagai fallback loading state -- keempatnya menerima tipe data dari `@/lib/data/mock-home` (`TopCommunity`, `TrendingMarket`, `UserBet`, `UserBetsSummary`).
- `market-detail-page.tsx` adalah orkestrator untuk market: memanggil `market-header.tsx`, `market-stats-bar.tsx`, `betting-interface.tsx`, `user-stakes.tsx`, `claim-rewards.tsx`, `discussion-section.tsx`, dengan `market-skeleton.tsx` sebagai fallback -- semua menerima tipe dari `@/lib/types/market` (`Market`, `UserStake`, `ClaimReward`, `Comment`, `MarketStatus`) dan data dari `@/lib/data/mock-market`.
- `betting-interface.tsx` merender `stake-dialog.tsx` sebagai modal terkontrol (state `open` diangkat/lifted dari parent), meneruskan `maxAmount={MOCK_WALLET_BALANCE}` dan callback `onStake` yang sebenarnya cuma mock delay.
- `design-system-showcase.tsx` mengompose keenam file di `showcase/*` menjadi satu halaman style-guide -- cluster ini berdiri sendiri, tidak dipanggil oleh `home-page.tsx` maupun `market-detail-page.tsx`.
- `nav-header.tsx` dan `theme-provider.tsx` adalah komponen app-shell level (kemungkinan dipakai di root layout, di luar file yang dibaca), independen dari cluster home/market tapi menyediakan navigasi & tema untuk semua halaman.
- `hero-section.tsx` tampak sebagai komponen landing terpisah yang **tidak terhubung** ke `home-page.tsx` (yang memakai `home-hero.tsx` sebagai gantinya) -- kemungkinan dead code/orphan.
- Pola berulang lintas file: fungsi format angka K/M (`formatVolume`/`formatNumber`) dan fungsi hitung waktu tersisa (`getTimeRemaining`) **didefinisikan ulang secara identik** di `top-communities.tsx`, `trending-markets.tsx`, `your-bets-dashboard.tsx`, dan `market-stats-bar.tsx` -- tidak ada shared utility, jelas duplikasi kode yang seharusnya di-refactor ke `lib/utils`.
- Tema mata uang **CHZ** (Chiliz) konsisten dipakai di seluruh cluster (stake, pool, payout, balance) selaras dengan badge "Chiliz Mainnet"/"Chiliz Chain" di `home-hero.tsx` dan `nav-header.tsx`.
- Referensi ke **Chainlink** muncul di teks UI (`stake-dialog.tsx` footer & info banner, `hero-section.tsx` badge) sebagai penjelas mekanisme eksekusi stake terpusat/pooled, tapi implementasi aktualnya (CRE/Automation call) tidak terlihat di layer komponen UI ini -- seluruhnya masih simulasi (`setTimeout`) di level frontend.
- Referensi ke **Polymarket** hanya muncul sebagai link keluar (`market.polymarketUrl`) di `market-stats-bar.tsx` dan sebagai teks di `hero-section.tsx` -- tidak ada pemanggilan API/on-chain Polymarket langsung di komponen UI yang dibaca.

**Ringkasan temuan mencurigakan/tidak lengkap**

1. `home-hero.tsx` -- import `Zap` dari lucide-react tidak dipakai (unused import).
2. `betting-interface.tsx`, `claim-rewards.tsx` -- `handleStake`/`handleClaim` cuma `setTimeout` mock, komentar eksplisit "In a real app, call your contract / API here" -- staking & klaim reward **belum terhubung ke smart contract**.
3. `MOCK_WALLET_BALANCE = 5000` (`betting-interface.tsx`) dan wallet address/balance hardcoded di `nav-header.tsx` -- **tidak ada integrasi wallet nyata** (tidak ada wagmi/viem terlihat), `isConnected` cuma boolean lokal.
4. `isCorrectNetwork` di `nav-header.tsx` di-hardcode `true`, tidak benar-benar mengecek chain ID.
5. Duplikasi fungsi `formatVolume`/`formatNumber`/`getTimeRemaining` di 4 file berbeda (DRY violation).
6. Link/tombol hardcoded ke slug spesifik `/community/premier-league-predictors` di `top-communities.tsx` dan `your-bets-dashboard.tsx` sebagai fallback "View All"/"Browse Markets" generik.
7. `discussion-section.tsx` -- menu "Save"/"Report", link "Continue this thread →", dan tombol "View more comments" tidak punya handler fungsional (dead UI); komentar baru tidak persist (hilang saat refresh, hanya state React lokal).
8. `stake-dialog.tsx` -- formula `estimatedPayout = amount * (100 / currentOdds)` adalah simplifikasi odds-implied, berpotensi tidak akurat dibanding mekanisme pooled-staking yang dideskripsikan sendiri di UI.
9. `hero-section.tsx` tampak sebagai komponen yatim (tidak diimpor oleh `home-page.tsx`), dengan angka statistik hardcoded yang **berbeda** dari `home-hero.tsx` (indikasi dua sumber "kebenaran" yang tidak sinkron).
10. `nav-header.tsx` -- brand/logo bertuliskan **"STACKBET"**, bukan "Predit" -- mismatch nama produk yang mencurigakan (sisa branding lama/template).
11. `showcase/*` (`button-styles.tsx`, `card-examples.tsx`, `status-badges.tsx`) menggunakan elemen HTML mentah alih-alih komponen shadcn yang dipakai di produksi, dan berisi data contoh bertema NFL/NBA/UFC yang tidak match domain Predit (community-staked prediction market untuk event Polymarket) -- indikasi boilerplate belum di-adaptasi penuh.
12. Semua state "loading" di `home-page.tsx` (600ms) dan `market-detail-page.tsx` (800ms) adalah **fixed fake delay**, bukan hasil fetch API/on-chain sungguhan -- perlu diganti ke real data-fetching sebelum production.

### ui/components/ui/ (shadcn primitives) + ui/hooks

**Kesimpulan utama**: Seluruh 59 file di cluster ini adalah hasil generate `shadcn/ui` CLI standar (pola `data-slot`, `cn()` dari `@/lib/utils`, Radix UI primitives, `class-variance-authority` untuk variants). **Tidak ada satupun logic bisnis prediction-market/Web3/Polymarket/Chainlink** yang bocor ke lapisan UI primitif ini — semua murni presentational/behavioral wrapper generik. Namun ditemukan beberapa hal struktural yang patut dicatat (lihat bagian "Temuan mencurigakan" di bawah).

**Daftar file + fungsi singkat:**

*Overlay & dialog primitives (Radix-based, portal + overlay pattern seragam):*
- `alert-dialog.tsx` — modal konfirmasi destruktif (`AlertDialogAction`/`AlertDialogCancel` pakai `buttonVariants()` dari `button.tsx`).
- `dialog.tsx` — modal generik dengan `DialogContent` (max-w-lg, animasi `zoom-in-95`/`fade-in-0`), tombol close `XIcon` opsional via prop `showCloseButton`.
- `drawer.tsx` — wrapper `vaul` (`Drawer as DrawerPrimitive`), mendukung 4 arah (`top/bottom/left/right`) via `data-[vaul-drawer-direction=...]`.
- `sheet.tsx` — panel slide-in berbasis `@radix-ui/react-dialog` (bukan `vaul`), prop `side` default `'right'`.
- `popover.tsx`, `hover-card.tsx`, `tooltip.tsx` — pola identik (Portal + Content + `sideOffset`), `TooltipProvider` default `delayDuration={0}`.
- `context-menu.tsx`, `dropdown-menu.tsx`, `menubar.tsx` — ketiganya struktur nyaris identik (Item/CheckboxItem/RadioItem/Sub*), masing-masing punya varian `data-variant="destructive"` untuk item merah.
- `command.tsx` — command palette berbasis `cmdk`, `CommandDialog` default `title="Command Palette"` dan `description="Search for a command to run..."` (nilai hardcoded default, bisa dioverride via props).

*Form & input:*
- `input.tsx`, `textarea.tsx` — input dasar dengan style focus-ring dan `aria-invalid` styling.
- `input-group.tsx` — wrapper kompleks untuk gabungan input+addon+button dengan variant `align` (`inline-start/inline-end/block-start/block-end`); ada logic `onClick` custom di `InputGroupAddon` yang auto-focus ke `<input>` sibling kecuali klik kena `<button>`.
- `input-otp.tsx` — wrapper `input-otp` lib, render caret palsu via `hasFakeCaret` + animasi `animate-caret-blink`.
- `checkbox.tsx`, `radio-group.tsx`, `switch.tsx`, `slider.tsx` — Radix primitives standar; `slider.tsx` punya `_values` memoized fallback ke `[min, max]` jika tidak ada `value`/`defaultValue`.
- `label.tsx` — wrapper `@radix-ui/react-label`.
- `select.tsx` — Radix Select lengkap dengan scroll up/down button.
- `form.tsx` — integrasi `react-hook-form` (`Controller`, `FormProvider`, `useFormContext`, `useFormState`); expose `useFormField()` yang generate id (`formItemId`, `formDescriptionId`, `formMessageId`) via `React.useId()`.
- `field.tsx` — sistem layout form generasi baru shadcn (`FieldSet`, `FieldGroup`, `FieldLabel`, `FieldError` dengan `errors` prop array `{message}`), terpisah dari `form.tsx` (kemungkinan dua pendekatan form berbeda dipakai bersamaan di project).
- `button.tsx` — `buttonVariants` cva dengan varian `default/destructive/outline/secondary/ghost/link` dan size `default/sm/lg/icon/icon-sm/icon-lg`.
- `button-group.tsx` — pembungkus grup tombol dengan border-radius saling menyambung (`orientation: horizontal/vertical`).
- `toggle.tsx`, `toggle-group.tsx` — `toggleVariants` dipakai bersama via context (`ToggleGroupContext`) agar `size`/`variant` konsisten di semua child.

*Navigasi & struktur konten:*
- `navigation-menu.tsx` — Radix NavigationMenu dengan `viewport` prop (default `true`) untuk render `NavigationMenuViewport` terpisah.
- `breadcrumb.tsx`, `pagination.tsx` — komponen navigasi non-Radix (plain HTML `nav/ol/li`), `pagination.tsx` reuse `buttonVariants`.
- `tabs.tsx`, `accordion.tsx`, `collapsible.tsx` — Radix state-driven, `accordion.tsx` pakai animasi custom `animate-accordion-up/down` (butuh keyframe didefinisikan di config Tailwind, tidak terlihat di file ini — perlu dicek `tailwind.config`).
- `sidebar.tsx` — **file paling kompleks di cluster** (727 baris). Konstanta hardcoded: `SIDEBAR_COOKIE_NAME='sidebar_state'`, `SIDEBAR_COOKIE_MAX_AGE=60*60*24*7` (7 hari), `SIDEBAR_WIDTH='16rem'`, `SIDEBAR_WIDTH_MOBILE='18rem'`, `SIDEBAR_WIDTH_ICON='3rem'`, `SIDEBAR_KEYBOARD_SHORTCUT='b'` (toggle via Cmd/Ctrl+B). State disimpan di cookie (bukan localStorage) via `document.cookie` langsung di `setOpen`. Pakai `useIsMobile()` dari `@/hooks/use-mobile`, dan compose `Sheet`/`Tooltip`/`Skeleton`/`Separator`/`Input` — jadi ini node integrasi yang menggabungkan banyak primitive lain dalam cluster ini. Ini tetap stock shadcn "sidebar-07" block, bukan modifikasi custom.
- `resizable.tsx` — wrapper `react-resizable-panels`.
- `scroll-area.tsx` — wrapper Radix ScrollArea + `ScrollBar` custom (vertical/horizontal).

*Data display:*
- `card.tsx`, `badge.tsx`, `avatar.tsx`, `separator.tsx`, `skeleton.tsx`, `kbd.tsx`, `table.tsx`, `item.tsx`, `empty.tsx` — komponen presentational murni, semua stock.
- `alert.tsx` — varian `default`/`destructive` via cva.
- `carousel.tsx` — wrapper `embla-carousel-react`; expose context `useCarousel()` yang throw error kalau dipakai di luar `<Carousel>`; handle keyboard arrow-left/right.
- `calendar.tsx` — wrapper `react-day-picker` v9-style (`captionLayout='label'`, `buttonVariant='ghost'`), custom `CalendarDayButton` dengan auto-focus via `useRef`+`useEffect` saat `modifiers.focused`.
- `chart.tsx` — wrapper `recharts`. Constant `THEMES = { light: '', dark: '.dark' }`. `ChartContainer` generate `chartId` unik via `React.useId()`, inject CSS variable `--color-{key}` per config lewat `<style dangerouslySetInnerHTML>` — pola shadcn standar untuk theming chart per light/dark.

*Notifikasi/feedback:*
- `spinner.tsx` — wrapper `Loader2Icon` dari lucide-react dengan `animate-spin`.
- `progress.tsx` — Radix Progress, indicator pakai `transform: translateX(-${100-value}%)`.
- `sonner.tsx` — wrapper `sonner` toast library terintegrasi `next-themes` (`useTheme()`), inject CSS var `--normal-bg/--normal-text/--normal-border` dari token tema shadcn.
- `toast.tsx`, `toaster.tsx`, `use-toast.ts` (dua lokasi identik) — **sistem toast lama** berbasis `@radix-ui/react-toast` + reducer manual (`ADD_TOAST/UPDATE_TOAST/DISMISS_TOAST/REMOVE_TOAST`), state disimpan di module-level `memoryState` + `listeners[]` (bukan Context React — pola singleton).

*Hooks:*
- `use-mobile.tsx` (di `components/ui/`) dan `use-mobile.ts` (di `hooks/`) — **isinya identik 100%**: `MOBILE_BREAKPOINT=768`, `useIsMobile()` pakai `matchMedia`.
- `use-toast.ts` (di `components/ui/`) dan `use-toast.ts` (di `hooks/`) — **isinya identik 100%** juga.

**Temuan mencurigakan (wajib dicatat):**

1. **Duplikasi file penuh (dead code kandidat)**: `ui/components/ui/use-mobile.tsx` vs `ui/hooks/use-mobile.ts`, dan `ui/components/ui/use-toast.ts` vs `ui/hooks/use-toast.ts` — masing-masing pasangan punya isi byte-identik. Ini kemungkinan besar residu dari menjalankan `npx shadcn add` berkali-kali (versi shadcn lama taruh hook di `components/ui/`, versi baru taruh di `hooks/`), dan tidak dibersihkan. `sidebar.tsx` sendiri sudah meng-import dari `@/hooks/use-mobile`, jadi file `components/ui/use-mobile.tsx` kemungkinan **tidak terpakai** — perlu di-grep referensinya di seluruh repo untuk konfirmasi sebelum dihapus.

2. **Dua sistem toast berjalan paralel**: proyek punya sistem toast lama (`toast.tsx` + `toaster.tsx` + `use-toast.ts`, berbasis Radix Toast + reducer manual) **dan** sistem baru `sonner.tsx` (berbasis library `sonner`, terintegrasi `next-themes`). Kalau hanya satu yang benar-benar dipasang di root layout (`<Toaster />`), yang satunya adalah dead code. Perlu dicek `app/layout.tsx` untuk tahu mana yang aktif.

3. **`TOAST_REMOVE_DELAY = 1000000`** (~16.6 menit) di `use-toast.ts` — ini adalah kutu/artefak yang sudah dikenal luas di template stock shadcn (harusnya kemungkinan dimaksud 1000ms tapi ketinggalan jadi 1_000_000ms), bukan modifikasi custom project ini, tapi tetap relevan dicatat kalau toast lama (non-sonner) itu masih dipakai — efeknya toast dismiss secara visual tapi elemennya baru benar-benar di-unmount ~16 menit kemudian. Juga `TOAST_LIMIT = 1` artinya hanya 1 toast bisa tampil bersamaan.

4. **Tidak ada dependency Web3/on-chain** apapun (tidak ada import `wagmi`, `viem`, `ethers`, alamat kontrak, atau ABI) di cluster ini — mengonfirmasi bahwa `ui/components/ui/` murni lapisan presentasi generik shadcn, terlepas total dari logic Predit (staking/prediction market/Chainlink CRE/Polymarket) yang harus dicari di komponen level lebih tinggi (`ui/app/` atau `ui/components/` non-`ui` subfolder) di luar cluster ini.

5. Dependency eksternal yang dipakai di cluster (semua standar shadcn stack): `@radix-ui/react-*` (accordion, alert-dialog, aspect-ratio, avatar, checkbox, collapsible, context-menu, dialog, dropdown-menu, hover-card, label, menubar, navigation-menu, popover, progress, radio-group, scroll-area, select, separator, slot, switch, tabs, toast, toggle, toggle-group, tooltip), `cmdk`, `vaul`, `embla-carousel-react`, `recharts`, `react-day-picker`, `react-hook-form`, `input-otp`, `react-resizable-panels`, `sonner`, `next-themes`, `lucide-react`, `class-variance-authority`, dan util internal `cn()` dari `@/lib/utils` (dipakai di hampir semua 59 file — file ini sendiri tidak termasuk cluster tapi jadi dependency sentral bersama).

**Ringkasan kepatuhan instruksi cluster**: 57 dari 59 file terkonfirmasi 100% stock shadcn/ui tanpa logic custom project-specific (tidak ada hardcoded value/endpoint/constant yang berhubungan dengan Predit/Polymarket/Chainlink). 2 pasang file (`use-mobile` dan `use-toast`, total 4 file) terkonfirmasi *duplikat identik* antar-lokasi — bukan modifikasi custom, tapi anomali struktural project yang layak dibersihkan.

### frontend/ (legacy app, README says reference-only) -- routes + API routes + config

**Ringkasan umum**: Cluster ini berisi Next.js 15 App Router (bukan Vite meski `package.json` masih bernama `"vite_react_shadcn_ts"` — sisa scaffold Lovable.dev asli sebelum diporting ke Next.js). Branding di `layout.tsx` masih **"BetTogether"** (title/description metadata), bukan "Predit" — indikasi rename proyek yang belum dibersihkan di legacy files. Stack: React 18, wagmi v2 + viem v2 + RainbowKit v2 untuk wallet/kontrak, TanStack Query v5, Supabase untuk komentar, shadcn-ui + Tailwind (HSL design tokens).

**File-file yang dibaca dan fungsinya:**

1. **`app/page.tsx`** — Landing page. Render `Header`, hero section dengan `SafeConnectButton`, seksi "How It Works" (3 langkah: Join Community → Place Bets → Auto-Execution "2 hours before market close via Chainlink"), dan **`featuredCommunities` yang 100% hardcoded** (3 komunitas mock: Crypto Predictions, Sports Analytics, Tech Trends) — tidak fetch dari kontrak sama sekali, murni mock UI.

2. **`app/layout.tsx`** — `RootLayout`, load font Google `Inter` via preconnect, bungkus children dengan `<Providers>`. `metadata.title` = **"BetTogether - Collective Betting on Polymarket"** — mismatch nama proyek (Predit).

3. **`app/providers.tsx`** — Client component setup provider stack: `WagmiProvider` (config dari `@/lib/wagmi`) → `QueryClientProvider` (instance `QueryClient` baru per mount via `useState`) → `RainbowKitProvider` → `TooltipProvider`. **Mencurigakan**: memasang **dua sistem toast sekaligus** — shadcn `<Toaster />` (Radix) DAN `<Sonner />` — berpotensi duplikat notifikasi kalau komponen lain memanggil `toast()` dari kedua library tsb (dan memang `sonner`'s `toast` dipakai di `events/[id]/page.tsx` dan `communities/[id]/page.tsx`).

4. **`app/not-found.tsx`** — 404 page sederhana, `useEffect` log `console.error("404 Error...")` ke console tiap ganti `pathname`, link balik ke `/`.

5. **`app/globals.css`** — Definisi design token HSL di `:root` (wajib HSL sesuai komentar file): `--background: 225 25% 8%`, `--primary: 200 100% 50%`, `--accent: 280 80% 60%`, `--success`, `--danger`, `--warning`, `--radius: 0.75rem`, plus gradient vars (`--gradient-primary`, `--gradient-success`, `--gradient-danger`, `--gradient-card`) dan shadow vars (`--shadow-glow`, `--shadow-card`). Utility classes `.gradient-primary`, `.shadow-glow`, `.transition-smooth` dipakai luas di semua page.

6. **`app/communities/page.tsx`** — Halaman list komunitas, **real on-chain read**. Alur: `useContractRead` `communityCount()` di `PredictionHub` (via `CONTRACT_ADDRESSES.PredictionHub` + `PredictionHubABI`) → generate array kontrak batch `communities(uint256 i)` untuk `i = 0..count-1` → `useContractReads` batch semua → map tuple `[id, name, description, metadataURI, creator, createdAt, memberCount, marketCount, isActive]`, filter `isActive`. Search client-side (substring match name/description). Ada `CreateCommunityForm` (dialog), `RegisterCreatorButton`, `CheckCreatorButton` — menunjukkan ada mekanisme registrasi "creator" role terpisah di kontrak.

7. **`app/communities/[id]/page.tsx`** — Detail komunitas, paling kompleks di cluster ini. Baca `getCommunity(id)`, `getCommunityMarkets(id)` (dengan `refetchInterval: 5000`), lalu untuk tiap market address baca 5 fungsi (`metadata`, `stakingDeadline`, `state`, `getPoolInfo`, `polymarketId`) via `useContractReads` batch, di-chunk balik per market (`chunkSize=5`). Punya defensive parsing ganda untuk tuple vs object return format dari kontrak (indikasi developer tidak yakin bentuk return ABI-nya konsisten). Komentar eksplisit **enum `MarketState`: `Open=0, Locked=1, MockBridged=2, MockTrading=3, Settled=4, Completed=5`** — nama `MockBridged`/`MockTrading` mengonfirmasi bridge ke Polymarket **masih di-mock**, belum integrasi real. Odds dihitung dari `getPoolInfo()` (`totalA/totalB/totalDraw`). Title fallback chain: `metadata.title` → format `polymarketId` → potongan alamat market.
   - **Bug konkret #1**: `handleJoinLeave` HANYA `setIsMember()` + `toast.success()` lokal — **tidak ada pemanggilan write function on-chain sama sekali** (tidak ada `joinCommunity`/`leaveCommunity` contract call). Tombol "Join Community" secara visual berhasil tapi tidak benar-benar mendaftarkan user di kontrak.
   - **Bug konkret #2 (off-by-one)**: `getCommunity` di-enable dengan `communityId >= 0`, tapi `getCommunityMarkets` dan `isCommunityMember` di-enable dengan `communityId > 0`. Karena komunitas pertama kemungkinan besar ber-ID **0** (index dari `communities/page.tsx` mulai dari `i=0`), maka komunitas ID 0 akan menampilkan detail tapi **tidak pernah** memuat market/status membership-nya.
   - `refreshKey` state di-increment di `handleEventSuggestionSuccess` tapi tidak pernah dipakai/dijadikan dependency di query manapun — dead state, refresh mengandalkan `refetchInterval: 5000` saja.
   - Banyak `console.log`/`console.warn` debug tersisa (log community data mentah, warning metadata parse gagal) — belum dibersihkan untuk produksi.

8. **`app/dashboard/page.tsx`** — **Seluruhnya mock/hardcoded**: `activeBets` (2 entri statis), `completedBets` (1 entri statis), `stats` (`totalBets:15, activeBets:2, totalVolume:1250, winRate:67`). Tidak ada fetch on-chain maupun filter berdasarkan `address` wallet yang connect — mengonfirmasi status "reference-only legacy".

9. **`app/events/[id]/page.tsx`** — Detail market/event, **real on-chain read+write** paling lengkap. `marketAddress = params.id`. Baca 7 field via `useContractReads` (`metadata, stakingDeadline, state, getTotalPool, getPoolInfo, polymarketId, hub`), lalu terpisah baca `hub()` untuk dapat alamat `PredictionHub`, lalu `getMarketCommunity(marketAddress)` pada hub, lalu `getCommunity(communityId)`. Untuk user stake: `getStake(address,0)`=Yes, `getStake(address,1)`=No, `canClaim`, `getPotentialReward`, `hasClaimed`, `chosenOutcome`, `winningOutcome`, `isSettled`. `useContractWrite` untuk fungsi **`claim`**, dipasangkan `useWaitForTransactionReceipt`, dengan guard `hasShownClaimSuccess`/`hasShownClaimError` mencegah toast dobel (toast id tetap `"claim"`).
   - `totalBetsEstimate` dihitung dengan rumus taksiran kasar: `Math.max(1, Math.floor(totalPool_CHZ / 0.01))` — **bukan angka riil jumlah petaruh**, murni estimasi karena kontrak tidak track unique staker count. Berpotensi menyesatkan UI ("Total Bets") karena publik akan membacanya sebagai angka pasti.
   - `executionWindowTime = stakingDeadline - 2 jam` — konsisten dengan narasi "Chainlink automation 2 hours before close" di homepage.
   - Ada blok JSX yang **di-comment-out**: tombol "View on Polymarket" (`<Button ... href={marketInfo.polymarketUrl}>`) — dead code ditinggalkan.
   - Merender `ChatContainer` (props `eventId=marketAddress`, `communityId`) — kemungkinan terhubung ke `api/comments` (di luar cluster ini untuk verifikasi detail, tapi skema cocok).

10. **`app/rankings/page.tsx`** — **Seluruhnya mock**: `fetchCommunityRankings`/`fetchUserRankings` cuma `setTimeout(800ms)` lalu isi array hardcoded (5 community rankings, 7 user rankings dengan address dummy). Tidak ada pemanggilan API/kontrak nyata sama sekali meski nama fungsinya seperti "fetch".

11. **`app/api/comments/route.ts`** — CRUD komentar via Supabase client `@/lib/supabase`. `GET` wajib query param `eventId` + `communityId`, select dari table `comments` order by `created_at` ascending. `POST` validasi field wajib (`eventId, communityId, userId, content`), `content` non-empty string, batasan `MAX_CONTENT_LENGTH = 500` (cocok dengan `CHECK` constraint di skema SQL README). **Mencurigakan**: `userId` diambil langsung dari body request client tanpa verifikasi signature/wallet — siapa pun bisa post komentar mengatasnamakan `userId` orang lain (spoofable identity, tidak ada auth).

12. **`app/api/market/lock/route.ts`** — POST endpoint admin yang memanggil `triggerExecution(outcome)` di kontrak Market, menandatangani tx pakai **private key server-side dari `process.env.CREATOR_PRIVATE_KEY`** via viem `privateKeyToAccount` + `createWalletClient`. Chain custom didefinisikan inline: **Spicy Testnet, chainId `88882`, RPC `https://spicy-rpc.chiliz.com`, native currency CHZ**. Validasi `outcome` harus salah satu `[0,1,2]` (A/B/Draw). **Tidak ada autentikasi/otorisasi apa pun** di luar payload validation — siapa saja yang tahu URL endpoint bisa memicu `triggerExecution` untuk market mana pun. Kerentanan keamanan signifikan.

13. **`app/api/market/submit-results/route.ts`** — Mirip di atas, tapi memanggil fungsi **`mockPolymarketReturn(winningOutcome, payoutWei)`** yang bersifat **payable** — server mengirim `value: payoutWei` CHZ **dari wallet-nya sendiri** (`CREATOR_PRIVATE_KEY`) untuk mendanai payout settlement. Ini mengonfirmasi seluruh alur settlement Polymarket saat ini **mock sepenuhnya** (bot server yang manual funding, bukan bridge nyata). **Sama seperti route `lock`, tidak ada auth** — kombinasi "tanpa auth" + "fungsi mengirim CHZ nyata dari wallet privat" adalah risiko finansial serius: siapa pun bisa memanggil endpoint ini dengan `winningOutcome` dan `payout` sembarang untuk menguras saldo wallet `CREATOR_PRIVATE_KEY` jika deploy live dan endpoint publik.

14. **`app/api/polymarket/events/[slug]/route.ts`** — Proxy sederhana ke Polymarket Gamma API: `GET https://gamma-api.polymarket.com/events/slug/${slug}`, validasi response punya `data.title` dan `data.description`, forward JSON. Kemungkinan dipakai `EventSuggestionForm` (di luar cluster) untuk creator mengimpor event Polymarket by slug.

15. **`app/api/market/.curl`** (dicatat sesuai instruksi) — Bukan kode, scratch file dokumentasi manual testing untuk 2 endpoint di atas (`/api/market/lock`, `/api/market/submit-results`), berisi contoh curl yang menembak **URL ngrok tunnel `https://bf1434f87eba.ngrok-free.app`** (tunnel dev lokal, kemungkinan sudah mati/berubah) dengan contoh `marketAddress: "0xd48143a6E214714a7901A0f37CD6d86232794E27"`. Bukti nyata developer men-test flow settlement mock secara manual selama development.

16. **`README.md`** — Sebagian besar **boilerplate generik Lovable.dev** (link project ID `6206cd26-88a9-4336-9585-6b68aa77b223`, instruksi generik "Use Lovable"/"Use GitHub Codespaces", tidak relevan). Bagian yang relevan: **setup Supabase lengkap** — env var wajib `NEXT_PUBLIC_SUPABASE_URL` dan `SUPABASE_SERVICE_ROLE_KEY`, plus **skema SQL persis** untuk table `comments` (kolom `id UUID`, `event_id/community_id/user_id TEXT`, `content TEXT CHECK(char_length<=500)`, `created_at/updated_at`), index komposit `idx_comments_event_community`, index `idx_comments_created_at`, trigger `update_comments_updated_at` + fungsi plpgsql `update_updated_at_column()`. Skema ini persis cocok dengan yang dipakai `api/comments/route.ts`.

17. **`WAGMI_CLIENTS_USAGE.md`** — Dokumen internal yang menjelaskan pola custom hooks: `useContractRead`/`useContractReads`/`useContractWrite` dari `@/hooks` (wrapper di atas wagmi, dipakai konsisten di semua page cluster ini), dan `getReadClient()` dari `@/lib/clients` untuk pemakaian server-side/API routes. **Inkonsistensi**: dokumen ini menyarankan pakai `getReadClient()` di API routes, tapi `lock/route.ts` dan `submit-results/route.ts` justru **duplikat mendefinisikan ulang** `spicyTestnet` chain config dan client viem sendiri secara inline (copy-paste identik di kedua file) alih-alih reuse dari `@/lib/clients` — pelanggaran DRY yang eksplisit terlihat. Juga dikonfirmasi `CONTRACT_ADDRESSES` expose 3 alamat: `NetworkConfig`, **`MockPolymarket`**, `PredictionHub` — nama `MockPolymarket` menguatkan lagi bahwa integrasi Polymarket saat ini simulasi.

18. **`next.config.js`** — Minimal, hanya `reactStrictMode: true`. Tidak ada config images/headers/redirects/CSP — tidak ada security header sama sekali, konsisten dengan absennya auth di API routes.

19. **`package.json`** — `name: "vite_react_shadcn_ts"` (sisa nama scaffold Vite lama, meski sekarang full Next.js — bukti migrasi Vite→Next belum "dibersihkan" penuh). Scripts: `dev`/`build`/`start` pakai `next`, `lint` pakai `eslint .`. Dependency kunci: `next ^15.1.0`, `react ^18.3.1`, `wagmi ^2.19.5`, `viem ^2.39.3`, `@rainbow-me/rainbowkit ^2.2.9`, `@tanstack/react-query ^5.90.10`, `@supabase/supabase-js ^2.84.0`, `sonner ^1.7.4` + Radix `@radix-ui/react-toast` (dua sistem toast, cocok temuan di `providers.tsx`), `zod ^3.25.76` dan `recharts ^2.15.4` (di-install tapi tidak terlihat dipakai langsung di file-file cluster ini — kemungkinan dipakai komponen di luar cluster). Dev deps: `typescript ^5.8.3`, `eslint ^9` flat config + `eslint-config-next`, `tailwindcss ^3.4.17`.

20. **`tailwind.config.ts`** — `darkMode: ["class"]`, content glob mencakup `pages/components/app/src`, `prefix: ""`, container center dengan padding `2rem` dan breakpoint `2xl: 1400px`. Semua warna semantic (`border, input, ring, background, foreground, primary(+glow), secondary, destructive, muted, accent, success, danger, warning, popover, card`) di-mapping ke `hsl(var(--x))` — **coupling ketat dengan `globals.css`**: rename variable CSS harus disinkron manual di kedua file, rawan human error. `borderRadius` (`lg/md/sm`) diturunkan dari `--radius`. Hanya keyframe accordion (dari Radix) + plugin `tailwindcss-animate`.

**Hubungan antar file dalam cluster:**
- `layout.tsx` → `providers.tsx` → menyuplai context wagmi/RainbowKit/react-query yang dipakai oleh semua hook `useContractRead`/`useContractReads`/`useContractWrite` di `communities/page.tsx`, `communities/[id]/page.tsx`, `events/[id]/page.tsx`.
- `communities/page.tsx` dan `communities/[id]/page.tsx` sama-sama pakai `PredictionHubABI` + `CONTRACT_ADDRESSES.PredictionHub`; `communities/[id]/page.tsx` dan `events/[id]/page.tsx` sama-sama pakai `MarketABI` — Market contract juga menyimpan referensi balik ke Hub (`hub()` function) yang dipakai `events/[id]/page.tsx` untuk resolve community info dari sebuah market address.
- `globals.css` (CSS vars) ↔ `tailwind.config.ts` (mapping token) saling bergantung erat.
- `README.md` (skema SQL Supabase) ↔ `api/comments/route.ts` (query/insert sesuai skema tsb).
- `WAGMI_CLIENTS_USAGE.md` mendokumentasikan pola `@/hooks` + `CONTRACT_ADDRESSES` yang benar-benar dipakai di `communities/*` dan `events/[id]/page.tsx`, tapi **tidak diikuti** oleh `api/market/lock` dan `api/market/submit-results` (keduanya bikin client viem sendiri, bukan `getReadClient()`).
- `.curl` mendokumentasikan pemakaian manual dua API routes admin (`lock`, `submit-results`) yang juga dibaca di cluster ini — bukti alur testing yang sama.
- `dashboard/page.tsx` dan `rankings/page.tsx` adalah dua halaman yang **sepenuhnya terisolasi** dari kontrak/backend nyata (100% mock), kontras jelas dengan `communities/*` dan `events/[id]` yang sudah terhubung on-chain — mendukung label "legacy, reference-only" di README-level judgement untuk folder ini secara keseluruhan.

**Temuan mencurigakan/berisiko yang perlu ditandai eksplisit:**
- API `lock` dan `submit-results` **tanpa autentikasi**, memegang `CREATOR_PRIVATE_KEY` dan salah satunya (`submit-results`) benar-benar mengirim CHZ (`value: payoutWei`) — risiko drain wallet jika ter-deploy publik tanpa proteksi tambahan.
- `handleJoinLeave` di `communities/[id]/page.tsx` tidak melakukan transaksi on-chain apa pun — UI menyesatkan user seolah sudah join komunitas.
- Off-by-one `enabled: communityId > 0` vs `>= 0` membuat komunitas ID 0 kemungkinan tidak pernah menampilkan market/membership-nya.
- `totalBetsEstimate` di halaman event adalah angka taksiran, bukan hitungan riil staker.
- Branding "BetTogether" di metadata vs nama proyek "Predit" — sisa rename yang belum dibersihkan.
- `userId` di API comments tidak diverifikasi terhadap wallet — bisa dipalsukan (impersonation).
- Duplikasi kode `spicyTestnet` chain config persis sama di 2 file API route (harusnya di-share).
- Dua sistem toast (`shadcn Toaster` + `sonner Sonner`) aktif bersamaan — potensi notifikasi dobel.
- `package.json` masih bernama `vite_react_shadcn_ts` — jejak migrasi framework yang tidak dibersihkan.
- `refreshKey` state di `communities/[id]/page.tsx` adalah dead state (tidak dipakai untuk trigger refetch mana pun).

### frontend/src/lib + hooks -- REAL wallet/contract/Supabase/Polymarket integration code (high value)

**Ringkasan cluster**: 18 file dibaca semua (2 ABI JSON, 9 file di `lib/`, ini termasuk `index.ts` barrel, dan 7 file di `hooks/`, termasuk `index.ts` barrel). Ini adalah lapisan integrasi non-mock frontend: cara app ngobrol ke smart contract on-chain (via **viem** + **wagmi** + **RainbowKit**), ke Supabase (server-side), dan ke Polymarket (via proxy Next.js API route, bukan langsung).

**1. `lib/abis/Market.json`** — ABI kontrak `Market.sol` (per-event market). Fungsi kunci: `stake(outcome)` (payable), `claim()`, `canClaim(user)`, `getPotentialReward(user)`, `getStake(user, outcome)`, `getPoolInfo()` → `(totalA, totalB, totalDraw)`, `getMarketSummary()` → state, totalPool, stakeA/B/Draw, hasChosenOutcome, chosen, settled, winner, `triggerExecution(outcome)`, `emergencyWithdraw()`, dan **`mockPolymarketReturn(_winningOutcome, _payout)` (payable)** — ini fungsi mock buat simulasi hasil dari Polymarket masuk balik ke kontrak. Enum `Market.Outcome` tersirat 3-arah (A/B/Draw, dari `stakeA/stakeB/stakeDraw`), enum `Market.MarketState` tidak dijabarkan nilainya di ABI (cuma dirujuk sebagai uint8). Event: `Staked`, `Claimed`, `ExecutionTriggered`, `MarketSettled`, `MarketCompleted`, dan **`MockBridged`**, **`MockTrading`** — dua event terakhir ini eksplisit menandakan bridging/trading ke Polymarket **masih disimulasikan on-chain**, bukan integrasi live.

**2. `lib/abis/PredictionHub.json`** — ABI kontrak factory/registry `PredictionHub.sol`. Constructor cuma butuh `_networkConfig` (address). Fungsi utama: `createCommunity(name, description, metadataURI)` → `communityId`, `createMarket(communityId, polymarketId, metadata, stakingDeadline)` → `marketAddress` (pola factory: deploy `Market` baru dan register ke `allMarkets`/`creatorMarkets`/`communityMarkets`), `registerCreator(name, metadataURI)`, `joinCommunity`/`leaveCommunity`, `getHubStats()` → totalCreators/totalMarkets/totalCommunities/tvl, `getTotalValueLocked()`, `getMarketsByState(enum Market.MarketState)` (Hub tahu enum internal Market — coupling erat antar kontrak), `isCommunityMember`, `isCreator`, `isMarket`. Struct `Community`: `id, name, description, metadataURI, creator, createdAt, memberCount, marketCount, isActive`. Event: `CommunityCreated`, `CommunityJoined`, `CommunityLeft`, `CreatorRegistered`, `MarketCreated`, `OwnershipTransferred`. Fungsi admin `owner`/`transferOwnership` menandakan Hub pakai pola Ownable.

**3. `lib/contracts.ts`** — hardcode `CONTRACT_ADDRESSES` untuk **Spicy Testnet (chain ID 88882)**: `NetworkConfig: 0xf6fcdf4eac93bf2f18ebac546981814ddc7b8f45`, `MockPolymarket: 0xb2b8a0e5bf1e3333a797e611ec4f3b1d520ce433`, `PredictionHub: 0xab402727bbad3bb067e439c3d3fc3c48806422d8`. Ketiga address ini **lowercase, tidak di-checksum EIP-55** (secara fungsional tetap valid di viem, tapi bukan best practice). **Adanya address `MockPolymarket` terpisah mengonfirmasi temuan di `Market.json`** — integrasi Polymarket di on-chain layer adalah kontrak mock, bukan kontrak Polymarket asli.

**4. `lib/chains.ts`** — definisi custom chain **`spicyTestnet`** via viem `defineChain`: id `88882`, native currency **CHZ (Chiliz)**, RPC `https://spicy-rpc.chiliz.com`, block explorer **Chiliscan** (`https://testnet.chiliscan.com`). Jadi target deploy bukan chain EVM generik, tapi testnet **Chiliz** (chain fan-token/sports).

**5. `lib/wagmi.ts`** — setup RainbowKit `getDefaultConfig`: `appName: "BetTogether"` — **mismatch nama produk!** Proyek ini judulnya "Predit" tapi konfigurasi wagmi masih pakai nama lama "BetTogether", indikasi rename yang tidak lengkap/legacy leftover. `projectId` diambil dari env `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`, kalau env kosong **fallback ke string literal `"YOUR_PROJECT_ID"`** — placeholder yang jelas akan bikin WalletConnect gagal/berperilaku aneh kalau env belum diisi di production. `chains: [spicyTestnet]` (hanya 1 chain didukung), `ssr: true`. Juga expose `publicClient` (via `createPublicClient` + `http()` transport ke RPC Spicy) dan `getWalletClient()` (fallback manual, dengan komentar eksplisit "in most cases use wagmi hooks instead" — jadi fungsi ini cuma edge-case fallback, kemungkinan jarang dipakai/berpotensi dead code).

**6. `lib/clients.ts`** — wrapper tipis: `getReadClient()` → panggil `getPublicClient()` dari wagmi.ts, `getWriteClient()` → panggil `getWalletClient()`. Re-export `publicClient`. Tujuannya abstraksi supaya kode lain nggak import langsung dari `wagmi.ts`.

**7. `lib/index.ts`** — barrel export utama `lib/`: re-export `publicClient, getPublicClient, getWalletClient, config` (dari wagmi), `getReadClient, getWriteClient` (dari clients), `CONTRACT_ADDRESSES` (dari contracts), `spicyTestnet` (dari chains). **Catatan**: barrel ini TIDAK meng-export isi `polymarket.ts`, `api.ts`, `supabase.ts`, maupun `utils.ts` — jadi consumer harus import file-file itu langsung by path, bukan lewat `@/lib`. Inkonsistensi kecil tapi bisa bikin bingung developer baru.

**8. `lib/polymarket.ts`** — utilitas sisi client untuk Polymarket, TIDAK ada API key/endpoint Polymarket asli yang hardcode di sini. `extractSlugFromUrl(url)` — parse slug terakhir dari path URL `polymarket.com` pakai regex `^[a-zA-Z0-9-]+$`. `isValidPolymarketUrl(url)` pakai fungsi di atas untuk validasi. `fetchEventBySlug(slug)` — **fetch ke `/api/polymarket/events/${slug}`** (proxy Next.js API route sendiri, disengaja "to avoid CORS issues" — komentar eksplisit di kode), validasi response harus punya `title` dan `description`, return objek `PolymarketEvent { title, description, slug, marketId }` (marketId fallback ke `data.marketId || data.id || slug`). Endpoint Polymarket asli (Gamma API dsb) kemungkinan ada di route handler `/api/polymarket/events/[slug]` yang **di luar cluster ini** — jadi detail endpoint upstream Polymarket tidak bisa dikonfirmasi dari file-file yang dibaca.

**9. `lib/api.ts`** — `submitEventSuggestion(data: EventSuggestionData)` → POST ke **`/api/events`** (lagi-lagi proxy internal Next.js, bukan Supabase langsung). Interface `EventSuggestionData` = `{ communityId, title, description, polymarketMarketId, polymarketUrl }`; response `EventSuggestionResponse` tambah `id` dan `createdAt`. Error handling: kalau response bukan `ok`, coba parse JSON error body, fallback ke `response.statusText`.

**10. `lib/supabase.ts`** — bikin server-side Supabase admin client pakai `createClient` dari `@supabase/supabase-js`. **Env var wajib**: `NEXT_PUBLIC_SUPABASE_URL` dan `SUPABASE_SERVICE_ROLE_KEY` — kalau salah satu kosong, **langsung `throw` di module-load time** (bukan lazy), jadi kalau file ini ke-import di path yang salah (misal ke client bundle) app bisa crash total saat build/runtime. Config: `auth: { autoRefreshToken: false, persistSession: false }` (masuk akal untuk service-role/admin client, bukan client session). **Catatan penting**: **tidak ada satupun query/table Supabase yang ditulis di file ini** — cuma instansiasi client. Jadi shape tabel/query Supabase (`from('...').select(...)` dsb) **tidak ada di cluster "Frontend-Legacy-Integration"** ini; kemungkinan besar ada di route handler `app/api/events/route.ts` atau sejenis yang **tidak termasuk** dalam daftar file yang diminta. Juga **tidak ada guard `import "server-only"`** di file ini — kalau ada komponen client yang salah import `lib/supabase.ts`, ada risiko `SUPABASE_SERVICE_ROLE_KEY` (secret) ke-bundle ke client-side. Ini layak dicatat sebagai potensi security concern meski tidak terbukti dieksploitasi dari cluster ini saja.

**11. `lib/utils.ts`** — cuma satu helper `cn(...inputs: ClassValue[])` = `twMerge(clsx(inputs))`, utility standar shadcn/tailwind buat gabung className kondisional.

**12. `hooks/index.ts`** — barrel export hooks: `useReadClient`, `useWriteClient`, `useCanWrite`, `useContractRead`, `useContractReads`, `useContractWrite`.

**13. `hooks/useReadClient.ts`** — wrapper `usePublicClient()` dari wagmi, fallback ke `publicClient` default (dari `lib/wagmi.ts`) kalau wagmi belum kasih instance (misal saat SSR/belum connect).

**14. `hooks/useWriteClient.ts`** — `useWriteClient()`: return `walletClient` (dari `useWalletClient()`) hanya kalau `isConnected` true, else `null`. `useCanWrite()`: return boolean `isConnected && !!walletClient` — dipakai `useContractWrite` buat gate tombol submit tx.

**15. `hooks/useContractRead.ts`** — generic wrapper di atas wagmi `useReadContract`/`useReadContracts`, terima `{address, abi, functionName, args, query}`. **Banyak pakai `as any`** buat bypass strict typing generic wagmi — trade-off type-safety demi kemudahan pemakaian generic. Ada komentar contoh pemakaian dengan `CONTRACT_ADDRESSES.PredictionHub` + `PredictionHubABI` (menghubungkan langsung ke file #3 dan #2).

**16. `hooks/useContractWrite.ts`** — generic wrapper di atas wagmi `useWriteContract` + `useWaitForTransactionReceipt`. Pakai `useCanWrite()` (dari #14) buat expose `write` function **hanya kalau wallet connect** (else `undefined` — pola disable tombol tanpa cek eksplisit di UI). `onError` cuma `console.error("Contract write error:", error)` — **tidak ada integrasi ke `use-toast.ts`** meski sistem toast sudah ada di codebase (lihat file #18) — jadi error tx kemungkinan tidak muncul sebagai notifikasi user-facing dari hook ini sendiri (mungkin di-handle di level komponen pemanggil, tapi tidak terlihat di cluster ini — worth flagging). Return object lengkap: `write, hash, receipt, isPending, isConfirming, isConfirmed, isLoading (=isPending||isConfirming), error, reset, canWrite`.

**17. `hooks/use-mobile.tsx`** — `useIsMobile()`, `MOBILE_BREAKPOINT = 768`, pakai `window.matchMedia` + listener `change` event, return boolean (default `undefined` sebelum mount, di-cast jadi `!!isMobile`).

**18. `hooks/use-toast.ts`** — implementasi toast ala shadcn (state management manual di luar React, pakai module-level `listeners[]` dan `memoryState`). **`TOAST_LIMIT = 1`** (cuma 1 toast tampil sekaligus, replace bukan queue) dan **`TOAST_REMOVE_DELAY = 1000000` ms (~16.7 menit)** — ini adalah **quirk terkenal dari boilerplate shadcn** (delay penghapusan toast dari DOM setelah dismiss kelamaan secara tidak wajar), kemungkinan besar copy-paste dari template tanpa disesuaikan; kalau tidak disengaja ini bug UX (toast "hilang" secara visual tapi node-nya nyangkut di memory 16+ menit).

**Hubungan antar file dalam cluster**: `chains.ts` (spicyTestnet) dipakai oleh `wagmi.ts` dan `clients.ts` (fallback wallet client) → `wagmi.ts` expose `config`, `publicClient` yang di-barrel ulang oleh `lib/index.ts` dan dipakai `clients.ts`. `contracts.ts` (alamat) dipasangkan dengan `abis/Market.json` dan `abis/PredictionHub.json` di level komponen lewat `hooks/useContractRead.ts` dan `hooks/useContractWrite.ts`, yang masing-masing bergantung pada `useReadClient.ts`/`useWriteClient.ts` untuk cek koneksi wallet. `polymarket.ts` dan `api.ts` sama-sama pakai pola "fetch ke Next.js API route sendiri" (bukan fetch API pihak ketiga langsung dari browser) untuk menghindari CORS dan supaya secret (kalau ada) tetap di server — konsisten dengan pola `supabase.ts` yang juga server-side only. `use-toast.ts` berdiri sendiri, tidak terhubung ke hook contract-write meski secara logis harusnya dipakai untuk notifikasi hasil transaksi.

**Temuan mencurigakan/tidak lengkap (ringkas)**:
- Kontrak `Market` punya fungsi/`event` eksplisit "mock" (`mockPolymarketReturn`, `MockBridged`, `MockTrading`) + address `MockPolymarket` di `contracts.ts` → integrasi Polymarket on-chain **belum real**, masih simulasi untuk keperluan hackathon/demo.
- `wagmi.ts`: `appName: "BetTogether"` — nama produk lama, tidak konsisten dengan nama proyek "Predit".
- `wagmi.ts`: `projectId` WalletConnect fallback ke literal `"YOUR_PROJECT_ID"` kalau env kosong — placeholder belum diganti, berisiko wallet-connect gagal di deployment yang env-nya belum diset.
- `supabase.ts` throw error di module scope kalau env kosong, dan tidak ada `import "server-only"` guard — risiko service-role key ke-bundle ke client kalau file ini salah di-import.
- Tidak ditemukan shape tabel/query Supabase apapun (`.from().select()` dsb) di seluruh cluster ini — API route Next.js yang menyimpan logic query (kemungkinan `app/api/events/route.ts`) **di luar scope file yang diberikan**, jadi detail skema tabel Supabase belum bisa dikonfirmasi dari cluster ini.
- Tidak ada endpoint Polymarket API asli (Gamma API dsb) yang hardcode di cluster ini — semua fetch Polymarket lewat proxy internal `/api/polymarket/events/[slug]`, endpoint upstream-nya ada di luar cluster.
- Contract addresses di `contracts.ts` semua lowercase (tidak checksummed EIP-55) — minor, fungsional tapi tidak best-practice.
- `use-toast.ts`: `TOAST_REMOVE_DELAY = 1000000` ms — kemungkinan bug/leftover boilerplate shadcn yang belum disesuaikan.
- `useContractWrite.ts` hanya `console.error` untuk error tx, tanpa toast — potensi UX gap untuk gagal transaksi on-chain (stake/claim/createMarket dll) kalau tidak di-handle ulang di level komponen.
- `wagmi.ts` fungsi `getWalletClient()` punya komentar sendiri bahwa ini "fallback edge case" dan sebaiknya pakai wagmi hooks — indikasi kode ini mungkin nyaris tidak terpakai (potential dead code / legacy path), konsisten dengan nama cluster "Frontend-Legacy-Integration".

### frontend/src/components/ (project-specific, non-ui)

Cluster ini berisi 16 komponen React (Next.js App Router, semua pakai `"use client"` kecuali beberapa yang murni presentational) + 1 subfolder `layout/` + 2 file CSS. Total 18 file dibaca penuh.

**BetCard.tsx** — Kartu riwayat bet milik user, link ke `/events/${eventId}`. Terima props `id, eventId, eventTitle, communityName, side ("yes"|"no"), amount, status ("pending"|"executed"|"won"|"lost"|"completed"), odds, executionTime?, payout?, isCompleted?`. Fungsi `getStatusBadge(status)` map status ke `Badge` shadcn dengan warna semantic (`bg-warning/20`, `bg-success/20`, dst). Variabel `betIsCompleted` fallback-computed dari status kalau prop `isCompleted` tidak diberikan. Kalau belum selesai, render `<CountdownTimer targetTime={executionTime} size="sm" />` (dependency ke CountdownTimer di cluster yang sama). Odds ditampilkan `(odds*100).toFixed(0)%`, payout `.toFixed(2)`.

**BettingInterface.tsx** — Komponen inti untuk taruhan on-chain, paling kompleks di cluster. Pakai `useAccount`, `useWaitForTransactionReceipt` dari **wagmi**, plus custom hooks `useContractRead`/`useContractWrite` dari `@/hooks`, ABI `MarketABI` dari `@/lib/abis/Market.json`. Prop `eventId` sebenarnya adalah **address kontrak Market individual** (bukan ID biasa) — artinya arsitektur pakai pola factory: `PredictionHub` men-deploy kontrak `Market` terpisah per event.
- Baca `getPoolInfo` dari kontrak Market (`refetchInterval: 5000`ms) → destructure `[totalA, totalB, totalDraw]`, hitung `yesOdds = totalA/totalPool`, `noOdds = totalB/totalPool` dimana `totalPool = totalA+totalB+totalDraw`. **Catatan mencurigakan**: `totalDraw` ikut dijumlah ke `totalPool` (pembagi) tapi tidak dapat odds/UI-nya sendiri — kalau ada stake di outcome "Draw", persentase YES+NO yang ditampilkan tidak akan pernah menjumlah 100%, padahal enum Outcome kontrak (komentar kode: "A=0 (Yes), B=1 (No)") mengindikasikan kemungkinan ada outcome ketiga (Draw) yang di-support kontrak tapi tidak diekspos di UI betting ini.
- Fungsi write `stake(outcome)` dengan `value: amountWei` (native token, `parseEther`), `outcome` di-map `side==="yes"?0:1`.
- Validasi `isBettingAllowed()`: cek `isConnected`, `marketState !== 0` (0=Open, 1=Locked, ...), `stakingDeadline` (unix seconds) sudah lewat, dan `isExecutionWindow`.
- Minimum bet **0.01 CHZ** (hardcoded di placeholder & helper text) — konfirmasi native token chain adalah **CHZ (Chiliz)**.
- Error-message mapping dari revert string kontrak ke toast ramah user: `"community member"`, `"staking period ended"`, `"must stake non-zero"` — ini mengindikasikan `require()` messages asli di `Market.sol` (berguna untuk cross-check ke cluster kontrak Solidity).
- Pakai **sonner** `toast` dengan id tetap `"place-bet"` untuk dedupe, dan flag state `hasShownSuccess`/`hasShownError` supaya `useEffect` tidak double-toast.

**ChatContainer.tsx** — Fitur diskusi per event. Props `eventId, communityId, currentUserId` dengan default **hardcoded `"0x1234567890abcdef"`** — ini **mencurigakan**: kalau parent tidak mengoper wallet address asli, pesan akan dikirim/dilabeli seolah dari address palsu ini. Fetch pesan via `GET /api/comments?eventId=...&communityId=...`, polling tiap **5000ms** lewat `setInterval`. Kirim pesan via `POST /api/comments` body `{eventId, communityId, userId, content}`. Konstanta `MAX_MESSAGE_LENGTH = 500`, `isNearLimit` aktif saat sisa <50 char. Render list pakai `MessageBubble` (dependency intra-cluster). **Inkonsistensi**: komponen ini pakai `useToast` dari `@/hooks/use-toast`, sedangkan hampir semua komponen lain di cluster (BettingInterface, CreateCommunityForm, dst) pakai `toast` dari **sonner** — dua sistem toast berbeda dipakai campur dalam satu app.

**CheckCreatorButton.tsx** — Tombol cek status creator on-chain. Pakai `useAccount`, `usePublicClient` (wagmi), baca `CONTRACT_ADDRESSES.PredictionHub` + `PredictionHubABI` dari `@/lib` & `@/lib/abis/PredictionHub.json`, chain `spicyTestnet` juga dari `@/lib`. Panggil `publicClient.readContract({functionName: "isCreator", args: [address]})`. **Type-safety longgar**: parameter call di-cast paksa `as any`.

**CommunityCard.tsx** — Kartu list komunitas murni presentational, link ke `/communities/${id}`, tampilkan `name, description (line-clamp-2), memberCount, activeEvents`, tombol "View Community". Tidak ada logic on-chain.

**CommunityRankingCard.tsx** — Kartu leaderboard komunitas. Props `rank, id, name, description, totalProfit, successfulBets, memberCount`. `getMedalIcon(rank)` → emoji 🥇🥈🥉 untuk top-3, styling border/bg khusus per rank. `truncateDescription(text, maxLength=100)`. Navigasi pakai `useRouter().push()` di `onClick` card (bukan `<Link>` seperti CommunityCard) — inkonsistensi pola navigasi antar dua komponen yang mirip fungsinya.

**CountdownTimer.tsx** — Timer reusable, dipakai BetCard & EventCard. Props `targetTime, variant ("default"|"urgent"|"warning"), size ("sm"|"md"|"lg")`. Update tiap **1000ms** via `setInterval`, hitung `hours/minutes/seconds` dari selisih. Auto-set `urgency` state: `<1 jam → "urgent"`, `<3 jam → "warning"`, sisanya `"safe"`. **Bug nyata** di `getColorClasses()`: kalau `variant` di-pass selain `"default"`, fungsi langsung `return variant;` — yaitu mengembalikan string literal `"urgent"`/`"warning"` sebagai className, padahal seharusnya berupa gabungan class Tailwind seperti pada branch auto-urgency (`"text-danger border-danger/30 bg-danger/10"`). Class `"urgent"` / `"warning"` sendiri **bukan** utility Tailwind yang valid → tidak menghasilkan styling apapun. Saat ini tidak ke-trigger karena BetCard & EventCard memanggilnya tanpa prop `variant`, tapi ini latent bug kalau ada pemanggil lain yang set variant eksplisit.

**CreateCommunityForm.tsx** — Form buat komunitas baru on-chain. Konstanta `MAX_NAME_LENGTH=50`, `MAX_DESCRIPTION_LENGTH=200`. Alur: cek `isCreator` (read PredictionHub) → kalau belum, panggil `registerCreator(["Creator", ""])` (**nama creator hardcoded literal `"Creator"`**, metadata URI kosong) → setelah confirm, auto-panggil `createCommunity([name, description, ""])` (**argumen ketiga string kosong**, tidak jelas kegunaannya — kemungkinan placeholder untuk image/metadata yang belum diimplementasi, terkesan TODO). **Code smell serius**: orkestrasi dua transaksi berurutan dilakukan lewat blok `if` telanjang di body komponen (bukan `useEffect`) yang memanggil `setState`/`registerCreator?.()` langsung saat render, plus `setTimeout(..., 100)` untuk "menunggu" sebelum trigger `createCommunity` kedua — pola rentan race condition/double-submit dan berpotensi re-render berulang meski dijaga flag `hasShownSuccess/hasShownError`.

**EventCard.tsx** — Kartu ringkasan market/event untuk listing. Props `id, title, description?, marketCloseTime, odds{yes,no}, status ("open"|"closing-soon"|"closed"), polymarketUrl`. Link ke `/events/${id}`, render dua box odds YES/NO, `CountdownTimer size="sm"`, dan link eksternal ke Polymarket (`target="_blank"`, `rel="noopener noreferrer"`, `e.stopPropagation()` supaya tidak trigger navigasi Link pembungkus). Mengonfirmasi keterikatan produk ke Polymarket sebagai sumber data event.

**EventSuggestionForm.tsx** — Form usul/buat market baru dari URL Polymarket, memanggil `createMarket` di `PredictionHub`. Konstanta: `MAX_TITLE_LENGTH=100`, `MAX_DESCRIPTION_LENGTH=500`, `DEFAULT_STAKING_DAYS=7`, `MIN_STAKING_DAYS=1`, `MAX_STAKING_DAYS=90`. Import helper `extractSlugFromUrl`, `isValidPolymarketUrl`, `fetchEventBySlug` dari `@/lib/polymarket` (modul di luar cluster ini, berarti ada lib integrasi Polymarket API terpisah). `useEffect` auto-fetch data event Polymarket saat URL valid dipaste, di-debounce **500ms**. Saat submit: hitung `stakingDeadline = now_seconds + days*86400` (BigInt), bikin `metadata = JSON.stringify({title, polymarketUrl})`. **Bug/inkonsistensi jelas**: field `description` divalidasi wajib diisi di form tapi **tidak pernah dikirim ke on-chain metadata** — hilang begitu saja, hanya `title` dan `polymarketUrl` yang disimpan. Panggil `createMarket([communityIdNum, polymarketMarketId||slug||"", metadata, stakingDeadline])`.

**MessageBubble.tsx** — Bubble chat presentational, dipakai `ChatContainer`. `truncateAddress` → format `0x1234...abcd`. `getAvatarFromAddress` ambil `address.slice(2,4).toUpperCase()` sebagai inisial avatar (asumsi `userId` selalu wallet address 0x-prefixed). Timestamp pakai `date-fns` `formatDistanceToNow` dengan fallback try/catch ke `toLocaleTimeString()`.

**NavLink.tsx** — Wrapper generik di atas `next/link` dengan active-state class via `usePathname() === href` (exact match saja, **tidak** mendukung nested route highlighting, mis. `/communities/123` tidak akan meng-highlight NavLink `/communities`). Pakai `forwardRef`, props arbitrary via `[key:string]: any`. **Temuan**: komponen ini tampaknya **tidak dipakai** di dalam cluster — `Header.tsx` justru pakai `next/link` biasa untuk nav items, bukan `NavLink` — indikasi dead code atau sisa refactor yang belum dibersihkan (selaras dengan nama cluster "Legacy-Components").

**RegisterCreatorButton.tsx** — Tombol registrasi creator alternatif, tapi diimplementasi **berbeda total** dari alur di `CreateCommunityForm`: alih-alih pakai `useContractWrite` bersama, komponen ini bikin sendiri `createWalletClient({transport: custom(window.ethereum)})` dari viem lalu panggil `walletClient.writeContract(...)` manual dengan **objek chain di-hardcode inline**: `{id: 88882, name: "Spicy Testnet", nativeCurrency: {name:"Chiliz", symbol:"CHZ", decimals:18}, rpcUrls:{default:{http:["https://spicy-rpc.chiliz.com"]}}}`. **Bug/duplikasi mencurigakan**: `spicyTestnet` sudah diimpor dari `@/lib` tapi hanya dipakai di `console.error` debug log — bukan di call `writeContract` yang sebenarnya, sehingga ada **dua definisi chain terpisah yang bisa drift**. Argumen `registerCreator` di sini juga **hardcoded** `["Creator", "ipfs://my-metadata-uri"]` — placeholder IPFS URI yang jelas belum diganti dengan value dinamis (beda dari `CreateCommunityForm` yang pakai `["Creator", ""]`). Jadi ada **dua jalur UI berbeda untuk aksi yang sama** (register creator) dengan argumen berbeda-beda — redundan dan inkonsisten.

**SafeConnectButton.tsx** — Wrapper `ConnectButton` dari `@rainbow-me/rainbowkit` untuk hindari hydration mismatch SSR. Pakai `requestAnimationFrame` di `useEffect` untuk set `mounted`, render skeleton pulse (`h-10 w-[140px]`) sebelum mount. Dipakai di `Header.tsx`.

**UserRankingCard.tsx** — Kartu leaderboard individual user, identitas berbasis wallet address (tidak ada sistem username). Props `rank, address, totalProfit, winRate, totalBets`. `getWinRateColor`: `>=70 → success`, `>=50 → warning`, else `muted`. **Duplikasi kode**: fungsi `truncateAddress` dan `getAvatarFromAddress` di sini identik persis dengan yang ada di `MessageBubble.tsx`, dan pola `getMedalIcon`/top-3 styling identik dengan `CommunityRankingCard.tsx` — logic yang sama di-copy-paste di 3 file alih-alih diekstrak ke shared utility (`@/lib/utils` atau semacamnya). Pelanggaran DRY yang jelas.

**layout/Header.tsx** — Header situs sticky (`backdrop-blur`). **Temuan penting**: brand name yang ditampilkan hardcoded **"BetTogether"**, padahal proyek ini bernama **Predit** — indikasi sisa branding lama/legacy yang belum diupdate (konsisten dengan nama cluster "Frontend-Legacy-Components"). Nav item: `/communities`, `/rankings`, `/dashboard` (pakai `next/link` polos, bukan `NavLink` yang tersedia di cluster ini — mengonfirmasi `NavLink` unused). Render `SafeConnectButton` di kanan.

**App.css** — File CSS sisa boilerplate default **Vite/Create-React-App template** (`#root { max-width:1280px }`, `.logo`, `.logo:hover`, `@keyframes logo-spin`, `.card`, `.read-the-docs { color:#888 }`). Tidak ada satupun class ini dipakai di komponen manapun yang dibaca (tidak ada `.logo`/`.read-the-docs` di JSX manapun) — file mati/dead code, kemungkinan besar warisan dari starter template sebelum migrasi ke Next.js dan tidak pernah dihapus.

**index.css** — File design-system Tailwind yang **benar-benar dipakai** (kontras dengan App.css). `@tailwind base/components/utilities`, lalu custom properties di `:root` dalam `@layer base`: `--background: 225 25% 8%` (dark), `--primary: 200 100% 50%`, `--primary-glow: 195 100% 60%`, `--success: 145 80% 45%`, `--danger: 348 85% 55%`, `--warning: 35 100% 60%`, `--destructive` (mirror ke danger), `--border/--input/--ring`, `--radius: 0.75rem`. Juga define gradient vars (`--gradient-primary/success/danger/card`), shadow vars (`--shadow-glow`, `--shadow-card`), `--transition-smooth`. Utility class custom di `@layer utilities`: `.gradient-primary`, `.gradient-success`, `.gradient-danger`, `.gradient-card`, `.shadow-glow`, `.shadow-card`, `.transition-smooth` — dipakai luas di hampir semua komponen (BettingInterface tombol YES/NO, RegisterCreatorButton, CreateCommunityForm, Header logo box, dst). **Catatan**: tidak ada definisi `:root[data-theme="light"]` atau media query light-mode — theme yang didefinisikan hanya satu (dark-fixed), padahal komentar di file bilang "Definisi design system... All colors MUST be HSL" seolah menyiratkan sistem theming lebih lengkap.

---

**Hubungan antar file dalam cluster:**
- `BetCard` & `EventCard` → sama-sama consume `CountdownTimer`.
- `ChatContainer` → consume `MessageBubble`.
- `Header` → consume `SafeConnectButton`; **tidak** consume `NavLink` meski tersedia (dead code).
- `CreateCommunityForm`, `CheckCreatorButton`, `RegisterCreatorButton`, `EventSuggestionForm` → semua bicara ke kontrak `PredictionHub` yang sama (`CONTRACT_ADDRESSES.PredictionHub` + `PredictionHubABI`), tapi `CreateCommunityForm` dan `RegisterCreatorButton` mengimplementasikan aksi "register creator" secara **independen dan inkonsisten** (hook shared vs manual viem client, argumen metadata berbeda).
- `BettingInterface` → satu-satunya yang bicara ke kontrak `Market` individual (`MarketABI`, address = `eventId`), bukan ke `PredictionHub` — menegaskan arsitektur factory-pattern (Hub men-deploy Market per event).
- `UserRankingCard`, `CommunityRankingCard`, `MessageBubble` → berbagi logic duplikat (truncate address, avatar dari address, medal icon) tanpa shared helper.
- `index.css` adalah design-system aktif yang dipakai lintas hampir semua komponen; `App.css` adalah file mati/legacy yang tidak terhubung ke komponen manapun di cluster ini.
- Chain **Chiliz Spicy Testnet** (chain id **88882**, RPC `https://spicy-rpc.chiliz.com`, native token **CHZ**) muncul berulang di `CheckCreatorButton`, `RegisterCreatorButton` (2 sumber berbeda: import `spicyTestnet` vs hardcoded inline object) — konsisten dipakai sebagai target chain, tapi didefinisikan lebih dari sekali dengan risiko drift.

### frontend/src/components/ui/ (shadcn primitives, legacy copy)

Cluster ini adalah **copy generik komponen shadcn/ui** (bukan kode terkait domain Predit sama sekali — tidak ada logic prediction market/Polymarket/Chainlink di sini). Semua 49 file dibaca lengkap. Konfirmasi: **seluruhnya stock shadcn/ui CLI output** (`npx shadcn-ui add ...`), dibangun di atas **Radix UI primitives** + `class-variance-authority` (cva) untuk variant styling + helper `cn()` dari `@/lib/utils` (classnames + tailwind-merge) + `lucide-react` untuk ikon. Tidak ada perubahan bisnis-logic kustom di cluster ini — hanya beberapa detail teknis dan **dua typo kode yang ikut ke-copy dari upstream template** (dicatat di bawah, bukan modifikasi Predit sendiri).

**Form/input primitives** — `input.tsx` (`Input`, native `<input>` wrapper, height `h-10`), `textarea.tsx` (`Textarea`), `label.tsx` (`Label`, pakai `@radix-ui/react-label` + `labelVariants` cva kosong-variant), `checkbox.tsx` (`Checkbox` via `@radix-ui/react-checkbox`, indikator `Check` icon), `radio-group.tsx` (`RadioGroup`/`RadioGroupItem` via `@radix-ui/react-radio-group`), `switch.tsx` (`Switch` via `@radix-ui/react-switch`), `slider.tsx` (`Slider` via `@radix-ui/react-slider`), `select.tsx` (`Select`, `SelectTrigger`, `SelectContent`, dst — via `@radix-ui/react-select`, punya `position="popper"` default), `input-otp.tsx` (`InputOTP`/`InputOTPSlot`/`InputOTPSeparator`, dependency `input-otp` lib, pakai context `OTPInputContext` untuk baca `char`/`hasFakeCaret`/`isActive` per slot), `form.tsx` (wrapper `react-hook-form`: `FormField` pakai `Controller`, context `FormFieldContext`/`FormItemContext`, hook `useFormField()` yang generate id `${id}-form-item`, `${id}-form-item-description`, `${id}-form-item-message`; **`useFormField` throw error "useFormField should be used within <FormField>"** kalau dipanggil di luar context — tapi cek `if (!fieldContext)` dieksekusi setelah `useContext` sudah dipakai untuk destructure `formState`, jadi errornya agak telat tapi tetap valid).

**Overlay/menu primitives** — `dialog.tsx` (`Dialog` via `@radix-ui/react-dialog`, ada tombol close bawaan dengan icon `X`), `alert-dialog.tsx` (mirip dialog tapi pakai `@radix-ui/react-alert-dialog`, `AlertDialogAction`/`AlertDialogCancel` reuse `buttonVariants` dari `button.tsx`), `sheet.tsx` (side-drawer via `@radix-ui/react-dialog` juga tapi diberi nama alias `SheetPrimitive`, `sheetVariants` cva dengan 4 sisi top/bottom/left/right, default `side: "right"`, width `w-3/4 sm:max-w-sm`), `drawer.tsx` (mobile drawer via lib **`vaul`**, default `shouldScaleBackground = true`), `popover.tsx`, `hover-card.tsx`, `tooltip.tsx` (semua Radix standar, `sideOffset` default 4), `dropdown-menu.tsx`, `context-menu.tsx`, `menubar.tsx` (tiga-tiganya struktur identik: Sub/SubTrigger/SubContent/Item/CheckboxItem/RadioItem/Label/Separator/Shortcut, semua pakai icon `Check`/`ChevronRight`/`Circle` dari lucide), `command.tsx` (command palette via lib **`cmdk`**, `CommandDialog` membungkus `Dialog`+`DialogContent`, `CommandInput` render icon `Search`).

**Navigation** — `navigation-menu.tsx` (`NavigationMenuViewport` auto di-render di dalam `NavigationMenu` root; `navigationMenuTriggerStyle` diexport sbg cva reusable), `breadcrumb.tsx` (`Breadcrumb`, `BreadcrumbList`, dst — default separator `ChevronRight` kalau `children` kosong), `pagination.tsx` (reuse `buttonVariants` dari button.tsx untuk styling link), `tabs.tsx` (via `@radix-ui/react-tabs`).

**Layout/struktural** — `card.tsx`, `separator.tsx`, `aspect-ratio.tsx` (cuma re-export `AspectRatioPrimitive.Root`, 5 baris), `collapsible.tsx` (cuma re-export 3 primitive Radix, tanpa styling tambahan sama sekali), `accordion.tsx` (animasi custom via className `data-[state=open]:animate-accordion-down` / `animate-accordion-up`, bergantung pada keyframe yang didefinisikan di tailwind config — file config-nya di luar cluster ini jadi tidak diverifikasi ada/tidak), `resizable.tsx` (via lib **`react-resizable-panels`**, `ResizableHandle` punya prop `withHandle` opsional yang render grip icon), `scroll-area.tsx` (via `@radix-ui/react-scroll-area`), `sidebar.tsx` — **file terbesar di cluster (638 baris)**, ini shadcn "sidebar block" penuh, bukan primitive sederhana. Detail teknis konkret: konstanta `SIDEBAR_COOKIE_NAME = "sidebar:state"`, `SIDEBAR_COOKIE_MAX_AGE = 60*60*24*7` (7 hari), `SIDEBAR_WIDTH = "16rem"`, `SIDEBAR_WIDTH_MOBILE = "18rem"`, `SIDEBAR_WIDTH_ICON = "3rem"`, `SIDEBAR_KEYBOARD_SHORTCUT = "b"` (toggle sidebar via Cmd/Ctrl+B). State disimpan lewat context `SidebarContext` + hook `useSidebar()`, persist ke `document.cookie` langsung di client (`document.cookie = "sidebar:state=..."`) **tanpa atribut `Secure`/`SameSite`/`HttpOnly`** — bukan celah kritis (cuma UI-state, bukan data sensitif), tapi tetap dicatat sebagai hardcoded/less-hardened cookie write. Bergantung ke `useIsMobile` dari `@/hooks/use-mobile` (di luar cluster ini) dan reuse `Button`, `Input`, `Separator`, `Sheet`/`SheetContent`, `Skeleton`, `Tooltip` — jadi file ini punya banyak coupling internal ke primitive lain dalam cluster yang sama.

**Data display** — `table.tsx` (native `<table>` wrapper, `Table` root membungkus dengan `div.overflow-auto`), `badge.tsx` (`badgeVariants` cva: `default`/`secondary`/`destructive`/`outline`), `avatar.tsx` (via `@radix-ui/react-avatar`), `skeleton.tsx` (cuma `animate-pulse rounded-md bg-muted`, dipakai juga oleh `sidebar.tsx` utk `SidebarMenuSkeleton` dengan **lebar random**: `Math.floor(Math.random() * 40) + 50` persen — nilai acak non-deterministic tiap render, bukan bug tapi catatan teknis), `carousel.tsx` (via lib **`embla-carousel-react`**, context `CarouselContext`/hook `useCarousel()` yang **throw Error "useCarousel must be used within a <Carousel />"** kalau dipanggil di luar provider; support keyboard arrow-left/right), `chart.tsx` (wrapper **`recharts`**, `THEMES = { light: "", dark: ".dark" }`, komponen `ChartStyle` generate `<style>` tag via `dangerouslySetInnerHTML` untuk inject CSS var `--color-{key}` per tema — sumber warna berasal dari `ChartConfig` yang didefinisikan developer, jadi risiko injeksi rendah selama config tidak diisi dari input user; helper `getPayloadConfigFromPayload()` untuk resolve label/icon dari `payload` recharts).

**Feedback/toast** — `alert.tsx` (`alertVariants` cva: `default`/`destructive`), `progress.tsx` (Radix progress, indicator width dihitung via inline `style={{transform: translateX(-${100-(value||0)}%)}}`, fallback value `0` kalau `value` undefined), `toast.tsx` (via `@radix-ui/react-toast`, `toastVariants` cva `default`/`destructive`, viewport pakai `z-[100]`), `toaster.tsx` (consumer: import `useToast` dari `@/hooks/use-toast`, iterate array `toasts` dan render `Toast`/`ToastTitle`/`ToastDescription`/`ToastClose`), `sonner.tsx` (alternatif toast lain via lib **`sonner`**, ambil tema dari `next-themes` `useTheme()`, custom classNames per bagian toast — **catatan: proyek ini punya DUA sistem toast berjalan paralel** — Radix-based (`toast.tsx`+`toaster.tsx`) dan Sonner-based (`sonner.tsx`) — berpotensi redundant/tidak sinkron kalau keduanya dipakai bersamaan di app, khas gejala "legacy copy" yang disebut di nama cluster ini), `use-toast.ts` (di `components/ui/`) — **ini bukan implementasi hook asli**, isinya cuma 3 baris re-export: `export { useToast, toast } from "@/hooks/use-toast"`. Artinya implementasi state-management toast yang sebenarnya (reducer, dispatch, limit toast, dsb) **hidup di file lain di luar cluster ini** (`@/hooks/use-toast.ts`), dan file di cluster ini murni shim kompatibilitas lama — konsisten dengan nama cluster "Frontend-Legacy-Primitives", kemungkinan sisa struktur folder shadcn versi lama yang belum dibersihkan.

**Toggle** — `toggle.tsx` (`toggleVariants` cva: variant `default`/`outline`, size `default`/`sm`/`lg`), `toggle-group.tsx` (context `ToggleGroupContext` meneruskan `variant`/`size` dari root ke tiap `ToggleGroupItem`, reuse `toggleVariants` dari `toggle.tsx`).

**Bug/typo eksplisit yang ditemukan** (kemungkinan besar typo bawaan upstream shadcn/ui, ikut ter-copy, bukan buatan tim Predit — tapi tetap tercatat karena user minta eksplisit):
1. `breadcrumb.tsx` baris 80 — `BreadcrumbEllipsis.displayName = "BreadcrumbElipssis"` (salah eja, seharusnya "BreadcrumbEllipsis"). Tidak mempengaruhi fungsi runtime, hanya nama di React DevTools jadi salah.
2. `menubar.tsx` baris 188 — `MenubarShortcut.displayname = "MenubarShortcut"` — properti ditulis huruf kecil `displayname` bukan `displayName`, jadi assignment ini **no-op** (React DevTools tetap menampilkan nama default component, bukan bug fungsional tapi menunjukkan file ini benar-benar hasil copy-paste tanpa review).

Tidak ditemukan hardcoded secret, endpoint, atau on-chain event apa pun di cluster ini — seluruhnya murni UI presentation layer tanpa koneksi ke smart contract/Chainlink CRE/Polymarket. Satu-satunya "hardcoded value" yang relevan secara fungsional adalah konstanta `sidebar.tsx` (SIDEBAR_WIDTH dll.) dan `THEMES`/warna di `chart.tsx`, keduanya bersifat kosmetik.

### contracts/ABI JSON artifacts + broadcast deployment records

**File yang dibaca (9 total):**

**1. `contracts.json`** — manifest/index generated. Berisi peta 4 kontrak (`NetworkConfig`, `MockPolymarket`, `Market`, `PredictionHub`) dengan path relatif ke ABI-nya + deskripsi 1-baris ("Factory contract for creators and markets" utk PredictionHub, dst), plus daftar 3 network yang didukung: **anvil** (`chainId 31337`, local), **chiliz_testnet** (`chainId 88882`, rpc `https://spicy-rpc.chiliz.com`), **chiliz_mainnet** (`chainId 88888`, rpc `https://rpc.chiliz.com`). Ada metadata `version: "1.0.0"`, `extractedAt`, `totalContracts: 4`, `successfulExtractions: 4` — menandakan file ini output dari script ekstraksi ABI otomatis (kemungkinan dari `forge build`/`out/` Foundry), bukan hand-written.

**2. `Market.json`** — ABI kontrak per-market individual. Constructor: `(_creator address, _polymarketId string, _metadata string, _stakingDeadline uint256, _minStake uint256)`, plus `receive() payable`. Fungsi kunci: `stake(outcome uint8)` payable, `triggerExecution(outcome uint8)` (hanya creator, transfer `totalPool` ke `creator`), `mockPolymarketReturn(_winningOutcome uint8, _payout uint256)` payable (creator/hub mengirim balik dana + menetapkan outcome pemenang), `claim()`, `emergencyWithdraw()`, plus banyak view getter (`getMarketSummary`, `getPoolInfo`, `getStake`, `getPotentialReward`, `canClaim`, `hasClaimed`, `isSettled`, `getTotalPool`, dll). State disimpan lewat `enum Market.Outcome` (3 nilai — cocok dgn field `stakeA/stakeB/stakeDraw` di `getMarketSummary`) dan `enum Market.MarketState` (ABI Solidity tidak expose nama varian, tapi dari pola guard di bytecode terlihat range nilai 0–5, jadi ~6 state). Event: `Staked`, `Claimed`, `ExecutionTriggered`, `ExecutionTransferred`, `MarketSettled`, `MarketCompleted` (tanpa field sama sekali — event kosong, terlihat vestigial/tidak dipakai penuh), serta **`MockBridged`** dan **`MockTrading`** — dua event ber-prefix "Mock" yang ikut ter-deploy di kontrak "production" Market, bukan hanya di kontrak test.

**3. `Market.bytecode.json`** — bytecode + deployedBytecode hex (di-skip isinya sesuai instruksi, tidak ditranskrip). Dari constructor-nya terlihat guard: `creator != address(0)`, `deadline > block.timestamp`, `minStake > 0` (revert message `"Market: invalid creator/deadline/min stake"`).

**4. `MockPolymarket.json`** — ABI oracle mock untuk testing resolusi market. Constructor tanpa parameter, set `owner = msg.sender`. Fungsi: `quickResolve(marketAddress, creatorWon bool, creatorChoice uint8)` (owner-only, revert `"MockPolymarket: caller is not owner"`), `calculatePayout(marketAddress, winningOutcome uint8) view returns payout`, `getResolution(marketAddress)`/`isResolved(marketAddress)`/public mapping `resolutions(address) → (resolved, winningOutcome, timestamp)`, `transferOwnership(newOwner)`. Event: `MarketResolved(marketAddress indexed, winningOutcome, payout)`, `OwnershipTransferred`.

**5. `MockPolymarket.bytecode.json`** — bytecode blob saja (di-skip), cuma dicatat exists.

**6. `NetworkConfig.json`** — kontrak konfigurasi multi-chain. Struct `ChainConfig { wrappedNative address, minStake uint256, maxStakingDuration uint256 }`. Fungsi: `getActiveConfig()`, `getConfigByChainId(chainId)`, `getAnvilConfig()`/`getChilizTestnetConfig()`/`getChilizMainnetConfig()` (semua `pure`), `getChainName()`, `isTestnet()`. Tidak ada constructor (deploy tanpa argumen) — nilai per-network **hardcoded langsung sebagai literal di bytecode** (bukan storage yang bisa di-set). Dari bytecode terlihat konstanta `chainId` 31337 / 88882 / 88888 cocok persis dengan `contracts.json` (konfirmasi konsistensi lintas file), serta literal seperti `2592000` (30 hari, `maxStakingDuration`) dan nilai `minStake` yang berbeda antar network (terdeteksi konstanta ~0.01 unit native token vs ~1 unit native token dalam wei — tidak dipetakan presisi per-network di sini karena ABI Solidity tidak expose mapping tsb secara eksplisit, hanya nilai literal di bytecode).

**7. `NetworkConfig.bytecode.json`** — bytecode blob saja (di-skip).

**8. `PredictionHub.json`** — ABI factory/registry utama. Constructor: `(_networkConfig address)`, set `owner = msg.sender` dan simpan alamat `networkConfig`. Struct `Community { id, name, description, metadataURI, creator, createdAt, memberCount, marketCount, isActive }`. Fungsi penting: `registerCreator(name, metadataURI)`, `createCommunity(name, description, metadataURI) → communityId`, `joinCommunity/leaveCommunity(communityId)`, **`createMarket(communityId, polymarketId, metadata, stakingDeadline) → marketAddress`** — ini yang men-deploy instance `Market` baru via opcode `CREATE` (bytecode `PredictionHub.bytecode.json` secara literal **meng-embed ulang seluruh creation-bytecode `Market`** di dalamnya, jadi Hub adalah pabrik on-chain untuk Market, bukan lewat proxy/clone/minimal-proxy pattern — tiap market = full deploy baru, jadi lebih mahal gas dibanding pola clone/EIP-1167). Getter agregat: `getHubStats()` (totalCreators, totalMarkets, totalCommunities, tvl), `getTotalValueLocked()`, `getMarketsByState(targetState)` — kedua terakhir ini **loop over seluruh array `allMarkets`** sambil melakukan external call (`.balance` / `Market.state()`) per market, pola unbounded-loop yang berpotensi gas-heavy/lambat begitu jumlah market bertambah banyak. Event: `CreatorRegistered`, `CommunityCreated/Joined/Left`, `MarketCreated`, `OwnershipTransferred`.

**9. `PredictionHub.bytecode.json`** — bytecode blob (sebagian saja terbaca sebelum truncation warning muncul, tapi isi setelahnya cuma lanjutan hex `deployedBytecode`, sudah cukup untuk konfirmasi struktur di atas — tidak ditranskrip sesuai instruksi).

**Hubungan antar file dalam cluster ini:**
- `contracts.json` adalah index yang menaungi keempat ABI lainnya + definisi network — dipakai frontend/deploy-script untuk tahu file ABI mana dan RPC/chainId mana yang dipakai.
- `PredictionHub` → `NetworkConfig`: Hub menyimpan address `NetworkConfig` di constructor dan memanggilnya (selector cocok dengan `getActiveConfig()`) saat `createMarket()` untuk validasi `stakingDeadline` terhadap `maxStakingDuration`.
- `PredictionHub` → `Market`: Hub adalah factory yang men-deploy `Market` baru (embed bytecode Market di dalam bytecode Hub) dan menyimpan mapping `isMarket`, `allMarkets`, `communityMarkets`, `marketCommunity`.
- `Market` → `PredictionHub` (balik lagi/bidirectional): `Market.stake()` memanggil balik ke `hub` (address yang disimpan di slot Market) — pola selector di bytecode cocok dengan `getMarketCommunity(address)` lalu `isCommunityMember(uint256,address)` milik `PredictionHub`, sesuai revert message `"must be community member to stake"`. Jadi staking di Market **mensyaratkan** user sudah `joinCommunity()` di Hub.
- `MockPolymarket` **tidak direferensikan sama sekali** oleh `Market.json` maupun `PredictionHub.json` — tidak ada state variable atau selector call di kedua kontrak itu yang mengarah ke `MockPolymarket`. Artinya `MockPolymarket` adalah kontrak oracle mandiri/paralel yang berdiri sendiri, kemungkinan dipakai di test suite Foundry saja, bukan bagian dari alur produksi Market.

**Temuan mencurigakan / gap yang perlu dicatat eksplisit:**
1. **Nama cluster menjanjikan "Broadcast deployment records" tapi tidak ada satupun file berisi alamat kontrak yang sudah di-deploy** (gaya Foundry `broadcast/run-latest.json` dengan address per chain). Dari 9 file yang dibaca, `contracts.json` hanya berisi *konfigurasi network* (chainId/RPC), bukan alamat deploy aktual di `chiliz_testnet`/`chiliz_mainnet`. Jadi tidak bisa dipastikan dari cluster ini kontrak sudah live di mana.
2. **Resolusi outcome market 100% bergantung pada self-report creator**, bukan oracle on-chain terverifikasi: `Market.mockPolymarketReturn(_winningOutcome, _payout)` bisa dipanggil creator/hub dengan payout sembarang (hanya divalidasi `msg.value == _payout` dan `payout harus 0 jika outcome != chosenOutcome`) — tidak ada pengecekan terhadap data Polymarket riil di ABI Market. Kombinasi dengan poin di bawah membuat ini rawan trust-abuse kalau di-deploy production.
3. **`MockPolymarket.sol` tampak seperti stub oracle yang orphaned** — fungsinya (`quickResolve`, `calculatePayout`, `getResolution`) tidak dipanggil oleh `Market` maupun `PredictionHub` manapun berdasarkan ABI. Nama file & fungsi eksplisit "Mock" mengindikasikan integrasi Polymarket asli belum pernah benar-benar disambungkan ke on-chain flow — cocok dengan poin no.2.
4. **Tidak ada jejak Chainlink CRE sama sekali di keempat ABI ini** (tidak ada fungsi `fulfillRequest`, CCIP receiver, Automation-compatible interface, dsb) — padahal deskripsi proyek menyebut "Chainlink CRE" untuk resolusi Polymarket. Kemungkinan logic CRE ada di layer lain (backend/CRE workflow) di luar cluster ini, tapi dari sisi smart contract, integrasinya tidak terlihat — worth flagging sebagai gap besar antara pitch dan implementasi kontrak.
5. **Event `Market.MarketCompleted` didefinisikan tanpa field sama sekali** (kosong) — kemungkinan sisa refactor yang tidak selesai, dibanding `MarketSettled` yang membawa `winningOutcome` + `totalPayout`.
6. **`NetworkConfig` tidak punya setter apapun** — semua `minStake`/`maxStakingDuration`/`wrappedNative` per-chain di-hardcode sebagai literal `pure` function, dan `PredictionHub` juga tidak punya fungsi untuk mengganti address `networkConfig` setelah constructor. Kalau parameter perlu diubah, satu-satunya jalan adalah redeploy `NetworkConfig` baru dan redeploy ulang `PredictionHub` (karena address networkConfig immutable secara efektif dari ABI yang tersedia) — cukup rigid untuk sebuah hackathon MVP yang parameternya mungkin masih perlu di-tuning.
7. **`getMarketsByState()` dan `getTotalValueLocked()`/`getHubStats()` melakukan loop over seluruh `allMarkets` dengan external call per-item** (`.state()` / `.balance`) — pola unbounded loop, akan makin berat/berpotensi gagal di RPC call begitu jumlah market di platform bertambah banyak (tidak fatal karena `view`, tapi scaling smell untuk fitur dashboard komunitas).
8. Deploy pattern `createMarket()` menggunakan **full contract deploy (`CREATE`) per market**, bukan minimal-proxy/clone — lebih boros gas dibanding pola clone factory yang lazim dipakai untuk multi-instance market seperti ini.

### Cross-cluster synthesis notes
- This confirms Predit is a real, partially-built repo (not just an ETHGlobal showcase blurb) — chain is **Chiliz (mainnet 88888 / Spicy testnet 88882)**, not Solana. Its settlement/CRE/staking patterns are architecture references for TxODDS, not directly portable code (different chain, different SDK — same caveat as the DreamTend assessment in section 4).
- Known gaps/risks surfaced across clusters should be treated as a single running list — cross-reference each cluster's report above for specifics (mock Polymarket integration, CRE "currently broken" per one cluster's findings, A/B/Draw vs YES/NO UI mismatch, hardcoded mac paths from a previous dev, CREATOR_PRIVATE_KEY custody centralization, mock data still wired into `ui/`).

### UI/UX visual reference (for teams cloning the look — see section 33 `ui/components/` design-system files)
- **Colors**: primary-light `#FF8F5C`, primary `#FF6B35`, primary-dark `#E55A2B`; background `#FFFFFF`, background-alt `#FAFAFA`, muted `#F3F4F6`, foreground `#1A1A1A`; success `#10B981`, warning `#F59E0B`, destructive `#EF4444`.
- **Typography**: display/hero font = **Bebas Neue** (`font-serif` token), UI/body font = **Inter** (`font-sans` token), weight scale 400-800.
- **Spacing/layout**: 4px grid basis (1=4px … 16=64px), radius scale sm/md/lg/xl/full, shadow scale sm/default/md/lg, container max-width 1280px (`px-4` mobile → `px-8` desktop).
- **Component layer**: `ui/components/ui/` is 100% stock shadcn/ui (Radix primitives + `class-variance-authority`), zero custom business logic leaked into it — safe to reuse the primitive layer wholesale, custom prediction-market UI lives one level up in `ui/app/`/`ui/components/` (non-`ui` subfolder).
- This is a DESIGN TOKEN reference only (colors/fonts/spacing), not full screen-by-screen visual specs — for pixel-level layout, still need to look at the actual `ui/app/` page components in the cloned repo (`D:\ethglobal`), not just this summary.

---

## 34. Open technical gaps — resolve during build, before/at day-1 spike (added 2026-07-14, post round-4/5 architecture audit)

These are TxLINE-specific facts that were never fully confirmed during research and directly affect whether the CPI spike (`preder-architecture.md` §1.4) succeeds. Test these FIRST, don't assume either direction.

- [ ] **`validateStatV3` predicate-array padding/encoding is undocumented.** No TxLINE doc or example shows how a `StatValidationInputV3`-style leg array marks "unused" slots when the real predicate has fewer legs than the array's max capacity (the only V3 example script, `subscription_scores_v3c.ts`, uses 4 stat keys — `"1002,1007,2007,1"` — not a full 8). If building a fixed-size predicate array (as `preder-architecture.md` §1 does with `MAX_STAT_KEYS`), you need an explicit `leg_count`/sentinel field of your own design — TxLINE's own examples don't demonstrate this pattern because their scripts always pass a fully-known, ungapped key list at call time.
- [ ] **Compute-unit consumption for `validateStatV3` is not a single confirmed number.** Two different official examples request different CU budgets: `onchain-validation.mdx`'s snippet sets `setComputeUnitLimit(1_400_000)` (the Solana per-tx max) for validation alone; the GitHub README's `settleTrade` example sets `units: 600_000` with a code comment `// max: 1.4M`. Both are REQUESTED ceilings, not measured consumption — actual `unitsConsumed` has never been captured via `simulateTransaction`. Measure this live before assuming either figure.
- [ ] **The V3 spike's own example fixture/seq (`18218149`/`seq 1087`) was NOT independently reachable via the live docs pages during the 2026-07-14 audit pass** — only the V2 example fixture (`18175981`/`seq 991`, used throughout section 23/24's V2 snippets) was confirmed reachable. V3 may still work (it's a real merged example script, just newer/less-indexed in the docs search), but budget a fallback to V2 if V3-specific values don't resolve.
- [ ] **The full subscribe → fund → activate → live-fetch flow has never been executed end-to-end by this project.** Everything in sections 8-25 is confirmed via docs reading + one single live check (`POST /auth/guest/start` → 200 with a real JWT; `/api/fixtures/snapshot` with JWT-only → 403 "Missing API token", as expected). The on-chain `subscribe` tx + wallet funding + `/api/token/activate` + a real authenticated data pull has NOT been run. This is precisely what should happen first when the build clock starts — don't assume it "just works" from docs alone.
- [ ] **SSE `Last-Event-ID` resume is a real documented feature** (`GET /api/odds/stream` and `GET /api/scores/stream` both accept an optional `Last-Event-ID` header to "resume stream from a specific event" — section 30/31) — this was NOT known when `preder-architecture.md` §2's keeper-reliability fix was written (it only recommended "persist Last-Event-ID across restarts" speculatively as a fix, without confirming the mechanism exists). **Still unconfirmed**: whether resume actually replays events after a FULL process outage (seconds/minutes down) or only covers brief in-session reconnects — docs don't state a buffer window. Use `Last-Event-ID` as the primary recovery mechanism (it exists, use it), keep the reconciliation-loop poll as backup for whatever gap the buffer window doesn't cover.
