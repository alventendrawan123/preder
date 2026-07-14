import type { Resolution } from "@/lib/types";
import { Card } from "./ui";
import { shortAddr } from "@/lib/format";
import { ShieldCheck, ExternalLink } from "lucide-react";

// Honest disclosure (kickoff §8 / architecture §4, round-4 correction + keeper-attested model):
// what is verified is the PREDICATE against the TxLINE Merkle proof, checked OFF-CHAIN by the
// keeper. Match finality itself is keeper-attested. Do NOT claim "fully trustless finality".
export function VerifiableResolution({ resolution }: { resolution: Resolution }) {
  const rows: [string, React.ReactNode][] = [
    ["Fixture ID", resolution.fixtureId.toString()],
    ["Stat keys", resolution.statKeys],
    ["Score seq", resolution.seq.toString()],
    ["Proof timestamp", new Date(resolution.timestamp * 1000).toUTCString()],
    ["Proof hash", <code key="h" className="break-all text-xs">{resolution.proofHash}</code>],
    ["Settled by (keeper)", shortAddr(resolution.keeper)],
  ];
  return (
    <Card className="p-5 border-primary/30">
      <div className="flex items-center gap-2 mb-1">
        <ShieldCheck size={18} className="text-primary" />
        <h3 className="font-semibold">Verifiable Resolution</h3>
      </div>
      <p className="text-xs text-foreground/60 mb-4">
        Predicate <span className="font-medium text-foreground">{resolution.verifiedBy}</span> against
        the TxLINE Merkle proof for this fixture. Match finalisation is attested by the keeper shown
        below — not a claim of fully trustless finality.
      </p>
      <dl className="divide-y divide-border">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-start justify-between gap-4 py-2 text-sm">
            <dt className="text-foreground/50 shrink-0">{k}</dt>
            <dd className="text-right font-medium max-w-[65%]">{v}</dd>
          </div>
        ))}
      </dl>
      <a
        href={`https://explorer.solana.com/tx/${resolution.settleTx}?cluster=devnet`}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark"
      >
        View settle transaction <ExternalLink size={14} />
      </a>
    </Card>
  );
}
