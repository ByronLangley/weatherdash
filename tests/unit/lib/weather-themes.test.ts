import { describe, it, expect } from "vitest";
import {
  conditionToTheme,
  weatherThemes,
  type WeatherThemeKey,
} from "@/lib/weather-themes";

describe("conditionToTheme", () => {
  it("maps thunderstorm IDs (200-299) to thunderstorm", () => {
    expect(conditionToTheme(200)).toBe("thunderstorm");
    expect(conditionToTheme(232)).toBe("thunderstorm");
    expect(conditionToTheme(299)).toBe("thunderstorm");
  });

  it("maps drizzle IDs (300-399) to drizzle", () => {
    expect(conditionToTheme(300)).toBe("drizzle");
    expect(conditionToTheme(321)).toBe("drizzle");
  });

  it("maps rain IDs (500-599) to rain", () => {
    expect(conditionToTheme(500)).toBe("rain");
    expect(conditionToTheme(502)).toBe("rain");
    expect(conditionToTheme(531)).toBe("rain");
  });

  it("maps snow IDs (600-699) to snow", () => {
    expect(conditionToTheme(600)).toBe("snow");
    expect(conditionToTheme(622)).toBe("snow");
  });

  it("maps atmosphere IDs (700-799) to atmosphere", () => {
    expect(conditionToTheme(701)).toBe("atmosphere"); // mist
    expect(conditionToTheme(741)).toBe("atmosphere"); // fog
    expect(conditionToTheme(781)).toBe("atmosphere"); // tornado
  });

  it("maps clear day (800 with day icon) to clear-day", () => {
    expect(conditionToTheme(800, "01d")).toBe("clear-day");
  });

  it("maps clear night (800 with night icon) to clear-night", () => {
    expect(conditionToTheme(800, "01n")).toBe("clear-night");
  });

  it("maps clear without icon to clear-day", () => {
    expect(conditionToTheme(800)).toBe("clear-day");
  });

  it("maps cloud IDs (801-804) to clouds", () => {
    expect(conditionToTheme(801)).toBe("clouds");
    expect(conditionToTheme(802)).toBe("clouds");
    expect(conditionToTheme(804)).toBe("clouds");
  });

  it("defaults to clouds for unknown IDs", () => {
    expect(conditionToTheme(999)).toBe("clouds");
  });
});

describe("weatherThemes", () => {
  const allThemes: WeatherThemeKey[] = [
    "clear-day",
    "clear-night",
    "clouds",
    "rain",
    "drizzle",
    "thunderstorm",
    "snow",
    "atmosphere",
  ];

  it("has all 8 theme variants", () => {
    expect(Object.keys(weatherThemes)).toHaveLength(8);
    for (const key of allThemes) {
      expect(weatherThemes[key]).toBeDefined();
    }
  });

  it("each theme has both light and dark modes", () => {
    for (const key of allThemes) {
      expect(weatherThemes[key].light).toBeDefined();
      expect(weatherThemes[key].dark).toBeDefined();
    }
  });

  it("each mode has all required CSS properties", () => {
    const requiredProps = [
      "--weather-bg",
      "--weather-accent",
      "--weather-tint",
      "--weather-gradient-from",
      "--weather-gradient-to",
    ];

    for (const key of allThemes) {
      for (const prop of requiredProps) {
        expect(weatherThemes[key].light).toHaveProperty(prop);
        expect(weatherThemes[key].dark).toHaveProperty(prop);
      }
    }
  });

  it("all color values are valid hex codes", () => {
    const hexRegex = /^#[0-9A-Fa-f]{6}$/;

    for (const key of allThemes) {
      for (const value of Object.values(weatherThemes[key].light)) {
        expect(value).toMatch(hexRegex);
      }
      for (const value of Object.values(weatherThemes[key].dark)) {
        expect(value).toMatch(hexRegex);
      }
    }
  });
});
