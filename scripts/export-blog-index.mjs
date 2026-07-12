#!/usr/bin/env node
/**
 * Exports published blog posts from Firestore to public/data/blog-index.json
 * at build time, so generate-seo.mjs can include real sitemap <url> entries
 * and RSS <item> entries per post -- something that isn't possible from a
 * script that only has filesystem access (blog posts live in Firestore, not
 * in this repo).
 *
 * Requires a Firebase service account with Firestore read access, passed as
 * the FIREBASE_SERVICE_ACCOUNT_KEY env var (base64-encoded JSON). This is
 * intentionally separate from the client-side VITE_FIREBASE_* config: a
 * service account can read regardless of security rules, so it must never
 * be exposed to the browser -- it's used here, in a CI/Node context, only.
 *
 * Graceful degradation: if FIREBASE_SERVICE_ACCOUNT_KEY isn't set (e.g. a
 * fork running this for the first time, or a local build without one
 * configured), this script logs a note and writes an empty index rather
 * than failing the build. The site works fine either way; you just get
 * fewer sitemap/RSS entries until the secret is added.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "../public/data");
const OUT_FILE = path.join(OUT_DIR, "blog-index.json");

async function main() {
  const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  mkdirSync(OUT_DIR, { recursive: true });

  if (!key) {
    console.log(
      "FIREBASE_SERVICE_ACCOUNT_KEY not set -- skipping Firestore export. " +
        "Sitemap/RSS will include only static routes, not individual blog posts. " +
        "See README.md > 'Exporting blog posts for sitemap/RSS' to enable this."
    );
    writeFileSync(OUT_FILE, JSON.stringify({ posts: [], exportedAt: null }, null, 2));
    return;
  }

  let admin;
  try {
    admin = await import("firebase-admin");
  } catch {
    console.warn("firebase-admin isn't installed -- run `npm install` first. Skipping export.");
    writeFileSync(OUT_FILE, JSON.stringify({ posts: [], exportedAt: null }, null, 2));
    return;
  }

  let serviceAccount;
  try {
    serviceAccount = JSON.parse(Buffer.from(key, "base64").toString("utf-8"));
  } catch {
    console.error(
      "FIREBASE_SERVICE_ACCOUNT_KEY is set but isn't valid base64-encoded JSON. " +
        "Skipping export rather than failing the build."
    );
    writeFileSync(OUT_FILE, JSON.stringify({ posts: [], exportedAt: null }, null, 2));
    return;
  }

  const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  try {
    const db = admin.firestore();
    const snap = await db
      .collection("blogPosts")
      .where("status", "==", "published")
      .get();

    const posts = snap.docs.map((doc) => {
      const data = doc.data();
      return {
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt,
        publishedAt: data.publishedAt ?? null,
      };
    });

    writeFileSync(
      OUT_FILE,
      JSON.stringify({ posts, exportedAt: new Date().toISOString() }, null, 2)
    );
    console.log(`Exported ${posts.length} published post(s) to ${OUT_FILE}`);
  } finally {
    await app.delete();
  }
}

main().catch((err) => {
  console.error("Firestore export failed:", err);
  // Still don't fail the build -- write an empty index so generate-seo.mjs
  // has something to read, and the deploy proceeds with reduced (not zero)
  // sitemap/RSS coverage.
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, JSON.stringify({ posts: [], exportedAt: null }, null, 2));
});
