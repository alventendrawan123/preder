"use client";

// Create Market (mock). INTEGRATION POINT: fixtures from /api/fixtures/snapshot; on submit,
// build create_market() with predicate legs derived from the chosen template. Labels are
// honest about binary yes/no framing (kickoff §8): a draw folds into the NO side.
import { useState } from "react";
import { fixtures, communities } from "@/lib/mock";
import type { PredicateTemplate, Fixture } from "@/lib/types";
import { useWallet } from "@/components/wallet-button";
import { Card } from "@/components/ui";

const TEMPLATES: { id: PredicateTemplate; name: string; labels: (f: Fixture) => [string, string]; note: string }[] = [
  { id: "match_winner", name: "Match Winner (home)", labels: (f) => [`${f.homeShort} wins`, `Draw or ${f.awayShort}`], note: "Binary: a draw counts as NO." },
  { id: "total_goals_over", name: "Total Goals Over 2.5", labels: () => ["3+ total goals", "2 or fewer goals"], note: "Settles on final goal total." },
  { id: "both_teams_score", name: "Both Teams To Score", labels: () => ["Both teams score", "At least one blanks"], note: "" },
  { id: "draw", name: "Draw", labels: () => ["Match ends level", "A team wins"], note: "" },
  { id: "clean_sheet", name: "Home Clean Sheet", labels: (f) => [`${f.awayShort} fails to score`, `${f.awayShort} scores`], note: "" },
];

export default function CreatePage() {
  const { addr, connect } = useWallet();
  const [fixtureId, setFixtureId] = useState<number>(fixtures[0].fixtureId);
  const [tpl, setTpl] = useState<PredicateTemplate>("match_winner");
  const [community, setCommunity] = useState<string>(communities[0].id);
  const [minStake, setMinStake] = useState("1");
  const [done, setDone] = useState(false);

  const fixture = fixtures.find((f) => f.fixtureId === fixtureId)!;
  const template = TEMPLATES.find((t) => t.id === tpl)!;
  const [yesLabel, noLabel] = template.labels(fixture);

  return (
    <div className="py-8 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-4xl">CREATE MARKET</h1>
        <p className="text-foreground/60 mt-1">Pick a live TxLINE fixture and a settlement template.</p>
      </div>

      <Card className="p-5 space-y-5">
        <Field label="Community">
          <select value={community} onChange={(e) => setCommunity(e.target.value)} className="input">
            {communities.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </Field>

        <Field label="Fixture (TxLINE)">
          <select value={fixtureId} onChange={(e) => setFixtureId(Number(e.target.value))} className="input">
            {fixtures.map((f) => (
              <option key={f.fixtureId} value={f.fixtureId}>
                {f.home} vs {f.away} · #{f.fixtureId} · {f.status}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Template">
          <div className="grid sm:grid-cols-2 gap-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTpl(t.id)}
                className={
                  "text-left rounded-md border px-3 py-2 text-sm transition-all " +
                  (tpl === t.id ? "border-primary bg-primary/5 font-semibold" : "border-border hover:border-foreground/30")
                }
              >
                {t.name}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Minimum stake (USDC)">
          <input value={minStake} onChange={(e) => setMinStake(e.target.value.replace(/[^0-9.]/g, ""))} className="input" />
        </Field>

        {/* Honest preview */}
        <div className="rounded-md bg-muted/60 p-4 space-y-2">
          <div className="text-xs font-medium uppercase tracking-wide text-foreground/40">Preview</div>
          <div className="flex gap-2">
            <span className="flex-1 rounded-md bg-success/10 text-success text-sm font-semibold px-3 py-2 text-center">
              YES · {yesLabel}
            </span>
            <span className="flex-1 rounded-md bg-primary/10 text-primary-dark text-sm font-semibold px-3 py-2 text-center">
              NO · {noLabel}
            </span>
          </div>
          {template.note && <p className="text-xs text-foreground/50">{template.note}</p>}
        </div>

        {!addr ? (
          <button onClick={connect} className="w-full rounded-md bg-primary py-2.5 font-semibold text-white hover:bg-primary-dark">
            Connect to create
          </button>
        ) : done ? (
          <div className="rounded-md bg-success/10 py-2.5 text-center text-sm font-semibold text-success">
            Market drafted (mock) — wire to create_market() next.
          </div>
        ) : (
          <button onClick={() => setDone(true)} className="w-full rounded-md bg-primary py-2.5 font-semibold text-white hover:bg-primary-dark">
            Create market
          </button>
        )}
      </Card>

      <style>{`.input{width:100%;border:1px solid #E7E7E9;border-radius:10px;padding:0.5rem 0.75rem;font-size:0.95rem;outline:none;background:#fff}.input:focus{border-color:#FF6B35}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-foreground/50">{label}</label>
      {children}
    </div>
  );
}
