export type Unit = "metric" | "imperial";

export interface City {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface Coords {
  lat: number;
  lon: number;
}

export interface DailyForecast {
  date: string; // e.g. "Mon", "Tue"
  dateISO: string; // e.g. "2025-01-15"
  tempMin: number; // Celsius
  tempMax: number; // Celsius
  conditionId: number;
  conditionMain: string;
  conditionIcon: string;
  humidity: number;
}

export interface HourlyPoint {
  dt: number;
  temp: number; // Celsius
  label: string; // formatted date/time string
}
