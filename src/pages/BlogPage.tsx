import { Link } from "react-router-dom";
import { Notebook } from "lucide-react";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import { EmptyState } from "@/components/common/EmptyState";
import { useSeo } from "@/hooks/useSeo";
import type { BlogPostEntry } from "@/types/content";

export function BlogPage() {
  useSeo({ title: "Blog", path: "/blog" });
  const { data: posts, isLoading } = useFirestoreCollection<BlogPostEntry>(
    "blogPosts",
    "order"
  );
  const published = posts
    ?.filter((p) => p.status === "published")
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[--color-accent-from]">
        Writing
      </p>
      <h1 className="font-[--font-display] text-[length:--text-3xl] font-bold tracking-tight">
        Blog
      </h1>

      {isLoading && (
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-[--radius-lg] bg-[--color-bg-subtle]" />
          ))}
        </div>
      )}

      {!isLoading && (!published || published.length === 0) && (
        <div className="mt-8">
          <EmptyState
            icon={Notebook}
            title="No posts published yet"
            description="Write and publish from Admin → Blog."
          />
        </div>
      )}

      {published && published.length > 0 && (
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {published.map((post) => (
            <Link key={post.id} to={`/blog/${post.slug}`} className="card-premium group overflow-hidden">
              {post.coverImageUrl ? (
                <div className="aspect-[16/9] overflow-hidden bg-[--color-bg-subtle]">
                  <img
                    src={post.coverImageUrl}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="aspect-[16/9] bg-gradient-to-br from-[--color-accent-from]/10 to-[--color-accent-to]/10" />
              )}
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-[--color-text-faint]">
                  {post.category && (
                    <span className="rounded-full bg-[--color-accent-from]/10 px-2 py-0.5 font-medium text-[--color-accent-from]">
                      {post.category}
                    </span>
                  )}
                  {post.publishedAt && (
                    <time dateTime={post.publishedAt}>
                      {new Date(post.publishedAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
                    </time>
                  )}
                  <span>·</span>
                  <span>{post.readingTimeMinutes} min read</span>
                </div>
                <h2 className="mt-2 font-[--font-display] text-lg font-semibold group-hover:text-[--color-accent-from]">
                  {post.title}
                </h2>
                <p className="mt-1.5 line-clamp-2 text-sm text-[--color-text-muted]">{post.excerpt}</p>
                {post.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[--color-border] px-2 py-0.5 text-[11px] text-[--color-text-faint]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
