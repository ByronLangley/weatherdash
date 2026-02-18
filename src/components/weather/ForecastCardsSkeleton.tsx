"use client";

import { SkeletonLoader } from "@/components/ui/SkeletonLoader";

export function ForecastCardsSkeleton() {
  return (
    <div className="flex gap-3 overflow-x-auto hide-scrollbar">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex min-w-[120px] flex-1 flex-col items-center gap-2 rounded-[--radius-lg] border border-border bg-bg-card p-4"
        >
          <SkeletonLoader className="h-4 w-12" />
          <SkeletonLoader className="h-8 w-8 rounded-full" />
          <SkeletonLoader className="h-4 w-16" />
          <SkeletonLoader className="h-3 w-12" />
        </div>
      ))}
    </div>
  );
}
