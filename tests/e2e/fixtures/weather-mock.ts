import type { Page } from "@playwright/test";

export const MOCK_CURRENT_WEATHER = {
  weather: [
    { id: 800, main: "Clear", description: "clear sky", icon: "01d" },
  ],
  main: {
    temp: 22,
    feels_like: 20,
    temp_min: 18,
    temp_max: 25,
    humidity: 60,
    pressure: 1015,
  },
  wind: { speed: 5, deg: 200 },
  clouds: { all: 0 },
  visibility: 10000,
  dt: Math.floor(Date.now() / 1000),
  name: "Test City",
  sys: { country: "TC", sunrise: 1700000000, sunset: 1700040000 },
  coord: { lat: 40.71, lon: -74.01 },
};

export const MOCK_FORECAST = {
  list: Array.from({ length: 40 }, (_, i) => ({
    dt: Math.floor(Date.now() / 1000) + i * 3 * 3600,
    main: {
      temp: 20 + Math.sin(i) * 5,
      feels_like: 18 + Math.sin(i) * 5,
      temp_min: 18 + Math.sin(i) * 3,
      temp_max: 22 + Math.sin(i) * 5,
      humidity: 60,
      pressure: 1015,
    },
    weather: [
      { id: 800, main: "Clear", description: "clear sky", icon: "01d" },
    ],
    wind: { speed: 4, deg: 180 },
    clouds: { all: 10 },
    visibility: 10000,
    pop: 0,
    dt_txt: new Date(
      (Math.floor(Date.now() / 1000) + i * 3 * 3600) * 1000
    ).toISOString(),
  })),
  city: {
    name: "Test City",
    country: "TC",
    coord: { lat: 40.71, lon: -74.01 },
    timezone: -18000,
    sunrise: 1700000000,
    sunset: 1700040000,
  },
};

export const MOCK_GEOCODE = [
  { name: "Test City", lat: 40.71, lon: -74.01, country: "TC", state: "TS" },
  { name: "Test Town", lat: 41.0, lon: -75.0, country: "TC", state: "TT" },
];

export async function mockWeatherAPIs(page: Page) {
  await page.route("**/api/weather*type=current*", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_CURRENT_WEATHER),
    });
  });

  await page.route("**/api/weather*type=forecast*", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_FORECAST),
    });
  });

  await page.route("**/api/geocode*", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_GEOCODE),
    });
  });
}
