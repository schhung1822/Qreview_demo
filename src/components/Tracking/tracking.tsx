"use client";

import { useEffect } from "react";
import { getTrackingData } from "@/lib/tracking";

export default function TrackingBootstrap() {
  useEffect(() => {
    const trackingData = getTrackingData();

    (window as any).__TRACKING__ = {
      ...trackingData,
      created_at: Date.now(),
    };
  }, []);

  return null;
}
