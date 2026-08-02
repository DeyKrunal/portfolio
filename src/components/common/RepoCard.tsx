import { Link } from "react-router-dom";
import { Star, GitFork, ExternalLink } from "lucide-react";
import type { Repository } from "@/types/github";
import { cn } from "@/lib/cn";

// Kept deliberately restrained: most categories share a calm neutral tag,
// with color reserved for a handful of categories where it adds real
// signal (Frontend/Backend/Full Stack/AI/ML/CLI/API) rather than forcing
// a distinct hue onto all 15.
const CATEGORY_STYLES: Record<string, string> = {
  Frontend: "bg-[--color-accent-from]/10 text-[--color-accent-from]",
  Library: "bg-[--color-accent-from]/10 text-[--color-accent-from]",
  Backend: "bg-[--color-accent-to]/10 text-[--color-accent-to]",
  Tool: "bg-[--color-accent-to]/10 text-[--color-accent-to]",
  AI: "bg-[--color-cyan]/10 text-[--color-cyan]",
  ML: "bg-[--color-cyan]/10 text-[--color-cyan]",
  CLI: "bg-[--color-success]/10 text-[--color-success]",
  API: "bg-[--color-success]/10 text-[--color-success]",
  Mobile: "bg-[--color-text-faint]/10 text-[--color-text-faint]",
  Desktop: "bg-[--color-text-faint]/10 text-[--color-text-faint]",
  Game: "bg-[--color-text-faint]/10 text-[--color-text-faint]",
  Utility: "bg-[--color-text-faint]/10 text-[--color-text-faint]",
  Research: "bg-[--color-text-faint]/10 text-[--color-text-faint]",
  Other: "bg-[--color-text-faint]/10 text-[--color-text-faint]",
};

export function RepoCard({ repo, featured = false }: { repo: Repository; featured?: boolean }) {
  const isFullStack = repo.category === "Full Stack";

  return (
    <Link
      to={`/projects/${repo.name}`}
      className={cn(
        "card-premium group relative flex flex-col overflow-hidden",
        featured && "sm:col-span-2"
      )}
    >
      {featured && (
        <div className="relative aspect-[21/9] overflow-hidden bg-[--color-bg-subtle]">
          <img
            src={repo.ogImageUrl}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <span className="absolute left-4 top-4 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
            Featured
          </span>
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3
            className={cn(
              "font-[--font-display] font-semibold text-[--color-text] transition-colors group-hover:text-[--color-accent-from]",
              featured ? "text-lg" : "text-base"
            )}
          >
            {repo.name}
          </h3>
          <span
            className={cn(
              "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
              isFullStack
                ? "bg-gradient-to-r from-[--color-accent-from] to-[--color-accent-to] text-white"
                : (CATEGORY_STYLES[repo.category] ?? CATEGORY_STYLES.Other)
            )}
          >
            {repo.category}
          </span>
        </div>

        <p className={cn("text-sm text-[--color-text-muted]", featured ? "line-clamp-3" : "line-clamp-2")}>
          {repo.description || "No description provided."}
        </p>

        <div className="mt-auto flex items-center gap-4 pt-2 text-xs text-[--color-text-faint]">
          {repo.primaryLanguage && (
            <span className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: repo.languages[0]?.color ?? "#999" }}
              />
              {repo.primaryLanguage}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Star size={12} /> {repo.stargazerCount}
          </span>
          <span className="flex items-center gap-1">
            <GitFork size={12} /> {repo.forkCount}
          </span>
          {repo.homepageUrl && (
            <span className="ml-auto flex items-center gap-1 text-[--color-accent-from]">
              <ExternalLink size={12} /> Live
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
