"use client";

import { X, Trash2 } from "lucide-react";
import { useWeatherContext } from "@/providers/WeatherProvider";

export function RecentCities() {
  const {
    recentCities,
    setCurrentCity,
    removeRecentCity,
    clearRecentCities,
    coords,
  } = useWeatherContext();

  if (recentCities.length === 0) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
      <span className="shrink-0 text-xs text-text-tertiary">Recent:</span>
      {recentCities.map((city) => {
        const isActive =
          coords &&
          Math.round(city.lat * 100) === Math.round(coords.lat * 100) &&
          Math.round(city.lon * 100) === Math.round(coords.lon * 100);

        return (
          <div
            key={`${city.lat}-${city.lon}`}
            className={`group flex shrink-0 items-center gap-1 rounded-[--radius-full] px-3 py-1.5 text-xs font-medium transition-colors duration-300 ${
              isActive
                ? "bg-weather-accent text-white"
                : "bg-bg-tertiary text-text-secondary hover:bg-bg-secondary"
            }`}
          >
            <button
              onClick={() => setCurrentCity(city)}
              className="max-w-[120px] truncate"
            >
              {city.name}
            </button>
            <button
              aria-label={`Remove ${city.name}`}
              onClick={(e) => {
                e.stopPropagation();
                removeRecentCity(city.lat, city.lon);
              }}
              className={`ml-0.5 h-4 w-4 flex items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100 ${
                isActive ? "text-white/80 hover:text-white" : "text-text-tertiary hover:text-text-primary"
              }`}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        );
      })}
      {recentCities.length > 1 && (
        <button
          onClick={clearRecentCities}
          className="shrink-0 p-1 text-xs text-text-tertiary hover:text-error"
          aria-label="Clear all recent cities"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
