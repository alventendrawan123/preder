import { notFound } from "next/navigation";
import Link from "next/link";
import { getMarket, getCommunity } from "@/lib/data";
import { commentsByMarket } from "@/lib/mock";
import { FixtureLine } from "@/components/fixture-line";
import { PoolSplitBar } from "@/components/pool-split-bar";
import { YesNoBet } from "@/components/yes-no-bet";
import { Discussion } from "@/components/discussion";
import { VerifiableResolution } from "@/components/verifiable-resolution";
import { StateBadge, Card } from "@/components/ui";
import { usdc, timeLeft } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function MarketPage({ params }: { params: { id: string } }) {
  const market = await getMarket(params.id);
  if (!market) return notFound();
  const community = await getCommunity(market.communityId);
  const comments = commentsByMarket(market.id);
  const pool = market.totalYes + market.totalNo;

  return (
    <div className="py-8 grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-foreground/50">
            {community && (
              <Link href={`/community/${community.id}`} className="hover:text-primary">
                {community.name}
              </Link>
            )}
            <span>·</span>
            <span>{market.fixture.competition}</span>
          </div>
          <div className="mt-2 flex items-start justify-between gap-3">
            <h1 className="font-display text-4xl md:text-5xl leading-none">{market.title}</h1>
            <StateBadge state={market.state} />
          </div>
        </div>

        <Card className="p-5 space-y-4">
          <FixtureLine fixture={market.fixture} big />
          <PoolSplitBar
            totalYes={market.totalYes}
            totalNo={market.totalNo}
            yesLabel={market.yesLabel}
            noLabel={market.noLabel}
          />
          <div className="grid grid-cols-3 gap-3 text-center text-sm">
            <Meta label="Total pool" value={`$${usdc(pool)}`} />
            <Meta label="Min stake" value={`$${usdc(market.minStake)}`} />
            <Meta
              label={market.state === "Open" ? "Closes in" : "Status"}
              value={market.state === "Open" ? timeLeft(market.stakingDeadline) : market.state}
            />
          </div>
        </Card>

        {market.state === "Settled" && market.resolution && (
          <VerifiableResolution resolution={market.resolution} />
        )}

        <Card className="p-5">
          <Discussion marketId={market.id} initial={comments} />
        </Card>
      </div>

      {/* Bet / claim rail */}
      <aside className="space-y-4">
        <div className="lg:sticky lg:top-24 space-y-4">
          {market.state === "Open" && <YesNoBet market={market} />}
          {market.state === "Settled" && (
            <Card className="p-4 space-y-2">
              <div className="text-sm font-semibold">
                Winning side:{" "}
                <span className="text-success">{market.winningOutcome ? market.yesLabel : market.noLabel}</span>
              </div>
              <button className="w-full rounded-md bg-primary py-2.5 font-semibold text-white hover:bg-primary-dark">
                Claim winnings
              </button>
              <p className="text-xs text-foreground/50">Pull-based, proportional to your stake.</p>
            </Card>
          )}
          {market.state === "Refundable" && (
            <Card className="p-4 space-y-2">
              <div className="text-sm font-semibold text-warning">Market refundable</div>
              <button className="w-full rounded-md bg-warning py-2.5 font-semibold text-white">Refund my stake</button>
              <p className="text-xs text-foreground/50">Each staker gets back 100% of their own stake.</p>
            </Card>
          )}
        </div>
      </aside>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-muted/60 py-2">
      <div className="font-semibold">{value}</div>
      <div className="text-xs text-foreground/50">{label}</div>
    </div>
  );
}
