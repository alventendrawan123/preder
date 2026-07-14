// Mock data layer for the Track B build (kickoff §9: build screens on mock, swap to on-chain later).
// Shapes match lib/types.ts so the swap to getProgramAccounts is mechanical.
import type { Community, Fixture, Market, Comment, LeaderRow, Stake } from "./types";
import { toBaseUnits } from "./format";

const now = Math.floor(Date.now() / 1000);
const H = 3600;

export const fixtures: Fixture[] = [
  {
    fixtureId: 18218149,
    competition: "World Cup",
    home: "Argentina",
    away: "Netherlands",
    homeShort: "ARG",
    awayShort: "NED",
    kickoff: now + 2 * H,
    status: "scheduled",
  },
  {
    fixtureId: 18209181,
    competition: "World Cup",
    home: "France",
    away: "Morocco",
    homeShort: "FRA",
    awayShort: "MAR",
    kickoff: now - 1 * H,
    status: "live",
    minute: 63,
    homeGoals: 1,
    awayGoals: 0,
  },
  {
    fixtureId: 18175981,
    competition: "World Cup",
    home: "Brazil",
    away: "Croatia",
    homeShort: "BRA",
    awayShort: "CRO",
    kickoff: now - 4 * H,
    status: "finished",
    homeGoals: 1,
    awayGoals: 1,
  },
];

export const communities: Community[] = [
  {
    id: "c_selecao",
    creator: "GCqBmTGT1x37mrHjuwTBV68GBrjVeCFcfDqBe7jo5n1b",
    name: "Seleção Street",
    description: "Brazil-first fan pool. Bold calls, hotter takes.",
    avatarColor: "#FF6B35",
    memberCount: 1284,
    marketCount: 3,
    createdAt: now - 30 * 86400,
  },
  {
    id: "c_lesbleus",
    creator: "7xKq2pRfN3mVwYtZ8sB1cJ4hL9dG6eA5nP0uQwErTyU",
    name: "Les Bleus Bunker",
    description: "France diehards calling every fixture.",
    avatarColor: "#2563EB",
    memberCount: 902,
    marketCount: 2,
    createdAt: now - 24 * 86400,
  },
  {
    id: "c_globalpicks",
    creator: "3jH8kL2mN9pQ4rS6tU7vW1xY5zA0bC8dE2fG3hJ4kL5",
    name: "Global Picks",
    description: "Neutral degens. Every match, every angle.",
    avatarColor: "#10B981",
    memberCount: 2571,
    marketCount: 4,
    createdAt: now - 40 * 86400,
  },
];

export const markets: Market[] = [
  {
    id: "m_arg_win",
    communityId: "c_globalpicks",
    creator: "3jH8kL2mN9pQ4rS6tU7vW1xY5zA0bC8dE2fG3hJ4kL5",
    fixture: fixtures[0],
    template: "match_winner",
    title: "Argentina to beat Netherlands",
    yesLabel: "Argentina wins",
    noLabel: "Draw or Netherlands",
    stakingDeadline: now + 2 * H,
    expectedSettleAfter: now + 4 * H,
    minStake: toBaseUnits(1),
    state: "Open",
    totalYes: toBaseUnits(4210),
    totalNo: toBaseUnits(2870),
  },
  {
    id: "m_fra_ttg",
    communityId: "c_lesbleus",
    creator: "7xKq2pRfN3mVwYtZ8sB1cJ4hL9dG6eA5nP0uQwErTyU",
    fixture: fixtures[1],
    template: "total_goals_over",
    title: "France vs Morocco — Over 2.5 goals",
    yesLabel: "3+ total goals",
    noLabel: "2 or fewer goals",
    stakingDeadline: now - 1 * H,
    expectedSettleAfter: now + 1 * H,
    minStake: toBaseUnits(1),
    state: "Open",
    totalYes: toBaseUnits(1560),
    totalNo: toBaseUnits(3320),
  },
  {
    id: "m_bra_btts",
    communityId: "c_selecao",
    creator: "GCqBmTGT1x37mrHjuwTBV68GBrjVeCFcfDqBe7jo5n1b",
    fixture: fixtures[2],
    template: "both_teams_score",
    title: "Brazil vs Croatia — Both teams to score",
    yesLabel: "Both score",
    noLabel: "At least one blanks",
    stakingDeadline: now - 4 * H,
    expectedSettleAfter: now - 2 * H,
    minStake: toBaseUnits(1),
    state: "Settled",
    totalYes: toBaseUnits(6120),
    totalNo: toBaseUnits(1980),
    winningOutcome: true,
    resolution: {
      fixtureId: 18175981,
      statKeys: "1002,1007",
      seq: 991,
      timestamp: now - 2 * H,
      proofHash: "0x8f3a91c2be44c0d15e77aa9302be1c4d5a6f7e8b9c0d1e2f3a4b5c6d7e8f9012",
      settleTx: "5xQ2m…keeperSettleTxSignatureDevnetExample…9aFp",
      keeper: "GCqBmTGT1x37mrHjuwTBV68GBrjVeCFcfDqBe7jo5n1b",
      verifiedBy: "keeper-attested, off-chain verified",
    },
  },
];

export const comments: Comment[] = [
  { id: "cm1", marketId: "m_arg_win", user: "GCqBmTGT1x37mrHjuwTBV68GBrjVeCFcfDqBe7jo5n1b", body: "Messi cooking today. Loading YES.", createdAt: now - 1200 },
  { id: "cm2", marketId: "m_arg_win", user: "7xKq2pRfN3mVwYtZ8sB1cJ4hL9dG6eA5nP0uQwErTyU", body: "NED defense is solid, draw is live. Fading.", createdAt: now - 600 },
  { id: "cm3", marketId: "m_fra_ttg", user: "3jH8kL2mN9pQ4rS6tU7vW1xY5zA0bC8dE2fG3hJ4kL5", body: "1-0 at 63' — under looking good.", createdAt: now - 200 },
];

export const stakes: Stake[] = [
  { marketId: "m_bra_btts", user: "GCqBmTGT1x37mrHjuwTBV68GBrjVeCFcfDqBe7jo5n1b", outcome: true, amount: toBaseUnits(50), claimed: false },
];

export const leaderboard: LeaderRow[] = [
  { user: "GCqBmTGT1x37mrHjuwTBV68GBrjVeCFcfDqBe7jo5n1b", handle: "selecao.sol", role: "creator", settled: 22, correct: 16, streak: 4, volume: toBaseUnits(18200) },
  { user: "7xKq2pRfN3mVwYtZ8sB1cJ4hL9dG6eA5nP0uQwErTyU", handle: "bleus.sol", role: "creator", settled: 19, correct: 11, streak: 0, volume: toBaseUnits(12040) },
  { user: "3jH8kL2mN9pQ4rS6tU7vW1xY5zA0bC8dE2fG3hJ4kL5", handle: "globalpicks.sol", role: "creator", settled: 31, correct: 20, streak: 2, volume: toBaseUnits(24800) },
  { user: "9aB1cD2eF3gH4iJ5kL6mN7oP8qR9sT0uV1wX2yZ3aB4", handle: "degenfan.sol", role: "audience", settled: 44, correct: 27, streak: 6, volume: toBaseUnits(8600) },
];

// --- accessors (mirror future on-chain fetchers) ---
export const getCommunity = (id: string) => communities.find((c) => c.id === id);
export const getMarket = (id: string) => markets.find((m) => m.id === id);
export const marketsByCommunity = (id: string) => markets.filter((m) => m.communityId === id);
export const commentsByMarket = (id: string) => comments.filter((c) => c.marketId === id);
