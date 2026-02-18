"use client";

import { ErrorCard } from "@/components/ui/ErrorCard";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <ErrorCard
        message="Something went wrong. Please try again."
        onRetry={reset}
      />
    </div>
  );
}
