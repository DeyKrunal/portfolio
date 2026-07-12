import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Flame, Star, GitBranch, TrendingUp } from "lucide-react";
import { useGithubSnapshot } from "@/hooks/useGithub";
import { ContributionHeatmap } from "@/components/common/ContributionHeatmap";
import { useSeo } from "@/hooks/useSeo";

export function GithubAnalyticsPage() {
  useSeo({ title: "GitHub Analytics", path: "/analytics" });

  const { data, isLoading, error } = useGithubSnapshot();

  if (isLoading) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="h-96 animate-pulse rounded-[--radius-lg] bg-[--color-bg-subtle]" />
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <p className="rounded-[--radius-md] border border-[--color-accent-warn]/30 bg-[--color-accent-warn]/5 px-4 py-3 text-sm text-[--color-accent-warn]">
          GitHub data hasn't synced yet. Run <code>npm run fetch:github</code> or wait for the
          sync Action to complete.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="font-[--font-display] text-[length:--text-3xl] font-semibold tracking-tight">
        GitHub Analytics
      </h1>
      <p className="mt-2 text-[--color-text-muted]">
        Live numbers, synced every 6 hours — nothing here is hand-maintained.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-[--radius-lg] border border-[--color-border] bg-[--color-border] sm:grid-cols-4">
        <Stat icon={<Star size={14} />} label="Total stars" value={data.totalStars} />
        <Stat icon={<GitBranch size={14} />} label="Repositories" value={data.profile.publicRepos} />
        <Stat icon={<Flame size={14} />} label="Current streak" value={`${data.currentStreak}d`} />
        <Stat icon={<TrendingUp size={14} />} label="Longest streak" value={`${data.longestStreak}d`} />
      </div>

      <div className="mt-10">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[--color-text-faint]">
          {data.contributionCalendar.totalContributions} contributions in the last year
        </h2>
        <div className="rounded-[--radius-lg] border border-[--color-border] bg-[--color-surface] p-5">
          <ContributionHeatmap days={data.contributionCalendar.days} />
        </div>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-[--radius-lg] border border-[--color-border] bg-[--color-surface] p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[--color-text-faint]">
            Top languages
          </h2>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data.topLanguages}
                  dataKey="percent"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {data.topLanguages.map((lang) => (
                    <Cell key={lang.name} fill={lang.color ?? "#999"} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "rgb(var(--color-surface))",
                    border: "1px solid rgb(var(--color-border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(value, name) => [`${value}%`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[--color-text-muted]">
            {data.topLanguages.map((lang) => (
              <li key={lang.name} className="flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: lang.color ?? "#999" }}
                />
                {lang.name} · {lang.percent}%
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[--radius-lg] border border-[--color-border] bg-[--color-surface] p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[--color-text-faint]">
            Most starred
          </h2>
          <ol className="space-y-3">
            {[...data.repositories]
              .sort((a, b) => b.stargazerCount - a.stargazerCount)
              .slice(0, 5)
              .map((repo, i) => (
                <li key={repo.id} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="text-[--color-text-faint]">{i + 1}</span>
                    {repo.name}
                  </span>
                  <span className="flex items-center gap-1 text-[--color-text-muted]">
                    <Star size={12} /> {repo.stargazerCount}
                  </span>
                </li>
              ))}
          </ol>
        </div>
      </div>

      <p className="mt-8 text-xs text-[--color-text-faint]">
        Last synced{" "}
        {new Date(data.generatedAt).toLocaleString(undefined, {
          dateStyle: "medium",
          timeStyle: "short",
        })}
      </p>
    </section>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="bg-[--color-surface] p-5">
      <div className="flex items-center gap-1.5 text-[--color-text-faint]">
        {icon}
        <span className="text-xs uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-2 font-[--font-display] text-[length:--text-2xl] font-semibold">{value}</p>
    </div>
  );
}
