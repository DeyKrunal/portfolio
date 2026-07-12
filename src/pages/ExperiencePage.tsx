import { Briefcase } from "lucide-react";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import { EmptyState } from "@/components/common/EmptyState";
import { useSeo } from "@/hooks/useSeo";
import type { ExperienceEntry } from "@/types/content";

function formatRange(start: string, end: string | null) {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString(undefined, { month: "short", year: "numeric" });
  return `${fmt(start)} — ${end ? fmt(end) : "Present"}`;
}

export function ExperiencePage() {
  useSeo({ title: "Experience", path: "/experience" });
  const { data: entries, isLoading } = useFirestoreCollection<ExperienceEntry>(
    "experience",
    "order"
  );

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-[--font-display] text-[length:--text-3xl] font-semibold tracking-tight">
        Experience
      </h1>

      {isLoading && (
        <div className="mt-8 space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-[--radius-lg] bg-[--color-bg-subtle]" />
          ))}
        </div>
      )}

      {!isLoading && (!entries || entries.length === 0) && (
        <div className="mt-8">
          <EmptyState
            icon={Briefcase}
            title="No experience entries yet"
            description="Add roles from Admin → Experience. Each entry supports achievements, tech stack, and a company logo."
          />
        </div>
      )}

      {entries && entries.length > 0 && (
        <ol className="mt-10 space-y-10 border-l border-[--color-border] pl-6">
          {entries.map((entry) => (
            <li key={entry.id} className="relative">
              <span className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full bg-[--color-accent]" />
              <p className="text-xs font-medium uppercase tracking-wide text-[--color-text-faint]">
                {formatRange(entry.startDate, entry.endDate)}
              </p>
              <h2 className="mt-1 font-[--font-display] text-lg font-semibold">
                {entry.role} · {entry.company}
              </h2>
              {entry.location && (
                <p className="text-sm text-[--color-text-faint]">{entry.location}</p>
              )}
              <p className="mt-2 text-sm text-[--color-text-muted]">{entry.description}</p>
              {entry.achievements.length > 0 && (
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[--color-text-muted]">
                  {entry.achievements.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              )}
              {entry.technologies.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {entry.technologies.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-[--color-border] px-2.5 py-0.5 text-xs"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
