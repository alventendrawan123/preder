// USDC has 6 decimals on-chain. Base units <-> display.
export const USDC_DECIMALS = 6;

export function usdc(baseUnits: number): string {
  const v = baseUnits / 10 ** USDC_DECIMALS;
  return v.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

export function toBaseUnits(display: number): number {
  return Math.round(display * 10 ** USDC_DECIMALS);
}

export function shortAddr(a: string): string {
  return a.length <= 10 ? a : `${a.slice(0, 4)}…${a.slice(-4)}`;
}

export function poolSplit(totalYes: number, totalNo: number): { yesPct: number; noPct: number } {
  const total = totalYes + totalNo;
  if (total === 0) return { yesPct: 50, noPct: 50 };
  const yesPct = Math.round((totalYes / total) * 100);
  return { yesPct, noPct: 100 - yesPct };
}

// Implied payout multiple for a winning stake (proportional pool math, u128 on-chain).
export function payoutMultiple(totalYes: number, totalNo: number, outcome: boolean): number {
  const total = totalYes + totalNo;
  const winSide = outcome ? totalYes : totalNo;
  if (winSide === 0) return 0;
  return total / winSide;
}

export function timeLeft(deadline: number): string {
  const now = Math.floor(Date.now() / 1000);
  let s = deadline - now;
  if (s <= 0) return "closed";
  const d = Math.floor(s / 86400);
  s -= d * 86400;
  const h = Math.floor(s / 3600);
  s -= h * 3600;
  const m = Math.floor(s / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}
