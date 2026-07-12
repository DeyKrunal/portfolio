import { useMemo } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";

/**
 * Renders markdown to sanitized HTML for public visitors. Unlike
 * MarkdownPreview (admin-only self-preview), this is the actual trust
 * boundary: content here has already passed through an authenticated
 * admin's editor, but sanitizing at render time means a compromised admin
 * account, a bad paste, or a future admin-editor bug still can't inject
 * a <script> tag or an onerror handler into a visitor's browser.
 */
export function SanitizedMarkdown({ markdown }: { markdown: string }) {
  const html = useMemo(() => {
    const rawHtml = marked.parse(markdown, { async: false }) as string;
    return DOMPurify.sanitize(rawHtml, {
      ALLOWED_TAGS: [
        "p", "br", "hr",
        "h1", "h2", "h3", "h4", "h5", "h6",
        "strong", "em", "del", "code", "pre",
        "ul", "ol", "li",
        "blockquote",
        "a", "img",
        "table", "thead", "tbody", "tr", "th", "td",
      ],
      ALLOWED_ATTR: ["href", "src", "alt", "title", "class", "target", "rel"],
      ALLOW_DATA_ATTR: false,
    });
  }, [markdown]);

  return (
    <div
      className="prose prose-neutral max-w-none [&_a]:text-[--color-accent] [&_a]:underline [&_code]:rounded [&_code]:bg-[--color-bg-subtle] [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-sm [&_pre]:overflow-x-auto [&_pre]:rounded-[--radius-md] [&_pre]:bg-[--color-bg-subtle] [&_pre]:p-4 [&_img]:rounded-[--radius-md]"
      // eslint-disable-next-line react/no-danger -- output is DOMPurify-sanitized immediately above
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
