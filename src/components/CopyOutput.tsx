"use client";

import { useState } from "react";
import { Copy, Check, Video, Hash, MessageSquare, Lightbulb, ClipboardCheck } from "lucide-react";
import { CopyResult } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CopyOutputProps {
  copy: CopyResult;
}

function CopyButton({ text, large }: { text: string; large?: boolean }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (large) {
    return (
      <button
        onClick={handleCopy}
        className={cn(
          "w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all",
          copied
            ? "glass border-green-500/30 text-green-400"
            : "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.01] active:scale-[0.99]"
        )}
      >
        {copied ? (
          <>
            <ClipboardCheck size={18} />
            Tudo Copiado!
          </>
        ) : (
          <>
            <Copy size={18} />
            Copiar Tudo
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all",
        copied
          ? "bg-green-500/10 text-green-400"
          : "glass text-muted-foreground hover:text-foreground"
      )}
    >
      {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
      {copied ? "Copiado!" : "Copiar"}
    </button>
  );
}

export default function CopyOutput({ copy }: CopyOutputProps) {
  return (
    <div className="space-y-4">
      {/* Caption */}
      <div className="animate-slide-up glass-card rounded-xl p-5" style={{ animationDelay: "0ms" }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <MessageSquare size={16} className="text-primary" />
            Caption
          </h3>
          <CopyButton text={copy.caption} />
        </div>
        <p className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
          {copy.caption}
        </p>
      </div>

      {/* Hashtags */}
      <div className="animate-slide-up glass-card rounded-xl p-5" style={{ animationDelay: "80ms" }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Hash size={16} className="text-primary" />
            Hashtags
          </h3>
          <CopyButton text={copy.hashtags.map(h => `#${h}`).join(" ")} />
        </div>
        <div className="flex flex-wrap gap-2">
          {copy.hashtags.map((tag, i) => (
            <span
              key={i}
              className="px-2.5 py-1 glass text-primary/80 text-xs rounded-full hover:bg-primary/10 hover:text-primary transition-all cursor-default"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="animate-slide-up glass-card rounded-xl p-5" style={{ animationDelay: "160ms" }}>
        <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
          <Lightbulb size={16} className="text-primary" />
          Call to Action
        </h3>
        <p className="text-sm text-foreground/90">{copy.cta}</p>
      </div>

      {/* Script */}
      {copy.script && (
        <div className="animate-slide-up glass-card rounded-xl p-5" style={{ animationDelay: "240ms" }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Video size={16} className="text-primary" />
              Roteiro
            </h3>
            <CopyButton text={copy.script} />
          </div>
          <div className="glass rounded-lg p-4 font-mono text-xs leading-relaxed text-foreground/80">
            <div className="flex items-center gap-2 text-muted-foreground/50 mb-3 pb-2 border-b border-white/5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
              <span className="ml-2 text-[10px]">roteiro.txt</span>
            </div>
            <pre className="whitespace-pre-line font-sans text-sm">{copy.script}</pre>
          </div>
        </div>
      )}

      {/* Production Notes */}
      {copy.notes && (
        <div className="animate-slide-up glass-card rounded-xl p-5 border-accent/20" style={{ animationDelay: "320ms" }}>
          <h3 className="font-semibold text-foreground mb-2">Notas de Produção</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{copy.notes}</p>
        </div>
      )}

      {/* Copy All */}
      <div className="animate-slide-up pt-2" style={{ animationDelay: "400ms" }}>
        <CopyButton
          large
          text={[
            "CAPTION:",
            copy.caption,
            "",
            "HASHTAGS:",
            copy.hashtags.map(h => `#${h}`).join(" "),
            "",
            "CTA:",
            copy.cta,
            "",
            copy.script ? `ROTEIRO:\n${copy.script}` : "",
            copy.notes ? `\nNOTAS DE PRODUÇÃO:\n${copy.notes}` : "",
          ].filter(Boolean).join("\n")}
        />
      </div>
    </div>
  );
}
