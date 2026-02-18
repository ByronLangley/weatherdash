import { describe, it, expect, beforeEach } from "vitest";
import { checkRateLimit, resetRateLimiter } from "@/lib/rate-limiter";

describe("rate-limiter", () => {
  beforeEach(() => {
    resetRateLimiter();
  });

  it("allows requests within the limit", () => {
    for (let i = 0; i < 5; i++) {
      expect(checkRateLimit("127.0.0.1", 60000, 5)).toBe(true);
    }
  });

  it("blocks requests exceeding the limit", () => {
    for (let i = 0; i < 5; i++) {
      checkRateLimit("127.0.0.1", 60000, 5);
    }
    expect(checkRateLimit("127.0.0.1", 60000, 5)).toBe(false);
  });

  it("tracks different IPs independently", () => {
    for (let i = 0; i < 5; i++) {
      checkRateLimit("10.0.0.1", 60000, 5);
    }
    expect(checkRateLimit("10.0.0.1", 60000, 5)).toBe(false);
    expect(checkRateLimit("10.0.0.2", 60000, 5)).toBe(true);
  });

  it("allows requests after window expires", () => {
    // Use a very short window (1ms)
    for (let i = 0; i < 3; i++) {
      checkRateLimit("127.0.0.1", 1, 3);
    }
    // Wait 5ms for window to expire
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(checkRateLimit("127.0.0.1", 1, 3)).toBe(true);
        resolve();
      }, 5);
    });
  });
});
