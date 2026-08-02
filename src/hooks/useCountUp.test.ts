import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useCountUp } from "@/hooks/useCountUp";

describe("useCountUp", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("jumps straight to the target when reduced motion is set", () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
    })) as unknown as typeof window.matchMedia;

    const { result } = renderHook(() => useCountUp(128));
    expect(result.current).toBe(128);
  });

  it("eventually reaches the target value when motion is not reduced", async () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
    })) as unknown as typeof window.matchMedia;

    const { result } = renderHook(() => useCountUp(50, 50));
    await waitFor(() => expect(result.current).toBe(50), { timeout: 1000 });
  });

  it("returns 0 immediately for a target of 0", () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
    })) as unknown as typeof window.matchMedia;

    const { result } = renderHook(() => useCountUp(0));
    expect(result.current).toBe(0);
  });
});
