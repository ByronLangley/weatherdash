"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useWeatherContext } from "@/providers/WeatherProvider";
import { useForecast } from "@/hooks/useForecast";
import { TemperatureChartSkeleton } from "./TemperatureChartSkeleton";
import { ErrorCard } from "@/components/ui/ErrorCard";
import { celsiusToFahrenheit } from "@/lib/units";
import type { Unit } from "@/types/app";

function convertTemp(tempC: number, unit: Unit): number {
  return unit === "imperial"
    ? Math.round(celsiusToFahrenheit(tempC))
    : Math.round(tempC);
}

export function TemperatureChart() {
  const { coords, unit } = useWeatherContext();
  const { forecast, loading, error, refetch } = useForecast(coords);

  if (loading) return <TemperatureChartSkeleton />;
  if (error) return <ErrorCard message={error} onRetry={refetch} />;
  if (forecast.length === 0) return null;

  const chartData = forecast.map((day) => ({
    name: day.date,
    high: convertTemp(day.tempMax, unit),
    low: convertTemp(day.tempMin, unit),
  }));

  const unitLabel = unit === "imperial" ? "°F" : "°C";

  return (
    <div className="rounded-[--radius-lg] border border-border bg-bg-card p-6">
      <h3 className="mb-4 text-sm font-semibold text-text-secondary">
        Temperature Trend ({unitLabel})
      </h3>
      <div className="h-56" role="img" aria-label={`Temperature trend chart showing high and low temperatures for the next ${forecast.length} days`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              opacity={0.5}
            />
            <XAxis
              dataKey="name"
              tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              unit={unitLabel}
              width={50}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                color: "var(--text-primary)",
              }}
              formatter={(value: unknown, name: unknown) => [
                `${value}${unitLabel}`,
                name === "high" ? "High" : "Low",
              ]}
            />
            <Line
              type="monotone"
              dataKey="high"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ fill: "#ef4444", r: 4 }}
              activeDot={{ r: 6 }}
              name="high"
            />
            <Line
              type="monotone"
              dataKey="low"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6", r: 4 }}
              activeDot={{ r: 6 }}
              name="low"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Accessible hidden data table */}
      <table className="sr-only">
        <caption>Temperature forecast data</caption>
        <thead>
          <tr>
            <th>Day</th>
            <th>High</th>
            <th>Low</th>
          </tr>
        </thead>
        <tbody>
          {chartData.map((d) => (
            <tr key={d.name}>
              <td>{d.name}</td>
              <td>{d.high}{unitLabel}</td>
              <td>{d.low}{unitLabel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
