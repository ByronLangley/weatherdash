"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, Loader2, X } from "lucide-react";
import { useGeocode } from "@/hooks/useGeocode";
import { useWeatherContext } from "@/providers/WeatherProvider";
import { SEARCH_MAX_LENGTH } from "@/lib/constants";
import { logger } from "@/lib/logger";
import type { GeocodingResult } from "@/types/geocode";

export function CitySearch() {
  const { setCurrentCity, addRecentCity } = useWeatherContext();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const { results, loading, error } = useGeocode(query);

  // Open dropdown when results arrive
  useEffect(() => {
    if (results.length > 0 || error) {
      setIsOpen(true);
      setActiveIndex(-1);
    }
  }, [results, error]);

  const selectCity = useCallback(
    (result: GeocodingResult) => {
      const city = {
        name: result.name,
        lat: result.lat,
        lon: result.lon,
        country: result.country,
        state: result.state,
      };
      setCurrentCity(city);
      addRecentCity(city);
      setQuery("");
      setIsOpen(false);
      inputRef.current?.blur();
      logger.info("CitySearch", "City selected", city);
    },
    [setCurrentCity, addRecentCity]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < results.length) {
          selectCity(results[activeIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setActiveIndex(-1);
        break;
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll("[role='option']");
      items[activeIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      if (
        inputRef.current &&
        !inputRef.current.contains(target) &&
        listRef.current &&
        !listRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const sanitizedQuery = query.replace(/<[^>]*>/g, "").slice(0, SEARCH_MAX_LENGTH);

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls="city-search-listbox"
          aria-activedescendant={
            activeIndex >= 0 ? `city-option-${activeIndex}` : undefined
          }
          placeholder="Search for a city..."
          value={sanitizedQuery}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0 || error) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className="h-10 w-full rounded-[--radius-md] border border-border bg-bg-card pl-9 pr-8 text-sm text-text-primary placeholder:text-text-tertiary focus:border-border-focus focus:outline-none"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-text-tertiary" />
        )}
        {!loading && query && (
          <button
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (results.length > 0 || error) && (
        <ul
          id="city-search-listbox"
          ref={listRef}
          role="listbox"
          className="absolute top-full z-50 mt-1 w-full overflow-hidden rounded-[--radius-md] border border-border bg-bg-card shadow-[var(--shadow-lg)]"
        >
          {error && results.length === 0 ? (
            <li className="px-4 py-3 text-sm text-text-secondary">{error}</li>
          ) : (
            results.map((result, index) => (
              <li
                key={`${result.lat}-${result.lon}`}
                id={`city-option-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                onClick={() => selectCity(result)}
                className={`cursor-pointer px-4 py-3 text-sm transition-colors ${
                  index === activeIndex
                    ? "bg-accent-muted text-text-primary"
                    : "text-text-primary hover:bg-bg-tertiary"
                }`}
              >
                <span className="font-medium">{result.name}</span>
                {result.state && (
                  <span className="text-text-secondary">
                    , {result.state}
                  </span>
                )}
                <span className="text-text-tertiary">
                  , {result.country}
                </span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
