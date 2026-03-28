"use client";

import { Heart, MessageCircle, Share2, ExternalLink } from "lucide-react";
import { AnalyzedReference } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ReferenceCardProps {
  reference: AnalyzedReference;
}

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
}

export default function ReferenceCard({ reference }: ReferenceCardProps) {
  return (
    <div className="card rounded-xl overflow-hidden group transition-all duration-200">
      {/* Thumbnail */}
      <div className="relative aspect-square bg-surface-2 overflow-hidden">
        {reference.thumbnail ? (
          <img
            src={reference.thumbnail}
            alt={reference.caption?.slice(0, 50) || "Referência"}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            Sem preview
          </div>
        )}

        {/* Relevance Badge */}
        {reference.relevanceScore && (
          <div className={cn(
            "absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-black/60 backdrop-blur-sm",
            reference.relevanceScore >= 8
              ? "text-green-400"
              : reference.relevanceScore >= 6
                ? "text-yellow-400"
                : "text-foreground/60"
          )}>
            <span className={cn(
              "w-1.5 h-1.5 rounded-full",
              reference.relevanceScore >= 8
                ? "bg-green-400"
                : reference.relevanceScore >= 6
                  ? "bg-yellow-400"
                  : "bg-foreground/40"
            )} />
            {reference.relevanceScore}
          </div>
        )}

        {/* Platform icon */}
        <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
          {reference.platform === "instagram" ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.6a8.24 8.24 0 0 0 4.76 1.5v-3.4a4.85 4.85 0 0 1-1-.01z"/></svg>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Heart size={12} className="text-red-400" />
            {formatNumber(reference.likes)}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle size={12} />
            {formatNumber(reference.comments)}
          </span>
          {reference.shares > 0 && (
            <span className="flex items-center gap-1">
              <Share2 size={12} />
              {formatNumber(reference.shares)}
            </span>
          )}
        </div>

        {reference.author && (
          <p className="text-xs text-muted-foreground/70">@{reference.author}</p>
        )}

        <p className="text-sm text-foreground/90 line-clamp-3">
          {reference.caption?.slice(0, 120)}
          {(reference.caption?.length || 0) > 120 ? "..." : ""}
        </p>

        {reference.analysis && (
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-primary/80 leading-relaxed">
              {reference.analysis}
            </p>
          </div>
        )}

        {reference.url && (
          <a
            href={reference.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <ExternalLink size={12} />
            Ver original
          </a>
        )}
      </div>
    </div>
  );
}
