"use client";

import { useState, useEffect } from "react";

export function useFontLoader(fontsUrl?: string) {
  const [loaded, setLoaded] = useState(!fontsUrl);

  useEffect(() => {
    if (!fontsUrl) {
      setLoaded(true);
      return;
    }

    // Don't inject duplicate links
    const existing = document.querySelector(`link[href="${fontsUrl}"]`);
    if (!existing) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = fontsUrl;
      document.head.appendChild(link);
    }

    const timeout = setTimeout(() => setLoaded(true), 5000);

    document.fonts.ready.then(() => {
      clearTimeout(timeout);
      setLoaded(true);
    });

    return () => clearTimeout(timeout);
  }, [fontsUrl]);

  return { loaded };
}
