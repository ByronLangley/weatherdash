"use client";

import { Header } from "@/components/layout/Header";
import { CurrentWeather } from "@/components/weather/CurrentWeather";
import { ForecastCards } from "@/components/weather/ForecastCards";
import { TemperatureChart } from "@/components/weather/TemperatureChart";
import { WeatherMap } from "@/components/weather/WeatherMap";
import { WeatherThemeApplier } from "@/components/weather/WeatherThemeApplier";
import { CitySearch } from "@/components/search/CitySearch";
import { RecentCities } from "@/components/search/RecentCities";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <WeatherThemeApplier />
      <Header searchSlot={<CitySearch />} />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6">
          {/* Recent cities chips */}
          <RecentCities />

          {/* Current Weather — full width hero */}
          <section aria-label="Current weather">
            <CurrentWeather />
          </section>

          {/* Forecast Cards */}
          <section aria-label="5-day forecast">
            <h2 className="mb-3 text-sm font-semibold text-text-secondary">
              5-Day Forecast
            </h2>
            <ForecastCards />
          </section>

          {/* Chart + Map row */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <section aria-label="Temperature trend">
              <TemperatureChart />
            </section>

            <section aria-label="Weather map">
              <WeatherMap />
            </section>
          </div>
        </div>
      </main>

      <footer className="mt-auto border-t border-border py-4 text-center text-sm text-text-tertiary">
        Powered by{" "}
        <a
          href="https://openweathermap.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          OpenWeatherMap
        </a>
      </footer>
    </div>
  );
}
