"use client";

import { SkeletonLoader } from "@/components/ui/SkeletonLoader";

export function CurrentWeatherSkeleton() {
  return (
    <div className="rounded-[--radius-lg] border border-border bg-bg-card p-6">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-8">
        {/* Icon + condition */}
        <div className="flex flex-col items-center gap-2">
          <SkeletonLoader className="h-16 w-16 rounded-full" />
          <SkeletonLoader className="h-4 w-24" />
        </div>

        {/* Temp + city */}
        <div className="flex flex-col items-center gap-2 sm:items-start">
          <SkeletonLoader className="h-6 w-40" />
          <SkeletonLoader className="h-16 w-32" />
          <SkeletonLoader className="h-4 w-28" />
        </div>

        {/* Details */}
        <div className="mt-4 flex flex-wrap justify-center gap-4 sm:ml-auto sm:mt-0 sm:flex-col sm:items-end">
          <SkeletonLoader className="h-4 w-24" />
          <SkeletonLoader className="h-4 w-20" />
          <SkeletonLoader className="h-4 w-28" />
          <SkeletonLoader className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
}
