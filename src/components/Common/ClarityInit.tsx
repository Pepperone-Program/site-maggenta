"use client";

import { useEffect } from "react";

const ClarityInit = () => {
  useEffect(() => {
    const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

    if (!projectId) {
      return;
    }

    const initClarity = async () => {
      const { default: Clarity } = await import("@microsoft/clarity");

      Clarity.init(projectId);
      Clarity.setTag("site", "pepperone");
      Clarity.setTag("funnel", "orcamento");
    };

    const schedule = window.requestIdleCallback
      ? window.requestIdleCallback(() => void initClarity(), { timeout: 3500 })
      : setTimeout(() => void initClarity(), 2500);

    return () => {
      if (window.cancelIdleCallback && typeof schedule === "number") {
        window.cancelIdleCallback(schedule);
        return;
      }

      clearTimeout(schedule);
    };
  }, []);

  return null;
};

export default ClarityInit;
