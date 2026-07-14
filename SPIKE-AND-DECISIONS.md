# Preder — Jam 0-0.2 Decisions + CPI Spike Report

Status date: 2026-07-14. Author: engineering agent (session 1). Source-of-truth specs: `preder-architecture.md`, `memory.md`.

---

## PART 1 — Jam 0-0.2 deliverables (§9 Track A) — DONE

### Decision 1.1 — `MAX_STAT_KEYS` padding / `leg_count` (§1 gap, §34 item 1) — RESOLVED

Verified against the **real devnet IDL** (`txodds/tx-on-chain@main:examples/devnet/idl/txoracle.json`):

- `validate_stat_v3(payload: StatValidationInputV3, strategy: NDimensionalStrategy) -> bool`
- `NDimensionalStrategy { geometric_targets: Vec<GeometricTarget>, distance_predicate: Option<TraderPredicate>, discrete_predicates: Vec<StatPredicate> }`
- `StatPredicate` = enum `Single{index:u8, predicate:TraderPredicate}` | `Binary{index_a:u8, index_b:u8, op:BinaryExpression, predicate:TraderPredicate}`
- `TraderPredicate { threshold:i32, comparison: GreaterThan|LessThan|EqualTo }`

**Key realization:** TxLINE's strategy is **`Vec`-based, not fixed-array**. The padding ambiguity of §34 only exists in how *Preder* STORES the predicate on its `Market` account (fixed-size for deterministic rent), never on the wire to TxLINE.

**Design (pin now):**
- `Market` stores each side as a fixed-capacity array + explicit count:
  - `yes_legs: [StatPredicateLeg; MAX_STAT_KEYS]`, `yes_leg_count: u8`
  - `no_legs:  [StatPredicateLeg; MAX_STAT_KEYS]`, `no_leg_count: u8`
  - `MAX_STAT_KEYS = 8` (matches largest official example; V3 script tops out at 4).
- `StatPredicateLeg` (Preder's own storage struct, borsh-fixed):
  ```
  struct StatPredicateLeg { kind:u8 /*0=Single,1=Binary*/, index_a:u8, index_b:u8, op:u8 /*0=Add,1=Subtract*/, threshold:i32, comparison:u8 /*0=GT,1=LT,2=EQ*/ }
  ```
- **Unused slots:** never marked with a sentinel that could leak — iteration is bounded by `leg_count`, and unused slots are canonical-zero for deterministic account hashing. At settle-time Preder reads `leg_count`, iterates EXACTLY that many legs, and builds a fresh `Vec<StatPredicate>` (Vec length = leg_count). Zero-fill padding is structurally impossible to leak into the proof because the Vec is rebuilt, not copied.
- `create_market` guards: `require!(yes_leg_count >= 1 && yes_leg_count <= MAX_STAT_KEYS)` (same for no). Also require `statKeys` count referenced by legs ≤ leaves supplied at settle.

This closes §34 item 1 with certainty (not assumption): the wire format is Vec, so there is no on-chain padding to misencode once we rebuild from `leg_count`.

### Decision 1.2 — Spike-inconclusive fallback rule (§1.4 poin 7) — COMMITTED (before spike)

If the live spike is inconclusive when the time-box ends, OR external-program CPI into `validate_stat_v3` proves impossible/too-costly, Preder settlement falls back to **keeper-attested (outcome c)**: keeper verifies the proof off-chain via `.view()` (the pattern of every official TxLINE example), then submits `settle(market, claimed_outcome)`; on-chain guards **0–3 run** (idempotency, keeper-auth, fixture-match, freshness), guards **4–5 dropped** (CPI call + return-data check). If (c) is used, the "Verifiable Resolution" panel copy MUST change from "Predicate verified on-chain via TxLINE Merkle proof" to **"keeper-attested, off-chain verified"** (§3/§4).

---

## PART 2 — CPI spike (§3 / §1.4) — OFFLINE portion DONE, LIVE portion BLOCKED

### 2.1 Offline dry-run (§1.4 step 1: borsh byte-size vs 1232 tx cap) — COMPLETE

Computed from the real IDL type tree. Payload model (L=4 legs):
`bytes(StatValidationInputV3) = 120 + L*(12 + 4 + Ps*33) + L*4 + (Pf+Pm+Pmp)*33`
where Pf/Pm/Pmp/Ps = proof-node counts (ProofNode = 33 B). Preder `settle()` instruction data = `8 (disc) + payload + 1 (claimed_outcome bool)`; strategy comes from the Market account, not an arg.

| Tree depth (Pf,Pm,Pmp,Ps) | payload B | settle ixdata | +tx overhead (~9 accts) | total B | fits ≤1232? |
|---|---|---|---|---|---|
| shallow (3,6,2,2) | 827 | 836 | 446 | **1282** | NO (+50) |
| mid (5,10,3,3) | 1190 | 1199 | 446 | **1645** | NO (+413) |
| deep (7,14,4,4) | 1553 | 1562 | 446 | **2008** | NO (+776) |
| very deep (9,18,6,5) | 1949 | 1958 | 446 | **2404** | NO (+1172) |

Max total Merkle nodes for a direct single-tx CPI ≈ **17**. A World Cup daily-scores tree (thousands of updates → main-tree depth ~12–18, plus fixture subtree + multiproof + per-leaf) exceeds 17 easily.

**Verdict (offline, high confidence): outcome (a) DIRECT single-tx CPI is byte-infeasible for realistic proof depth.** Even the most optimistic shallow tree overflows once wrapped in `settle()`. → Narrowed to **(b) proof-staging / 2-tx** or **(c) keeper-attested**.

Caveat: the 1232 cap binds because the live proof must arrive as `settle()`'s outer-tx arg (the program can't reconstruct live data). CPI instruction data built in-program at runtime does NOT count against the outer tx — but the incoming proof does. Model holds.

### 2.2 Bonus discovery — TxLINE ships `settleTrade` (reframes the whole spike)

`tx-on-chain@main:README.md` documents a **deployed, working** on-chain instruction `settle_trade(tradeId, ts, fixtureSummary, fixtureProof, mainTreeProof, predicate, stat1, stat2, op)` that:
- validates the Merkle proof **internally** (same args as `validate_stat`), AND
- releases escrowed funds to the winner + closes the escrow, in **one `.rpc()` state-changing tx**,
- with a **confirmed devnet explorer tx** (`f7t9VqWyum...`) and `units: 600_000 // max: 1.4M`.

Implications:
- **Proves** validation + fund-move fit together at ~600k CU on devnet (within TxLINE's own program) — de-risks the CU ceiling worry for the combined operation.
- Does **NOT** prove external-program CPI — here TxLINE validates internally; the open spike question (can *Preder* CPI `validate_stat_v3`?) is untouched.
- `settle_trade` is a **2-party P2P trade escrow** (`create_trade` co-signed by both traders + TxODDS authority; winner submits proof). Different model from Preder's pooled YES/NO market → **not directly reusable**, but it confirms TxLINE's intended pattern is "winner/keeper fetches proof off-chain → submits" — i.e. the keeper-attested-style flow, close to fallback (c).

### 2.3 Live portion — BLOCKED (cannot complete in this environment)

Blocked spike steps (§1.4 steps 2–5): live devnet CPI, actual `unitsConsumed` via `simulateTransaction`, `get_return_data()==true` check, and whether external-program CPI works at all.

Environment blockers found:
- **No Rust / Cargo / Solana CLI / Anchor** installed → cannot build or deploy a test program.
- **No funded devnet wallet + no active TxLINE World Cup subscription** → cannot fetch a live V3 proof (proof endpoints need the activated API token = on-chain `subscribe` tx + activation). Repo has **no cached proof JSON** to substitute.
- Node 22.13.1 present; `yarn`/`ts-node` absent (npx works).

These are the §2 "Prasyarat keras" and §34 item 4 ("subscribe → fund → activate → live-fetch never run end-to-end") — now confirmed blocking, not assumed.

---

## PART 3 — User decisions (RESOLVED 2026-07-14)

1. **Toolchain**: Use **Solana Playground (beta.solpg.io)** — browser-based compile + devnet deploy + built-in wallet + SOL airdrop, no native install. → Program source must be Playground-paste-ready (standard Anchor, no exotic deps). I cannot drive Playground from this CLI; user compiles/deploys there.
2. **Settlement path**: **(c) keeper-attested** (confirmed). `settle()` runs on-chain guards 0–3 (idempotency, keeper-auth, fixture-match, freshness) + zero-winner branch; NO CPI (guards 4–5 dropped). Keeper validates the Merkle proof off-chain via `.view()`. Verifiable-Resolution panel copy = **"keeper-attested, off-chain verified"**.
3. **Scope**: full Anchor program + keeper + backend + frontend — BUT **compile-verify the program in Playground (`anchor build`) FIRST**, before writing any dependent layer. No settlement code written "blind" without one compile pass.
4. **Demo match window** (§6 pt 4): STILL OPEN — must confirm a live TxLINE-covered match exists in the demo window before the hour-9 recording step (historical data = DQ risk). Not blocking the build; revisit before recording.

### Build workflow (agreed)
1. Write complete Anchor program source (this session). →
2. **User compiles in Solana Playground, reports errors, I fix until `anchor build` passes.** ← compile gate
3. Then keeper + thin backend + Next.js frontend (frontend mock-data screens may start in parallel since they don't depend on the compiled IDL; settlement-touching client code waits for the verified IDL).
