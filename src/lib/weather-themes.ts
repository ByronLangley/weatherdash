export type WeatherThemeKey =
  | "clear-day"
  | "clear-night"
  | "clouds"
  | "rain"
  | "drizzle"
  | "thunderstorm"
  | "snow"
  | "atmosphere";

interface ThemeColors {
  "--weather-bg": string;
  "--weather-accent": string;
  "--weather-tint": string;
  "--weather-gradient-from": string;
  "--weather-gradient-to": string;
}

interface WeatherTheme {
  light: ThemeColors;
  dark: ThemeColors;
}

export const weatherThemes: Record<WeatherThemeKey, WeatherTheme> = {
  "clear-day": {
    light: {
      "--weather-bg": "#FEF3C7",
      "--weather-accent": "#F59E0B",
      "--weather-tint": "#FDE68A",
      "--weather-gradient-from": "#FEF3C7",
      "--weather-gradient-to": "#FDE68A",
    },
    dark: {
      "--weather-bg": "#422006",
      "--weather-accent": "#F59E0B",
      "--weather-tint": "#78350F",
      "--weather-gradient-from": "#1C1917",
      "--weather-gradient-to": "#422006",
    },
  },
  "clear-night": {
    light: {
      "--weather-bg": "#EFF6FF",
      "--weather-accent": "#6366F1",
      "--weather-tint": "#C7D2FE",
      "--weather-gradient-from": "#EEF2FF",
      "--weather-gradient-to": "#E0E7FF",
    },
    dark: {
      "--weather-bg": "#020617",
      "--weather-accent": "#6366F1",
      "--weather-tint": "#1E1B4B",
      "--weather-gradient-from": "#020617",
      "--weather-gradient-to": "#0F172A",
    },
  },
  clouds: {
    light: {
      "--weather-bg": "#F1F5F9",
      "--weather-accent": "#94A3B8",
      "--weather-tint": "#E2E8F0",
      "--weather-gradient-from": "#F8FAFC",
      "--weather-gradient-to": "#F1F5F9",
    },
    dark: {
      "--weather-bg": "#1E293B",
      "--weather-accent": "#94A3B8",
      "--weather-tint": "#334155",
      "--weather-gradient-from": "#1E293B",
      "--weather-gradient-to": "#0F172A",
    },
  },
  rain: {
    light: {
      "--weather-bg": "#EFF6FF",
      "--weather-accent": "#3B82F6",
      "--weather-tint": "#DBEAFE",
      "--weather-gradient-from": "#EFF6FF",
      "--weather-gradient-to": "#DBEAFE",
    },
    dark: {
      "--weather-bg": "#0C1929",
      "--weather-accent": "#3B82F6",
      "--weather-tint": "#1E3A5F",
      "--weather-gradient-from": "#0C1929",
      "--weather-gradient-to": "#0F172A",
    },
  },
  drizzle: {
    light: {
      "--weather-bg": "#F0FDFA",
      "--weather-accent": "#14B8A6",
      "--weather-tint": "#CCFBF1",
      "--weather-gradient-from": "#F0FDFA",
      "--weather-gradient-to": "#CCFBF1",
    },
    dark: {
      "--weather-bg": "#042F2E",
      "--weather-accent": "#14B8A6",
      "--weather-tint": "#134E4A",
      "--weather-gradient-from": "#042F2E",
      "--weather-gradient-to": "#0F172A",
    },
  },
  thunderstorm: {
    light: {
      "--weather-bg": "#EDE9FE",
      "--weather-accent": "#8B5CF6",
      "--weather-tint": "#DDD6FE",
      "--weather-gradient-from": "#EDE9FE",
      "--weather-gradient-to": "#DDD6FE",
    },
    dark: {
      "--weather-bg": "#1E1338",
      "--weather-accent": "#8B5CF6",
      "--weather-tint": "#2E1065",
      "--weather-gradient-from": "#1E1338",
      "--weather-gradient-to": "#0F172A",
    },
  },
  snow: {
    light: {
      "--weather-bg": "#F0F9FF",
      "--weather-accent": "#38BDF8",
      "--weather-tint": "#BAE6FD",
      "--weather-gradient-from": "#F0F9FF",
      "--weather-gradient-to": "#E0F2FE",
    },
    dark: {
      "--weather-bg": "#0F172A",
      "--weather-accent": "#BAE6FD",
      "--weather-tint": "#0C4A6E",
      "--weather-gradient-from": "#0F172A",
      "--weather-gradient-to": "#082F49",
    },
  },
  atmosphere: {
    light: {
      "--weather-bg": "#F8FAFC",
      "--weather-accent": "#CBD5E1",
      "--weather-tint": "#E2E8F0",
      "--weather-gradient-from": "#F8FAFC",
      "--weather-gradient-to": "#F1F5F9",
    },
    dark: {
      "--weather-bg": "#1E293B",
      "--weather-accent": "#CBD5E1",
      "--weather-tint": "#334155",
      "--weather-gradient-from": "#1E293B",
      "--weather-gradient-to": "#0F172A",
    },
  },
};

/**
 * Maps an OWM weather condition ID to a theme key.
 * See: https://openweathermap.org/weather-conditions
 */
export function conditionToTheme(
  conditionId: number,
  icon?: string
): WeatherThemeKey {
  const isNight = icon?.endsWith("n") ?? false;

  // 200-299: Thunderstorm
  if (conditionId >= 200 && conditionId < 300) return "thunderstorm";
  // 300-399: Drizzle
  if (conditionId >= 300 && conditionId < 400) return "drizzle";
  // 500-599: Rain
  if (conditionId >= 500 && conditionId < 600) return "rain";
  // 600-699: Snow
  if (conditionId >= 600 && conditionId < 700) return "snow";
  // 700-799: Atmosphere (fog, mist, haze, dust, etc.)
  if (conditionId >= 700 && conditionId < 800) return "atmosphere";
  // 800: Clear
  if (conditionId === 800) return isNight ? "clear-night" : "clear-day";
  // 801-804: Clouds
  if (conditionId > 800) return "clouds";

  return "clouds";
}

/**
 * Apply weather theme CSS variables to the document root.
 */
export function applyWeatherTheme(
  themeKey: WeatherThemeKey,
  isDark: boolean
): void {
  const theme = weatherThemes[themeKey];
  const colors = isDark ? theme.dark : theme.light;

  const root = document.documentElement;
  for (const [prop, value] of Object.entries(colors)) {
    root.style.setProperty(prop, value);
  }
}
