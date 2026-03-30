"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { FileText, Loader2, CheckCircle, AlertCircle, ArrowRight, Sparkles, PenTool, Clock, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import Link from "next/link";
import { useBriefs } from "@/hooks/useBriefs";
import { useActivities } from "@/hooks/useActivities";
import { cn } from "@/lib/utils";
import type { BriefResult } from "@/lib/types";

const TEMPLATES = [
  { label: "Campanha Instagram", placeholder: "Preciso de conteúdo para campanha no Instagram do cliente X. Objetivo: awareness. Público: mulheres 25-40. Tom: aspiracional." },
  { label: "Lançamento Produto", placeholder: "Lançamento do produto Y no dia Z. Plataformas: Instagram e TikTok. Focar em benefícios e urgência. Público: jovens 18-30." },
  { label: "Conteúdo Sazonal", placeholder: "Conteúdo para [data comemorativa]. Cliente do segmento X. Mix de formatos: reels + carrossel + stories. Tom descontraído." },
  { label: "Briefing Livre", placeholder: "Cole aqui o briefing do cliente como recebeu — por email, WhatsApp, ou qualquer formato..." },
];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

export default function BriefsPage() {
  const [briefing, setBriefing] = useState("");
  const [decoding, setDecoding] = useState(false);
  const [result, setResult] = useState<BriefResult | null>(null);
  const [error, setError] = useState("");
  const [activeTemplate, setActiveTemplate] = useState(3);

  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { briefs, addBrief, deleteBrief } = useBriefs();
  const { addActivity } = useActivities();

  useEffect(() => {
    if (decoding) {
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [decoding]);

  const handleDecode = useCallback(async () => {
    if (!briefing.trim()) return;
    setDecoding(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ briefing }),
      });

      if (!res.ok) throw new Error("Erro ao decodificar");
      const data: BriefResult = await res.json();
      setResult(data);

      await addBrief({
        rawBriefing: briefing.trim(),
        decodedResult: data,
      });

      await addActivity({
        type: "brief",
        title: `Brief: ${data.topic}`,
        module: "Central de Briefs",
      });

      toast.success("Briefing decodificado com sucesso!");
    } catch {
      setError("Erro ao processar o briefing. Tente novamente.");
    } finally {
      setDecoding(false);
    }
  }, [briefing, addBrief, addActivity]);

  const handleDeleteBrief = useCallback(async (id: string) => {
    await deleteBrief(id);
    toast.success("Brief removido");
  }, [deleteBrief]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Central de Briefs</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Decodifique briefings bagunçados de clientes com IA e envie direto para outros módulos.
        </p>
      </div>

      {/* Templates */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TEMPLATES.map((t, i) => (
          <button
            key={i}
            onClick={() => { setActiveTemplate(i); setBriefing(""); setResult(null); }}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium border whitespace-nowrap transition-all",
              activeTemplate === i
                ? "bg-primary/10 border-primary/30 text-primary"
                : "bg-surface-2 border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="card p-6 space-y-4">
        <textarea
          value={briefing}
          onChange={(e) => setBriefing(e.target.value)}
          placeholder={TEMPLATES[activeTemplate].placeholder}
          rows={5}
          className="w-full px-4 py-3 bg-surface-2 border border-border rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all resize-none"
        />

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleDecode}
          disabled={!briefing.trim() || decoding}
          className={cn(
            "w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all",
            briefing.trim() && !decoding
              ? "bg-primary text-white hover:bg-primary/90"
              : "bg-surface-2 text-muted-foreground cursor-not-allowed border border-border"
          )}
        >
          {decoding ? (
            <><Loader2 size={18} className="animate-spin" /> Decodificando...</>
          ) : (
            <><FileText size={18} /> Decodificar Briefing</>
          )}
        </motion.button>

        {/* Visual Timer */}
        <AnimatePresence>
          {decoding && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-4 px-4 py-3 rounded-xl bg-primary/5 border border-primary/10">
                <div className="relative flex items-center justify-center w-12 h-12 shrink-0">
                  <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                    <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" className="text-border" strokeWidth="3" />
                    <circle
                      cx="24" cy="24" r="20" fill="none" stroke="currentColor" className="text-primary"
                      strokeWidth="3" strokeLinecap="round"
                      strokeDasharray={`${Math.min(elapsed / 15, 1) * 125.6} 125.6`}
                      style={{ transition: "stroke-dasharray 1s linear" }}
                    />
                  </svg>
                  <span className="absolute text-xs font-bold text-primary tabular-nums">
                    {elapsed}s
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {elapsed < 3 ? "Analisando briefing..." : elapsed < 8 ? "Extraindo informações..." : "Estruturando resultado..."}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    IA processando — geralmente leva 5-10s
                  </p>
                  {/* Progress bar */}
                  <div className="mt-2 h-1 bg-border rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: `${Math.min(elapsed * 7, 95)}%` }}
                      transition={{ duration: 1, ease: "linear" }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="flex items-center gap-2 text-destructive text-sm card px-4 py-3">
            <AlertCircle size={16} /> {error}
          </div>
        )}
      </div>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6 space-y-4"
          >
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <CheckCircle size={18} className="text-green-400" />
              Briefing Decodificado
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {[
                { label: "Tema", value: result.topic },
                { label: "Plataforma", value: result.platform },
                { label: "Formato", value: result.format },
                { label: "Tom", value: result.tone },
              ].map((item) => (
                <div key={item.label} className="bg-surface-2 rounded-lg p-3">
                  <span className="text-muted-foreground text-xs">{item.label}</span>
                  <p className="font-medium mt-1 capitalize">{item.value}</p>
                </div>
              ))}
            </div>

            {result.audience && (
              <div className="bg-surface-2 rounded-lg p-3 text-sm">
                <span className="text-muted-foreground text-xs">Público-alvo</span>
                <p className="font-medium mt-1">{result.audience}</p>
              </div>
            )}

            {result.summary && (
              <p className="text-sm text-muted-foreground italic">{result.summary}</p>
            )}

            {result.clarificationQuestions?.length > 0 && (
              <div className="card p-3" style={{ borderColor: "rgba(234, 179, 8, 0.2)" }}>
                <span className="text-yellow-400 text-sm font-medium">Perguntas para o cliente:</span>
                <ul className="mt-2 space-y-1">
                  {result.clarificationQuestions.map((q, i) => (
                    <li key={i} className="text-sm text-muted-foreground">• {q}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Cross-nav buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href={`/musa`}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors"
              >
                <Sparkles size={16} />
                Enviar para Musa
                <ArrowRight size={14} />
              </Link>
              <Link
                href={`/copy-lab?prompt=${encodeURIComponent(result.summary || result.topic)}`}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-primary/30 text-primary font-medium text-sm hover:bg-primary/5 transition-colors"
              >
                <PenTool size={16} />
                Enviar para Copy Lab
                <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History */}
      {briefs.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Clock size={14} />
            Histórico de Briefs ({briefs.length})
          </h2>
          <div className="space-y-2">
            {briefs.map((brief) => (
              <div key={brief.id} className="card p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{brief.decodedResult.topic}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {brief.decodedResult.platform} · {brief.decodedResult.format} · {timeAgo(brief.createdAt)} atrás
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteBrief(brief.id)}
                  className="text-muted-foreground/40 hover:text-destructive transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
