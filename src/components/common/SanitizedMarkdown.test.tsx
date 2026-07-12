import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { SanitizedMarkdown } from "@/components/common/SanitizedMarkdown";

describe("SanitizedMarkdown", () => {
  it("renders safe markdown as HTML", () => {
    const { container } = render(<SanitizedMarkdown markdown="# Hello\n\nSome **bold** text." />);
    expect(container.querySelector("h1")).toBeTruthy();
    expect(container.querySelector("strong")).toBeTruthy();
  });

  it("strips script tags injected via raw HTML in markdown", () => {
    const malicious = "Hello <script>window.__pwned = true;</script> world";
    const { container } = render(<SanitizedMarkdown markdown={malicious} />);
    expect(container.querySelector("script")).toBeNull();
    expect(container.innerHTML).not.toContain("<script>");
  });

  it("strips inline event handler attributes", () => {
    const malicious = '<img src="x" onerror="window.__pwned = true">';
    const { container } = render(<SanitizedMarkdown markdown={malicious} />);
    const img = container.querySelector("img");
    expect(img?.getAttribute("onerror")).toBeNull();
  });
});
