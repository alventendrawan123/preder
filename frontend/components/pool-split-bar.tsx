import { poolSplit, usdc } from "@/lib/format";

export function PoolSplitBar({
  totalYes,
  totalNo,
  yesLabel,
  noLabel,
  compact,
}: {
  totalYes: number;
  totalNo: number;
  yesLabel: string;
  noLabel: string;
  compact?: boolean;
}) {
  const { yesPct, noPct } = poolSplit(totalYes, totalNo);
  return (
    <div className="space-y-1.5">
      {!compact && (
        <div className="flex justify-between text-xs font-medium">
          <span className="text-success">{yesLabel} · {yesPct}%</span>
          <span className="text-foreground/60">{noLabel} · {noPct}%</span>
        </div>
      )}
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <div className="bg-success transition-all duration-500" style={{ width: `${yesPct}%` }} />
        <div className="bg-primary transition-all duration-500" style={{ width: `${noPct}%` }} />
      </div>
      {!compact && (
        <div className="flex justify-between text-xs text-foreground/50">
          <span>${usdc(totalYes)}</span>
          <span>${usdc(totalNo)}</span>
        </div>
      )}
    </div>
  );
}
