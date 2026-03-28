"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchCopyHistory, insertCopyHistory } from "@/lib/db";
import type { CopyHistoryItem, CopyResult, CopyType, Tone, Platform } from "@/lib/types";

export function useCopyHistory() {
  const [copies, setCopies] = useState<CopyHistoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetchCopyHistory()
      .then(setCopies)
      .catch(console.error)
      .finally(() => setIsLoaded(true));
  }, []);

  const addCopy = useCallback(
    async (item: {
      clientId?: string;
      module: "musa" | "copy-lab";
      prompt: string;
      result: CopyResult;
      copyType?: CopyType;
      tone?: Tone;
      platform: Platform;
    }) => {
      const id = await insertCopyHistory(item);
      const entry: CopyHistoryItem = {
        id,
        clientId: item.clientId,
        module: item.module,
        prompt: item.prompt,
        result: item.result,
        copyType: item.copyType,
        tone: item.tone,
        platform: item.platform,
        createdAt: new Date().toISOString(),
      };
      setCopies((prev) => [entry, ...prev]);
      return entry;
    },
    []
  );

  return { copies, isLoaded, addCopy };
}
