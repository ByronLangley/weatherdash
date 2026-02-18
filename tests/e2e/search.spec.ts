import { test, expect } from "@playwright/test";
import { mockWeatherAPIs } from "./fixtures/weather-mock";

test.describe("City Search", () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(["geolocation"]);
    await context.setGeolocation({ latitude: 40.71, longitude: -74.01 });
    await mockWeatherAPIs(page);
    await page.goto("/");
    // Wait for initial weather to load
    await expect(page.getByText("Test City, TC")).toBeVisible();
  });

  test("shows autocomplete results when typing", async ({ page }) => {
    const searchInput = page.getByRole("combobox", { name: /search/i });
    await searchInput.fill("Test");

    // Wait for debounced search results
    await expect(page.getByRole("option", { name: /Test City/ })).toBeVisible();
    await expect(page.getByRole("option", { name: /Test Town/ })).toBeVisible();
  });

  test("selects a city from autocomplete results", async ({ page }) => {
    const searchInput = page.getByRole("combobox", { name: /search/i });
    await searchInput.fill("Test");

    await page.getByRole("option", { name: /Test City/ }).click();

    // Search should be cleared after selection
    await expect(searchInput).toHaveValue("");
  });

  test("clears search with the X button", async ({ page }) => {
    const searchInput = page.getByRole("combobox", { name: /search/i });
    await searchInput.fill("Test");

    await page.getByRole("button", { name: "Clear search" }).click();
    await expect(searchInput).toHaveValue("");
  });

  test("shows error for no results", async ({ page }) => {
    // Override geocode to return empty
    await page.route("**/api/geocode*", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      });
    });

    const searchInput = page.getByRole("combobox", { name: /search/i });
    await searchInput.fill("Nonexistent");

    await expect(
      page.getByText(/couldn't find that city/i)
    ).toBeVisible();
  });
});
