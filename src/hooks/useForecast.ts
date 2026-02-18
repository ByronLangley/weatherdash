"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchForecast } from "@/lib/api";
import { logger } from "@/lib/logger";
import type { OWMForecastResponse, OWMForecastItem } from "@/types/weather";
import type { Coords, DailyForecast, HourlyPoint } from "@/types/app";

interface UseForecastResult {
  forecast: DailyForecast[];
  hourlyPoints: HourlyPoint[];
  raw: OWMForecastResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function getDayName(dt: number): string {
  return new Date(dt * 1000).toLocaleDateString("en-US", { weekday: "short" });
}

function getDateISO(dt: number): string {
  return new Date(dt * 1000).toISOString().split("T")[0];
}

function getMostFrequent<T>(arr: T[]): T {
  const counts = new Map<string, { value: T; count: number }>();
  for (const item of arr) {
    const key = JSON.stringify(item);
    const existing = counts.get(key);
    if (existing) {
      existing.count++;
    } else {
      counts.set(key, { value: item, count: 1 });
    }
  }
  let max: { value: T; count: number } | null = null;
  for (const entry of counts.values()) {
    if (!max || entry.count > max.count) {
      max = entry;
    }
  }
  return max!.value;
}

function aggregateToDays(items: OWMForecastItem[]): DailyForecast[] {
  const dayMap = new Map<
    string,
    {
      temps: number[];
      conditions: { id: number; main: string; icon: string }[];
      humidities: number[];
      dt: number;
    }
  >();

  for (const item of items) {
    const dateKey = getDateISO(item.dt);
    const existing = dayMap.get(dateKey);

    if (existing) {
      existing.temps.push(item.main.temp_min, item.main.temp_max);
      existing.conditions.push({
        id: item.weather[0].id,
        main: item.weather[0].main,
        icon: item.weather[0].icon,
      });
      existing.humidities.push(item.main.humidity);
    } else {
      dayMap.set(dateKey, {
        temps: [item.main.temp_min, item.main.temp_max],
        conditions: [
          {
            id: item.weather[0].id,
            main: item.weather[0].main,
            icon: item.weather[0].icon,
          },
        ],
        humidities: [item.main.humidity],
        dt: item.dt,
      });
    }
  }

  const today = getDateISO(Date.now() / 1000);

  return Array.from(dayMap.entries())
    .slice(0, 5)
    .map(([dateISO, data]) => {
      const dominantCondition = getMostFrequent(
        data.conditions.map((c) => c.main)
      );
      const dominantEntry = data.conditions.find(
        (c) => c.main === dominantCondition
      )!;

      return {
        date: dateISO === today ? "Today" : getDayName(data.dt),
        dateISO,
        tempMin: Math.min(...data.temps),
        tempMax: Math.max(...data.temps),
        conditionId: dominantEntry.id,
        conditionMain: dominantEntry.main,
        conditionIcon: dominantEntry.icon,
        humidity: Math.round(
          data.humidities.reduce((a, b) => a + b, 0) / data.humidities.length
        ),
      };
    });
}

function toHourlyPoints(items: OWMForecastItem[]): HourlyPoint[] {
  return items.map((item) => ({
    dt: item.dt,
    temp: item.main.temp,
    label: new Date(item.dt * 1000).toLocaleDateString("en-US", {
      weekday: "short",
      hour: "numeric",
    }),
  }));
}

export function useForecast(coords: Coords | null): UseForecastResult {
  const [raw, setRaw] = useState<OWMForecastResponse | null>(null);
  const [forecast, setForecast] = useState<DailyForecast[]>([]);
  const [hourlyPoints, setHourlyPoints] = useState<HourlyPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    if (!coords) return;

    setLoading(true);
    setError(null);

    try {
      logger.info("useForecast", "Fetching forecast", coords);
      const data = await fetchForecast(coords.lat, coords.lon);
      setRaw(data);
      setForecast(aggregateToDays(data.list));
      setHourlyPoints(toHourlyPoints(data.list));
      logger.info("useForecast", "Forecast data received", {
        items: data.list.length,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load forecast";
      setError(message);
      logger.error("useForecast", "Failed to fetch forecast", err);
    } finally {
      setLoading(false);
    }
  }, [coords]);

  useEffect(() => {
    fetch_();
  }, [fetch_]);

  return { forecast, hourlyPoints, raw, loading, error, refetch: fetch_ };
}

// Export for testing
export { aggregateToDays, getMostFrequent };
