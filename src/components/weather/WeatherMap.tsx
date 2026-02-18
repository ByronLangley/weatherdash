"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useWeatherContext } from "@/providers/WeatherProvider";
import { WeatherMapSkeleton } from "./WeatherMapSkeleton";
import { ErrorCard } from "@/components/ui/ErrorCard";
import { logger } from "@/lib/logger";

// Dynamic imports — Leaflet requires window/document (no SSR)
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

// Inner component to recenter map on city change
const MapRecenter = dynamic(
  () =>
    import("react-leaflet").then((mod) => {
      const { useMap } = mod;
      function Recenter({ lat, lon }: { lat: number; lon: number }) {
        const map = useMap();
        useEffect(() => {
          map.setView([lat, lon], map.getZoom());
        }, [lat, lon, map]);
        return null;
      }
      return Recenter;
    }),
  { ssr: false }
);

type WeatherLayer = "temp_new" | "precipitation_new" | "clouds_new" | "wind_new";

const LAYER_OPTIONS: { value: WeatherLayer; label: string }[] = [
  { value: "temp_new", label: "Temperature" },
  { value: "precipitation_new", label: "Precipitation" },
  { value: "clouds_new", label: "Clouds" },
  { value: "wind_new", label: "Wind" },
];

export function WeatherMap() {
  const { coords, currentCity } = useWeatherContext();
  const [layer, setLayer] = useState<WeatherLayer>("temp_new");
  const [mounted, setMounted] = useState(false);

  const tileKey = process.env.NEXT_PUBLIC_OWM_TILE_KEY;

  useEffect(() => {
    // Fix Leaflet default marker icon paths
    import("@/lib/leaflet-icon-fix");
    setMounted(true);
    logger.info("WeatherMap", "Map component mounted");
  }, []);

  if (!coords) return null;
  if (!mounted) return <WeatherMapSkeleton />;

  if (!tileKey) {
    return (
      <ErrorCard message="Map tile key is not configured. Set NEXT_PUBLIC_OWM_TILE_KEY in your environment." />
    );
  }

  return (
    <div className="overflow-hidden rounded-[--radius-lg] border border-border bg-bg-card">
      {/* Layer toggle */}
      <div className="flex gap-1 border-b border-border p-2">
        {LAYER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setLayer(opt.value)}
            className={`rounded-[--radius-md] px-3 py-1.5 text-xs font-medium transition-colors ${
              layer === opt.value
                ? "bg-accent text-white"
                : "text-text-secondary hover:bg-bg-tertiary"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Map */}
      <div className="h-[300px] sm:h-[350px] lg:h-[400px]">
        <MapContainer
          center={[coords.lat, coords.lon]}
          zoom={6}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
          attributionControl={true}
        >
          {/* Base tiles */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Weather overlay */}
          <TileLayer
            url={`https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${tileKey}`}
            opacity={0.85}
          />

          {/* City marker */}
          <Marker position={[coords.lat, coords.lon]}>
            <Popup>
              {currentCity
                ? `${currentCity.name}, ${currentCity.country}`
                : `${coords.lat.toFixed(2)}, ${coords.lon.toFixed(2)}`}
            </Popup>
          </Marker>

          <MapRecenter lat={coords.lat} lon={coords.lon} />
        </MapContainer>
      </div>
    </div>
  );
}
