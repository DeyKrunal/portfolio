import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Layers } from "lucide-react";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import { EmptyState } from "@/components/common/EmptyState";
import { useSeo } from "@/hooks/useSeo";
import type { SkillEntry } from "@/types/content";

const CATEGORY_COLORS: Record<string, string> = {
  Frontend: "#2563eb",
  Backend: "#7c3aed",
  AI: "#db2777",
  "Machine Learning": "#e11d48",
  Cloud: "#0891b2",
  DevOps: "#d97706",
  Security: "#dc2626",
  Programming: "#059669",
  Database: "#4f46e5",
  Testing: "#65a30d",
  Tools: "#64748b",
};

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
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="font-[--font-display] text-[length:--text-3xl] font-semibold tracking-tight">
        Skills
      </h1>
      <p className="mt-2 text-[--color-text-muted]">
        Proficiency is self-rated and weighted by real project usage, not certification badges.
      </p>

      {isLoading && (
        <div className="mt-8 h-64 animate-pulse rounded-[--radius-lg] bg-[--color-bg-subtle]" />
      )}

      {!isLoading && (!skills || skills.length === 0) && (
        <div className="mt-8">
          <EmptyState
            icon={Layers}
            title="No skills added yet"
            description="Add skills from Admin → Skills, grouped by category with a proficiency level and project count."
          />
        </div>
      )}

      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="mt-10">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[--color-text-faint]">
            {category}
          </h2>
          <div style={{ width: "100%", height: items.length * 44 + 20 }}>
            <ResponsiveContainer>
              <BarChart
                data={items}
                layout="vertical"
                margin={{ left: 8, right: 24, top: 4, bottom: 4 }}
              >
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={130}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "rgb(var(--color-text-muted))", fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: "rgb(var(--color-bg-subtle))" }}
                  contentStyle={{
                    background: "rgb(var(--color-surface))",
                    border: "1px solid rgb(var(--color-border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(value, _name, item) => [
                    `${value}% · ${item.payload.yearsExperience}y · ${item.payload.projectsUsingSkill} projects`,
                    "Proficiency",
                  ]}
                />
                <Bar dataKey="level" radius={[0, 6, 6, 0]} maxBarSize={18} animationDuration={500}>
                  {items.map((item) => (
                    <Cell key={item.id} fill={CATEGORY_COLORS[category] ?? "#64748b"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </section>
  );
}
