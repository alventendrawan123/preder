"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { WalletButton } from "./wallet-button";

const nav = [
  { href: "/", label: "Communities" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/create", label: "Create" },
];

export function SiteHeader() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto max-w-container px-4 md:px-8 h-16 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-white font-display text-xl leading-none">
            P
          </span>
          <span className="font-display text-2xl tracking-wide">PREDER</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1 ml-2">
          {nav.map((n) => {
            const active = n.href === "/" ? path === "/" : path.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  active ? "bg-muted text-foreground" : "text-foreground/60 hover:text-foreground hover:bg-muted/60"
                )}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto">
          <WalletButton />
        </div>
      </div>
    </header>
  );
}
