"use client";

import React, { useCallback } from "react";
import { toast } from "sonner";

type ProductCodeProps = {
  code?: string | null;
  className?: string;
};

const copyText = async (text: string) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
};

const ProductCode = ({ code, className = "" }: ProductCodeProps) => {
  const normalizedCode = String(code || "").trim();

  const handleCopy = useCallback(async () => {
    if (!normalizedCode) return;

    try {
      await copyText(normalizedCode);
      toast.success("Código copiado", {
        description: normalizedCode,
        duration: 1800,
      });
    } catch {
      toast.error("Não foi possível copiar o código", {
        description: "Selecione o texto e copie manualmente.",
        duration: 2500,
      });
    }
  }, [normalizedCode]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLSpanElement>) => {
      if (event.key !== "Enter" && event.key !== " ") return;

      event.preventDefault();
      handleCopy();
    },
    [handleCopy]
  );

  if (!normalizedCode) return null;

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={handleCopy}
      onKeyDown={handleKeyDown}
      title="Copiar código"
      className={`inline-block cursor-copy select-text ${className}`}
    >
      Código: {normalizedCode}
    </span>
  );
};

export default ProductCode;
