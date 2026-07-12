import { useMemo } from "react";
import { marked } from "marked";

/**
 * Renders a live preview of markdown as the admin types. This output is
 * ONLY ever shown inside the authenticated Admin Dashboard, to the site
 * owner previewing their own draft — it is not what gets rendered to
 * public visitors. The public blog post page (Phase 4) will run content
 * through a proper sanitizing pipeline (e.g. rehype-sanitize) before
 * rendering to anyone else, since at that point the trust boundary is
 * different (visitor render surface, not self-preview).
 */
export function MarkdownPreview({ markdown }: { markdown: string }) {
  const html = useMemo(() => {
    try {
      return marked.parse(markdown || "*Nothing to preview yet.*", { async: false }) as string;
    } catch {
      return "<p>Could not render preview.</p>";
    }
  }, [markdown]);

  return (
    <div
      className="prose prose-neutral max-w-none rounded-[--radius-md] border border-[--color-border] bg-[--color-bg-subtle] p-4 text-sm [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-[--color-surface] [&_pre]:p-3"
      // eslint-disable-next-line react/no-danger -- admin-only self-preview, see comment above
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
