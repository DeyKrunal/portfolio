import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRotatingText } from "@/hooks/useRotatingText";

describe("useRotatingText", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("starts on the first item", () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true, // reduced motion -- should stay static
    })) as unknown as typeof window.matchMedia;

    const { result } = renderHook(() => useRotatingText(["Alpha", "Beta", "Gamma"]));
    expect(result.current.current).toBe("Alpha");
  });

  it("advances to the next item over time when motion is not reduced", () => {
    vi.useFakeTimers();
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
    })) as unknown as typeof window.matchMedia;

    const { result } = renderHook(() => useRotatingText(["Alpha", "Beta"], 1000));
    expect(result.current.current).toBe("Alpha");

    act(() => {
      vi.advanceTimersByTime(1000); // trigger fade-out
      vi.advanceTimersByTime(220); // trigger swap
    });

    expect(result.current.current).toBe("Beta");
  });
});
