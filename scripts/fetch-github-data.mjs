#!/usr/bin/env node
/**
 * Fetches everything needed for the portfolio from GitHub and writes
 * public/data/github.json. Run via `node scripts/fetch-github-data.mjs`.
 *
 * Requires env var GH_TOKEN — a GitHub PAT (classic or fine-grained) with
 * public_repo (or repo) read scope. In CI this is the built-in
 * secrets.GITHUB_TOKEN via the workflow (see .github/workflows/sync-github-data.yml).
 * NEVER commit a token. NEVER expose this script's output token, only its data.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "../public/data");
const USERNAME = process.env.GH_USERNAME || "DeyKrunal";
const TOKEN = process.env.GH_TOKEN ;

if (!TOKEN) {
  console.error("Missing GH_TOKEN environment variable. Aborting.");
  process.exit(1);
}

const GRAPHQL_URL = "https://api.github.com/graphql";
const REST_BASE = "https://api.github.com";

async function graphql(query, variables = {}) {
  const res = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      Authorization: `bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) {
    throw new Error("GraphQL error: " + JSON.stringify(json.errors));
  }
  return json.data;
}

async function rest(endpoint) {
  const res = await fetch(`${REST_BASE}${endpoint}`, {
    headers: {
      Authorization: `bearer ${TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    console.warn(`REST ${endpoint} -> ${res.status}`);
    return null;
  }
  return res.json();
}

// ---------------------------------------------------------------------
// 1. Profile + pinned + all repos (single GraphQL round trip, paginated)
      // repositories(first: 1, isFork: false) { totalCount }
// ---------------------------------------------------------------------
const PROFILE_QUERY = /* GraphQL */ `
  query ($login: String!, $after: String) {
    user(login: $login) {
      login
      name
      avatarUrl
      bio
      company
      location
      websiteUrl
      followers { totalCount }
      following { totalCount }
      createdAt
      pinnedItems(first: 12, types: [REPOSITORY]) {
        nodes {
          ... on Repository { name }
        }
      }
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
            }
          }
        }
      }
      repositories(
        first: 50
        after: $after
        ownerAffiliations: OWNER
        privacy: PUBLIC
        isFork: false
        orderBy: { field: PUSHED_AT, direction: DESC }
      ) {
        totalCount
        pageInfo { hasNextPage endCursor }
        nodes {
          id
          name
          nameWithOwner
          description
          url
          homepageUrl
          isFork
          isArchived
          isTemplate
          stargazerCount
          forkCount
          diskUsage
          createdAt
          updatedAt
          pushedAt
          defaultBranchRef { name }
          licenseInfo { spdxId }
          repositoryTopics(first: 10) { nodes { topic { name } } }
          languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
            totalSize
            edges { size node { name color } }
          }
          issues(states: OPEN) { totalCount }
          pullRequests(states: OPEN) { totalCount }
          watchers { totalCount }
          releases(first: 1, orderBy: { field: CREATED_AT, direction: DESC }) {
            nodes { tagName name publishedAt url }
          }
          object(expression: "HEAD:README.md") {
            ... on Blob { text }
          }
        }
      }
    }
  }
`;

async function fetchAllRepos() {
  let after = null;
  let all = [];
  let profileMeta = null;
  let pinnedNames = [];
  let contributionDays = [];
  let totalContributions = 0;

  for (;;) {
    const data = await graphql(PROFILE_QUERY, { login: USERNAME, after });
    const user = data.user;
    if (!user) throw new Error(`GitHub user "${USERNAME}" not found`);

    if (!profileMeta) {
      profileMeta = {
        login: user.login,
        name: user.name,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        company: user.company,
        location: user.location,
        websiteUrl: user.websiteUrl,
        followers: user.followers.totalCount,
        following: user.following.totalCount,
        publicRepos: user.repositories.totalCount,
        createdAt: user.createdAt,
      };
      pinnedNames = user.pinnedItems.nodes.map((n) => n.name);
      totalContributions =
        user.contributionsCollection.contributionCalendar.totalContributions;
      contributionDays = user.contributionsCollection.contributionCalendar.weeks.flatMap(
        (w) =>
          w.contributionDays.map((d) => ({
            date: d.date,
            count: d.contributionCount,
            level: levelToInt(d.contributionLevel),
          }))
      );
    }

    all = all.concat(user.repositories.nodes);
    if (!user.repositories.pageInfo.hasNextPage) break;
    after = user.repositories.pageInfo.endCursor;
  }

  return { profileMeta, pinnedNames, all, contributionDays, totalContributions };
}

function levelToInt(level) {
  const map = {
    NONE: 0,
    FIRST_QUARTILE: 1,
    SECOND_QUARTILE: 2,
    THIRD_QUARTILE: 3,
    FOURTH_QUARTILE: 4,
  };
  return map[level] ?? 0;
}

// ---------------------------------------------------------------------
// 2. Per-repo enrichment: contributors, package.json detection, category
// ---------------------------------------------------------------------
const STACK_SIGNATURES = [
  { file: "package.json", probe: (pkg) => detectFromPackageJson(pkg) },
];

function detectFromPackageJson(pkg) {
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  const stack = [];
  const has = (name) => Object.prototype.hasOwnProperty.call(deps, name);

  if (has("react")) stack.push("React");
  if (has("next")) stack.push("Next.js");
  if (has("vue")) stack.push("Vue");
  if (has("svelte")) stack.push("Svelte");
  if (has("express")) stack.push("Express");
  if (has("fastify")) stack.push("Fastify");
  if (has("@nestjs/core")) stack.push("NestJS");
  if (has("tailwindcss")) stack.push("Tailwind CSS");
  if (has("typescript")) stack.push("TypeScript");
  if (has("vite")) stack.push("Vite");
  if (has("electron")) stack.push("Electron");
  if (has("react-native")) stack.push("React Native");
  if (has("firebase") || has("firebase-admin")) stack.push("Firebase");
  return stack;
}

function categorize(repo, detectedStack, languages, topics) {
  const t = topics.map((s) => s.toLowerCase());
  const primary = (languages[0]?.name || "").toLowerCase();
  const name = repo.name.toLowerCase();

  if (t.some((x) => ["ml", "machine-learning", "deep-learning"].includes(x)))
    return "ML";
  if (t.some((x) => ["ai", "llm", "genai", "artificial-intelligence"].includes(x)))
    return "AI";
  if (detectedStack.includes("React Native") || t.includes("mobile")) return "Mobile";
  if (detectedStack.includes("Electron") || t.includes("desktop")) return "Desktop";
  if (t.includes("cli") || name.includes("cli")) return "CLI";
  if (t.includes("game") || primary === "c#" || t.includes("gamedev")) return "Game";
  if (t.includes("library") || repo.isTemplate) return "Library";
  if (t.includes("api")) return "API";
  if (
    detectedStack.some((s) => ["React", "Vue", "Svelte", "Next.js"].includes(s)) &&
    detectedStack.some((s) => ["Express", "Fastify", "NestJS", "Firebase"].includes(s))
  )
    return "Full Stack";
  if (detectedStack.some((s) => ["Express", "Fastify", "NestJS"].includes(s)))
    return "Backend";
  if (detectedStack.some((s) => ["React", "Vue", "Svelte", "Next.js", "Tailwind CSS"].includes(s)))
    return "Frontend";
  if (t.includes("tool") || t.includes("utility")) return "Tool";
  return "Other";
}

async function enrichRepo(repo) {
  const languages = repo.languages.edges.map((e) => ({
    name: e.node.name,
    color: e.node.color,
    bytes: e.size,
    percent: repo.languages.totalSize
      ? Math.round((e.size / repo.languages.totalSize) * 1000) / 10
      : 0,
  }));
  const topics = repo.repositoryTopics.nodes.map((n) => n.topic.name);

  let detectedStack = [];
  const pkgRaw = await rest(
    `/repos/${repo.nameWithOwner}/contents/package.json`
  );
  if (pkgRaw && pkgRaw.content) {
    try {
      const decoded = Buffer.from(pkgRaw.content, "base64").toString("utf-8");
      detectedStack = detectFromPackageJson(JSON.parse(decoded));
    } catch {
      // not valid JSON or not accessible — skip silently, not fatal
    }
  }

  const contributorsRaw =
    (await rest(`/repos/${repo.nameWithOwner}/contributors?per_page=6`)) || [];
  const contributors = Array.isArray(contributorsRaw)
    ? contributorsRaw.map((c) => ({
        login: c.login,
        avatarUrl: c.avatar_url,
        contributions: c.contributions,
      }))
    : [];

  const pagesInfo = await rest(`/repos/${repo.nameWithOwner}/pages`);

  const category = categorize(repo, detectedStack, languages, topics);

  return {
    id: repo.id,
    name: repo.name,
    fullName: repo.nameWithOwner,
    description: repo.description,
    url: repo.url,
    homepageUrl: repo.homepageUrl || null,
    isPinned: false, // set by caller
    isFork: repo.isFork,
    isArchived: repo.isArchived,
    isTemplate: repo.isTemplate,
    stargazerCount: repo.stargazerCount,
    forkCount: repo.forkCount,
    openIssuesCount: repo.issues.totalCount,
    openPRCount: repo.pullRequests.totalCount,
    watcherCount: repo.watchers.totalCount,
    diskUsageKb: repo.diskUsage,
    primaryLanguage: languages[0]?.name || null,
    languages,
    topics,
    licenseSpdxId: repo.licenseInfo?.spdxId || null,
    defaultBranch: repo.defaultBranchRef?.name || "main",
    createdAt: repo.createdAt,
    updatedAt: repo.updatedAt,
    pushedAt: repo.pushedAt,
    latestRelease: repo.releases.nodes[0]
      ? {
          tagName: repo.releases.nodes[0].tagName,
          name: repo.releases.nodes[0].name,
          publishedAt: repo.releases.nodes[0].publishedAt,
          url: repo.releases.nodes[0].url,
        }
      : null,
    readmeRaw: repo.object?.text || null,
    readmeHtml: null, // rendered client-side with a sanitizing markdown renderer
    ogImageUrl: `https://opengraph.githubassets.com/1/${repo.nameWithOwner}`,
    hasPagesSite: Boolean(pagesInfo),
    pagesUrl: pagesInfo?.html_url || null,
    detectedStack,
    category,
    contributors,
  };
}

// ---------------------------------------------------------------------
// 3. Run
// ---------------------------------------------------------------------
async function main() {
  console.log(`Fetching GitHub data for ${USERNAME}...`);
  const { profileMeta, pinnedNames, all, contributionDays, totalContributions } =
    await fetchAllRepos();

  console.log(`Found ${all.length} repositories. Enriching (this calls REST per repo)...`);

  const enriched = [];
  for (const repo of all) {
    const e = await enrichRepo(repo);
    e.isPinned = pinnedNames.includes(repo.name);
    enriched.push(e);
  }

  const totalStars = enriched.reduce((sum, r) => sum + r.stargazerCount, 0);

  const langTotals = new Map();
  for (const r of enriched) {
    for (const l of r.languages) {
      langTotals.set(l.name, (langTotals.get(l.name) || 0) + l.bytes);
    }
  }
  const langSum = [...langTotals.values()].reduce((a, b) => a + b, 0) || 1;
  const topLanguages = [...langTotals.entries()]
    .map(([name, bytes]) => ({
      name,
      color: enriched.find((r) => r.languages.some((l) => l.name === name))
        ?.languages.find((l) => l.name === name)?.color ?? null,
      percent: Math.round((bytes / langSum) * 1000) / 10,
    }))
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 8);

  // Streak calculation from contribution calendar
  const sortedDays = [...contributionDays].sort((a, b) => (a.date < b.date ? -1 : 1));
  let currentStreak = 0;
  let longestStreak = 0;
  let running = 0;
  for (const day of sortedDays) {
    if (day.count > 0) {
      running += 1;
      longestStreak = Math.max(longestStreak, running);
    } else {
      running = 0;
    }
  }
  for (let i = sortedDays.length - 1; i >= 0; i--) {
    if (sortedDays[i].count > 0) currentStreak += 1;
    else break;
  }

  const snapshot = {
    generatedAt: new Date().toISOString(),
    profile: profileMeta,
    repositories: enriched,
    pinnedRepositoryIds: enriched.filter((r) => r.isPinned).map((r) => r.id),
    totalStars,
    contributionCalendar: {
      totalContributions,
      days: contributionDays,
    },
    currentStreak,
    longestStreak,
    topLanguages,
  };

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(
    path.join(OUT_DIR, "github.json"),
    JSON.stringify(snapshot, null, 2)
  );
  console.log(`Wrote ${path.join(OUT_DIR, "github.json")}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
