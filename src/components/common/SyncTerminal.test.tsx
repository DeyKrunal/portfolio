import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { SyncTerminal } from "@/components/common/SyncTerminal";
import type { GithubDataSnapshot } from "@/types/github";

const mockSnapshot: GithubDataSnapshot = {
  generatedAt: new Date().toISOString(),
  profile: {
    login: "DeyKrunal",
    name: "Krunal Dey",
    avatarUrl: "",
    bio: null,
    company: null,
    location: null,
    websiteUrl: null,
    followers: 42,
    following: 10,
    publicRepos: 17,
    createdAt: new Date().toISOString(),
  },
  repositories: [],
  pinnedRepositoryIds: [],
  totalStars: 128,
  contributionCalendar: { totalContributions: 500, days: [] },
  currentStreak: 9,
  longestStreak: 30,
  topLanguages: [],
};

describe("SyncTerminal", () => {
  beforeEach(() => {
    // matchMedia isn't implemented in jsdom by default
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("reduce") ? true : false, // force reduced-motion path for deterministic tests
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows a loading state before data arrives", () => {
    render(<SyncTerminal data={undefined} isLoading={true} />);
    expect(screen.getByText(/Connecting to GitHub Actions/i)).toBeInTheDocument();
  });

  it("renders real synced numbers once data loads (with reduced motion, immediately)", async () => {
    render(<SyncTerminal data={mockSnapshot} isLoading={false} />);
    await waitFor(() => {
      expect(screen.getByText(/synced 17 repositories/)).toBeInTheDocument();
    });
    expect(screen.getByText(/128 stars/)).toBeInTheDocument();
    expect(screen.getByText(/streak: 9d/)).toBeInTheDocument();
  });
});
