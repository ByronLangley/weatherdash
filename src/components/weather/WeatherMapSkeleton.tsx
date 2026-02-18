"use client";

import { SkeletonLoader } from "@/components/ui/SkeletonLoader";
import { Map } from "lucide-react";

export function WeatherMapSkeleton() {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[--radius-lg] border border-border bg-bg-card">
      <Map className="mb-2 h-8 w-8 animate-pulse text-text-tertiary" />
      <SkeletonLoader className="h-4 w-32" />
    </div>
  );
}
