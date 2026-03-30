"use client";

import { useState } from "react";
import { BookOpen, ExternalLink, Download, FileJson, FileCode, FileText } from "lucide-react";

const ASSETS = [
  { label: "Design Tokens (JSON)", file: "/docs/musa-brand-tokens.json", icon: FileJson },
  { label: "Brand CSS", file: "/docs/musa-brand.css", icon: FileCode },
  { label: "Quick Reference (MD)", file: "/docs/BRAND_QUICK_REFERENCE.md", icon: FileText },
];

export default function BrandPage() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-heading text-foreground flex items-center gap-3">
            <BookOpen size={28} className="text-primary" />
            Brand Book
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Guia completo de identidade visual e design system do Musa — uso interno da equipe.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {ASSETS.map((asset) => (
            <a
              key={asset.file}
              href={asset.file}
              download
              className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground bg-surface-2 hover:bg-surface-3 border border-white/[0.06] rounded-lg transition-colors"
              title={asset.label}
            >
              <asset.icon size={14} />
              <span className="hidden lg:inline">{asset.label}</span>
              <Download size={12} />
            </a>
          ))}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground bg-surface-2 hover:bg-surface-3 border border-white/[0.06] rounded-lg transition-colors"
          >
            <ExternalLink size={14} />
            <span className="hidden lg:inline">{isFullscreen ? "Sair" : "Tela cheia"}</span>
          </button>
        </div>
      </div>

      {/* Brand Book Iframe */}
      <div
        className={
          isFullscreen
            ? "fixed inset-0 z-[100] bg-[#09090b]"
            : "card overflow-hidden"
        }
        style={isFullscreen ? undefined : { height: "calc(100vh - 160px)" }}
      >
        {isFullscreen && (
          <button
            onClick={() => setIsFullscreen(false)}
            className="fixed top-4 right-4 z-[110] px-4 py-2 bg-surface-2 border border-white/[0.08] rounded-lg text-sm text-foreground hover:bg-surface-3 transition-colors"
          >
            ✕ Fechar
          </button>
        )}
        <iframe
          src="/docs/musa-brand-book.html"
          className="w-full h-full border-0 rounded-2xl"
          style={isFullscreen ? { borderRadius: 0 } : undefined}
          title="Musa Brand Book"
        />
      </div>
    </div>
  );
}
