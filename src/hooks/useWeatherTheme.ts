"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import {
  conditionToTheme,
  applyWeatherTheme,
  type WeatherThemeKey,
} from "@/lib/weather-themes";
import { logger } from "@/lib/logger";

/**
 * Applies weather-based CSS theme variables when the condition changes.
 * Also reapplies when dark/light mode toggles.
 */
export function useWeatherTheme(
  conditionId: number | null,
  icon?: string
): WeatherThemeKey | null {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const themeKey =
    conditionId !== null ? conditionToTheme(conditionId, icon) : null;

  useEffect(() => {
    if (themeKey) {
      logger.info("useWeatherTheme", "Applying weather theme", {
        themeKey,
        isDark,
      });
      applyWeatherTheme(themeKey, isDark);
    }
  }, [themeKey, isDark]);

  return themeKey;
}
