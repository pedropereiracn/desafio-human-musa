"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { storage } from "@/lib/storage";
import type { ClientProfile } from "@/lib/types";

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
  const [clients, setClients] = useLocalStorage<ClientProfile[]>(
    storage.keys.clients,
    []
  );

  const addClient = useCallback(
    (data: Omit<ClientProfile, "id" | "createdAt" | "color">) => {
      const client: ClientProfile = {
        ...data,
        id: crypto.randomUUID(),
        color: getColorForSegment(data.segment),
        createdAt: new Date().toISOString(),
      };
      setClients((prev) => [client, ...prev]);
      return client;
    },
    [setClients]
  );

  const updateClient = useCallback(
    (id: string, data: Partial<ClientProfile>) => {
      setClients((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, ...data, color: data.segment ? getColorForSegment(data.segment) : c.color }
            : c
        )
      );
    },
    [setClients]
  );

  const deleteClient = useCallback(
    (id: string) => {
      setClients((prev) => prev.filter((c) => c.id !== id));
    },
    [setClients]
  );

  const getClient = useCallback(
    (id: string) => clients.find((c) => c.id === id),
    [clients]
  );

  return { clients, addClient, updateClient, deleteClient, getClient };
}
