// Data layer: on-chain first, mock fallback (so the demo works before/after seeding).
// React cache() dedupes the RPC fetch within a single request render.
import { cache } from "react";
import { fetchCommunitiesOnchain, fetchMarketsOnchain } from "./chain";
import * as mock from "./mock";
import type { Community, Market } from "./types";

export const load = cache(async (): Promise<{ communities: Community[]; markets: Market[]; source: "onchain" | "mock" }> => {
  try {
    const [communities, markets] = await Promise.all([fetchCommunitiesOnchain(), fetchMarketsOnchain()]);
    if (communities.length > 0) return { communities, markets, source: "onchain" };
  } catch {
    // fall through to mock
  }
  return { communities: mock.communities, markets: mock.markets, source: "mock" };
});

export async function getCommunities() {
  return (await load()).communities;
}
export async function getMarkets() {
  return (await load()).markets;
}
export async function getCommunity(id: string) {
  return (await load()).communities.find((c) => c.id === id);
}
export async function getMarket(id: string) {
  return (await load()).markets.find((m) => m.id === id);
}
export async function marketsByCommunity(id: string) {
  return (await load()).markets.filter((m) => m.communityId === id);
}
