"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import type { CalendarEntryRow } from "@/lib/db";

type EntryStatus = "rascunho" | "agendado" | "publicado";

const STATUS_CYCLE: Record<EntryStatus, EntryStatus> = {
  rascunho: "agendado",
  agendado: "publicado",
  publicado: "rascunho",
};

export function useCalendarEntries(year: number, month: number) {
  const [entries, setEntries] = useState<CalendarEntryRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEntries = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/calendar?year=${year}&month=${month}`);
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      setEntries(data);
    } catch {
      toast.error("Erro ao carregar calendário");
      setEntries([]);
    } finally {
      setIsLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const entriesByDay = useMemo(() => {
    const map: Record<number, CalendarEntryRow[]> = {};
    for (const e of entries) {
      const day = new Date(e.scheduledDate + "T12:00:00").getDate();
      if (!map[day]) map[day] = [];
      map[day].push(e);
    }
    return map;
  }, [entries]);

  const createEntry = useCallback(
    async (data: {
      clientId?: string;
      title: string;
      platform: string;
      format?: string;
      scheduledDate: string;
      status?: string;
      notes?: string;
    }) => {
      try {
        const res = await fetch("/api/calendar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Create failed");
        const { id } = await res.json();

        const newEntry: CalendarEntryRow = {
          id,
          clientId: data.clientId || null,
          title: data.title,
          platform: data.platform,
          format: data.format || "reels",
          scheduledDate: data.scheduledDate,
          status: (data.status as EntryStatus) || "rascunho",
          notes: data.notes || "",
        };
        setEntries((prev) => [...prev, newEntry]);
        toast.success("Entrada criada");
      } catch {
        toast.error("Erro ao criar entrada");
      }
    },
    []
  );

  const updateEntry = useCallback(
    async (
      id: string,
      updates: Partial<{
        title: string;
        status: string;
        scheduledDate: string;
        platform: string;
        format: string;
        clientId: string;
        notes: string;
      }>
    ) => {
      const prev = entries;
      setEntries((curr) =>
        curr.map((e) => (e.id === id ? { ...e, ...updates } as CalendarEntryRow : e))
      );

      try {
        const res = await fetch("/api/calendar", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, ...updates }),
        });
        if (!res.ok) throw new Error("Update failed");
      } catch {
        setEntries(prev);
        toast.error("Erro ao atualizar entrada");
      }
    },
    [entries]
  );

  const deleteEntry = useCallback(
    async (id: string) => {
      const prev = entries;
      setEntries((curr) => curr.filter((e) => e.id !== id));

      try {
        const res = await fetch("/api/calendar", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        if (!res.ok) throw new Error("Delete failed");
        toast.success("Entrada removida");
      } catch {
        setEntries(prev);
        toast.error("Erro ao remover entrada");
      }
    },
    [entries]
  );

  const cycleStatus = useCallback(
    async (id: string, currentStatus: EntryStatus) => {
      const next = STATUS_CYCLE[currentStatus];
      await updateEntry(id, { status: next });
    },
    [updateEntry]
  );

  const reschedule = useCallback(
    async (id: string, newDate: string) => {
      await updateEntry(id, { scheduledDate: newDate });
    },
    [updateEntry]
  );

  return {
    entries,
    entriesByDay,
    isLoading,
    createEntry,
    updateEntry,
    deleteEntry,
    cycleStatus,
    reschedule,
    refetch: fetchEntries,
  };
}
