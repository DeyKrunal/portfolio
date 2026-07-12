/**
 * Shape of /public/data/github.json, produced by scripts/fetch-github-data.mjs
 * and regenerated on a schedule by .github/workflows/sync-github-data.yml.
 *
 * The site NEVER calls the GitHub API from the client. All data is fetched
 * once at build/schedule time (server-side, with an authenticated token) and
 * shipped as a static JSON asset. This avoids exposing a token in client code
 * and avoids the unauthenticated 60 req/hr rate limit that would break the
 * site for visitors.
 */

export type ProjectCategory =
  | "Frontend"
  | "Backend"
  | "Full Stack"
  | "AI"
  | "ML"
  | "CLI"
  | "Mobile"
  | "Desktop"
  | "Library"
  | "Tool"
  | "Game"
  | "API"
  | "Utility"
  | "Research"
  | "Other";

export interface RepoLanguage {
  name: string;
  color: string | null;
  bytes: number;
  percent: number;
}

export interface RepoRelease {
  tagName: string;
  name: string | null;
  publishedAt: string | null;
  url: string;
}

export interface Repository {
  id: string;
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  homepageUrl: string | null;
  isPinned: boolean;
  isFork: boolean;
  isArchived: boolean;
  isTemplate: boolean;
  stargazerCount: number;
  forkCount: number;
  openIssuesCount: number;
  openPRCount: number;
  watcherCount: number;
  diskUsageKb: number;
  primaryLanguage: string | null;
  languages: RepoLanguage[];
  topics: string[];
  licenseSpdxId: string | null;
  defaultBranch: string;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  latestRelease: RepoRelease | null;
  readmeHtml: string | null;
  readmeRaw: string | null;
  ogImageUrl: string;
  hasPagesSite: boolean;
  pagesUrl: string | null;
  detectedStack: string[];
  category: ProjectCategory;
  contributors: { login: string; avatarUrl: string; contributions: number }[];
}

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface GithubProfile {
  login: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  websiteUrl: string | null;
  followers: number;
  following: number;
  publicRepos: number;
  createdAt: string;
}

export interface GithubDataSnapshot {
  generatedAt: string;
  profile: GithubProfile;
  repositories: Repository[];
  pinnedRepositoryIds: string[];
  totalStars: number;
  contributionCalendar: {
    totalContributions: number;
    days: ContributionDay[];
  };
  currentStreak: number;
  longestStreak: number;
  topLanguages: { name: string; color: string | null; percent: number }[];
}
