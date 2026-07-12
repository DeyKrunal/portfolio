import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { RepoCard } from "@/components/common/RepoCard";
import type { Repository } from "@/types/github";

const mockRepo: Repository = {
  id: "1",
  name: "example-repo",
  fullName: "DeyKrunal/example-repo",
  description: "An example repository for testing.",
  url: "https://github.com/DeyKrunal/example-repo",
  homepageUrl: null,
  isPinned: true,
  isFork: false,
  isArchived: false,
  isTemplate: false,
  stargazerCount: 42,
  forkCount: 3,
  openIssuesCount: 0,
  openPRCount: 0,
  watcherCount: 5,
  diskUsageKb: 100,
  primaryLanguage: "TypeScript",
  languages: [{ name: "TypeScript", color: "#3178c6", bytes: 1000, percent: 100 }],
  topics: ["portfolio"],
  licenseSpdxId: "MIT",
  defaultBranch: "main",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  pushedAt: new Date().toISOString(),
  latestRelease: null,
  readmeHtml: null,
  readmeRaw: null,
  ogImageUrl: "",
  hasPagesSite: false,
  pagesUrl: null,
  detectedStack: ["React", "TypeScript"],
  category: "Frontend",
  contributors: [],
};

describe("RepoCard", () => {
  it("renders repo name, description, category, and stats", () => {
    render(
      <MemoryRouter>
        <RepoCard repo={mockRepo} />
      </MemoryRouter>
    );

    expect(screen.getByText("example-repo")).toBeInTheDocument();
    expect(screen.getByText("An example repository for testing.")).toBeInTheDocument();
    expect(screen.getByText("Frontend")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });
});
