"use client";

import { useState } from "react";
import { FileText, Loader2, Search, AlertCircle, CheckCircle } from "lucide-react";
import { BriefResult, Platform, Format } from "@/lib/types";
import { cn } from "@/lib/utils";

interface BriefDecoderProps {
  onSearchFromBrief: (topic: string, platform: Platform, format: Format) => void;
  isLoading: boolean;
}

export default function BriefDecoder({ onSearchFromBrief, isLoading }: BriefDecoderProps) {
  const [briefing, setBriefing] = useState("");
  const [decoding, setDecoding] = useState(false);
  const [result, setResult] = useState<BriefResult | null>(null);
  const [error, setError] = useState("");

  const handleDecode = async () => {
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
      const data = await res.json();
      setResult(data);
    } catch {
      setError("Erro ao processar o briefing. Tente novamente.");
    } finally {
      setDecoding(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Cole o briefing do cliente
        </label>
        <textarea
          value={briefing}
          onChange={(e) => setBriefing(e.target.value)}
          placeholder={"Cole aqui o briefing, email, mensagem do WhatsApp...\n\nExemplo: 'Oi, preciso de conteúdo sobre skincare pro Instagram da clínica. Pode ser reels e carrossel. O público é mulheres 25-40. Tom mais clean e profissional.'"}
          rows={5}
          className="w-full px-4 py-3 glass-input rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-all resize-none"
        />
      </div>

      <button
        onClick={handleDecode}
        disabled={!briefing.trim() || decoding}
        className={cn(
          "w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all",
          briefing.trim() && !decoding
            ? "bg-gradient-to-r from-accent to-primary text-white shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:scale-[1.01] active:scale-[0.99]"
            : "glass text-muted-foreground cursor-not-allowed"
        )}
      >
        {decoding ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Decodificando</span>
            <span className="flex gap-0.5">
              <span className="w-1 h-1 rounded-full bg-white/80 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1 h-1 rounded-full bg-white/80 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1 h-1 rounded-full bg-white/80 animate-bounce" style={{ animationDelay: "300ms" }} />
            </span>
          </>
        ) : (
          <>
            <FileText size={18} />
            Decodificar Briefing
          </>
        )}
      </button>

      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm glass-card rounded-xl px-4 py-3">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {result && (
        <div className="animate-slide-up glass-card rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <CheckCircle size={18} className="text-green-400" />
            Briefing Decodificado
          </h3>

          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { label: "Tema", value: result.topic },
              { label: "Plataforma", value: result.platform },
              { label: "Formato", value: result.format },
              { label: "Tom", value: result.tone },
            ].map((item, i) => (
              <div
                key={item.label}
                className="animate-slide-up glass rounded-lg p-3"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span className="text-muted-foreground text-xs">{item.label}</span>
                <p className="font-medium mt-1 capitalize">{item.value}</p>
              </div>
            ))}
          </div>

          {result.audience && (
            <div className="animate-slide-up glass rounded-lg p-3 text-sm" style={{ animationDelay: "320ms" }}>
              <span className="text-muted-foreground text-xs">Público-alvo</span>
              <p className="font-medium mt-1">{result.audience}</p>
            </div>
          )}

          {result.summary && (
            <p className="text-sm text-muted-foreground italic">{result.summary}</p>
          )}

          {result.clarificationQuestions?.length > 0 && (
            <div className="glass rounded-lg p-3 border-yellow-500/20" style={{ borderColor: "rgba(234, 179, 8, 0.2)" }}>
              <span className="text-yellow-400 text-sm font-medium">Perguntas para o cliente:</span>
              <ul className="mt-2 space-y-1">
                {result.clarificationQuestions.map((q, i) => (
                  <li key={i} className="text-sm text-muted-foreground">• {q}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={() => onSearchFromBrief(result.topic, result.platform as Platform, result.format as Format)}
            disabled={isLoading}
            className={cn(
              "w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all",
              !isLoading
                ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.01] active:scale-[0.99]"
                : "glass text-muted-foreground cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Buscando referências...
              </>
            ) : (
              <>
                <Search size={18} />
                Buscar Referências com esses dados
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
