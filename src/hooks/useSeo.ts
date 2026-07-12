import { useEffect } from "react";
import { siteConfig } from "@/config/site";

interface SeoOptions {
  title: string;
  description?: string;
  image?: string;
  path?: string; // e.g. "/projects" — used to build canonical + OG url
}

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Call at the top of any page component to set that page's meta tags.
 * Falls back to site-wide defaults for anything not specified. This
 * mutates existing tags from index.html rather than duplicating them, so
 * static crawlers that only read the initial HTML still see sane defaults,
 * and client-side navigations update tags correctly for anything that
 * executes JS (social un-furlers that render JS, on-page sharing, etc).
 */
export function useSeo({ title, description, image, path }: SeoOptions) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${siteConfig.siteName}` : siteConfig.siteTitle;
    const desc = description ?? siteConfig.siteDescription;
    const url = `${siteConfig.siteUrl}${path ?? ""}`;
    const img = image ?? `${siteConfig.siteUrl}/og-image.png`;

    document.title = fullTitle;
    upsertMeta("name", "description", desc);
    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", desc);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:image", img);
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", desc);
    upsertMeta("name", "twitter:image", img);
    upsertLink("canonical", url);
  }, [title, description, image, path]);
}
