"use client";

import { useState } from "react";
import { Copy, Check, Video, Hash, MessageSquare, Lightbulb } from "lucide-react";
import { CopyResult } from "@/lib/types";

interface CopyOutputProps {
  copy: CopyResult;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-xs text-muted-foreground hover:text-foreground transition-all"
    >
      {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
      {copied ? "Copiado!" : "Copiar"}
    </button>
  );
}

export default function CopyOutput({ copy }: CopyOutputProps) {
  return (
    <div className="animate-fade-in space-y-5">
      {/* Caption */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <MessageSquare size={16} className="text-primary" />
            Caption
          </h3>
          <CopyButton text={copy.caption} />
        </div>
        <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">
          {copy.caption}
        </p>
      </div>

      {/* Hashtags */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Hash size={16} className="text-primary" />
            Hashtags
          </h3>
          <CopyButton text={copy.hashtags.map(h => `#${h}`).join(" ")} />
        </div>
        <div className="flex flex-wrap gap-2">
          {copy.hashtags.map((tag, i) => (
            <span key={i} className="px-2.5 py-1 bg-primary/10 text-primary text-xs rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
          <Lightbulb size={16} className="text-primary" />
          Call to Action
        </h3>
        <p className="text-sm text-foreground">{copy.cta}</p>
      </div>

      {/* Script */}
      {copy.script && (
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Video size={16} className="text-primary" />
              Roteiro
            </h3>
            <CopyButton text={copy.script} />
          </div>
          <pre className="text-sm text-foreground whitespace-pre-line leading-relaxed font-sans">
            {copy.script}
          </pre>
        </div>
      )}

      {/* Production Notes */}
      {copy.notes && (
        <div className="bg-accent/10 border border-accent/20 rounded-xl p-5">
          <h3 className="font-semibold text-foreground mb-2">Notas de Produção</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{copy.notes}</p>
        </div>
      )}

      {/* Copy All */}
      <div className="flex justify-center">
        <CopyButton text={[
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
        ].filter(Boolean).join("\n")} />
      </div>
    </div>
  );
}
