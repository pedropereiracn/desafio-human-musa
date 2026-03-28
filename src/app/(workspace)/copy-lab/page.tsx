"use client";

import { useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PenTool, Loader2, Copy, RefreshCw, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { useClients } from "@/hooks/useClients";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { storage } from "@/lib/storage";
import { cn } from "@/lib/utils";
import type { CopyType, Tone, Platform, CopyResult, CopyHistoryItem, ActivityItem, UserPreferences } from "@/lib/types";

const COPY_TYPES: { value: CopyType; label: string; desc: string }[] = [
  { value: "ad", label: "Ad Copy", desc: "Anúncios patrocinados" },
  { value: "social", label: "Social Post", desc: "Posts orgânicos" },
  { value: "email", label: "Email Marketing", desc: "Campanhas de email" },
  { value: "headline", label: "Headline", desc: "Títulos e chamadas" },
  { value: "carrossel", label: "Roteiro Carrossel", desc: "Slides de carrossel" },
];

const TONES: { value: Tone; label: string }[] = [
  { value: "formal", label: "Formal" },
  { value: "casual", label: "Casual" },
  { value: "provocativo", label: "Provocativo" },
  { value: "inspiracional", label: "Inspiracional" },
];

const PLATFORMS: { value: Platform; label: string }[] = [
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
];

function CopyLabContent() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get("prompt") || "";

  const [prompt, setPrompt] = useState(initialPrompt);
  const [copyType, setCopyType] = useState<CopyType>("social");
  const [tone, setTone] = useState<Tone>("casual");
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [variations, setVariations] = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CopyResult[]>([]);

  const { clients, getClient } = useClients();
  const [prefs] = useLocalStorage<UserPreferences>(storage.keys.preferences, { sidebarCollapsed: false });
  const [, setCopyHistory] = useLocalStorage<CopyHistoryItem[]>(storage.keys.copyHistory, []);
  const [, setActivities] = useLocalStorage<ActivityItem[]>(storage.keys.activities, []);

  const selectedClient = prefs.selectedClientId ? getClient(prefs.selectedClientId) : undefined;

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResults([]);

    try {
      const res = await fetch("/api/copylab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          copyType,
          tone,
          platform,
          brandVoice: selectedClient?.brandVoice,
          variations,
        }),
      });

      if (!res.ok) throw new Error("Erro ao gerar copy");
      const { copies } = await res.json();

      setResults(copies);
      toast.success(`${copies.length} copy${copies.length > 1 ? "s" : ""} gerado${copies.length > 1 ? "s" : ""}!`);

      // Save to history
      for (const copy of copies) {
        setCopyHistory((prev) => {
          const item: CopyHistoryItem = {
            id: crypto.randomUUID(),
            clientId: selectedClient?.id,
            module: "copy-lab",
            prompt: prompt.trim(),
            result: copy,
            copyType,
            tone,
            platform,
            createdAt: new Date().toISOString(),
          };
          const next = [item, ...prev];
          if (next.length > 100) next.length = 100;
          return next;
        });
      }

      setActivities((prev) => {
        const item: ActivityItem = {
          id: crypto.randomUUID(),
          type: "copy",
          title: `Copy Lab: ${prompt.trim().slice(0, 50)}`,
          clientId: selectedClient?.id,
          module: "Copy Lab",
          createdAt: new Date().toISOString(),
        };
        const next = [item, ...prev];
        if (next.length > 50) next.length = 50;
        return next;
      });
    } catch (error) {
      console.error("CopyLab error:", error);
      toast.error("Erro ao gerar copy. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [prompt, copyType, tone, platform, selectedClient, variations, setCopyHistory, setActivities]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Copy Lab</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Gere copy profissional para qualquer formato, sem precisar buscar referências.
        </p>
      </div>

      {selectedClient && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/20 text-sm">
          <div className="w-5 h-5 rounded flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: selectedClient.color }}>
            {selectedClient.name.charAt(0)}
          </div>
          <span className="text-primary">Brand voice de <strong>{selectedClient.name}</strong> será aplicada</span>
        </div>
      )}

      <div className="card p-6 space-y-5">
        {/* Prompt */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">O que você quer comunicar?</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Descreva o que você quer comunicar. Ex: 'Promoção de 30% em todos os tratamentos faciais durante março...'"
            rows={4}
            className="w-full px-4 py-3 bg-surface-2 border border-border rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all resize-none"
          />
        </div>

        {/* Copy Type */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Tipo de copy</label>
          <div className="flex flex-wrap gap-2">
            {COPY_TYPES.map((ct) => (
              <button
                key={ct.value}
                onClick={() => setCopyType(ct.value)}
                className={cn(
                  "px-3 py-2 rounded-lg text-xs font-medium border transition-all",
                  copyType === ct.value
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "bg-surface-2 border-border text-muted-foreground hover:text-foreground hover:border-primary/20"
                )}
              >
                {ct.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tone + Platform */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Tom</label>
            <div className="flex flex-wrap gap-1.5">
              {TONES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTone(t.value)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-xs font-medium border transition-all",
                    tone === t.value
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "bg-surface-2 border-border text-muted-foreground hover:text-foreground hover:border-primary/20"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Plataforma</label>
            <div className="flex gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPlatform(p.value)}
                  className={cn(
                    "flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition-all",
                    platform === p.value
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "bg-surface-2 border-border text-muted-foreground hover:text-foreground hover:border-primary/20"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Variations */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Variações: {variations}</label>
          <input
            type="range"
            min={1}
            max={5}
            value={variations}
            onChange={(e) => setVariations(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground/60 mt-1">
            <span>1</span><span>5</span>
          </div>
        </div>

        {/* Generate */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleGenerate}
          disabled={!prompt.trim() || loading}
          className={cn(
            "w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all",
            prompt.trim() && !loading
              ? "bg-primary text-white hover:bg-primary/90"
              : "bg-surface-2 text-muted-foreground cursor-not-allowed border border-border"
          )}
        >
          {loading ? (
            <><Loader2 size={18} className="animate-spin" /> Gerando copy...</>
          ) : (
            <><Sparkles size={18} /> Gerar Copy</>
          )}
        </motion.button>
        <p className="text-center text-xs text-muted-foreground/40">Custo estimado: ~$0.02 por geração</p>
      </div>

      {/* Results */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">
                {results.length > 1 ? `${results.length} Variações` : "Copy Gerado"}
              </h2>
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground border border-border hover:border-primary/20 transition-colors"
              >
                <RefreshCw size={14} />
                Refinar
              </button>
            </div>

            {results.map((copy, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card p-5 space-y-4"
              >
                {results.length > 1 && (
                  <span className="text-xs text-muted-foreground font-medium">Variação {i + 1}</span>
                )}

                {/* Caption */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground font-medium">Caption</span>
                    <button onClick={() => handleCopy(copy.caption)} className="text-muted-foreground hover:text-primary transition-colors">
                      <Copy size={14} />
                    </button>
                  </div>
                  <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">{copy.caption}</p>
                </div>

                {/* Hashtags */}
                {copy.hashtags?.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground font-medium">Hashtags</span>
                      <button onClick={() => handleCopy(copy.hashtags.join(" "))} className="text-muted-foreground hover:text-primary transition-colors">
                        <Copy size={14} />
                      </button>
                    </div>
                    <p className="text-sm text-accent">{copy.hashtags.join(" ")}</p>
                  </div>
                )}

                {/* CTA */}
                {copy.cta && (
                  <div>
                    <span className="text-xs text-muted-foreground font-medium">CTA</span>
                    <p className="text-sm text-foreground mt-1">{copy.cta}</p>
                  </div>
                )}

                {/* Script */}
                {copy.script && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground font-medium">Roteiro</span>
                      <button onClick={() => handleCopy(copy.script!)} className="text-muted-foreground hover:text-primary transition-colors">
                        <Copy size={14} />
                      </button>
                    </div>
                    <p className="text-sm text-foreground whitespace-pre-line bg-surface-2 rounded-lg p-3 font-mono">{copy.script}</p>
                  </div>
                )}

                {/* Notes */}
                {copy.notes && (
                  <p className="text-xs text-muted-foreground italic">{copy.notes}</p>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CopyLabPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto p-8 text-center text-muted-foreground">Carregando...</div>}>
      <CopyLabContent />
    </Suspense>
  );
}
