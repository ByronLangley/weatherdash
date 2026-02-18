"use client";

import { useState, useEffect } from "react";
import { GEOLOCATION_TIMEOUT_MS } from "@/lib/constants";
import { logger } from "@/lib/logger";
import type { Coords } from "@/types/app";

interface GeolocationState {
  coords: Coords | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    coords: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    const context = "useGeolocation";

    if (!navigator.geolocation) {
      logger.warn(context, "Geolocation not supported by this browser");
      setState({
        coords: null,
        error: "Geolocation is not supported by your browser",
        loading: false,
      });
      return;
    }

    logger.info(context, "Requesting geolocation permission");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        logger.info(context, "Geolocation granted", {
          lat: latitude,
          lon: longitude,
        });
        setState({
          coords: { lat: latitude, lon: longitude },
          error: null,
          loading: false,
        });
      },
      (error) => {
        let message: string;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Location access was denied";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Location information is unavailable";
            break;
          case error.TIMEOUT:
            message = "Location request timed out";
            break;
          default:
            message = "An unknown error occurred";
        }
        logger.warn(context, `Geolocation error: ${message}`, {
          code: error.code,
        });
        setState({ coords: null, error: message, loading: false });
      },
      {
        enableHighAccuracy: false,
        timeout: GEOLOCATION_TIMEOUT_MS,
        maximumAge: 300_000, // 5 minutes cache
      }
    );
  }, []);

  return state;
}
