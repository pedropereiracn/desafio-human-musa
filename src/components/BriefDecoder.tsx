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
          className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
        />
      </div>

      <button
        onClick={handleDecode}
        disabled={!briefing.trim() || decoding}
        className={cn(
          "w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all",
          briefing.trim() && !decoding
            ? "bg-accent text-primary-foreground hover:bg-accent/90 shadow-lg shadow-accent/25"
            : "bg-secondary text-muted-foreground cursor-not-allowed"
        )}
      >
        {decoding ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Decodificando briefing...
          </>
        ) : (
          <>
            <FileText size={18} />
            Decodificar Briefing
          </>
        )}
      </button>

      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {result && (
        <div className="animate-fade-in space-y-4 p-5 bg-card border border-border rounded-xl">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <CheckCircle size={18} className="text-green-500" />
            Briefing Decodificado
          </h3>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-secondary/50 rounded-lg p-3">
              <span className="text-muted-foreground">Tema</span>
              <p className="font-medium mt-1">{result.topic}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3">
              <span className="text-muted-foreground">Plataforma</span>
              <p className="font-medium mt-1 capitalize">{result.platform}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3">
              <span className="text-muted-foreground">Formato</span>
              <p className="font-medium mt-1 capitalize">{result.format}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3">
              <span className="text-muted-foreground">Tom</span>
              <p className="font-medium mt-1">{result.tone}</p>
            </div>
          </div>

          {result.audience && (
            <div className="bg-secondary/50 rounded-lg p-3 text-sm">
              <span className="text-muted-foreground">Público-alvo</span>
              <p className="font-medium mt-1">{result.audience}</p>
            </div>
          )}

          {result.summary && (
            <p className="text-sm text-muted-foreground italic">{result.summary}</p>
          )}

          {result.clarificationQuestions?.length > 0 && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
              <span className="text-yellow-500 text-sm font-medium">Perguntas para o cliente:</span>
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
                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25"
                : "bg-secondary text-muted-foreground cursor-not-allowed"
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
