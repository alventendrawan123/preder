import { cn } from "@/lib/cn";
import type { MarketState } from "@/lib/types";

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold", className)}>
      {children}
    </span>
  );
}

export function StateBadge({ state }: { state: MarketState }) {
  const map: Record<MarketState, string> = {
    Open: "bg-success/10 text-success",
    Settled: "bg-primary/10 text-primary-dark",
    Refundable: "bg-warning/10 text-warning",
  };
  return <Badge className={map[state]}>{state}</Badge>;
}

export function LiveDot({ label = "LIVE" }: { label?: string }) {
  return (
    <Badge className="bg-destructive/10 text-destructive">
      <span className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse-live" />
      {label}
    </Badge>
  );
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-lg border border-border bg-white shadow-sm", className)}>{children}</div>
  );
}
