import { test, expect } from "@playwright/test";
import { mockWeatherAPIs } from "./fixtures/weather-mock";

test.describe("Dark Mode", () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(["geolocation"]);
    await context.setGeolocation({ latitude: 40.71, longitude: -74.01 });
    await mockWeatherAPIs(page);
  });

  test("toggles dark mode on and off", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Test City, TC")).toBeVisible();

    // Should start in light mode (no .dark class on html)
    const htmlEl = page.locator("html");

    // Click to switch to dark mode
    await page.getByRole("button", { name: /switch to dark mode/i }).click();
    await expect(htmlEl).toHaveClass(/dark/);

    // Click to switch back to light mode
    await page.getByRole("button", { name: /switch to light mode/i }).click();
    await expect(htmlEl).not.toHaveClass(/dark/);
  });

  test("persists dark mode preference after refresh", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Test City, TC")).toBeVisible();

    // Enable dark mode
    await page.getByRole("button", { name: /switch to dark mode/i }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);

    // Refresh page
    await page.reload();
    await expect(page.getByText("Test City, TC")).toBeVisible();

    // Should still be in dark mode
    await expect(page.locator("html")).toHaveClass(/dark/);
  });
});
