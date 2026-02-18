"use client";

import { useWeatherContext } from "@/providers/WeatherProvider";
import { useForecast } from "@/hooks/useForecast";
import { WeatherIcon } from "./WeatherIcon";
import { ForecastCardsSkeleton } from "./ForecastCardsSkeleton";
import { ErrorCard } from "@/components/ui/ErrorCard";
import { formatTemp } from "@/lib/units";

export function ForecastCards() {
  const { coords, unit } = useWeatherContext();
  const { forecast, loading, error, refetch } = useForecast(coords);

  if (loading) return <ForecastCardsSkeleton />;
  if (error) return <ErrorCard message={error} onRetry={refetch} />;
  if (forecast.length === 0) return null;

  return (
    <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
      {forecast.map((day) => (
        <div
          key={day.dateISO}
          className={`flex min-w-[120px] flex-1 flex-col items-center gap-2 rounded-[--radius-lg] border bg-bg-card p-4 transition-colors ${
            day.date === "Today"
              ? "border-accent shadow-[var(--shadow-md)]"
              : "border-border"
          }`}
        >
          <p
            className={`text-sm font-semibold ${
              day.date === "Today" ? "text-accent" : "text-text-secondary"
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
        </div>
      ))}
    </div>
  );
}
