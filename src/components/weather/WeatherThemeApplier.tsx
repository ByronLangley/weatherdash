"use client";

import { useWeatherContext } from "@/providers/WeatherProvider";
import { useWeather } from "@/hooks/useWeather";
import { useWeatherTheme } from "@/hooks/useWeatherTheme";

/**
 * Invisible component that applies the weather theme CSS variables
 * based on the current weather condition.
 */
export function WeatherThemeApplier() {
  const { coords } = useWeatherContext();
  const { weather } = useWeather(coords);

  const conditionId = weather?.weather[0]?.id ?? null;
  const icon = weather?.weather[0]?.icon;

  useWeatherTheme(conditionId, icon);

  return null;
}
