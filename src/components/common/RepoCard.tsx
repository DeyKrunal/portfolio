import { Link } from "react-router-dom";
import { Star, GitFork, ExternalLink } from "lucide-react";
import type { Repository } from "@/types/github";
import { cn } from "@/lib/cn";

// Category colors are drawn from the site's actual accent tokens
// (green/gold/violet/rust) wherever a category maps naturally onto one,
// with a small curated set of one-off hexes for the remainder -- kept to
// under 8 distinct hues total across 15 categories so it reads as a
// cohesive palette, not a randomized tag-color generator.
const CATEGORY_STYLES: Record<string, string> = {
  Frontend: "bg-[--color-accent]/10 text-[--color-accent]",
  Library: "bg-[--color-accent]/10 text-[--color-accent]",
  Backend: "bg-[--color-accent-alt]/10 text-[--color-accent-alt]",
  Tool: "bg-[--color-accent-alt]/10 text-[--color-accent-alt]",
  "Full Stack": "bg-[--color-accent-violet]/10 text-[--color-accent-violet]",
  Game: "bg-[--color-accent-violet]/10 text-[--color-accent-violet]",
  Research: "bg-[--color-accent-violet]/10 text-[--color-accent-violet]",
  AI: "bg-[--color-accent-warn]/10 text-[--color-accent-warn]",
  ML: "bg-[#D65C8A]/10 text-[#D65C8A]",
  CLI: "bg-[#38B8C7]/10 text-[#38B8C7]",
  API: "bg-[#38B8C7]/10 text-[#38B8C7]",
  Mobile: "bg-[#6C93C7]/10 text-[#6C93C7]",
  Desktop: "bg-[--color-text-faint]/10 text-[--color-text-faint]",
  Utility: "bg-[--color-text-faint]/10 text-[--color-text-faint]",
  Other: "bg-[--color-text-faint]/10 text-[--color-text-faint]",
};

export function RepoCard({ repo }: { repo: Repository }) {
  return (
    <Link
      to={`/projects/${repo.name}`}
      className="group flex flex-col gap-3 rounded-[--radius-lg] border border-[--color-border] bg-[--color-surface] p-5 shadow-[--shadow-sm] transition-all duration-200 hover:-translate-y-0.5 hover:border-[--color-accent]/40 hover:shadow-[--shadow-glow]"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-[--font-display] text-base font-semibold text-[--color-text] group-hover:text-[--color-accent]">
          {repo.name}
        </h3>
        <span
          className={cn(
            "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
            CATEGORY_STYLES[repo.category] ?? CATEGORY_STYLES.Other
          )}
        >
          {repo.category}
        </span>
      </div>

      <p className="line-clamp-2 text-sm text-[--color-text-muted]">
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
          <span className="ml-auto flex items-center gap-1 text-[--color-accent]">
            <ExternalLink size={12} /> Live
          </span>
        )}
      </div>
    </Link>
  );
}
