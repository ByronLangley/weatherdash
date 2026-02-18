"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { STORAGE_KEYS, MAX_RECENT_CITIES } from "@/lib/constants";
import { logger } from "@/lib/logger";
import type { Coords, Unit, City } from "@/types/app";

interface WeatherContextValue {
  coords: Coords | null;
  setCoords: (coords: Coords) => void;
  currentCity: City | null;
  setCurrentCity: (city: City) => void;
  unit: Unit;
  setUnit: (unit: Unit) => void;
  recentCities: City[];
  addRecentCity: (city: City) => void;
  removeRecentCity: (lat: number, lon: number) => void;
  clearRecentCities: () => void;
  geoLoading: boolean;
  geoError: string | null;
}

const WeatherContext = createContext<WeatherContextValue | null>(null);

export function useWeatherContext(): WeatherContextValue {
  const ctx = useContext(WeatherContext);
  if (!ctx) {
    throw new Error("useWeatherContext must be used within WeatherProvider");
  }
  return ctx;
}

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = localStorage.getItem(key);
    if (stored === null) return fallback;
    return JSON.parse(stored) as T;
  } catch {
    logger.warn("WeatherProvider", `Failed to read localStorage key: ${key}`);
    return fallback;
  }
}

function saveToStorage(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    logger.warn("WeatherProvider", `Failed to write localStorage key: ${key}`);
  }
}

export function WeatherProvider({ children }: { children: ReactNode }) {
  const { coords: geoCoords, error: geoError, loading: geoLoading } = useGeolocation();

  const [coords, setCoords] = useState<Coords | null>(null);
  const [currentCity, setCurrentCity] = useState<City | null>(null);
  const [unit, setUnitState] = useState<Unit>("metric");
  const [recentCities, setRecentCities] = useState<City[]>([]);

  // Initialize from localStorage on mount
  useEffect(() => {
    const savedUnit = loadFromStorage<Unit>(STORAGE_KEYS.unit, "metric");
    setUnitState(savedUnit);

    const savedCities = loadFromStorage<City[]>(STORAGE_KEYS.recentCities, []);
    setRecentCities(savedCities);

    const lastCity = loadFromStorage<City | null>(STORAGE_KEYS.lastCity, null);
    if (lastCity) {
      setCoords({ lat: lastCity.lat, lon: lastCity.lon });
      setCurrentCity(lastCity);
      logger.info("WeatherProvider", "Restored last city from localStorage", lastCity);
    }
  }, []);

  // When geolocation completes, use those coords if no saved city
  useEffect(() => {
    if (geoCoords && !currentCity) {
      logger.info("WeatherProvider", "Using geolocation coordinates", geoCoords);
      setCoords(geoCoords);
    }
  }, [geoCoords, currentCity]);

  const setUnit = useCallback((newUnit: Unit) => {
    setUnitState(newUnit);
    saveToStorage(STORAGE_KEYS.unit, newUnit);
    logger.info("WeatherProvider", "Unit changed", { unit: newUnit });
  }, []);

  const handleSetCurrentCity = useCallback((city: City) => {
    setCurrentCity(city);
    setCoords({ lat: city.lat, lon: city.lon });
    saveToStorage(STORAGE_KEYS.lastCity, city);
    logger.info("WeatherProvider", "City selected", city);
  }, []);

  const addRecentCity = useCallback(
    (city: City) => {
      setRecentCities((prev) => {
        // Remove duplicate (by lat/lon rounded to 2 decimals)
        const filtered = prev.filter(
          (c) =>
            Math.round(c.lat * 100) !== Math.round(city.lat * 100) ||
            Math.round(c.lon * 100) !== Math.round(city.lon * 100)
        );
        const updated = [city, ...filtered].slice(0, MAX_RECENT_CITIES);
        saveToStorage(STORAGE_KEYS.recentCities, updated);
        return updated;
      });
    },
    []
  );

  const removeRecentCity = useCallback((lat: number, lon: number) => {
    setRecentCities((prev) => {
      const updated = prev.filter(
        (c) =>
          Math.round(c.lat * 100) !== Math.round(lat * 100) ||
          Math.round(c.lon * 100) !== Math.round(lon * 100)
      );
      saveToStorage(STORAGE_KEYS.recentCities, updated);
      return updated;
    });
  }, []);

  const clearRecentCities = useCallback(() => {
    setRecentCities([]);
    saveToStorage(STORAGE_KEYS.recentCities, []);
    logger.info("WeatherProvider", "Recent cities cleared");
  }, []);

  return (
    <WeatherContext.Provider
      value={{
        coords,
        setCoords,
        currentCity,
        setCurrentCity: handleSetCurrentCity,
        unit,
        setUnit,
        recentCities,
        addRecentCity,
        removeRecentCity,
        clearRecentCities,
        geoLoading,
        geoError,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}
