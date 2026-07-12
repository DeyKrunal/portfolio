import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import { SanitizedMarkdown } from "@/components/common/SanitizedMarkdown";
import { useSeo } from "@/hooks/useSeo";
import type { BlogPostEntry } from "@/types/content";

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: posts, isLoading } = useFirestoreCollection<BlogPostEntry>(
    "blogPosts",
    "order"
  );

  const post = posts?.find((p) => p.slug === slug && p.status === "published");

  useSeo({
    title: post?.title ?? "Blog",
    description: post?.excerpt,
    image: post?.coverImageUrl ?? undefined,
    path: `/blog/${slug}`,
  });

  if (isLoading) {
    return (
      <article className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <div className="h-8 w-2/3 animate-pulse rounded bg-[--color-bg-subtle]" />
        <div className="mt-6 h-64 animate-pulse rounded-[--radius-lg] bg-[--color-bg-subtle]" />
      </article>
    );
  }

  // Drafts and unknown slugs both fall through to the same redirect --
  // visitors shouldn't be able to distinguish "doesn't exist" from
  // "exists but isn't published yet" by probing URLs.
  if (!isLoading && !post) {
    return <Navigate to="/blog" replace />;
  }

  if (!post) return null;

  return (
    <article className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <Link to="/blog" className="flex items-center gap-1.5 text-sm text-[--color-accent] hover:underline">
        <ArrowLeft size={14} /> All posts
      </Link>

      <h1 className="mt-6 font-[--font-display] text-[length:--text-3xl] font-semibold tracking-tight text-balance">
        {post.title}
      </h1>

      <div className="mt-3 flex items-center gap-3 text-sm text-[--color-text-faint]">
        {post.publishedAt && (
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString(undefined, { dateStyle: "long" })}
          </time>
        )}
        <span>·</span>
        <span>{post.readingTimeMinutes} min read</span>
        {post.category && (
          <>
            <span>·</span>
            <span>{post.category}</span>
          </>
        )}
      </div>

      {post.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[--color-accent]/10 px-2.5 py-0.5 text-xs text-[--color-accent]"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {post.coverImageUrl && (
        <img
          src={post.coverImageUrl}
          alt=""
          className="mt-8 aspect-[21/9] w-full rounded-[--radius-lg] object-cover"
        />
      )}

      <div className="mt-8">
        <SanitizedMarkdown markdown={post.contentMdx} />
      </div>
    </article>
  );
}
