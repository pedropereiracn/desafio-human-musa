"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchActivities, insertActivity } from "@/lib/db";
import type { ActivityItem } from "@/lib/types";

export function useActivities() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetchActivities()
      .then(setActivities)
      .catch(console.error)
      .finally(() => setIsLoaded(true));
  }, []);

  const addActivity = useCallback(
    async (item: {
      type: ActivityItem["type"];
      title: string;
      clientId?: string;
      module: string;
    }) => {
      await insertActivity(item);
      const entry: ActivityItem = {
        id: crypto.randomUUID(),
        type: item.type,
        title: item.title,
        clientId: item.clientId,
        module: item.module,
        createdAt: new Date().toISOString(),
      };
      setActivities((prev) => [entry, ...prev]);
    },
    []
  );

  return { activities, isLoaded, addActivity };
}
