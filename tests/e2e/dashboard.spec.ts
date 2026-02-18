import { test, expect } from "@playwright/test";
import { mockWeatherAPIs } from "./fixtures/weather-mock";

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page, context }) => {
    // Mock geolocation
    await context.grantPermissions(["geolocation"]);
    await context.setGeolocation({ latitude: 40.71, longitude: -74.01 });

    // Mock weather APIs
    await mockWeatherAPIs(page);

    await page.goto("/");
  });

  test("displays current weather data", async ({ page }) => {
    await expect(page.getByText("Test City, TC")).toBeVisible();
    await expect(page.getByText("22°")).toBeVisible();
    await expect(page.getByText("clear sky")).toBeVisible();
    await expect(page.getByText(/Humidity: 60%/)).toBeVisible();
  });

  test("displays 5-day forecast section", async ({ page }) => {
    await expect(page.getByText("5-Day Forecast")).toBeVisible();
    await expect(page.getByLabel("5-day forecast").getByText("Today")).toBeVisible();
  });

  test("displays temperature trend chart", async ({ page }) => {
    await expect(page.getByText("Temperature Trend (°C)")).toBeVisible();
  });

  test("has all header controls", async ({ page }) => {
    await expect(page.getByRole("combobox", { name: /search/i })).toBeVisible();
    await expect(page.getByRole("radio", { name: "°C" })).toBeVisible();
    await expect(page.getByRole("radio", { name: "°F" })).toBeVisible();
  });

  test("shows footer with OpenWeatherMap attribution", async ({ page }) => {
    await expect(page.getByText("Powered by")).toBeVisible();
    await expect(page.getByRole("link", { name: "OpenWeatherMap" })).toBeVisible();
  });
});

test.describe("Dashboard without geolocation", () => {
  test("shows search prompt when geolocation is denied", async ({ page, context }) => {
    await context.clearPermissions();

    // Mock APIs but geolocation will fail
    await mockWeatherAPIs(page);

    await page.goto("/");

    await expect(
      page.getByText("Search for a city to get started")
    ).toBeVisible();
  });
});
