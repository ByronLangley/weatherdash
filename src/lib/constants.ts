export const OWM_BASE_URL = "https://api.openweathermap.org/data/2.5";
export const OWM_GEO_URL = "https://api.openweathermap.org/geo/1.0";
export const OWM_TILE_URL = "https://tile.openweathermap.org/map";

export const DEFAULT_COORDS = { lat: 40.7128, lon: -74.006 }; // NYC fallback
export const GEOCODE_LIMIT = 5;

export const RATE_LIMIT_WINDOW_MS = 60_000;
export const RATE_LIMIT_MAX_REQUESTS = 60;

export const GEOLOCATION_TIMEOUT_MS = 10_000;
export const SEARCH_DEBOUNCE_MS = 300;
export const SEARCH_MIN_LENGTH = 2;
export const SEARCH_MAX_LENGTH = 100;

export const MAX_RECENT_CITIES = 5;

export const STORAGE_KEYS = {
  unit: "weatherdash-unit",
  theme: "weatherdash-theme",
  recentCities: "weatherdash-recent-cities",
  lastCity: "weatherdash-last-city",
} as const;
