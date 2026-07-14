"use client";

// Mock wallet button. INTEGRATION POINT: replace with Privy + Phantom (Solana) —
// kickoff §8 "sign up through Solana". For the mock phase we simulate a connected
// devnet pubkey so the bet / claim flows are demonstrable without real signing.
import { useEffect, useState } from "react";
import { Wallet } from "lucide-react";
import { shortAddr } from "@/lib/format";

const DEMO_WALLET = "GCqBmTGT1x37mrHjuwTBV68GBrjVeCFcfDqBe7jo5n1b";

export function useWallet() {
  const [addr, setAddr] = useState<string | null>(null);
  useEffect(() => {
    setAddr(localStorage.getItem("preder.wallet"));
  }, []);
  const connect = () => {
    localStorage.setItem("preder.wallet", DEMO_WALLET);
    setAddr(DEMO_WALLET);
  };
  const disconnect = () => {
    localStorage.removeItem("preder.wallet");
    setAddr(null);
  };
  return { addr, connect, disconnect };
}

export function WalletButton() {
  const { addr, connect, disconnect } = useWallet();
  if (addr) {
    return (
      <button
        onClick={disconnect}
        className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-muted"
      >
        <span className="h-2 w-2 rounded-full bg-success" />
        {shortAddr(addr)}
      </button>
    );
  }
  return (
    <button
      onClick={connect}
      className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark transition-colors"
    >
      <Wallet size={16} /> Connect
    </button>
  );
}
