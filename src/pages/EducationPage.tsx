import { GraduationCap } from "lucide-react";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import { EmptyState } from "@/components/common/EmptyState";
import { useSeo } from "@/hooks/useSeo";
import type { EducationEntry } from "@/types/content";

function formatRange(start: string, end: string | null) {
  const fmt = (d: string) => new Date(d).getFullYear();
  return `${fmt(start)} — ${end ? fmt(end) : "Present"}`;
}

export function EducationPage() {
  useSeo({ title: "Education", path: "/education" });

  const { data: entries, isLoading } = useFirestoreCollection<EducationEntry>(
    "education",
    "order"
  );

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-[--font-display] text-[length:--text-3xl] font-semibold tracking-tight">
        Education
      </h1>

      {isLoading && (
        <div className="mt-8 space-y-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-[--radius-lg] bg-[--color-bg-subtle]" />
          ))}
        </div>
      )}

      {!isLoading && (!entries || entries.length === 0) && (
        <div className="mt-8">
          <EmptyState
            icon={GraduationCap}
            title="No education entries yet"
            description="Add institutions, degrees, and activities from Admin → Education."
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
                {entry.degree}
                {entry.major ? ` in ${entry.major}` : ""}
              </h2>
              <p className="text-sm text-[--color-text-faint]">{entry.institution}</p>
              {entry.cgpa && (
                <p className="mt-1 text-sm text-[--color-text-muted]">CGPA: {entry.cgpa}</p>
              )}
              {entry.achievements.length > 0 && (
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[--color-text-muted]">
                  {entry.achievements.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              )}
              {entry.activities.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {entry.activities.map((a) => (
                    <span
                      key={a}
                      className="rounded-full border border-[--color-border] px-2.5 py-0.5 text-xs"
                    >
                      {a}
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
