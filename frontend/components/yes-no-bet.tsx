"use client";

// Bet widget (mock). INTEGRATION POINT: on submit, build + send the `stake` instruction
// (programs/preder stake()) with the connected Privy/Phantom wallet. For now it validates
// input and shows the projected payout, honestly labelling the binary framing.
import { useState } from "react";
import type { Market } from "@/lib/types";
import { useWallet } from "./wallet-button";
import { usdc, toBaseUnits, payoutMultiple } from "@/lib/format";
import { cn } from "@/lib/cn";

export function YesNoBet({ market }: { market: Market }) {
  const { addr, connect } = useWallet();
  const [side, setSide] = useState<boolean | null>(null);
  const [amount, setAmount] = useState<string>("10");
  const [done, setDone] = useState(false);

  const closed = market.state !== "Open" || market.stakingDeadline <= Math.floor(Date.now() / 1000);
  const amt = Number(amount) || 0;
  const minOk = toBaseUnits(amt) >= market.minStake;

  const projected = () => {
    if (side === null || amt <= 0) return null;
    const ty = market.totalYes + (side ? toBaseUnits(amt) : 0);
    const tn = market.totalNo + (side ? 0 : toBaseUnits(amt));
    const mult = payoutMultiple(ty, tn, side);
    return mult * amt;
  };
  const proj = projected();

  if (closed) {
    return (
      <div className="rounded-lg border border-border bg-muted/50 p-4 text-sm text-foreground/60">
        Staking is closed for this market.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border p-4 space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <SideButton active={side === true} tone="yes" onClick={() => setSide(true)}>
          {market.yesLabel}
        </SideButton>
        <SideButton active={side === false} tone="no" onClick={() => setSide(false)}>
          {market.noLabel}
        </SideButton>
      </div>

      <div>
        <label className="text-xs font-medium text-foreground/50">Amount (USDC)</label>
        <input
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
          className="mt-1 w-full rounded-md border border-border px-3 py-2 text-lg font-semibold outline-none focus:border-primary"
        />
        <div className="mt-1 flex justify-between text-xs text-foreground/50">
          <span>min ${usdc(market.minStake)}</span>
          {proj !== null && side !== null && (
            <span className="text-success font-medium">est. payout ${proj.toFixed(2)} if correct</span>
          )}
        </div>
      </div>

      {/* Honest framing note for winner/draw templates */}
      <p className="text-xs text-foreground/50">
        Binary market: a draw resolves to <span className="font-medium">{market.noLabel}</span>.
      </p>

      {!addr ? (
        <button onClick={connect} className="w-full rounded-md bg-primary py-2.5 font-semibold text-white hover:bg-primary-dark">
          Connect to bet
        </button>
      ) : done ? (
        <div className="rounded-md bg-success/10 py-2.5 text-center text-sm font-semibold text-success">
          Stake placed (mock) — wire to on-chain next.
        </div>
      ) : (
        <button
          disabled={side === null || !minOk}
          onClick={() => setDone(true)}
          className={cn(
            "w-full rounded-md py-2.5 font-semibold text-white transition-colors",
            side === null || !minOk ? "bg-foreground/20 cursor-not-allowed" : "bg-primary hover:bg-primary-dark"
          )}
        >
          {side === null ? "Pick a side" : !minOk ? "Below minimum" : `Stake $${amt} on ${side ? "YES" : "NO"}`}
        </button>
      )}
    </div>
  );
}

function SideButton({
  active,
  tone,
  onClick,
  children,
}: {
  active: boolean;
  tone: "yes" | "no";
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-md border px-3 py-3 text-sm font-semibold transition-all",
        active
          ? tone === "yes"
            ? "border-success bg-success/10 text-success"
            : "border-primary bg-primary/10 text-primary-dark"
          : "border-border hover:border-foreground/30"
      )}
    >
      {children}
    </button>
  );
}
