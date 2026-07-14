export const PROGRAM_ID = "xa2YjaE4f8qyae8crkfDQZV7KiwzQMSBcx56jeanyHi";
export const DEVNET_RPC = process.env.NEXT_PUBLIC_RPC || "https://api.devnet.solana.com";
export const EXPLORER = (sig: string) => `https://explorer.solana.com/tx/${sig}?cluster=devnet`;

// Fixture metadata lookup (fixtureId -> display). MVP static map; later served from the
// backend TxLINE fixtures proxy (/api/fixtures/snapshot).
export const FIXTURE_META: Record<number, { home: string; away: string; homeShort: string; awayShort: string; competition: string }> = {
  18218149: { home: "Argentina", away: "Netherlands", homeShort: "ARG", awayShort: "NED", competition: "World Cup" },
  18209181: { home: "France", away: "Morocco", homeShort: "FRA", awayShort: "MAR", competition: "World Cup" },
  18175981: { home: "Brazil", away: "Croatia", homeShort: "BRA", awayShort: "CRO", competition: "World Cup" },
};
