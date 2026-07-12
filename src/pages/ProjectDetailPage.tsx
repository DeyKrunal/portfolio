import { useParams, Link, Navigate } from "react-router-dom";
import { Star, GitFork, ExternalLink, Tag, AlertCircle } from "lucide-react";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { useRepository } from "@/hooks/useGithub";
import { RepoCardSkeleton } from "@/components/common/RepoCardSkeleton";
import { useSeo } from "@/hooks/useSeo";

export function ProjectDetailPage() {
  const { name } = useParams<{ name: string }>();
  const { data: repo, isLoading, error } = useRepository(name ?? "");
  useSeo({
    title: repo?.name ?? name ?? "Project",
    description: repo?.description ?? undefined,
    path: `/projects/${name}`,
  });

  if (isLoading) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <RepoCardSkeleton />
      </section>
    );
  }

  if (!isLoading && !error && !repo) {
    return <Navigate to="/projects" replace />;
  }

  if (!repo) return null;

  return (
    <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <Link to="/projects" className="text-sm text-[--color-accent] hover:underline">
        ← All projects
      </Link>

      <img
        src={repo.ogImageUrl}
        alt=""
        loading="lazy"
        className="mt-6 aspect-[40/21] w-full rounded-[--radius-lg] border border-[--color-border] object-cover"
        onError={(e) => {
          // GitHub's OG image endpoint 404s for brand-new or very small
          // repos that haven't been rendered yet -- hide gracefully
          // instead of showing a broken image icon.
          e.currentTarget.style.display = "none";
        }}
      />

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-[--font-display] text-[length:--text-3xl] font-semibold tracking-tight">
            {repo.name}
          </h1>
          <p className="mt-2 max-w-2xl text-[--color-text-muted]">
            {repo.description || "No description provided."}
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href={repo.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-full border border-[--color-border] px-4 py-2 text-sm font-medium hover:bg-[--color-bg-subtle]"
          >
            <GithubIcon width={15} height={15} /> Source
          </a>
          {repo.homepageUrl && (
            <a
              href={repo.homepageUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full bg-[--color-accent] px-4 py-2 text-sm font-medium text-[--color-accent-contrast]"
            >
              <ExternalLink size={15} /> Live demo
            </a>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 flex flex-wrap gap-6 border-y border-[--color-border] py-4 text-sm text-[--color-text-muted]">
        <span className="flex items-center gap-1.5">
          <Star size={14} /> {repo.stargazerCount} stars
        </span>
        <span className="flex items-center gap-1.5">
          <GitFork size={14} /> {repo.forkCount} forks
        </span>
        <span className="flex items-center gap-1.5">
          <AlertCircle size={14} /> {repo.openIssuesCount} open issues
        </span>
        {repo.latestRelease && (
          <span className="flex items-center gap-1.5">
            <Tag size={14} /> {repo.latestRelease.tagName}
          </span>
        )}
      </div>

      {/* Languages */}
      {repo.languages.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[--color-text-faint]">
            Languages
          </h2>
          <div className="flex h-2 w-full overflow-hidden rounded-full bg-[--color-bg-subtle]">
            {repo.languages.map((lang) => (
              <div
                key={lang.name}
                style={{ width: `${lang.percent}%`, backgroundColor: lang.color ?? "#999" }}
                title={`${lang.name} ${lang.percent}%`}
              />
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[--color-text-muted]">
            {repo.languages.map((lang) => (
              <span key={lang.name} className="flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: lang.color ?? "#999" }}
                />
                {lang.name} · {lang.percent}%
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tech stack detected from package.json */}
      {repo.detectedStack.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[--color-text-faint]">
            Tech stack
          </h2>
          <div className="flex flex-wrap gap-2">
            {repo.detectedStack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-[--color-border] px-3 py-1 text-xs"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Topics */}
      {repo.topics.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {repo.topics.map((topic) => (
            <span
              key={topic}
              className="rounded-full bg-[--color-accent]/10 px-3 py-1 text-xs text-[--color-accent]"
            >
              #{topic}
            </span>
          ))}
        </div>
      )}

      {/* Contributors */}
      {repo.contributors.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[--color-text-faint]">
            Contributors
          </h2>
          <div className="flex -space-x-2">
            {repo.contributors.map((c) => (
              <a
                key={c.login}
                href={`https://github.com/${c.login}`}
                target="_blank"
                rel="noreferrer"
                title={`${c.login} · ${c.contributions} commits`}
              >
                <img
                  src={c.avatarUrl}
                  alt={c.login}
                  width={32}
                  height={32}
                  loading="lazy"
                  className="h-8 w-8 rounded-full border-2 border-[--color-bg]"
                />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* README */}
      {repo.readmeRaw && (
        <div className="mt-12">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[--color-text-faint]">
            README
          </h2>
          <div className="rounded-[--radius-lg] border border-[--color-border] bg-[--color-surface] p-6">
            {/* README is rendered as plain preformatted text here to avoid
                shipping an HTML-injection surface. Swap in a sanitizing
                markdown renderer (e.g. react-markdown + rehype-sanitize)
                if rich rendering is desired later. */}
            <pre className="max-h-[32rem] overflow-auto whitespace-pre-wrap font-[--font-mono] text-xs text-[--color-text-muted]">
              {repo.readmeRaw}
            </pre>
          </div>
        </div>
      )}
    </article>
  );
}
