"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchBriefs, insertBrief, deleteBriefById } from "@/lib/db";
import type { SavedBrief, BriefResult } from "@/lib/types";

export function useBriefs() {
  const [briefs, setBriefs] = useState<SavedBrief[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetchBriefs()
      .then(setBriefs)
      .catch(console.error)
      .finally(() => setIsLoaded(true));
  }, []);

  const addBrief = useCallback(
    async (data: { clientId?: string; rawBriefing: string; decodedResult: BriefResult }) => {
      const id = await insertBrief(data);
      const brief: SavedBrief = {
        id,
        clientId: data.clientId,
        rawBriefing: data.rawBriefing,
        decodedResult: data.decodedResult,
        createdAt: new Date().toISOString(),
      };
      setBriefs((prev) => [brief, ...prev]);
      return brief;
    },
    []
  );

  const deleteBrief = useCallback(
    async (id: string) => {
      await deleteBriefById(id);
      setBriefs((prev) => prev.filter((b) => b.id !== id));
    },
    []
  );

  return { briefs, isLoaded, addBrief, deleteBrief };
}
