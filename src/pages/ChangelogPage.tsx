import { useSeo } from "@/hooks/useSeo";

interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
}

// Hand-maintained. Add an entry here whenever you ship something worth noting.
const CHANGELOG: ChangelogEntry[] = [
  {
    version: "0.2.0",
    date: "2026-07-11",
    changes: [
      "Added Skills, Gallery, Testimonials, Resume, Now Playing, Education, Certificates, and Achievements pages",
      "Added GitHub Analytics page with contribution heatmap and language breakdown",
      "Added per-page SEO (dynamic title/meta/canonical)",
    ],
  },
  {
    version: "0.1.0",
    date: "2026-07-10",
    changes: [
      "Initial scaffold: Vite + React 19 + TypeScript + Tailwind",
      "Automated GitHub data sync pipeline (GraphQL + REST → static JSON)",
      "Home, Projects, Project Detail, About, Experience, Blog, Contact pages",
      "GitHub Actions for data sync and build/deploy to GitHub Pages",
      "Firestore/Storage security rules",
    ],
  },
];

export function ChangelogPage() {
  useSeo({ title: "Changelog", path: "/changelog" });

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="font-[--font-display] text-[length:--text-3xl] font-semibold tracking-tight">
        Changelog
      </h1>
      <div className="mt-8 space-y-8">
        {CHANGELOG.map((entry) => (
          <div key={entry.version}>
            <div className="flex items-baseline gap-3">
              <h2 className="font-[--font-display] text-lg font-semibold">v{entry.version}</h2>
              <span className="text-xs text-[--color-text-faint]">{entry.date}</span>
            </div>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[--color-text-muted]">
              {entry.changes.map((change, i) => (
                <li key={i}>{change}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
