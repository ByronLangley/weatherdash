"use client";

import { CloudSun } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { UnitToggle } from "@/components/ui/UnitToggle";

interface HeaderProps {
  searchSlot?: React.ReactNode;
}

export function Header({ searchSlot }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg-primary/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex shrink-0 items-center gap-2">
          <CloudSun className="h-6 w-6 text-weather-accent transition-colors duration-500" />
          <h1 className="text-lg font-semibold text-text-primary">
            WeatherDash
          </h1>
        </div>

        {/* Search slot */}
        <div className="hidden flex-1 sm:block">{searchSlot}</div>

        <div className="flex shrink-0 items-center gap-2">
          <UnitToggle />
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile search (below header bar) */}
      {searchSlot && (
        <div className="border-t border-border px-4 py-2 sm:hidden">
          {searchSlot}
        </div>
      )}
    </header>
  );
}
