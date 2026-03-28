"use client";

import { useState, useCallback } from "react";
import { Users, Plus, X, Trash2, Edit3, Check, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { useClients } from "@/hooks/useClients";
import { useActivities } from "@/hooks/useActivities";
import { cn } from "@/lib/utils";
import type { Platform, Format, ClientProfile } from "@/lib/types";

const PLATFORM_OPTIONS: Platform[] = ["instagram", "tiktok"];
const FORMAT_OPTIONS: Format[] = ["reels", "carrossel", "post", "stories"];

const BRAND_VOICE_PROMPTS = [
  "Como essa marca fala? (ex: descontraída, técnica, aspiracional...)",
  "Quais palavras essa marca NUNCA usaria?",
  "Se a marca fosse uma pessoa, como ela se apresentaria?",
];

interface FormData {
  name: string;
  segment: string;
  brandVoice: string;
  targetAudience: string;
  platforms: Platform[];
  preferredFormats: Format[];
  notes: string;
}

const EMPTY_FORM: FormData = {
  name: "",
  segment: "",
  brandVoice: "",
  targetAudience: "",
  platforms: ["instagram"],
  preferredFormats: ["reels"],
  notes: "",
};

export default function ClientsPage() {
  const { clients, addClient, updateClient, deleteClient } = useClients();
  const { addActivity } = useActivities();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [voiceStep, setVoiceStep] = useState(0);

  const handleOpenNew = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setVoiceStep(0);
    setShowForm(true);
  };

  const handleEdit = (client: ClientProfile) => {
    setForm({
      name: client.name,
      segment: client.segment,
      brandVoice: client.brandVoice,
      targetAudience: client.targetAudience,
      platforms: client.platforms,
      preferredFormats: client.preferredFormats,
      notes: client.notes,
    });
    setEditingId(client.id);
    setVoiceStep(0);
    setShowForm(true);
  };

  const handleSave = useCallback(async () => {
    if (!form.name.trim() || !form.segment.trim()) {
      toast.error("Nome e segmento são obrigatórios");
      return;
    }

    if (editingId) {
      await updateClient(editingId, form);
      toast.success(`${form.name} atualizado`);
    } else {
      await addClient(form);
      toast.success(`${form.name} adicionado`);
      await addActivity({
        type: "client",
        title: `Novo cliente: ${form.name}`,
        module: "Hub de Clientes",
      });
    }

    setShowForm(false);
    setForm(EMPTY_FORM);
    setEditingId(null);
  }, [form, editingId, addClient, updateClient, addActivity]);

  const handleDelete = async (id: string, name: string) => {
    await deleteClient(id);
    toast.success(`${name} removido`);
  };

  const togglePlatform = (p: Platform) => {
    setForm((f) => ({
      ...f,
      platforms: f.platforms.includes(p) ? f.platforms.filter((x) => x !== p) : [...f.platforms, p],
    }));
  };

  const toggleFormat = (fmt: Format) => {
    setForm((f) => ({
      ...f,
      preferredFormats: f.preferredFormats.includes(fmt) ? f.preferredFormats.filter((x) => x !== fmt) : [...f.preferredFormats, fmt],
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Hub de Clientes</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gerencie perfis e brand voice dos seus clientes.
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleOpenNew}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} />
          Novo Cliente
        </motion.button>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="card p-6 space-y-5"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-foreground">
                {editingId ? "Editar Cliente" : "Novo Cliente"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Nome *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Nome do cliente"
                  className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Segmento *</label>
                <input
                  value={form.segment}
                  onChange={(e) => setForm((f) => ({ ...f, segment: e.target.value }))}
                  placeholder="Ex: Moda, Tech, Food..."
                  className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Público-alvo</label>
              <input
                value={form.targetAudience}
                onChange={(e) => setForm((f) => ({ ...f, targetAudience: e.target.value }))}
                placeholder="Ex: Mulheres 25-40, interessadas em skincare"
                className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 transition-colors"
              />
            </div>

            {/* Brand Voice Builder */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-2">
                <MessageSquare size={12} />
                Brand Voice
              </label>
              <div className="bg-surface-2 rounded-lg p-3 mb-2">
                <p className="text-xs text-accent mb-2">{BRAND_VOICE_PROMPTS[voiceStep]}</p>
                <div className="flex gap-1">
                  {BRAND_VOICE_PROMPTS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setVoiceStep(i)}
                      className={cn(
                        "w-2 h-2 rounded-full transition-colors",
                        voiceStep === i ? "bg-primary" : "bg-surface-3"
                      )}
                    />
                  ))}
                </div>
              </div>
              <textarea
                value={form.brandVoice}
                onChange={(e) => setForm((f) => ({ ...f, brandVoice: e.target.value }))}
                placeholder="Descreva a voz e personalidade da marca..."
                rows={3}
                className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 transition-colors resize-none"
              />
            </div>

            {/* Platforms + Formats */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Plataformas</label>
                <div className="flex gap-2">
                  {PLATFORM_OPTIONS.map((p) => (
                    <button
                      key={p}
                      onClick={() => togglePlatform(p)}
                      className={cn(
                        "flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition-all capitalize",
                        form.platforms.includes(p)
                          ? "bg-primary/10 border-primary/30 text-primary"
                          : "bg-surface-2 border-border text-muted-foreground"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Formatos</label>
                <div className="flex flex-wrap gap-1.5">
                  {FORMAT_OPTIONS.map((f) => (
                    <button
                      key={f}
                      onClick={() => toggleFormat(f)}
                      className={cn(
                        "px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize",
                        form.preferredFormats.includes(f)
                          ? "bg-primary/10 border-primary/30 text-primary"
                          : "bg-surface-2 border-border text-muted-foreground"
                      )}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Notas</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Observações, restrições, preferências..."
                rows={2}
                className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 transition-colors resize-none"
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              <Check size={16} />
              {editingId ? "Salvar Alterações" : "Adicionar Cliente"}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Client Cards */}
      {clients.length === 0 && !showForm ? (
        <div className="card p-12 text-center">
          <Users size={32} className="text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhum cliente cadastrado</p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Adicione clientes para integrar brand voice nos seus prompts.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clients.map((client) => (
            <motion.div
              key={client.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card p-5 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: client.color }}
                  >
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{client.name}</h3>
                    <p className="text-xs text-muted-foreground">{client.segment}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(client)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(client.id, client.name)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-surface-2 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {client.brandVoice && (
                <div className="bg-surface-2 rounded-lg p-3">
                  <span className="text-xs text-muted-foreground">Brand Voice</span>
                  <p className="text-sm text-foreground mt-1 line-clamp-2">{client.brandVoice}</p>
                </div>
              )}

              {client.targetAudience && (
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium">Público:</span> {client.targetAudience}
                </p>
              )}

              <div className="flex gap-1.5 flex-wrap">
                {client.platforms.map((p) => (
                  <span key={p} className="px-2 py-0.5 rounded text-[10px] bg-primary/10 text-primary font-medium capitalize">
                    {p}
                  </span>
                ))}
                {client.preferredFormats.map((f) => (
                  <span key={f} className="px-2 py-0.5 rounded text-[10px] bg-surface-2 text-muted-foreground capitalize">
                    {f}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
