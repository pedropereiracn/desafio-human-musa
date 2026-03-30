"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Plus, Pencil } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { useCalendarEntries } from "@/hooks/useCalendarEntries";
import EntryModal from "@/components/calendar/EntryModal";
import { cn } from "@/lib/utils";
import type { CalendarEntryRow } from "@/lib/db";

type EntryStatus = "rascunho" | "agendado" | "publicado";

const STATUS_COLORS: Record<EntryStatus, string> = {
  rascunho: "bg-yellow-500/20 text-yellow-400",
  agendado: "bg-blue-500/20 text-blue-400",
  publicado: "bg-green-500/20 text-green-400",
};

const STATUS_DOTS: Record<EntryStatus, string> = {
  rascunho: "bg-yellow-400",
  agendado: "bg-blue-400",
  publicado: "bg-green-400",
};

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export default function CalendarPage() {
  const { clients } = useWorkspace();

  // Navigation
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const directionRef = useRef(1);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<CalendarEntryRow | null>(null);
  const [defaultDate, setDefaultDate] = useState<string | undefined>();

  // Drag
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverDay, setDragOverDay] = useState<number | null>(null);

  // Filters
  const [filterClient, setFilterClient] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPlatform, setFilterPlatform] = useState("all");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const {
    entriesByDay: rawEntriesByDay,
    isLoading,
    createEntry,
    updateEntry,
    deleteEntry,
    cycleStatus,
    reschedule,
  } = useCalendarEntries(year, month);

  // Client lookup
  const clientMap = useMemo(() => {
    const map: Record<string, { name: string; color: string }> = {};
    for (const c of clients) map[c.id] = { name: c.name, color: c.color };
    return map;
  }, [clients]);

  // Filter entries
  const entriesByDay = useMemo(() => {
    const filtered: Record<number, CalendarEntryRow[]> = {};
    for (const [dayStr, dayEntries] of Object.entries(rawEntriesByDay)) {
      const day = parseInt(dayStr);
      const filt = dayEntries.filter((e) => {
        if (filterClient !== "all" && (e.clientId || "") !== filterClient) return false;
        if (filterStatus !== "all" && e.status !== filterStatus) return false;
        if (filterPlatform !== "all" && e.platform !== filterPlatform) return false;
        return true;
      });
      if (filt.length > 0) filtered[day] = filt;
    }
    return filtered;
  }, [rawEntriesByDay, filterClient, filterStatus, filterPlatform]);

  const prevMonth = () => {
    directionRef.current = -1;
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };
  const nextMonth = () => {
    directionRef.current = 1;
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  };
  const goToday = () => {
    const now = new Date();
    directionRef.current = now > currentDate ? 1 : -1;
    setCurrentDate(now);
    setSelectedDay(null);
  };

  const openCreate = useCallback((date?: string) => {
    setEditingEntry(null);
    setDefaultDate(date);
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((entry: CalendarEntryRow) => {
    setEditingEntry(entry);
    setModalOpen(true);
  }, []);

  const handleSave = useCallback(
    async (data: {
      title: string;
      clientId?: string;
      platform: string;
      format: string;
      scheduledDate: string;
      status: string;
      notes: string;
    }) => {
      if (editingEntry) {
        await updateEntry(editingEntry.id, data);
      } else {
        await createEntry(data);
      }
    },
    [editingEntry, updateEntry, createEntry]
  );

  // Drag handlers
  const onDragStart = (e: React.DragEvent, entryId: string) => {
    e.dataTransfer.setData("text/plain", entryId);
    e.dataTransfer.effectAllowed = "move";
    setDraggingId(entryId);
  };

  const onDragEnd = () => {
    setDraggingId(null);
    setDragOverDay(null);
  };

  const onDayDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const onDayDrop = (e: React.DragEvent, day: number) => {
    e.preventDefault();
    const entryId = e.dataTransfer.getData("text/plain");
    if (!entryId) return;

    const newDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    reschedule(entryId, newDate);
    toast.success(`Entrada movida para ${day} de ${MONTHS[month]}`);
    setDraggingId(null);
    setDragOverDay(null);
  };

  const selectedEntries = selectedDay ? entriesByDay[selectedDay] || [] : [];

  const today = new Date();
  const isCurrentMonth = month === today.getMonth() && year === today.getFullYear();

  const hasFilters = filterClient !== "all" || filterStatus !== "all" || filterPlatform !== "all";

  const formatDate = (day: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Calendário de Conteúdo</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Planeje, agende e acompanhe seu pipeline de conteúdo.
          </p>
        </div>
        <button
          onClick={() => openCreate()}
          className="flex items-center gap-2 btn-primary !py-2.5 !px-5"
        >
          <Plus size={16} />
          Nova entrada
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Month nav */}
        <div className="flex items-center gap-1 bg-surface-2 rounded-xl p-1">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-lg hover:bg-surface-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-semibold text-foreground min-w-[140px] text-center">
            {MONTHS[month]} {year}
          </span>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded-lg hover:bg-surface-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <button
          onClick={goToday}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
            isCurrentMonth
              ? "border-primary/30 bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
          )}
        >
          Hoje
        </button>

        <div className="flex-1" />

        {/* Filters */}
        <select
          value={filterClient}
          onChange={(e) => setFilterClient(e.target.value)}
          className="input-field text-xs !py-1.5 !px-2.5 max-w-[130px]"
        >
          <option value="all">Todos clientes</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="input-field text-xs !py-1.5 !px-2.5"
        >
          <option value="all">Todos status</option>
          <option value="rascunho">Rascunho</option>
          <option value="agendado">Agendado</option>
          <option value="publicado">Publicado</option>
        </select>

        <select
          value={filterPlatform}
          onChange={(e) => setFilterPlatform(e.target.value)}
          className="input-field text-xs !py-1.5 !px-2.5"
        >
          <option value="all">Todas plataformas</option>
          <option value="instagram">Instagram</option>
          <option value="tiktok">TikTok</option>
        </select>

        {hasFilters && (
          <button
            onClick={() => { setFilterClient("all"); setFilterStatus("all"); setFilterPlatform("all"); }}
            className="text-xs text-primary hover:underline"
          >
            Limpar
          </button>
        )}
      </div>

      {/* Calendar Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${year}-${month}`}
          initial={{ opacity: 0, x: directionRef.current > 0 ? 40 : -40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: directionRef.current > 0 ? -40 : 40 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {isLoading ? (
            /* Skeleton */
            <div className="grid grid-cols-7 gap-px bg-border rounded-xl overflow-hidden">
              {DAYS.map((d) => (
                <div key={d} className="bg-surface-1 px-2 py-2 text-center text-xs font-medium text-muted-foreground">
                  {d}
                </div>
              ))}
              {Array.from({ length: 35 }).map((_, i) => (
                <div key={i} className="bg-background min-h-[90px] p-1.5">
                  <div className="w-6 h-6 rounded-full skeleton" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-px bg-border rounded-xl overflow-hidden">
              {/* Day headers */}
              {DAYS.map((d) => (
                <div key={d} className="bg-surface-1 px-2 py-2 text-center text-xs font-medium text-muted-foreground">
                  {d}
                </div>
              ))}

              {/* Empty cells */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="bg-background min-h-[90px]" />
              ))}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dayEntries = entriesByDay[day] || [];
                const isToday = day === today.getDate() && isCurrentMonth;
                const isSelected = selectedDay === day;
                const isDragOver = dragOverDay === day;

                return (
                  <div
                    key={day}
                    onClick={() => setSelectedDay(isSelected ? null : day)}
                    onDoubleClick={() => openCreate(formatDate(day))}
                    onDragOver={onDayDragOver}
                    onDragEnter={() => setDragOverDay(day)}
                    onDragLeave={() => { if (dragOverDay === day) setDragOverDay(null); }}
                    onDrop={(e) => onDayDrop(e, day)}
                    className={cn(
                      "bg-background min-h-[90px] p-1.5 text-left transition-all relative cursor-pointer",
                      isSelected && "ring-1 ring-primary bg-primary/[0.03]",
                      !isSelected && "hover:bg-surface-1",
                      isDragOver && "ring-2 ring-primary/50 bg-primary/5",
                      isToday && "ring-1 ring-primary/30"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          "text-xs font-medium inline-flex items-center justify-center w-6 h-6 rounded-full transition-colors",
                          isToday ? "bg-primary text-white" : "text-muted-foreground"
                        )}
                      >
                        {day}
                      </span>
                      {dayEntries.length > 0 && (
                        <span className="text-[9px] font-bold text-muted-foreground/40 tabular-nums">
                          {dayEntries.length}
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 space-y-0.5">
                      {dayEntries.slice(0, 2).map((e) => {
                        const client = e.clientId ? clientMap[e.clientId] : null;
                        const color = client?.color || "#6366f1";
                        return (
                          <div
                            key={e.id}
                            draggable
                            onDragStart={(ev) => onDragStart(ev, e.id)}
                            onDragEnd={onDragEnd}
                            onClick={(ev) => { ev.stopPropagation(); openEdit(e); }}
                            className={cn(
                              "text-[10px] pl-2 pr-1 py-0.5 rounded truncate font-medium flex items-center gap-1 cursor-grab active:cursor-grabbing hover:brightness-125 transition-all",
                              draggingId === e.id && "opacity-40"
                            )}
                            style={{
                              backgroundColor: `${color}15`,
                              borderLeft: `2px solid ${color}`,
                              color: color,
                            }}
                          >
                            <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", STATUS_DOTS[e.status])} />
                            <span className="truncate">{e.title.slice(0, 14)}</span>
                          </div>
                        );
                      })}
                      {dayEntries.length > 2 && (
                        <span className="text-[10px] text-muted-foreground/50 px-1 font-medium">
                          +{dayEntries.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Trailing empty cells */}
              {Array.from({ length: (7 - ((firstDay + daysInMonth) % 7)) % 7 }).map((_, i) => (
                <div key={`trail-${i}`} className="bg-background min-h-[90px]" />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Empty state */}
      {!isLoading && Object.keys(rawEntriesByDay).length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <CalendarDays size={48} className="text-muted-foreground/30 mb-4" />
          <p className="text-foreground font-semibold mb-1">Nenhum conteúdo agendado</p>
          <p className="text-muted-foreground text-sm mb-4">Comece criando sua primeira entrada no calendário.</p>
          <button
            onClick={() => openCreate()}
            className="flex items-center gap-2 btn-primary !py-2.5 !px-5"
          >
            <Plus size={16} />
            Criar primeira entrada
          </button>
        </div>
      )}

      {/* Selected day detail panel */}
      <AnimatePresence>
        {selectedDay !== null && selectedEntries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="card p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <CalendarDays size={16} />
                {selectedDay} de {MONTHS[month]}
              </h3>
              <button
                onClick={() => openCreate(formatDate(selectedDay))}
                className="flex items-center gap-1.5 text-xs text-primary font-medium hover:underline"
              >
                <Plus size={12} />
                Adicionar
              </button>
            </div>
            <div className="space-y-2">
              {selectedEntries.map((entry) => {
                const client = entry.clientId ? clientMap[entry.clientId] : null;
                return (
                  <div key={entry.id} className="flex items-center gap-3 p-3 rounded-lg bg-surface-2 group">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                      style={{ backgroundColor: client?.color || "#6366f1" }}
                    >
                      {(client?.name || "?").charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{entry.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {client?.name || "Sem cliente"} · {entry.platform} · {entry.format}
                      </p>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => cycleStatus(entry.id, entry.status)}
                      className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-medium cursor-pointer transition-all hover:brightness-125",
                        STATUS_COLORS[entry.status]
                      )}
                      title="Clique para mudar status"
                    >
                      {entry.status}
                    </motion.button>
                    <button
                      onClick={() => openEdit(entry)}
                      className="p-1.5 rounded-lg text-muted-foreground/40 hover:text-foreground hover:bg-surface-3 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Pencil size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Entry Modal */}
      <EntryModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        entry={editingEntry}
        defaultDate={defaultDate}
        clients={clients}
        onSave={handleSave}
        onDelete={deleteEntry}
      />
    </div>
  );
}
