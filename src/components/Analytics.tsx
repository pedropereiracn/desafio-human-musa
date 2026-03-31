"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function getVisitorId(): { id: string; isFirstVisit: boolean } {
  const KEY = "musa_vid";
  const existing = localStorage.getItem(KEY);
  if (existing) return { id: existing, isFirstVisit: false };
  const id = generateId();
  localStorage.setItem(KEY, id);
  return { id, isFirstVisit: true };
}

function getSessionId(): string {
  const KEY = "musa_sid";
  const existing = sessionStorage.getItem(KEY);
  if (existing) return existing;
  const id = generateId();
  sessionStorage.setItem(KEY, id);
  return id;
}

export default function Analytics() {
  const pathname = usePathname();
  const tracked = useRef(new Set<string>());

  useEffect(() => {
    // Avoid tracking in dev
    if (typeof window === "undefined") return;

    // Dedupe same path in same render cycle
    const key = pathname + ":" + Date.now().toString().slice(0, -3); // 1s granularity
    if (tracked.current.has(pathname)) return;
    tracked.current.add(pathname);

    // Reset after navigation
    setTimeout(() => tracked.current.delete(pathname), 2000);

    const { id: visitorId, isFirstVisit } = getVisitorId();
    const sessionId = getSessionId();

    const payload = {
      path: pathname,
      visitorId,
      sessionId,
      isFirstVisit,
      referrer: document.referrer || "",
      screenWidth: window.screen.width,
    };

    // Use sendBeacon for reliability, fallback to fetch
    const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", blob);
    } else {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    }
  }, [pathname]);

  return null;
}
