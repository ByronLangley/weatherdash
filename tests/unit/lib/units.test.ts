import { describe, it, expect } from "vitest";
import {
  celsiusToFahrenheit,
  formatTemp,
  formatTempWithUnit,
  formatWindSpeed,
} from "@/lib/units";

describe("celsiusToFahrenheit", () => {
  it("converts 0°C to 32°F", () => {
    expect(celsiusToFahrenheit(0)).toBe(32);
  });

  it("converts 100°C to 212°F", () => {
    expect(celsiusToFahrenheit(100)).toBe(212);
  });

  it("converts -40°C to -40°F", () => {
    expect(celsiusToFahrenheit(-40)).toBe(-40);
  });

  it("converts 37°C to 98.6°F", () => {
    expect(celsiusToFahrenheit(37)).toBeCloseTo(98.6);
  });
});

describe("formatTemp", () => {
  it("formats metric temperatures with degree symbol", () => {
    expect(formatTemp(20, "metric")).toBe("20°");
  });

  it("formats imperial temperatures with degree symbol", () => {
    expect(formatTemp(0, "imperial")).toBe("32°");
  });

  it("rounds to nearest integer", () => {
    expect(formatTemp(20.6, "metric")).toBe("21°");
    expect(formatTemp(20.4, "metric")).toBe("20°");
  });
});

describe("formatTempWithUnit", () => {
  it("includes C for metric", () => {
    expect(formatTempWithUnit(20, "metric")).toBe("20°C");
  });

  it("includes F for imperial", () => {
    expect(formatTempWithUnit(0, "imperial")).toBe("32°F");
  });
});

describe("formatWindSpeed", () => {
  it("formats m/s to km/h for metric", () => {
    expect(formatWindSpeed(10, "metric")).toBe("36 km/h");
  });

  it("formats m/s to mph for imperial", () => {
    expect(formatWindSpeed(10, "imperial")).toBe("22 mph");
  });

  it("rounds to nearest integer", () => {
    expect(formatWindSpeed(1, "metric")).toBe("4 km/h");
  });
});
