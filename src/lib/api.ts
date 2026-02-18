import type { OWMCurrentWeather, OWMForecastResponse } from "@/types/weather";
import type { GeocodingResult } from "@/types/geocode";
import { logger } from "./logger";

interface APIError {
  error: true;
  message: string;
  code: string;
}

async function fetchAPI<T>(url: string, context: string): Promise<T> {
  logger.info(context, `Fetching ${url}`);

  const response = await fetch(url);

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as APIError | null;
    const message =
      body?.message ?? `Request failed with status ${response.status}`;
    logger.error(context, "API request failed", {
      status: response.status,
      message,
    });
    throw new Error(message);
  }

  const data = (await response.json()) as T;
  logger.info(context, "API response received");
  return data;
}

export async function fetchCurrentWeather(
  lat: number,
  lon: number
): Promise<OWMCurrentWeather> {
  return fetchAPI<OWMCurrentWeather>(
    `/api/weather?lat=${lat}&lon=${lon}&type=current`,
    "fetchCurrentWeather"
  );
}

export async function fetchForecast(
  lat: number,
  lon: number
): Promise<OWMForecastResponse> {
  return fetchAPI<OWMForecastResponse>(
    `/api/weather?lat=${lat}&lon=${lon}&type=forecast`,
    "fetchForecast"
  );
}

export async function fetchGeocoding(
  query: string
): Promise<GeocodingResult[]> {
  return fetchAPI<GeocodingResult[]>(
    `/api/geocode?q=${encodeURIComponent(query)}`,
    "fetchGeocoding"
  );
}
