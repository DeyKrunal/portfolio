import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Loader2 } from "lucide-react";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import {
  useCreateDoc,
  useUpdateDoc,
  useDeleteDoc,
} from "@/features/admin/hooks/useFirestoreMutations";
import { ConfirmDialog } from "@/features/admin/components/ConfirmDialog";
import { ImageDropField } from "@/features/admin/components/ImageDropField";
import { TagsField } from "@/features/admin/components/TagsField";
import { MarkdownPreview } from "@/features/admin/components/MarkdownPreview";
import type { BlogPostEntry } from "@/types/content";

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function estimateReadingTime(markdown: string) {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function AdminBlogPage() {
  const { data: posts, isLoading } = useFirestoreCollection<BlogPostEntry>(
    "blogPosts",
    "order"
  );
  const createMutation = useCreateDoc("blogPosts");
  const updateMutation = useUpdateDoc("blogPosts");
  const deleteMutation = useDeleteDoc("blogPosts");

  const [editing, setEditing] = useState<BlogPostEntry | null | "new">(null);
  const [deleting, setDeleting] = useState<BlogPostEntry | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[--font-display] text-xl font-semibold">Blog</h1>
          <p className="mt-1 text-sm text-[--color-text-muted]">
            {posts?.length ?? 0} posts
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditing("new")}
          className="flex items-center gap-2 rounded-full bg-[--color-accent] px-4 py-2 text-sm font-medium text-[--color-accent-contrast]"
        >
          <Plus size={15} /> New post
        </button>
      </div>

      {isLoading && (
        <div className="mt-8 space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-[--radius-md] bg-[--color-bg-subtle]" />
          ))}
        </div>
      )}

      {!isLoading && (!posts || posts.length === 0) && (
        <div className="mt-8 rounded-[--radius-lg] border border-dashed border-[--color-border] px-6 py-16 text-center">
          <p className="text-sm text-[--color-text-muted]">No posts yet. Write the first one.</p>
        </div>
      )}

      {posts && posts.length > 0 && (
        <div className="mt-6 divide-y divide-[--color-border] rounded-[--radius-lg] border border-[--color-border] bg-[--color-surface]">
          {posts.map((post) => (
            <div key={post.id} className="flex items-center gap-3 px-4 py-3">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full ${
                  post.status === "published"
                    ? "bg-[--color-accent-alt]/10 text-[--color-accent-alt]"
                    : "bg-[--color-text-faint]/10 text-[--color-text-faint]"
                }`}
                title={post.status}
              >
                {post.status === "published" ? <Eye size={13} /> : <EyeOff size={13} />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{post.title}</p>
                <p className="truncate text-xs text-[--color-text-faint]">/blog/{post.slug}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditing(post)}
                aria-label={`Edit ${post.title}`}
                className="rounded-full p-2 text-[--color-text-muted] hover:bg-[--color-bg-subtle] hover:text-[--color-text]"
              >
                <Pencil size={15} />
              </button>
              <button
                type="button"
                onClick={() => setDeleting(post)}
                aria-label={`Delete ${post.title}`}
                className="rounded-full p-2 text-[--color-text-muted] hover:bg-red-500/10 hover:text-red-500"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <BlogEditorPanel
          post={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSubmit={async (values) => {
            if (editing !== "new") {
              await updateMutation.mutateAsync({ id: editing.id, data: values });
            } else {
              const maxOrder = posts?.reduce((max, p) => Math.max(max, p.order ?? 0), 0) ?? 0;
              await createMutation.mutateAsync({ ...values, order: maxOrder + 1 });
            }
          }}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete this post?"
          description={`"${deleting.title}" will be permanently removed.`}
          confirmLabel="Delete"
          destructive
          onCancel={() => setDeleting(null)}
          onConfirm={async () => {
            await deleteMutation.mutateAsync(deleting.id);
            setDeleting(null);
          }}
        />
      )}
    </div>
  );
}

function BlogEditorPanel({
  post,
  onClose,
  onSubmit,
}: {
  post: BlogPostEntry | null;
  onClose: () => void;
  onSubmit: (values: Record<string, unknown>) => Promise<void>;
}) {
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [contentMdx, setContentMdx] = useState(post?.contentMdx ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(post?.coverImageUrl ?? "");
  const [tags, setTags] = useState<string[]>(post?.tags ?? []);
  const [category, setCategory] = useState(post?.category ?? "");
  const [status, setStatus] = useState<"draft" | "published">(post?.status ?? "draft");
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title));
  }, [title, slugTouched]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !slug || !contentMdx) {
      setError("Title, slug, and content are required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSubmit({
        title,
        slug,
        excerpt,
        contentMdx,
        coverImageUrl: coverImageUrl || null,
        tags,
        category,
        status,
        publishedAt: status === "published" ? post?.publishedAt ?? new Date().toISOString() : null,
        readingTimeMinutes: estimateReadingTime(contentMdx),
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[90] flex justify-end bg-black/40" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={post ? "Edit post" : "New post"}
        className="flex h-full w-full max-w-2xl flex-col bg-[--color-surface] shadow-[--shadow-lg]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[--color-border] px-5 py-4">
          <h2 className="font-[--font-display] text-base font-semibold">
            {post ? "Edit post" : "New post"}
          </h2>
          <button type="button" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto">
          <div className="flex-1 space-y-5 px-5 py-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-[--radius-md] border border-[--color-border] bg-[--color-surface] px-3 py-2 text-sm outline-none focus-visible:border-[--color-accent]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Slug</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[--color-text-faint]">/blog/</span>
                <input
                  value={slug}
                  onChange={(e) => {
                    setSlug(slugify(e.target.value));
                    setSlugTouched(true);
                  }}
                  className="w-full rounded-[--radius-md] border border-[--color-border] bg-[--color-surface] px-3 py-2 text-sm outline-none focus-visible:border-[--color-accent]"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Excerpt</label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full rounded-[--radius-md] border border-[--color-border] bg-[--color-surface] px-3 py-2 text-sm outline-none focus-visible:border-[--color-accent]"
              />
            </div>

            <ImageDropField label="Cover image" value={coverImageUrl} onChange={setCoverImageUrl} />

            <div>
              <label className="mb-1.5 block text-sm font-medium">Category</label>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-[--radius-md] border border-[--color-border] bg-[--color-surface] px-3 py-2 text-sm outline-none focus-visible:border-[--color-accent]"
              />
            </div>

            <TagsField label="Tags" value={tags} onChange={setTags} />

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm font-medium">
                  Content (Markdown) <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowPreview((v) => !v)}
                  className="text-xs text-[--color-accent] hover:underline"
                >
                  {showPreview ? "Edit" : "Preview"}
                </button>
              </div>
              {showPreview ? (
                <MarkdownPreview markdown={contentMdx} />
              ) : (
                <textarea
                  rows={14}
                  value={contentMdx}
                  onChange={(e) => setContentMdx(e.target.value)}
                  className="w-full rounded-[--radius-md] border border-[--color-border] bg-[--color-surface] px-3 py-2 font-[--font-mono] text-xs outline-none focus-visible:border-[--color-accent]"
                />
              )}
              <p className="mt-1 text-xs text-[--color-text-faint]">
                ~{estimateReadingTime(contentMdx)} min read
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Status</label>
              <div className="flex gap-2">
                {(["draft", "published"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium capitalize ${
                      status === s
                        ? "border-[--color-accent] bg-[--color-accent]/10 text-[--color-accent]"
                        : "border-[--color-border] text-[--color-text-muted]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <p className="mx-5 mb-3 rounded-[--radius-md] bg-red-500/10 px-3 py-2 text-xs text-red-500">
              {error}
            </p>
          )}

          <div className="flex gap-2 border-t border-[--color-border] px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full border border-[--color-border] px-4 py-2 text-sm font-medium hover:bg-[--color-bg-subtle]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[--color-accent] px-4 py-2 text-sm font-medium text-[--color-accent-contrast] disabled:opacity-60"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
