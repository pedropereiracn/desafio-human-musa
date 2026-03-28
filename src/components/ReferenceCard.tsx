"use client";

import { Heart, MessageCircle, Share2, ExternalLink } from "lucide-react";
import { AnalyzedReference } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ReferenceCardProps {
  reference: AnalyzedReference;
  index: number;
}

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
}

export default function ReferenceCard({ reference, index }: ReferenceCardProps) {
  return (
    <div
      className="animate-scale-in glass-card rounded-xl overflow-hidden group hover:-translate-y-1 transition-all duration-300"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-square bg-surface-2 overflow-hidden">
        {reference.thumbnail ? (
          <img
            src={reference.thumbnail}
            alt={reference.caption?.slice(0, 50) || "Referência"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            Sem preview
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Relevance Badge */}
        {reference.relevanceScore && (
          <div className={cn(
            "absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold backdrop-blur-md transition-all",
            reference.relevanceScore >= 8
              ? "bg-green-500/20 text-green-300 border border-green-500/30 shadow-[0_0_12px_rgba(34,197,94,0.3)]"
              : reference.relevanceScore >= 6
                ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                : "bg-white/10 text-foreground/80 border border-white/10"
          )}>
            {reference.relevanceScore}/10
          </div>
        )}

        {/* Platform Badge */}
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-medium bg-black/40 backdrop-blur-md text-white/90 border border-white/10 capitalize">
          {reference.platform}
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
          <div className="pt-2 border-t border-white/5">
            <p className="text-xs text-primary/70 leading-relaxed">
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
