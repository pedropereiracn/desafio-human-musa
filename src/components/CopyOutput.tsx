"use client";

import { useState, useEffect, useRef } from "react";
import { Copy, Check, Video, Hash, MessageSquare, Lightbulb, ClipboardCheck, Zap, Clock, Sparkles } from "lucide-react";
import { CopyResult } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CopyOutputProps {
  copy: CopyResult;
}

function useTypewriter(text: string, speed = 15) {
  const [display, setDisplay] = useState("");
  useEffect(() => {
    let i = 0;
    setDisplay("");
    const timer = setInterval(() => {
      setDisplay(text.slice(0, ++i));
      if (i >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);
  return display;
}

function useAnimatedCounter(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (started.current || !target) return;
    started.current = true;
    let start = 0;
    const step = Math.max(0.1, target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.round(start * 10) / 10);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
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
          "w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all border",
          copied
            ? "border-green-500/30 text-green-400"
            : "border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
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
          : "bg-surface-2 text-muted-foreground hover:text-foreground"
      )}
    >
      {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
      {copied ? "Copiado!" : "Copiar"}
    </button>
  );
}

export default function CopyOutput({ copy }: CopyOutputProps) {
  const typedCaption = useTypewriter(copy.caption);
  const [selectedHook, setSelectedHook] = useState(0);
  const animatedScore = useAnimatedCounter(copy.engagementScore || 0);

  return (
    <div className="space-y-4">
      {/* Engagement Score + Best Time */}
      {(copy.engagementScore || copy.bestTimeToPost) && (
        <div className="flex flex-wrap gap-3">
          {copy.engagementScore && (
            <div className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl border",
              copy.engagementScore >= 8 ? "border-green-500/30 bg-green-500/5" :
              copy.engagementScore >= 5 ? "border-yellow-500/30 bg-yellow-500/5" :
              "border-red-500/30 bg-red-500/5"
            )}>
              <Zap size={16} className={cn(
                copy.engagementScore >= 8 ? "text-green-400" :
                copy.engagementScore >= 5 ? "text-yellow-400" :
                "text-red-400"
              )} />
              <span className="text-sm font-semibold text-foreground">
                Engagement Score: {animatedScore}/10
              </span>
            </div>
          )}
          {copy.bestTimeToPost && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-primary/20 bg-primary/5">
              <Clock size={16} className="text-primary" />
              <span className="text-sm text-foreground">{copy.bestTimeToPost}</span>
            </div>
          )}
        </div>
      )}

      {/* Hook Variations */}
      {copy.hookVariations && copy.hookVariations.length > 0 && (
        <div className="card rounded-xl p-5">
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-primary" />
            Variações de Gancho
          </h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {copy.hookVariations.map((_, i) => (
              <button
                key={i}
                onClick={() => setSelectedHook(i)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                  selectedHook === i
                    ? "bg-gradient-to-r from-primary to-orange-400 text-white shadow-sm shadow-primary/20"
                    : "bg-surface-2 text-muted-foreground hover:text-foreground hover:bg-surface-3"
                )}
              >
                Opção {i + 1}
              </button>
            ))}
          </div>
          <p className="text-sm text-foreground/90 bg-surface-2 rounded-lg p-3">
            &quot;{copy.hookVariations[selectedHook]}&quot;
          </p>
        </div>
      )}

      {/* Caption */}
      <div className="card rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <MessageSquare size={16} className="text-primary" />
            Caption
          </h3>
          <CopyButton text={copy.caption} />
        </div>
        <p className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
          {typedCaption}
          {typedCaption.length < copy.caption.length && <span className="typing-cursor" />}
        </p>
      </div>

      {/* Hashtags */}
      <div className="card rounded-xl p-5">
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
              className="px-2.5 py-1 bg-surface-2 text-primary/80 text-xs rounded-full hover:bg-primary/10 hover:text-primary transition-all cursor-default"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="card rounded-xl p-5">
        <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
          <Lightbulb size={16} className="text-primary" />
          Call to Action
        </h3>
        <p className="text-sm text-foreground/90">{copy.cta}</p>
      </div>

      {/* Script — terminal style kept */}
      {copy.script && (
        <div className="card rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Video size={16} className="text-primary" />
              Roteiro
            </h3>
            <CopyButton text={copy.script} />
          </div>
          <div className="bg-surface-2 rounded-lg p-4 font-mono text-xs leading-relaxed text-foreground/80">
            <div className="flex items-center gap-2 text-muted-foreground/50 mb-3 pb-2 border-b border-border">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              <span className="ml-2 text-[10px]">roteiro.txt</span>
            </div>
            <pre className="whitespace-pre-line font-sans text-sm">{copy.script}</pre>
          </div>
        </div>
      )}

      {/* Production Notes */}
      {copy.notes && (
        <div className="card rounded-xl p-5">
          <h3 className="font-semibold text-foreground mb-2">Notas de Produção</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{copy.notes}</p>
        </div>
      )}

      {/* Copy All */}
      <div className="pt-2">
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
            copy.hookVariations?.length ? `VARIAÇÕES DE GANCHO:\n${copy.hookVariations.map((h, i) => `${i + 1}. ${h}`).join("\n")}` : "",
            copy.engagementScore ? `\nENGAGEMENT SCORE: ${copy.engagementScore}/10` : "",
            copy.bestTimeToPost ? `MELHOR HORÁRIO: ${copy.bestTimeToPost}` : "",
            copy.script ? `\nROTEIRO:\n${copy.script}` : "",
            copy.notes ? `\nNOTAS DE PRODUÇÃO:\n${copy.notes}` : "",
          ].filter(Boolean).join("\n")}
        />
      </div>
    </div>
  );
}
