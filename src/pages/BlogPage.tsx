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
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-[--font-display] text-[length:--text-3xl] font-semibold tracking-tight">
        Blog
      </h1>

      {isLoading && (
        <div className="mt-8 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-[--radius-lg] bg-[--color-bg-subtle]" />
          ))}
        </div>
      )}

      {!isLoading && (!published || published.length === 0) && (
        <div className="mt-8">
          <EmptyState
            icon={Notebook}
            title="No posts published yet"
            description="Write and publish from Admin → Blog. Supports MDX, code highlighting, and Mermaid diagrams."
          />
        </div>
      )}

      {published && published.length > 0 && (
        <div className="mt-8 divide-y divide-[--color-border]">
          {published.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="block py-6 first:pt-0 group"
            >
              <p className="text-xs text-[--color-text-faint]">
                {post.publishedAt &&
                  new Date(post.publishedAt).toLocaleDateString(undefined, {
                    dateStyle: "long",
                  })}{" "}
                · {post.readingTimeMinutes} min read
              </p>
              <h2 className="mt-1 font-[--font-display] text-lg font-semibold group-hover:text-[--color-accent]">
                {post.title}
              </h2>
              <p className="mt-1.5 text-sm text-[--color-text-muted]">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
