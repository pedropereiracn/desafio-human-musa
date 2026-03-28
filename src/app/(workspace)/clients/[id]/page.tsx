"use client";

import { use } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  Calendar,
  Hash,
  MessageSquare,
  FileText,
  Users,
  Star,
  Loader2,
  Lightbulb,
} from "lucide-react";
import { useClientDetail } from "@/hooks/useClientDetail";
import { cn } from "@/lib/utils";
import type { CopyHistoryItem, Platform } from "@/lib/types";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "agora";
  if (mins < 60) return `${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

function PlatformBadge({ platform }: { platform: Platform }) {
  const colors: Record<Platform, string> = {
    instagram: "bg-pink-500/10 text-pink-400",
    tiktok: "bg-cyan-500/10 text-cyan-400",
  };
  return (
    <span className={cn("px-2 py-0.5 rounded text-[10px] font-medium capitalize", colors[platform] || "bg-surface-2 text-muted-foreground")}>
      {platform}
    </span>
  );
}

function CopyCard({ copy }: { copy: CopyHistoryItem }) {
  const caption = copy.result.caption || "";
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface-2 rounded-xl p-4 space-y-2"
    >
      <div className="flex items-center justify-between gap-2">
        <PlatformBadge platform={copy.platform} />
        <span className="text-[10px] text-muted-foreground/50 font-mono">{timeAgo(copy.createdAt)}</span>
      </div>
      <p className="text-sm text-foreground line-clamp-3">{caption}</p>
      <div className="flex items-center gap-3 text-[11px] text-muted-foreground/60">
        {copy.result.engagementScore != null && (
          <span className="flex items-center gap-1">
            <TrendingUp size={10} />
            {copy.result.engagementScore}/10
          </span>
        )}
        {copy.copyType && (
          <span className="capitalize">{copy.copyType}</span>
        )}
        {copy.tone && (
          <span className="capitalize">{copy.tone}</span>
        )}
      </div>
    </motion.div>
  );
}

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { client, copies, briefs, stats, isLoading } = useClientDetail(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={24} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <div className="w-14 h-14 rounded-2xl bg-surface-2 flex items-center justify-center mx-auto mb-4">
          <Users size={24} className="text-muted-foreground" />
        </div>
        <h2 className="text-lg font-semibold text-foreground mb-2">Cliente nao encontrado</h2>
        <p className="text-sm text-muted-foreground mb-6">Este cliente pode ter sido removido.</p>
        <Link href="/clients" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft size={14} />
          Voltar para Clientes
        </Link>
      </div>
    );
  }

  const statCards = [
    { label: "Copies", value: stats.totalCopies, icon: Hash, color: "text-violet-400" },
    { label: "Engagement", value: stats.avgEngagement ? `${stats.avgEngagement}/10` : "—", icon: TrendingUp, color: "text-green-400" },
    { label: "Briefs", value: stats.totalBriefs, icon: FileText, color: "text-amber-400" },
    { label: "Desde", value: formatDate(client.createdAt), icon: Calendar, color: "text-cyan-400" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Link
          href="/clients"
          className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0"
          style={{ backgroundColor: client.color }}
        >
          {client.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-foreground truncate">{client.name}</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-sm text-muted-foreground">{client.segment}</span>
            {client.platforms.map((p) => (
              <PlatformBadge key={p} platform={p} />
            ))}
          </div>
        </div>
        <Link
          href="/clients"
          className="px-4 py-2 rounded-xl text-sm font-medium bg-surface-2 text-muted-foreground hover:text-foreground border border-white/[0.06] hover:border-primary/30 transition-all"
        >
          Editar
        </Link>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.04 }}
            className="card p-4 text-center"
          >
            <stat.icon size={16} className={cn("mx-auto mb-2", stat.color)} />
            <div className="text-xl font-bold text-foreground tracking-tight">{stat.value}</div>
            <div className="text-[11px] text-muted-foreground/60 mt-0.5">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content: Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Recent Content (3/5) */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-3 space-y-4"
        >
          <h2 className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-widest flex items-center gap-2">
            <MessageSquare size={12} />
            Conteudo Recente
          </h2>

          {copies.length === 0 ? (
            <div className="card p-10 text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Lightbulb size={20} className="text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">Nenhum conteudo vinculado</h3>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                Selecione este cliente no seletor do TopBar antes de gerar conteudo para vincular automaticamente.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {copies.map((copy) => (
                <CopyCard key={copy.id} copy={copy} />
              ))}
            </div>
          )}
        </motion.div>

        {/* Right: Client Profile + Top Performing (2/5) */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Client Profile */}
          <div className="space-y-4">
            <h2 className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-widest flex items-center gap-2">
              <Users size={12} />
              Perfil do Cliente
            </h2>

            <div className="card p-5 space-y-4">
              {client.brandVoice && (
                <div>
                  <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">Brand Voice</span>
                  <p className="text-sm text-foreground mt-1">{client.brandVoice}</p>
                </div>
              )}

              {client.targetAudience && (
                <div>
                  <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">Publico-alvo</span>
                  <p className="text-sm text-foreground mt-1">{client.targetAudience}</p>
                </div>
              )}

              <div>
                <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">Plataformas & Formatos</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {client.platforms.map((p) => (
                    <span key={p} className="px-2 py-0.5 rounded text-[10px] bg-primary/10 text-primary font-medium capitalize">
                      {p}
                    </span>
                  ))}
                  {client.preferredFormats.map((f) => (
                    <span key={f} className="px-2 py-0.5 rounded text-[10px] bg-surface-2 text-muted-foreground capitalize">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {client.notes && (
                <div>
                  <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">Notas</span>
                  <p className="text-sm text-foreground mt-1">{client.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Top Performing */}
          {stats.topPerforming.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-widest flex items-center gap-2">
                <Star size={12} />
                Top Performing
              </h2>

              <div className="space-y-2">
                {stats.topPerforming.map((copy, i) => (
                  <motion.div
                    key={copy.id}
                    initial={{ opacity: 0, x: 4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + i * 0.05 }}
                    className="card p-3 flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[10px] font-bold text-amber-400">{i + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground line-clamp-2">{copy.result.caption}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <PlatformBadge platform={copy.platform} />
                        <span className="text-[10px] text-green-400 font-medium flex items-center gap-0.5">
                          <BarChart3 size={8} />
                          {copy.result.engagementScore}/10
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Briefs Summary */}
          {briefs.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-widest flex items-center gap-2">
                <FileText size={12} />
                Briefs Recentes
              </h2>
              <div className="space-y-2">
                {briefs.slice(0, 3).map((brief) => (
                  <div key={brief.id} className="card p-3">
                    <p className="text-xs text-foreground line-clamp-2">{brief.decodedResult.summary || brief.rawBriefing}</p>
                    <span className="text-[10px] text-muted-foreground/50 mt-1 block">{formatDate(brief.createdAt)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
