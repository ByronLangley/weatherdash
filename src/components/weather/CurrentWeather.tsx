"use client";

import { useWeatherContext } from "@/providers/WeatherProvider";
import { useWeather } from "@/hooks/useWeather";
import { WeatherIcon } from "./WeatherIcon";
import { CurrentWeatherSkeleton } from "./CurrentWeatherSkeleton";
import { ErrorCard } from "@/components/ui/ErrorCard";
import { formatTemp, formatTempWithUnit, formatWindSpeed } from "@/lib/units";
import { Droplets, Wind, Thermometer, Eye } from "lucide-react";

export function CurrentWeather() {
  const { coords, unit, geoLoading, geoError } = useWeatherContext();
  const { weather, loading, error, refetch } = useWeather(coords);

  if (geoLoading || loading) {
    return <CurrentWeatherSkeleton />;
  }

  if (!coords && geoError) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-[--radius-lg] border border-border bg-bg-card p-8 text-center">
        <p className="text-lg text-text-secondary">
          Search for a city to get started
        </p>
        <p className="text-sm text-text-tertiary">{geoError}</p>
      </div>
    );
  }

  if (error) {
    return <ErrorCard message={error} onRetry={refetch} />;
  }

  if (!weather) {
    return <CurrentWeatherSkeleton />;
  }

  const condition = weather.weather[0];

  return (
    <div className="overflow-hidden rounded-[--radius-lg] border border-border bg-bg-card p-6 shadow-[var(--shadow-md)] transition-colors duration-300">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-8">
        {/* Icon + condition */}
        <div className="flex flex-col items-center gap-2">
          <WeatherIcon
            conditionId={condition.id}
            icon={condition.icon}
            className="h-16 w-16 text-weather-accent"
          />
          <p className="text-sm font-medium capitalize text-text-secondary">
            {condition.description}
          </p>
        </div>

        {/* Temperature + city */}
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <h2 className="text-lg font-medium text-text-secondary">
            {weather.name}, {weather.sys.country}
          </h2>
          <p className="text-5xl font-bold tracking-tight text-text-primary sm:text-7xl">
            {formatTemp(weather.main.temp, unit)}
          </p>
          <p className="text-sm text-text-tertiary">
            Feels like {formatTempWithUnit(weather.main.feels_like, unit)}
          </p>
          <p className="text-sm text-text-tertiary">
            H: {formatTemp(weather.main.temp_max, unit)} &nbsp; L:{" "}
            {formatTemp(weather.main.temp_min, unit)}
          </p>
        </div>

        {/* Detail metrics */}
        <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-3 sm:ml-auto sm:mt-0 sm:flex-col sm:items-end">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Droplets className="h-4 w-4" />
            <span>Humidity: {weather.main.humidity}%</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Wind className="h-4 w-4" />
            <span>Wind: {formatWindSpeed(weather.wind.speed, unit)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Thermometer className="h-4 w-4" />
            <span>Pressure: {weather.main.pressure} hPa</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Eye className="h-4 w-4" />
            <span>
              Visibility: {Math.round(weather.visibility / 1000)} km
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
