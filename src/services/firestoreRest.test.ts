import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fetchPublicFirestoreDoc } from "@/services/firestoreRest";

const originalFetch = globalThis.fetch;

describe("fetchPublicFirestoreDoc", () => {
  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.unstubAllEnvs();
  });

  beforeEach(() => {
    vi.stubEnv("VITE_FIREBASE_PROJECT_ID", "test-project");
  });

  it("unwraps Firestore's REST value-wrapper format into plain values", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        fields: {
          linkedin: { stringValue: "https://linkedin.com/in/test" },
          featured: { booleanValue: true },
          order: { integerValue: "3" },
        },
      }),
    }) as unknown as typeof fetch;

    const result = await fetchPublicFirestoreDoc("settings", "social");
    expect(result).toEqual({
      linkedin: "https://linkedin.com/in/test",
      featured: true,
      order: 3,
    });
  });

  it("returns null on a 404 (document doesn't exist)", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    }) as unknown as typeof fetch;

    const result = await fetchPublicFirestoreDoc("settings", "nonexistent");
    expect(result).toBeNull();
  });

  it("returns null when the project ID isn't configured", async () => {
    vi.stubEnv("VITE_FIREBASE_PROJECT_ID", "");
    globalThis.fetch = vi.fn();

    const result = await fetchPublicFirestoreDoc("settings", "social");
    expect(result).toBeNull();
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it("returns null instead of throwing on a network error", async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("network down"));
    const result = await fetchPublicFirestoreDoc("settings", "social");
    expect(result).toBeNull();
  });
});
