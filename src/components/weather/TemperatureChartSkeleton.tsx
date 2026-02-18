"use client";

import { SkeletonLoader } from "@/components/ui/SkeletonLoader";

export function TemperatureChartSkeleton() {
  return (
    <div className="rounded-[--radius-lg] border border-border bg-bg-card p-6">
      <SkeletonLoader className="mb-4 h-5 w-40" />
      <SkeletonLoader className="h-56 w-full" />
    </div>
  );
}
