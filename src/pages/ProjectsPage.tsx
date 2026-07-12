import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import { Search } from "lucide-react";
import { useGithubSnapshot } from "@/hooks/useGithub";
import { RepoCard } from "@/components/common/RepoCard";
import { RepoCardSkeleton } from "@/components/common/RepoCardSkeleton";
import { cn } from "@/lib/cn";
import { useSeo } from "@/hooks/useSeo";
import type { ProjectCategory } from "@/types/github";

export function ProjectsPage() {
  useSeo({ title: "Projects", path: "/projects" });
  const { data, isLoading } = useGithubSnapshot();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ProjectCategory | "All">("All");

  const repos = useMemo(
    () => (data?.repositories ?? []).filter((r) => !r.isFork && !r.isArchived),
    [data]
  );

  const categories = useMemo(() => {
    const set = new Set(repos.map((r) => r.category));
    return ["All", ...Array.from(set)] as const;
  }, [repos]);

  const fuse = useMemo(
    () =>
      new Fuse(repos, {
        keys: ["name", "description", "topics", "primaryLanguage"],
        threshold: 0.35,
      }),
    [repos]
  );

  const filtered = useMemo(() => {
    let result = query ? fuse.search(query).map((r) => r.item) : repos;
    if (category !== "All") {
      result = result.filter((r) => r.category === category);
    }
    return result;
  }, [query, category, fuse, repos]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="font-[--font-display] text-[length:--text-3xl] font-semibold tracking-tight">
        Projects
      </h1>
      <p className="mt-2 max-w-xl text-[--color-text-muted]">
        Every project here is pulled automatically from GitHub — no manual entry, always current.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[--color-text-faint]"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects by name, language, or topic..."
            aria-label="Search projects"
            className="w-full rounded-full border border-[--color-border] bg-[--color-surface] py-2.5 pl-10 pr-4 text-sm outline-none focus-visible:border-[--color-accent]"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                category === c
                  ? "border-[--color-accent] bg-[--color-accent]/10 text-[--color-accent]"
                  : "border-[--color-border] text-[--color-text-muted] hover:text-[--color-text]"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading && Array.from({ length: 9 }).map((_, i) => <RepoCardSkeleton key={i} />)}
        {!isLoading && filtered.length === 0 && (
          <p className="col-span-full py-12 text-center text-sm text-[--color-text-muted]">
            No projects match "{query}". Try a different search term.
          </p>
        )}
        {filtered.map((repo) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </div>
    </section>
  );
}
