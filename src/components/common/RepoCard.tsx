import { Link } from "react-router-dom";
import { Star, GitFork, ExternalLink } from "lucide-react";
import type { Repository } from "@/types/github";
import { cn } from "@/lib/cn";

const CATEGORY_STYLES: Record<string, string> = {
  Frontend: "bg-blue-500/10 text-blue-400",
  Backend: "bg-purple-500/10 text-purple-400",
  "Full Stack": "bg-indigo-500/10 text-indigo-400",
  AI: "bg-pink-500/10 text-pink-400",
  ML: "bg-rose-500/10 text-rose-400",
  CLI: "bg-amber-500/10 text-amber-400",
  Mobile: "bg-teal-500/10 text-teal-400",
  Desktop: "bg-cyan-500/10 text-cyan-400",
  Library: "bg-emerald-500/10 text-emerald-400",
  Tool: "bg-lime-500/10 text-lime-500",
  Game: "bg-fuchsia-500/10 text-fuchsia-400",
  API: "bg-orange-500/10 text-orange-400",
  Utility: "bg-slate-500/10 text-slate-400",
  Research: "bg-violet-500/10 text-violet-400",
  Other: "bg-neutral-500/10 text-neutral-400",
};

export function RepoCard({ repo }: { repo: Repository }) {
  return (
    <Link
      to={`/projects/${repo.name}`}
      className="group flex flex-col gap-3 rounded-[--radius-lg] border border-[--color-border] bg-[--color-surface] p-5 shadow-[--shadow-sm] transition-all duration-200 hover:-translate-y-0.5 hover:border-[--color-border-strong] hover:shadow-[--shadow-md]"
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
