import type { Fixture } from "@/lib/types";
import { LiveDot } from "./ui";

export function FixtureLine({ fixture, big }: { fixture: Fixture; big?: boolean }) {
  const showScore = fixture.status !== "scheduled";
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 min-w-0">
        <span className={big ? "font-display text-2xl" : "font-semibold text-sm"}>{fixture.homeShort}</span>
        {showScore ? (
          <span className={big ? "font-display text-2xl text-primary" : "text-sm font-bold text-primary"}>
            {fixture.homeGoals}–{fixture.awayGoals}
          </span>
        ) : (
          <span className="text-foreground/30 text-xs">vs</span>
        )}
        <span className={big ? "font-display text-2xl" : "font-semibold text-sm"}>{fixture.awayShort}</span>
      </div>
      <div className="shrink-0">
        {fixture.status === "live" && <LiveDot label={`${fixture.minute}'`} />}
        {fixture.status === "finished" && <span className="text-xs font-medium text-foreground/40">FT</span>}
        {fixture.status === "scheduled" && (
          <span className="text-xs text-foreground/40">
            {new Date(fixture.kickoff * 1000).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
          </span>
        )}
      </div>
    </div>
  );
}
