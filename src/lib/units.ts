import type { Unit } from "@/types/app";

export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

export function formatTemp(tempCelsius: number, unit: Unit): string {
  const value =
    unit === "imperial" ? celsiusToFahrenheit(tempCelsius) : tempCelsius;
  return `${Math.round(value)}°`;
}

export function formatTempWithUnit(tempCelsius: number, unit: Unit): string {
  const value =
    unit === "imperial" ? celsiusToFahrenheit(tempCelsius) : tempCelsius;
  return `${Math.round(value)}°${unit === "imperial" ? "F" : "C"}`;
}

export function formatWindSpeed(mps: number, unit: Unit): string {
  if (unit === "imperial") {
    // m/s to mph
    return `${Math.round(mps * 2.237)} mph`;
  }
  return `${Math.round(mps * 3.6)} km/h`;
}
