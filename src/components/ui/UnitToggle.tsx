"use client";

import { useWeatherContext } from "@/providers/WeatherProvider";

export function UnitToggle() {
  const { unit, setUnit } = useWeatherContext();

  return (
    <div
      className="flex h-10 overflow-hidden rounded-[--radius-md] border border-border"
      role="radiogroup"
      aria-label="Temperature unit"
    >
      <button
        role="radio"
        aria-checked={unit === "metric"}
        onClick={() => setUnit("metric")}
        className={`flex h-full w-10 items-center justify-center text-sm font-semibold transition-colors ${
          unit === "metric"
            ? "bg-accent text-white"
            : "bg-bg-card text-text-secondary hover:bg-bg-tertiary"
        }`}
      >
        °C
      </button>
      <button
        role="radio"
        aria-checked={unit === "imperial"}
        onClick={() => setUnit("imperial")}
        className={`flex h-full w-10 items-center justify-center text-sm font-semibold transition-colors ${
          unit === "imperial"
            ? "bg-accent text-white"
            : "bg-bg-card text-text-secondary hover:bg-bg-tertiary"
        }`}
      >
        °F
      </button>
    </div>
  );
}
