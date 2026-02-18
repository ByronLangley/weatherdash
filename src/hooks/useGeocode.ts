"use client";

import { useState, useEffect } from "react";
import { fetchGeocoding } from "@/lib/api";
import { useDebounce } from "./useDebounce";
import { logger } from "@/lib/logger";
import { SEARCH_MIN_LENGTH } from "@/lib/constants";
import type { GeocodingResult } from "@/types/geocode";

interface UseGeocodeResult {
  results: GeocodingResult[];
  loading: boolean;
  error: string | null;
}

export function useGeocode(query: string): UseGeocodeResult {
  const debouncedQuery = useDebounce(query);
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const trimmed = debouncedQuery.trim();

    if (trimmed.length < SEARCH_MIN_LENGTH) {
      setResults([]);
      setError(null);
      return;
    }

    let cancelled = false;

    async function search() {
      setLoading(true);
      setError(null);

      try {
        logger.info("useGeocode", "Searching", { query: trimmed });
        const data = await fetchGeocoding(trimmed);

        if (!cancelled) {
          setResults(data);
          if (data.length === 0) {
            setError(
              "We couldn't find that city. Try a different spelling or a nearby city."
            );
          }
          logger.info("useGeocode", "Search results", {
            count: data.length,
          });
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error
              ? err.message
              : "Search is temporarily unavailable. Please try again.";
          setError(message);
          logger.error("useGeocode", "Search failed", err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    search();

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  return { results, loading, error };
}
