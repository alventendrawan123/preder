import Link from "next/link";
import { getCommunities, getMarkets } from "@/lib/data";
import { CommunityCard } from "@/components/community-card";
import { MarketCard } from "@/components/market-card";
import { usdc } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [communities, markets] = await Promise.all([getCommunities(), getMarkets()]);
  const totalPool = markets.reduce((s, m) => s + m.totalYes + m.totalNo, 0);
  const open = markets.filter((m) => m.state === "Open");

  return (
    <div className="py-8 space-y-12">
      {/* Hero */}
      <section className="rounded-xl bg-gradient-to-br from-primary-light via-primary to-primary-dark p-8 md:p-12 text-white">
        <h1 className="font-display text-5xl md:text-7xl leading-none max-w-3xl">
          PREDICT THE WORLD CUP, TOGETHER.
        </h1>
        <p className="mt-4 max-w-xl text-white/90">
          Community-run prediction markets settled on real TxLINE match data. Pick a side, stake USDC,
          split the pool with your crew — resolved against cryptographic proofs on Solana.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/create" className="rounded-md bg-white px-5 py-2.5 font-semibold text-primary-dark hover:bg-white/90">
            Create a market
          </Link>
          <a href="#markets" className="rounded-md border border-white/40 px-5 py-2.5 font-semibold hover:bg-white/10">
            Browse markets
          </a>
        </div>
        <div className="mt-8 flex flex-wrap gap-8 text-sm">
          <Stat label="Communities" value={communities.length.toString()} />
          <Stat label="Open markets" value={open.length.toString()} />
          <Stat label="Total pool" value={`$${usdc(totalPool)}`} />
        </div>
      </section>

      {/* Communities */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-3xl">COMMUNITIES</h2>
          <Link href="/create" className="text-sm font-medium text-primary hover:text-primary-dark">
            Start your own →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {communities.map((c) => (
            <CommunityCard key={c.id} community={c} />
          ))}
        </div>
      </section>

      {/* Markets */}
      <section id="markets" className="space-y-4">
        <h2 className="font-display text-3xl">TRENDING MARKETS</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {markets.map((m) => (
            <MarketCard key={m.id} market={m} />
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-display text-3xl leading-none">{value}</div>
      <div className="text-white/70">{label}</div>
    </div>
  );
}
