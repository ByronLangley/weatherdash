"use client";

interface SkeletonLoaderProps {
  className?: string;
  width?: string;
  height?: string;
}

export function SkeletonLoader({
  className = "",
  width,
  height,
}: SkeletonLoaderProps) {
  return (
    <div
      className={`animate-pulse rounded-[--radius-md] bg-bg-tertiary ${className}`}
      style={{ width, height }}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
