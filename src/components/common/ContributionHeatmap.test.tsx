import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ContributionHeatmap } from "@/components/common/ContributionHeatmap";
import type { ContributionDay } from "@/types/github";

function makeDays(count: number): ContributionDay[] {
  const days: ContributionDay[] = [];
  const start = new Date("2025-01-01");
  for (let i = 0; i < count; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    days.push({ date: d.toISOString().slice(0, 10), count: i % 5, level: (i % 5) as 0 | 1 | 2 | 3 | 4 });
  }
  return days;
}

describe("ContributionHeatmap", () => {
  it("renders a legend and title attributes for each real day", () => {
    const days = makeDays(30);
    const { container } = render(<ContributionHeatmap days={days} />);
    const cellsWithTitles = container.querySelectorAll("[title]");
    expect(cellsWithTitles.length).toBe(30);
  });
});
