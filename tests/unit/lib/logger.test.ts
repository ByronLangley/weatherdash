import { describe, it, expect, vi, beforeEach } from "vitest";

describe("logger", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("logs info messages in development", async () => {
    vi.stubEnv("NODE_ENV", "development");
    // Re-import to pick up env change
    vi.resetModules();
    const { logger } = await import("@/lib/logger");

    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    logger.info("TestContext", "test message", { key: "value" });
    expect(spy).toHaveBeenCalledWith(
      "[INFO] [TestContext] test message",
      { key: "value" }
    );
  });

  it("does not log info in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.resetModules();
    const { logger } = await import("@/lib/logger");

    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    logger.info("TestContext", "should not appear");
    expect(spy).not.toHaveBeenCalled();
  });

  it("always logs errors regardless of environment", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.resetModules();
    const { logger } = await import("@/lib/logger");

    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    logger.error("TestContext", "error message", { err: "details" });
    expect(spy).toHaveBeenCalledWith(
      "[ERROR] [TestContext] error message",
      { err: "details" }
    );
  });

  it("always logs warnings regardless of environment", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.resetModules();
    const { logger } = await import("@/lib/logger");

    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    logger.warn("TestContext", "warning message");
    expect(spy).toHaveBeenCalledWith(
      "[WARN] [TestContext] warning message",
      ""
    );
  });
});
