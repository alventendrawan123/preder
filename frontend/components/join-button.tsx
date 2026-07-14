"use client";

// Join/leave (mock). INTEGRATION POINT: join_community / leave_community instructions
// (Membership PDA). Persists locally for the mock phase.
import { useEffect, useState } from "react";
import { useWallet } from "./wallet-button";

export function JoinButton({ communityId }: { communityId: string }) {
  const { addr, connect } = useWallet();
  const [joined, setJoined] = useState(false);
  const key = `preder.member.${communityId}`;

  useEffect(() => {
    setJoined(localStorage.getItem(key) === "1");
  }, [key]);

  if (!addr) {
    return (
      <button onClick={connect} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark">
        Connect to join
      </button>
    );
  }
  return (
    <button
      onClick={() => {
        const next = !joined;
        localStorage.setItem(key, next ? "1" : "0");
        setJoined(next);
      }}
      className={
        joined
          ? "rounded-md border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
          : "rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
      }
    >
      {joined ? "Joined ✓" : "Join community"}
    </button>
  );
}
