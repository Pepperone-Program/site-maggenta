"use client";

import ApiErrorState from "@/components/ApiErrorState";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0 }}>
        <ApiErrorState error={error} onRetry={reset} standalone />
      </body>
    </html>
  );
}
