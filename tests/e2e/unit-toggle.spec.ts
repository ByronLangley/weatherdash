import { test, expect } from "@playwright/test";
import { mockWeatherAPIs } from "./fixtures/weather-mock";

test.describe("Unit Toggle (°C / °F)", () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(["geolocation"]);
    await context.setGeolocation({ latitude: 40.71, longitude: -74.01 });
    await mockWeatherAPIs(page);
    await page.goto("/");
    await expect(page.getByText("Test City, TC")).toBeVisible();
  });

  test("defaults to Celsius", async ({ page }) => {
    await expect(page.getByRole("radio", { name: "°C" })).toBeChecked();
    await expect(page.getByText("22°")).toBeVisible();
    await expect(page.getByText("Temperature Trend (°C)")).toBeVisible();
  });

  test("switches to Fahrenheit when clicking °F", async ({ page }) => {
    await page.getByRole("radio", { name: "°F" }).click();

    await expect(page.getByRole("radio", { name: "°F" })).toBeChecked();
    // 22°C = 72°F (rounded)
    await expect(page.getByText("72°")).toBeVisible();
    await expect(page.getByText("Temperature Trend (°F)")).toBeVisible();
  });

  test("switches back to Celsius", async ({ page }) => {
    await page.getByRole("radio", { name: "°F" }).click();
    await expect(page.getByText("72°")).toBeVisible();

    await page.getByRole("radio", { name: "°C" }).click();
    await expect(page.getByText("22°")).toBeVisible();
  });
});
