# Preder — "Predict Together"

Community prediction markets for the World Cup, powered by **TxLINE** (TxODDS' cryptographically-signed
sports data, anchored to Solana). Communities create binary YES/NO markets on real fixtures, fans stake
USDC into a shared pool, and markets settle against real TxLINE match data. Solana **devnet**, Anchor.

Track 2 — Consumer & Fan Experiences.

## Repository layout

```
contracts/        Anchor program (on-chain)
  preder/src/lib.rs   the whole program: communities, markets, stake, settle, claim, refund
frontend/         Next.js app — UI + serverless API routes
  app/                pages (Home, Community, Market, Create, Leaderboard) + app/api (backend proxy)
  lib/                design tokens, on-chain read layer (chain.ts/data.ts), TxLINE client (txline.ts)
backend/          Off-chain services (Node / ts-node)
  src/init-and-seed.ts    initialize Config + test-USDC mint + seed communities/markets
  src/keeper.ts           keeper: watch finalisation, fetch proof, submit settle() (keeper-attested)
  src/test-lifecycle.ts   full on-chain integration test (stake/settle/claim/refund) — 8/8 pass
idl/preder.json   deployed program IDL (legacy Anchor format)
keys/             devnet keypairs (gitignored)
```

> Note: the backend TxLINE **proxy** (fixtures/odds/scores + `/api/settle-proof`) lives in
> `frontend/app/api/*` — Next.js serverless routes are deployed with the app. The `backend/` folder
> holds the standalone off-chain services (keeper + seed + tests).

## Deployed (devnet)

- Program ID: `xa2YjaE4f8qyae8crkfDQZV7KiwzQMSBcx56jeanyHi`
- Config PDA: `3DTCEgjWNKUay1WrfDkU3QVuEZo8HVHiTKDbavATWqTV`
- Test-USDC mint: `H3FQaWeRZTsz8bcX47XiCNWAoA9oLZRNBaJEV7ayjYjo`

## Settlement model

**Keeper-attested** (see [SPIKE-AND-DECISIONS.md](SPIKE-AND-DECISIONS.md)): the keeper verifies the
TxLINE Merkle proof off-chain, then submits `settle()`. On-chain guards enforce idempotency,
keeper-auth, fixture-match, freshness, and the zero-winner branch. (Direct on-chain CPI into
`validate_stat_v3` was byte-infeasible >1232 B — proven in the day-1 spike.)

## Run

```
# contracts — compiled + deployed via Solana Playground (beta.solpg.io), paste contracts/preder/src/lib.rs
# backend
cd backend && npm i
npm run init-seed      # seed on-chain data (needs a funded keeper wallet)
npm run keeper         # run the settlement keeper
npx ts-node src/test-lifecycle.ts   # full lifecycle integration test
# frontend
cd frontend && npm i && npm run dev  # http://localhost:3000
```

TxLINE endpoints used: `/auth/guest/start`, `/api/token/activate`, `/api/fixtures/snapshot`,
`/api/scores/snapshot/{fixtureId}`, `/api/scores/stat-validation-v3`, `/api/odds/snapshot/{fixtureId}`.

Not affiliated with FIFA or any tournament organiser.
