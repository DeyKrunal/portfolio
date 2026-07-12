#!/usr/bin/env node
/**
 * Generates sitemap.xml and rss.xml into dist/ after the Vite build.
 * Run via `npm run generate:seo` (wired into the deploy workflow after `build`).
 *
 * Individual blog post entries come from public/data/blog-index.json,
 * which scripts/export-blog-index.mjs writes at build time by reading
 * Firestore directly (see that script for why this needs a separate
 * export step rather than just reading the repo's filesystem).
 */
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "../dist");
const BLOG_INDEX_PATH = path.resolve(__dirname, "../public/data/blog-index.json");
const SITE_URL = "https://DeyKrunal.github.io";

const STATIC_ROUTES = [
  "/",
  "/projects",
  "/about",
  "/experience",
  "/education",
  "/skills",
  "/certificates",
  "/achievements",
  "/gallery",
  "/testimonials",
  "/resume",
  "/now-playing",
  "/analytics",
  "/blog",
  "/contact",
  "/privacy",
  "/terms",
  "/changelog",
];

function loadBlogPosts() {
  if (!existsSync(BLOG_INDEX_PATH)) {
    console.log(
      "public/data/blog-index.json not found -- run `npm run export:blog` first " +
        "(or it just hasn't been generated yet). Sitemap/RSS will omit individual posts."
    );
    return [];
  }
  try {
    const raw = JSON.parse(readFileSync(BLOG_INDEX_PATH, "utf-8"));
    return raw.posts ?? [];
  } catch {
    console.warn("public/data/blog-index.json exists but couldn't be parsed. Skipping posts.");
    return [];
  }
}

function buildSitemap(routes, posts) {
  const staticUrls = routes.map(
    (route) => `  <url>
    <loc>${SITE_URL}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === "/" ? "1.0" : "0.7"}</priority>
  </url>`
  );

  const postUrls = posts.map(
    (p) => `  <url>
    <loc>${SITE_URL}/blog/${p.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...postUrls].join("\n")}
</urlset>
`;
}

function buildRss(posts) {
  const items = posts
    .map(
      (p) => `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${SITE_URL}/blog/${p.slug}</link>
      <guid>${SITE_URL}/blog/${p.slug}</guid>
      <pubDate>${p.publishedAt ? new Date(p.publishedAt).toUTCString() : ""}</pubDate>
      <description>${escapeXml(p.excerpt ?? "")}</description>
    </item>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Krunal Dey — Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Software engineering notes and write-ups.</description>
${items}
  </channel>
</rss>
`;
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function main() {
  if (!existsSync(DIST)) {
    console.error(`dist/ not found at ${DIST} -- run \`npm run build\` first.`);
    process.exit(1);
  }

  const posts = loadBlogPosts();

  writeFileSync(path.join(DIST, "sitemap.xml"), buildSitemap(STATIC_ROUTES, posts));
  writeFileSync(path.join(DIST, "rss.xml"), buildRss(posts));

  const robotsPath = path.join(DIST, "robots.txt");
  if (!existsSync(robotsPath)) {
    writeFileSync(
      robotsPath,
      `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`
    );
  }

  console.log(
    `Generated sitemap.xml (${STATIC_ROUTES.length + posts.length} URLs), ` +
      `rss.xml (${posts.length} posts), robots.txt in dist/`
  );
}

main();
