"use client";

import { useEffect } from "react";

type ApiErrorStateProps = {
  error: Error & { digest?: string };
  onRetry: () => void;
  standalone?: boolean;
};

export default function ApiErrorState({
  error,
  onRetry,
  standalone = false,
}: ApiErrorStateProps) {
  useEffect(() => {
    console.error("Falha ao carregar dados da Maggenta.", {
      digest: error.digest,
      message: error.message,
    });
  }, [error]);

  return (
    <main
      role="alert"
      aria-live="assertive"
      style={{
        minHeight: standalone ? "100dvh" : "68vh",
        display: "grid",
        placeItems: "center",
        padding: "48px 20px",
        background:
          "linear-gradient(145deg, #fff 0%, #fff 64%, rgba(211, 0, 104, 0.07) 100%)",
        color: "#18131a",
        fontFamily: '"Euclid Circular A", Arial, sans-serif',
      }}
    >
      <section style={{ width: "min(100%, 620px)", textAlign: "center" }}>
        <div
          aria-hidden="true"
          style={{
            width: 72,
            height: 6,
            margin: "0 auto 28px",
            borderRadius: 999,
            background: "#d30068",
          }}
        />
        <p
          style={{
            margin: "0 0 12px",
            color: "#d30068",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Conexão temporariamente indisponível
        </p>
        <h1
          style={{
            margin: "0 0 16px",
            fontSize: "clamp(30px, 6vw, 48px)",
            lineHeight: 1.08,
            letterSpacing: "-0.04em",
          }}
        >
          Não foi possível carregar os dados agora
        </h1>
        <p
          style={{
            maxWidth: 510,
            margin: "0 auto 28px",
            color: "#635b66",
            fontSize: 17,
            lineHeight: 1.6,
          }}
        >
          Sua navegação está segura. Tente novamente para buscar os dados atualizados
          da Maggenta.
        </p>
        <button
          type="button"
          onClick={onRetry}
          style={{
            minHeight: 48,
            padding: "0 28px",
            border: 0,
            borderRadius: 999,
            background: "#d30068",
            color: "#fff",
            cursor: "pointer",
            font: "inherit",
            fontWeight: 700,
            boxShadow: "0 12px 28px rgba(211, 0, 104, 0.2)",
          }}
        >
          Tentar novamente
        </button>
      </section>
    </main>
  );
}
