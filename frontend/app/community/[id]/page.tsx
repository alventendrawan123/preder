import { notFound } from "next/navigation";
import Link from "next/link";
import { getCommunity, marketsByCommunity } from "@/lib/data";
import { MarketCard } from "@/components/market-card";
import { JoinButton } from "@/components/join-button";
import { Users } from "lucide-react";
import { shortAddr } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function CommunityPage({ params }: { params: { id: string } }) {
  const community = await getCommunity(params.id);
  if (!community) return notFound();
  const list = await marketsByCommunity(community.id);

  return (
    <div className="py-8 space-y-8">
      <div className="rounded-xl border border-border p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-5">
        <span
          className="grid h-16 w-16 place-items-center rounded-xl font-display text-3xl text-white"
          style={{ background: community.avatarColor }}
        >
          {community.name.slice(0, 1)}
        </span>
        <div className="flex-1">
          <h1 className="font-display text-4xl leading-none">{community.name}</h1>
          <p className="mt-2 text-foreground/60 max-w-2xl">{community.description}</p>
          <div className="mt-2 flex items-center gap-3 text-sm text-foreground/50">
            <span className="flex items-center gap-1">
              <Users size={14} /> {community.memberCount.toLocaleString()} members
            </span>
            <span>·</span>
            <span>by {shortAddr(community.creator)}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <JoinButton communityId={community.id} />
          <Link
            href={`/create?community=${community.id}`}
            className="rounded-md border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
          >
            New market
          </Link>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="font-display text-3xl">MARKETS</h2>
        {list.length === 0 ? (
          <p className="text-foreground/50">No markets yet — be the first to create one.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((m) => (
              <MarketCard key={m.id} market={m} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
