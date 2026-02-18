"use client";

import { useState } from "react";
import { useWeatherContext } from "@/providers/WeatherProvider";
import { useForecast } from "@/hooks/useForecast";
import { WeatherIcon } from "./WeatherIcon";
import { ForecastCardsSkeleton } from "./ForecastCardsSkeleton";
import { ErrorCard } from "@/components/ui/ErrorCard";
import { formatTemp, formatWindSpeed } from "@/lib/units";
import { Droplets, Wind, CloudRain, ChevronDown } from "lucide-react";
import type { OWMForecastItem } from "@/types/weather";

function getDateISO(dt: number): string {
  return new Date(dt * 1000).toISOString().split("T")[0];
}

function formatTime(dt: number): string {
  return new Date(dt * 1000).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function ForecastCards() {
  const { coords, unit } = useWeatherContext();
  const { forecast, raw, loading, error, refetch } = useForecast(coords);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  if (loading) return <ForecastCardsSkeleton />;
  if (error) return <ErrorCard message={error} onRetry={refetch} />;
  if (forecast.length === 0) return null;

  // Get 3-hour intervals for the selected day
  const selectedIntervals: OWMForecastItem[] =
    selectedDay && raw
      ? raw.list.filter(
          (item) => getDateISO(item.dt) === selectedDay
        )
      : [];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
        {forecast.map((day) => {
          const isSelected = selectedDay === day.dateISO;

          return (
            <button
              key={day.dateISO}
              onClick={() =>
                setSelectedDay(isSelected ? null : day.dateISO)
              }
              className={`flex min-w-[120px] flex-1 flex-col items-center gap-2 rounded-[--radius-lg] border bg-bg-card p-4 transition-all cursor-pointer ${
                isSelected
                  ? "border-accent shadow-[var(--shadow-md)] ring-2 ring-accent/30"
                  : day.date === "Today"
                  ? "border-accent/50 shadow-[var(--shadow-sm)]"
                  : "border-border hover:border-accent/30 hover:shadow-[var(--shadow-sm)]"
              }`}
              aria-pressed={isSelected}
              aria-label={`${day.date} forecast: ${day.conditionMain}, high ${formatTemp(day.tempMax, unit)}, low ${formatTemp(day.tempMin, unit)}`}
            >
              <p
                className={`text-sm font-semibold ${
                  isSelected
                    ? "text-accent"
                    : day.date === "Today"
                    ? "text-accent"
                    : "text-text-secondary"
                }`}
              >
                {day.date}
              </p>
              <WeatherIcon
                conditionId={day.conditionId}
                icon={day.conditionIcon}
                className="h-8 w-8 text-text-primary"
              />
              <div className="text-center">
                <p className="text-sm font-bold text-text-primary">
                  {formatTemp(day.tempMax, unit)}
                </p>
                <p className="text-xs text-text-tertiary">
                  {formatTemp(day.tempMin, unit)}
                </p>
              </div>
              <p className="text-xs text-text-secondary">{day.conditionMain}</p>
              <ChevronDown
                className={`h-3 w-3 text-text-tertiary transition-transform ${
                  isSelected ? "rotate-180" : ""
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Expanded hourly detail panel */}
      {selectedDay && selectedIntervals.length > 0 && (
        <div className="rounded-[--radius-lg] border border-accent/30 bg-bg-card p-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <h3 className="mb-3 text-sm font-semibold text-text-secondary">
            {forecast.find((d) => d.dateISO === selectedDay)?.date} — 3-Hour
            Breakdown
          </h3>
          <div className="overflow-x-auto hide-scrollbar">
            <div className="flex gap-3">
              {selectedIntervals.map((interval) => (
                <div
                  key={interval.dt}
                  className="flex min-w-[100px] flex-col items-center gap-1.5 rounded-[--radius-md] border border-border bg-bg-secondary p-3"
                >
                  <p className="text-xs font-medium text-text-secondary">
                    {formatTime(interval.dt)}
                  </p>
                  <WeatherIcon
                    conditionId={interval.weather[0].id}
                    icon={interval.weather[0].icon}
                    className="h-6 w-6 text-text-primary"
                  />
                  <p className="text-sm font-bold text-text-primary">
                    {formatTemp(interval.main.temp, unit)}
                  </p>
                  <div className="flex flex-col gap-0.5 text-center">
                    <span className="flex items-center gap-1 text-[10px] text-text-tertiary">
                      <Droplets className="h-3 w-3" />
                      {interval.main.humidity}%
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-text-tertiary">
                      <Wind className="h-3 w-3" />
                      {formatWindSpeed(interval.wind.speed, unit)}
                    </span>
                    {interval.pop > 0 && (
                      <span className="flex items-center gap-1 text-[10px] text-text-tertiary">
                        <CloudRain className="h-3 w-3" />
                        {Math.round(interval.pop * 100)}%
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
