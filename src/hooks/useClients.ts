"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchClients, insertClient, updateClientById, deleteClientById } from "@/lib/db";
import type { ClientProfile, Platform } from "@/lib/types";

const SEGMENT_COLORS: Record<string, string> = {
  "moda": "#ec4899",
  "tech": "#6366f1",
  "food": "#f59e0b",
  "saúde": "#10b981",
  "educação": "#3b82f6",
  "beleza": "#f472b6",
  "fitness": "#22c55e",
  "finanças": "#8b5cf6",
  "varejo": "#ef4444",
  "serviços": "#14b8a6",
};

function getColorForSegment(segment: string): string {
  const key = segment.toLowerCase();
  for (const [k, color] of Object.entries(SEGMENT_COLORS)) {
    if (key.includes(k)) return color;
  }
  const colors = ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"];
  const hash = key.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

export function useClients() {
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetchClients()
      .then(setClients)
      .catch(console.error)
      .finally(() => setIsLoaded(true));
  }, []);

  const addClient = useCallback(
    async (data: Omit<ClientProfile, "id" | "createdAt" | "color">) => {
      const color = getColorForSegment(data.segment);
      const client = await insertClient({ ...data, color });
      setClients((prev) => [client, ...prev]);
      return client;
    },
    []
  );

  const updateClient = useCallback(
    async (id: string, data: Partial<ClientProfile>) => {
      const updates = data.segment
        ? { ...data, color: getColorForSegment(data.segment) }
        : data;
      await updateClientById(id, updates);
      setClients((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
      );
    },
    []
  );

  const deleteClient = useCallback(
    async (id: string) => {
      await deleteClientById(id);
      setClients((prev) => prev.filter((c) => c.id !== id));
    },
    []
  );

  const getClient = useCallback(
    (id: string) => clients.find((c) => c.id === id),
    [clients]
  );

  return { clients, isLoaded, addClient, updateClient, deleteClient, getClient };
}
