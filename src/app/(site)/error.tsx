"use client";

import ApiErrorState from "@/components/ApiErrorState";

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ApiErrorState error={error} onRetry={reset} />;
}
