import type { GithubDataSnapshot } from "@/types/github";

/**
 * Loads the pre-generated GitHub data snapshot. This file is produced by
 * scripts/fetch-github-data.mjs (run in CI on a schedule) and lives at
 * /data/github.json in the built site. We never hit the live GitHub API
 * from the browser — that would require exposing a token or hitting the
 * unauthenticated 60/hr rate limit.
 */
export async function getGithubSnapshot(): Promise<GithubDataSnapshot> {
  const base = import.meta.env.BASE_URL;
  const res = await fetch(`${base}data/github.json`, { cache: "no-cache" });
  if (!res.ok) {
    throw new Error(
      `Could not load GitHub data snapshot (${res.status}). ` +
        `Has scripts/fetch-github-data.mjs been run yet?`
    );
  }
  return res.json();
}
