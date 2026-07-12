import { Trophy, ExternalLink } from "lucide-react";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import { EmptyState } from "@/components/common/EmptyState";
import { useSeo } from "@/hooks/useSeo";

interface AchievementEntry {
  id: string;
  title: string;
  description: string;
  date: string;
  imageUrl: string | null;
  linkUrl: string | null;
  tags: string[];
  featured: boolean;
  order: number;
}

export function AchievementsPage() {
  useSeo({ title: "Achievements", path: "/achievements" });

  const { data: achievements, isLoading } = useFirestoreCollection<AchievementEntry>(
    "achievements",
    "order"
  );

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="font-[--font-display] text-[length:--text-3xl] font-semibold tracking-tight">
        Achievements
      </h1>

      {isLoading && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-[--radius-lg] bg-[--color-bg-subtle]" />
          ))}
        </div>
      )}

      {!isLoading && (!achievements || achievements.length === 0) && (
        <div className="mt-8">
          <EmptyState
            icon={Trophy}
            title="No achievements added yet"
            description="Add hackathon wins, publications, or awards from Admin → Achievements."
          />
        </div>
      )}

      {achievements && achievements.length > 0 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((a) => (
            <div
              key={a.id}
              className="flex flex-col gap-3 rounded-[--radius-lg] border border-[--color-border] bg-[--color-surface] p-5"
            >
              <div className="flex items-start justify-between">
                <Trophy size={18} className="text-[--color-accent-warn]" />
                {a.featured && (
                  <span className="rounded-full bg-[--color-accent-warn]/10 px-2 py-0.5 text-[10px] font-medium text-[--color-accent-warn]">
                    Featured
                  </span>
                )}
              </div>
              <p className="font-[--font-display] text-sm font-semibold">{a.title}</p>
              <p className="text-xs text-[--color-text-muted]">{a.description}</p>
              <p className="text-xs text-[--color-text-faint]">
                {new Date(a.date).toLocaleDateString(undefined, { dateStyle: "medium" })}
              </p>
              {a.linkUrl && (
                <a
                  href={a.linkUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-auto flex items-center gap-1 text-xs text-[--color-accent] hover:underline"
                >
                  <ExternalLink size={12} /> View
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
