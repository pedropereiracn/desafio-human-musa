"use client";

import { useState, useEffect, useMemo } from "react";
import type { ClientProfile, CopyHistoryItem, SavedBrief, ActivityItem, Platform } from "@/lib/types";

interface ClientStats {
  totalCopies: number;
  avgEngagement: number;
  copiesByPlatform: Record<Platform, number>;
  topPerforming: CopyHistoryItem[];
  totalBriefs: number;
}

export function useClientDetail(clientId: string) {
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [copies, setCopies] = useState<CopyHistoryItem[]>([]);
  const [briefs, setBriefs] = useState<SavedBrief[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!clientId) return;

    setIsLoading(true);
    fetch(`/api/clients?id=${clientId}`)
      .then((r) => r.json())
      .then((data) => {
        setClient(data.client || null);
        setCopies(data.copies || []);
        setBriefs(data.briefs || []);
        setActivities(data.activities || []);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [clientId]);

  const stats = useMemo<ClientStats>(() => {
    const withScore = copies.filter((c) => c.result.engagementScore != null);
    const avgEngagement =
      withScore.length > 0
        ? withScore.reduce((sum, c) => sum + (c.result.engagementScore || 0), 0) / withScore.length
        : 0;

    const copiesByPlatform = copies.reduce<Record<Platform, number>>(
      (acc, c) => {
        acc[c.platform] = (acc[c.platform] || 0) + 1;
        return acc;
      },
      {} as Record<Platform, number>
    );

    const topPerforming = [...copies]
      .filter((c) => c.result.engagementScore != null)
      .sort((a, b) => (b.result.engagementScore || 0) - (a.result.engagementScore || 0))
      .slice(0, 3);

    return {
      totalCopies: copies.length,
      avgEngagement: Math.round(avgEngagement * 10) / 10,
      copiesByPlatform,
      topPerforming,
      totalBriefs: briefs.length,
    };
  }, [copies, briefs]);

  return { client, copies, briefs, activities, stats, isLoading };
}
