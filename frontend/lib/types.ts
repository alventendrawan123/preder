// Domain types — mirror the on-chain program (programs/preder/src/lib.rs).
// During the mock phase these are populated by lib/mock.ts; later by getProgramAccounts.

export type MarketState = "Open" | "Settled" | "Refundable";

export type PredicateTemplate =
  | "match_winner"
  | "total_goals_over"
  | "both_teams_score"
  | "draw"
  | "clean_sheet";

export interface Community {
  id: string;
  creator: string;
  name: string;
  description: string;
  avatarColor: string;
  memberCount: number;
  marketCount: number;
  createdAt: number;
}

export interface Fixture {
  fixtureId: number;
  competition: string;
  home: string;
  away: string;
  homeShort: string;
  awayShort: string;
  kickoff: number; // unix seconds
  status: "scheduled" | "live" | "finished";
  minute?: number;
  homeGoals?: number;
  awayGoals?: number;
}

export interface Market {
  id: string;
  communityId: string;
  creator: string;
  fixture: Fixture;
  template: PredicateTemplate;
  title: string; // human label, honest binary framing
  yesLabel: string;
  noLabel: string;
  stakingDeadline: number;
  expectedSettleAfter: number;
  minStake: number; // USDC base units (6 decimals)
  state: MarketState;
  totalYes: number; // USDC base units
  totalNo: number;
  winningOutcome?: boolean;
  resolution?: Resolution;
}

export interface Resolution {
  fixtureId: number;
  statKeys: string;
  seq: number;
  timestamp: number;
  proofHash: string;
  settleTx: string;
  keeper: string;
  // Honest disclosure: predicate is off-chain verified against TxLINE proof (keeper-attested model).
  verifiedBy: "keeper-attested, off-chain verified";
}

export interface Stake {
  marketId: string;
  user: string;
  outcome: boolean;
  amount: number; // USDC base units
  claimed: boolean;
}

export interface Comment {
  id: string;
  marketId: string;
  user: string;
  body: string;
  createdAt: number;
}

export interface LeaderRow {
  user: string;
  handle: string;
  role: "creator" | "audience";
  settled: number;
  correct: number;
  streak: number;
  volume: number; // USDC base units
}
