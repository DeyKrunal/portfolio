import { useMemo } from "react";
import { Layers } from "lucide-react";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import { EmptyState } from "@/components/common/EmptyState";
import { useSeo } from "@/hooks/useSeo";
import type { SkillEntry } from "@/types/content";

/**
 * Deliberately no progress bars or numeric proficiency charts here --
 * skills are shown as clean badge cards grouped by category. The
 * underlying `level` field still exists in the data model, it's just
 * not rendered as a bar/meter.
 */
export function SkillsPage() {
  useSeo({ title: "Skills", path: "/skills" });

  const { data: skills, isLoading } = useFirestoreCollection<SkillEntry>("skills", "order");

  const grouped = useMemo(() => {
    if (!skills) return {} as Record<string, SkillEntry[]>;
    return skills.reduce<Record<string, SkillEntry[]>>((acc, skill) => {
      (acc[skill.category] ??= []).push(skill);
      return acc;
    }, {});
  }, [skills]);

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[--color-accent-from]">
        Capabilities
      </p>
      <h1 className="font-[--font-display] text-[length:--text-3xl] font-bold tracking-tight">
        Skills
      </h1>
      <p className="mt-2 max-w-lg text-[--color-text-muted]">
        Technologies I reach for regularly, grouped by where they show up in real projects.
      </p>

      {isLoading && (
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-[--radius-lg] bg-[--color-bg-subtle]" />
          ))}
        </div>
      )}

      {!isLoading && (!skills || skills.length === 0) && (
        <div className="mt-8">
          <EmptyState
            icon={Layers}
            title="No skills added yet"
            description="Add skills from Admin → Skills, grouped by category with a project count."
          />
        </div>
      )}

      <div className="mt-10 space-y-10">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[--color-text-faint]">
              {category}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((skill) => (
                <div key={skill.id} className="card-premium flex items-center gap-3 p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[--color-accent-from]/10 to-[--color-accent-to]/10">
                    {skill.iconUrl ? (
                      <img src={skill.iconUrl} alt="" className="h-6 w-6 object-contain" />
                    ) : (
                      <span className="font-[--font-display] text-sm font-bold text-[--color-accent-from]">
                        {skill.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{skill.name}</p>
                    <p className="truncate text-xs text-[--color-text-faint]">
                      {skill.yearsExperience > 0 && `${skill.yearsExperience}y · `}
                      {skill.projectsUsingSkill} project{skill.projectsUsingSkill === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
