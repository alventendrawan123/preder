"use client";

// Discussion thread (mock). INTEGRATION POINT: Supabase social layer (architecture §3) —
// userId MUST be verified from a signed wallet session, never trusted from the body.
import { useState } from "react";
import type { Comment } from "@/lib/types";
import { useWallet } from "./wallet-button";
import { shortAddr } from "@/lib/format";

function ago(ts: number) {
  const s = Math.floor(Date.now() / 1000) - ts;
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}

export function Discussion({ marketId, initial }: { marketId: string; initial: Comment[] }) {
  const { addr, connect } = useWallet();
  const [items, setItems] = useState<Comment[]>(initial);
  const [text, setText] = useState("");

  const post = () => {
    if (!text.trim() || !addr) return;
    setItems((p) => [
      { id: `local_${Date.now()}`, marketId, user: addr, body: text.trim(), createdAt: Math.floor(Date.now() / 1000) },
      ...p,
    ]);
    setText("");
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Discussion <span className="text-foreground/40">({items.length})</span></h3>
      {addr ? (
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && post()}
            placeholder="Share your read…"
            className="flex-1 rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <button onClick={post} className="rounded-md bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-dark">
            Post
          </button>
        </div>
      ) : (
        <button onClick={connect} className="text-sm font-medium text-primary hover:text-primary-dark">
          Connect to join the discussion →
        </button>
      )}
      <ul className="space-y-3">
        {items.map((c) => (
          <li key={c.id} className="flex gap-3">
            <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-muted text-xs font-semibold">
              {c.user.slice(0, 2)}
            </span>
            <div className="min-w-0">
              <div className="text-xs text-foreground/50">
                {shortAddr(c.user)} · {ago(c.createdAt)} ago
              </div>
              <p className="text-sm">{c.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
