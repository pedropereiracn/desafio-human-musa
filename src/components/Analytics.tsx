"use client";

import { useEffect, useRef, useCallback } from "react";
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

function getVisitCount(): number {
  const KEY = "musa_vc";
  const count = parseInt(localStorage.getItem(KEY) || "0") + 1;
  localStorage.setItem(KEY, count.toString());
  return count;
}

function send(payload: Record<string, unknown>) {
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
}

export default function Analytics() {
  const pathname = usePathname();
  const tracked = useRef(new Set<string>());
  const pageEnteredAt = useRef(Date.now());
  const maxScroll = useRef(0);
  const sessionPages = useRef<string[]>([]);

  // Track scroll depth
  useEffect(() => {
    maxScroll.current = 0;
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const pct = Math.round((scrollTop / docHeight) * 100);
        if (pct > maxScroll.current) maxScroll.current = pct;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  // Send time-on-page when leaving
  const sendExit = useCallback(() => {
    const timeOnPage = Math.round((Date.now() - pageEnteredAt.current) / 1000);
    if (timeOnPage < 1) return;
    const { id: visitorId } = getVisitorId();
    send({
      path: pathname,
      visitorId,
      sessionId: getSessionId(),
      eventType: "exit",
      timeOnPage,
      scrollDepth: maxScroll.current,
      journey: sessionPages.current.join(" → "),
    });
  }, [pathname]);

  // Page view tracking
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (tracked.current.has(pathname)) return;
    tracked.current.add(pathname);
    setTimeout(() => tracked.current.delete(pathname), 2000);

    // Record entry time and journey
    pageEnteredAt.current = Date.now();
    maxScroll.current = 0;
    sessionPages.current.push(pathname);

    const { id: visitorId, isFirstVisit } = getVisitorId();
    const sessionId = getSessionId();
    const visitCount = getVisitCount();

    send({
      path: pathname,
      visitorId,
      sessionId,
      isFirstVisit,
      eventType: "pageview",
      referrer: document.referrer || "",
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      touchPoints: navigator.maxTouchPoints || 0,
      colorDepth: window.screen.colorDepth,
      pixelRatio: window.devicePixelRatio || 1,
      visitCount,
      journey: sessionPages.current.join(" → "),
      connectionType: (navigator as unknown as Record<string, { effectiveType?: string }>).connection?.effectiveType || "",
      platform: navigator.platform || "",
    });
  }, [pathname]);

  // Track exit (tab close, navigation away)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        sendExit();
      }
    };
    const handleBeforeUnload = () => {
      sendExit();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [sendExit]);

  return null;
}

// Feature click tracker — import and call from any component
export function trackFeatureClick(feature: string) {
  if (typeof window === "undefined") return;
  const KEY = "musa_vid";
  const visitorId = localStorage.getItem(KEY) || "unknown";
  const sessionId = sessionStorage.getItem("musa_sid") || "unknown";
  send({
    path: window.location.pathname,
    visitorId,
    sessionId,
    eventType: "feature",
    feature,
  });
}
