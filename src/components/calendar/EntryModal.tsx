"use client";

import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { CalendarEntryRow } from "@/lib/db";
import type { ClientProfile } from "@/lib/types";

type EntryStatus = "rascunho" | "agendado" | "publicado";

interface EntryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry?: CalendarEntryRow | null;
  defaultDate?: string;
  clients: ClientProfile[];
  onSave: (data: {
    title: string;
    clientId?: string;
    platform: string;
    format: string;
    scheduledDate: string;
    status: string;
    notes: string;
  }) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

const PLATFORMS = [
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
];

const FORMATS = [
  { value: "reels", label: "Reels" },
  { value: "carrossel", label: "Carrossel" },
  { value: "post", label: "Post" },
  { value: "stories", label: "Stories" },
];

const STATUSES: { value: EntryStatus; label: string; color: string }[] = [
  { value: "rascunho", label: "Rascunho", color: "bg-yellow-400" },
  { value: "agendado", label: "Agendado", color: "bg-blue-400" },
  { value: "publicado", label: "Publicado", color: "bg-green-400" },
];

export default function EntryModal({
  open,
  onOpenChange,
  entry,
  defaultDate,
  clients,
  onSave,
  onDelete,
}: EntryModalProps) {
  const isEdit = !!entry;

  const [title, setTitle] = useState("");
  const [clientId, setClientId] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [format, setFormat] = useState("reels");
  const [scheduledDate, setScheduledDate] = useState("");
  const [status, setStatus] = useState<EntryStatus>("rascunho");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      if (entry) {
        setTitle(entry.title);
        setClientId(entry.clientId || "");
        setPlatform(entry.platform);
        setFormat(entry.format);
        setScheduledDate(entry.scheduledDate);
        setStatus(entry.status);
        setNotes(entry.notes);
      } else {
        setTitle("");
        setClientId("");
        setPlatform("instagram");
        setFormat("reels");
        setScheduledDate(defaultDate || new Date().toISOString().split("T")[0]);
        setStatus("rascunho");
        setNotes("");
      }
    }
  }, [open, entry, defaultDate]);

  const handleSave = async () => {
    if (!title.trim() || !scheduledDate) return;
    setSaving(true);
    try {
      await onSave({
        title: title.trim(),
        clientId: clientId || undefined,
        platform,
        format,
        scheduledDate,
        status,
        notes: notes.trim(),
      });
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!entry || !onDelete) return;
    setSaving(true);
    try {
      await onDelete(entry.id);
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar Entrada" : "Nova Entrada"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Title */}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
              Título
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field w-full text-sm"
              placeholder="Ex: Reels — 5 dicas de produtividade"
              autoFocus
            />
          </div>

          {/* Grid 2 cols */}
          <div className="grid grid-cols-2 gap-3">
            {/* Client */}
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                Cliente
              </label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="input-field w-full text-sm"
              >
                <option value="">Sem cliente</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                Data
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="input-field w-full text-sm"
              />
            </div>

            {/* Platform */}
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                Plataforma
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="input-field w-full text-sm"
              >
                {PLATFORMS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>

            {/* Format */}
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                Formato
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="input-field w-full text-sm"
              >
                {FORMATS.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
              Status
            </label>
            <div className="flex gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setStatus(s.value)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                    status === s.value
                      ? "border-primary/40 bg-primary/10 text-foreground"
                      : "border-border bg-surface-2 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className={cn("w-2 h-2 rounded-full", s.color)} />
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
              Notas
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input-field w-full text-sm resize-none"
              rows={3}
              placeholder="Anotações, referências, links..."
            />
          </div>
        </div>

        <DialogFooter className="flex-row gap-2">
          {isEdit && onDelete && (
            <button
              onClick={handleDelete}
              disabled={saving}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors mr-auto disabled:opacity-50"
            >
              <Trash2 size={14} />
              Excluir
            </button>
          )}
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground border border-border hover:border-primary/30 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim() || !scheduledDate || saving}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {saving ? "Salvando..." : isEdit ? "Salvar" : "Criar"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
