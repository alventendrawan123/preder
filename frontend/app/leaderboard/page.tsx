import { leaderboard } from "@/lib/mock";
import { usdc, shortAddr } from "@/lib/format";
import { Card } from "@/components/ui";

export default function LeaderboardPage() {
  const rows = [...leaderboard].sort((a, b) => b.correct / b.settled - a.correct / a.settled);
  return (
    <div className="py-8 space-y-6">
      <div>
        <h1 className="font-display text-4xl">LEADERBOARD</h1>
        <p className="text-foreground/60 mt-1">
          Accuracy & streaks computed from on-chain <span className="font-medium">Settled</span> /{" "}
          <span className="font-medium">Claimed</span> events (mock data for now).
        </p>
      </div>
      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-foreground/50 border-b border-border">
              <th className="p-3 font-medium">#</th>
              <th className="p-3 font-medium">Predictor</th>
              <th className="p-3 font-medium">Role</th>
              <th className="p-3 font-medium text-right">Accuracy</th>
              <th className="p-3 font-medium text-right">Streak</th>
              <th className="p-3 font-medium text-right">Volume</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const acc = Math.round((r.correct / r.settled) * 100);
              return (
                <tr key={r.user} className="border-b border-border last:border-0 hover:bg-muted/40">
                  <td className="p-3 font-display text-lg text-foreground/40">{i + 1}</td>
                  <td className="p-3">
                    <div className="font-semibold">{r.handle}</div>
                    <div className="text-xs text-foreground/40">{shortAddr(r.user)}</div>
                  </td>
                  <td className="p-3">
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium capitalize">{r.role}</span>
                  </td>
                  <td className="p-3 text-right font-semibold">
                    {acc}% <span className="text-foreground/40 font-normal">({r.correct}/{r.settled})</span>
                  </td>
                  <td className="p-3 text-right">
                    {r.streak > 0 ? <span className="text-success font-semibold">🔥 {r.streak}</span> : "—"}
                  </td>
                  <td className="p-3 text-right">${usdc(r.volume)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
