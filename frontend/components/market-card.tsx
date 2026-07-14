import Link from "next/link";
import type { Market } from "@/lib/types";
import { Card, StateBadge } from "./ui";
import { FixtureLine } from "./fixture-line";
import { PoolSplitBar } from "./pool-split-bar";
import { usdc, timeLeft } from "@/lib/format";

export function MarketCard({ market }: { market: Market }) {
  const pool = market.totalYes + market.totalNo;
  return (
    <Link href={`/market/${market.id}`}>
      <Card className="p-4 hover:shadow-md transition-shadow h-full flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-foreground/40">
            {market.fixture.competition}
          </span>
          <StateBadge state={market.state} />
        </div>
        <FixtureLine fixture={market.fixture} />
        <h3 className="font-semibold leading-snug">{market.title}</h3>
        <div className="mt-auto space-y-2">
          <PoolSplitBar
            totalYes={market.totalYes}
            totalNo={market.totalNo}
            yesLabel={market.yesLabel}
            noLabel={market.noLabel}
            compact
          />
          <div className="flex justify-between text-xs text-foreground/50">
            <span>${usdc(pool)} pool</span>
            <span>{market.state === "Open" ? `closes ${timeLeft(market.stakingDeadline)}` : "closed"}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
