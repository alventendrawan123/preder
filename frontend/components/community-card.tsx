import Link from "next/link";
import type { Community } from "@/lib/types";
import { Card } from "./ui";
import { Users } from "lucide-react";

export function CommunityCard({ community }: { community: Community }) {
  return (
    <Link href={`/community/${community.id}`}>
      <Card className="p-5 hover:shadow-md transition-shadow h-full">
        <div className="flex items-center gap-3">
          <span
            className="grid h-11 w-11 place-items-center rounded-lg font-display text-xl text-white"
            style={{ background: community.avatarColor }}
          >
            {community.name.slice(0, 1)}
          </span>
          <div className="min-w-0">
            <h3 className="font-semibold truncate">{community.name}</h3>
            <div className="flex items-center gap-1 text-xs text-foreground/50">
              <Users size={12} /> {community.memberCount.toLocaleString()} members · {community.marketCount} markets
            </div>
          </div>
        </div>
        <p className="mt-3 text-sm text-foreground/60 line-clamp-2">{community.description}</p>
      </Card>
    </Link>
  );
}
