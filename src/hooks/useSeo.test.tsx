import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { useSeo } from "@/hooks/useSeo";

function TestComponent({ title }: { title: string }) {
  useSeo({ title, path: "/test" });
  return null;
}

describe("useSeo", () => {
  it("sets document title including the site name", () => {
    render(<TestComponent title="Projects" />);
    expect(document.title).toContain("Projects");
  });

  it("sets the canonical link href", () => {
    render(<TestComponent title="Projects" />);
    const canonical = document.querySelector('link[rel="canonical"]');
    expect(canonical?.getAttribute("href")).toContain("/test");
  });
});
