"use client";

import { useState, useMemo } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useClients } from "@/hooks/useClients";
import { cn } from "@/lib/utils";

interface CalendarEntry {
  id: string;
  day: number;
  title: string;
  platform: string;
  format: string;
  clientName: string;
  clientColor: string;
  status: "rascunho" | "agendado" | "publicado";
}

const STATUS_COLORS = {
  rascunho: "bg-yellow-500/20 text-yellow-400",
  agendado: "bg-blue-500/20 text-blue-400",
  publicado: "bg-green-500/20 text-green-400",
};

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

function generateMockEntries(year: number, month: number, clients: { name: string; color: string }[]): CalendarEntry[] {
  if (clients.length === 0) {
    clients = [
      { name: "Clínica Glow", color: "#ec4899" },
      { name: "TechStart", color: "#6366f1" },
      { name: "Fit Kitchen", color: "#f59e0b" },
    ];
  }

  const entries: CalendarEntry[] = [];
  const titles = [
    "Reels: 5 dicas rápidas", "Carrossel: Tutorial", "Post: Depoimento cliente",
    "Stories: Bastidores", "Reels: Antes e depois", "Post: Promoção", "Carrossel: Mitos vs Verdades",
    "Reels: POV do dia", "Stories: Enquete", "Post: Frase motivacional",
    "Reels: Trend adaptada", "Carrossel: Checklist",
  ];
  const formats = ["reels", "carrossel", "post", "stories"];
  const platforms = ["instagram", "tiktok"];
  const statuses: ("rascunho" | "agendado" | "publicado")[] = ["rascunho", "agendado", "publicado"];
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < 18; i++) {
    const day = Math.floor(Math.random() * daysInMonth) + 1;
    const client = clients[i % clients.length];
    entries.push({
      id: `mock-${i}`,
      day,
      title: titles[i % titles.length],
      platform: platforms[i % platforms.length],
      format: formats[i % formats.length],
      clientName: client.name,
      clientColor: client.color,
      status: statuses[i % statuses.length],
    });
  }

  return entries;
}

export default function CalendarPage() {
  const { clients } = useClients();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const mockEntries = useMemo(
    () => generateMockEntries(year, month, clients.map((c) => ({ name: c.name, color: c.color }))),
    [year, month, clients]
  );

  const entriesByDay = useMemo(() => {
    const map: Record<number, CalendarEntry[]> = {};
    for (const e of mockEntries) {
      if (!map[e.day]) map[e.day] = [];
      map[e.day].push(e);
    }
    return map;
  }, [mockEntries]);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const selectedEntries = selectedDay ? entriesByDay[selectedDay] || [] : [];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          Calendário de Conteúdo
          <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent font-medium">Beta</span>
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Visualize e planeje seu pipeline de conteúdo.
        </p>
      </div>

      {/* Month Nav */}
      <div className="flex items-center justify-between">
        <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-surface-2 text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-semibold text-foreground">
          {MONTHS[month]} {year}
        </h2>
        <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-surface-2 text-muted-foreground hover:text-foreground transition-colors">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-px bg-border rounded-xl overflow-hidden">
        {/* Day headers */}
        {DAYS.map((d) => (
          <div key={d} className="bg-surface-1 px-2 py-2 text-center text-xs font-medium text-muted-foreground">
            {d}
          </div>
        ))}

        {/* Empty cells */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="bg-background min-h-[80px]" />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dayEntries = entriesByDay[day] || [];
          const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
          const isSelected = selectedDay === day;

          return (
            <motion.button
              key={day}
              onClick={() => setSelectedDay(isSelected ? null : day)}
              className={cn(
                "bg-background min-h-[80px] p-1.5 text-left transition-colors relative",
                isSelected && "ring-1 ring-primary",
                !isSelected && "hover:bg-surface-1"
              )}
            >
              <span className={cn(
                "text-xs font-medium inline-flex items-center justify-center w-6 h-6 rounded-full",
                isToday ? "bg-primary text-white" : "text-muted-foreground"
              )}>
                {day}
              </span>
              <div className="mt-0.5 space-y-0.5">
                {dayEntries.slice(0, 2).map((e) => (
                  <div
                    key={e.id}
                    className="text-[10px] px-1 py-0.5 rounded truncate font-medium"
                    style={{ backgroundColor: `${e.clientColor}20`, color: e.clientColor }}
                  >
                    {e.title.slice(0, 15)}
                  </div>
                ))}
                {dayEntries.length > 2 && (
                  <span className="text-[10px] text-muted-foreground/60 px-1">+{dayEntries.length - 2}</span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Selected day detail */}
      <AnimatePresence>
        {selectedDay && selectedEntries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="card p-5 space-y-3"
          >
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <CalendarDays size={16} />
              {selectedDay} de {MONTHS[month]}
            </h3>
            <div className="space-y-2">
              {selectedEntries.map((entry) => (
                <div key={entry.id} className="flex items-center gap-3 p-3 rounded-lg bg-surface-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                    style={{ backgroundColor: entry.clientColor }}
                  >
                    {entry.clientName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{entry.title}</p>
                    <p className="text-xs text-muted-foreground">{entry.clientName} · {entry.platform} · {entry.format}</p>
                  </div>
                  <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", STATUS_COLORS[entry.status])}>
                    {entry.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
