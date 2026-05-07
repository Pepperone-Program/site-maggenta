"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

const ClarityInit = () => {
  useEffect(() => {
    const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

    if (!projectId) {
      return;
    }

    Clarity.init(projectId);
    Clarity.setTag("site", "pepperone");
    Clarity.setTag("funnel", "orcamento");
  }, []);

  return null;
};

export default ClarityInit;
