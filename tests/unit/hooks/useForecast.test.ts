import { describe, it, expect } from "vitest";
import { aggregateToDays, getMostFrequent } from "@/hooks/useForecast";
import type { OWMForecastItem } from "@/types/weather";

function makeForecastItem(
  overrides: Partial<OWMForecastItem> & { dt: number }
): OWMForecastItem {
  return {
    dt: overrides.dt,
    main: {
      temp: overrides.main?.temp ?? 10,
      feels_like: overrides.main?.feels_like ?? 8,
      temp_min: overrides.main?.temp_min ?? 8,
      temp_max: overrides.main?.temp_max ?? 12,
      humidity: overrides.main?.humidity ?? 75,
      pressure: overrides.main?.pressure ?? 1013,
    },
    weather: overrides.weather ?? [
      { id: 802, main: "Clouds", description: "scattered clouds", icon: "03d" },
    ],
    wind: overrides.wind ?? { speed: 3, deg: 180 },
    clouds: overrides.clouds ?? { all: 50 },
    visibility: overrides.visibility ?? 10000,
    pop: overrides.pop ?? 0,
    dt_txt: overrides.dt_txt ?? "",
  };
}

describe("getMostFrequent", () => {
  it("returns the most frequent value", () => {
    expect(getMostFrequent(["rain", "clouds", "rain", "clear"])).toBe("rain");
  });

  it("returns the first max if tied", () => {
    const result = getMostFrequent(["a", "b"]);
    expect(["a", "b"]).toContain(result);
  });

  it("works with a single element", () => {
    expect(getMostFrequent(["only"])).toBe("only");
  });
});

describe("aggregateToDays", () => {
  it("aggregates 3-hour intervals into daily summaries", () => {
    // Create 8 entries for one day (24 hours / 3 = 8 intervals)
    const baseTime = new Date("2025-01-15T00:00:00Z").getTime() / 1000;
    const items: OWMForecastItem[] = [];

    for (let i = 0; i < 8; i++) {
      items.push(
        makeForecastItem({
          dt: baseTime + i * 3 * 3600,
          main: {
            temp: 10 + i,
            feels_like: 8 + i,
            temp_min: 5 + i,
            temp_max: 15 + i,
            humidity: 70 + i,
            pressure: 1013,
          },
          dt_txt: `2025-01-15 ${String(i * 3).padStart(2, "0")}:00:00`,
        })
      );
    }

    const result = aggregateToDays(items);

    expect(result).toHaveLength(1);
    expect(result[0].tempMin).toBe(5); // min of all temp_min values
    expect(result[0].tempMax).toBe(22); // max of all temp_max values
    expect(result[0].conditionMain).toBe("Clouds");
  });

  it("limits output to 5 days", () => {
    const baseTime = new Date("2025-01-15T00:00:00Z").getTime() / 1000;
    const items: OWMForecastItem[] = [];

    // Create entries for 6 days
    for (let day = 0; day < 6; day++) {
      for (let hour = 0; hour < 8; hour++) {
        items.push(
          makeForecastItem({
            dt: baseTime + day * 86400 + hour * 3 * 3600,
            dt_txt: `2025-01-${15 + day} ${String(hour * 3).padStart(2, "0")}:00:00`,
          })
        );
      }
    }

    const result = aggregateToDays(items);
    expect(result.length).toBeLessThanOrEqual(5);
  });

  it("finds the most frequent condition for each day", () => {
    const baseTime = new Date("2025-01-15T00:00:00Z").getTime() / 1000;
    const items: OWMForecastItem[] = [];

    // 5 cloudy + 3 rainy entries for one day
    for (let i = 0; i < 5; i++) {
      items.push(
        makeForecastItem({
          dt: baseTime + i * 3 * 3600,
          weather: [
            { id: 802, main: "Clouds", description: "clouds", icon: "03d" },
          ],
        })
      );
    }
    for (let i = 5; i < 8; i++) {
      items.push(
        makeForecastItem({
          dt: baseTime + i * 3 * 3600,
          weather: [
            { id: 500, main: "Rain", description: "rain", icon: "10d" },
          ],
        })
      );
    }

    const result = aggregateToDays(items);
    expect(result[0].conditionMain).toBe("Clouds");
  });
});
