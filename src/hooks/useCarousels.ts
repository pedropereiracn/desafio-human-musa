"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type { CarouselSlide, Platform } from "@/lib/types";

export interface SavedCarousel {
  id: string;
  title: string;
  topic: string;
  platform: Platform;
  templateId: string;
  slides: CarouselSlide[];
  caption?: string;
  hashtags?: string[];
  createdAt: string;
  updatedAt: string;
}

export function useCarousels() {
  const [carousels, setCarousels, isLoaded] = useLocalStorage<SavedCarousel[]>(
    "musa-carousels",
    []
  );

  const saveCarousel = useCallback(
    (carousel: Omit<SavedCarousel, "id" | "createdAt" | "updatedAt">) => {
      const now = new Date().toISOString();
      const newCarousel: SavedCarousel = {
        ...carousel,
        id: `carousel-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      };
      setCarousels((prev) => [newCarousel, ...prev]);
      return newCarousel.id;
    },
    [setCarousels]
  );

  const updateCarousel = useCallback(
    (id: string, updates: Partial<Omit<SavedCarousel, "id" | "createdAt">>) => {
      setCarousels((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, ...updates, updatedAt: new Date().toISOString() }
            : c
        )
      );
    },
    [setCarousels]
  );

  const deleteCarousel = useCallback(
    (id: string) => {
      setCarousels((prev) => prev.filter((c) => c.id !== id));
    },
    [setCarousels]
  );

  const getCarousel = useCallback(
    (id: string) => carousels.find((c) => c.id === id) || null,
    [carousels]
  );

  return {
    carousels,
    isLoaded,
    saveCarousel,
    updateCarousel,
    deleteCarousel,
    getCarousel,
  };
}
