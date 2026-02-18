"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchCurrentWeather } from "@/lib/api";
import { logger } from "@/lib/logger";
import type { OWMCurrentWeather } from "@/types/weather";
import type { Coords } from "@/types/app";

interface UseWeatherResult {
  weather: OWMCurrentWeather | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useWeather(coords: Coords | null): UseWeatherResult {
  const [weather, setWeather] = useState<OWMCurrentWeather | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    if (!coords) return;

    setLoading(true);
    setError(null);

    try {
      logger.info("useWeather", "Fetching current weather", coords);
      const data = await fetchCurrentWeather(coords.lat, coords.lon);
      setWeather(data);
      logger.info("useWeather", "Weather data received", {
        city: data.name,
        temp: data.main.temp,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load weather data";
      setError(message);
      logger.error("useWeather", "Failed to fetch weather", err);
    } finally {
      setLoading(false);
    }
  }, [coords]);

  useEffect(() => {
    fetch_();
  }, [fetch_]);

  return { weather, loading, error, refetch: fetch_ };
}
