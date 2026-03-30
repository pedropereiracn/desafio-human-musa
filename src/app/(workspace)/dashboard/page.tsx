"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  PenTool,
  FileText,
  Users,
  BarChart3,
  CalendarDays,
  Layers,
  BookOpen,
  Clock,
  TrendingUp,
  Zap,
  Copy,
  ChevronDown,
  ExternalLink,
  ClipboardCopy,
  Check,
  Search,
} from "lucide-react";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { useBriefs } from "@/hooks/useBriefs";
import { useCopyHistory } from "@/hooks/useCopyHistory";
import { useActivities } from "@/hooks/useActivities";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { ActivityItem, CopyHistoryItem, SavedBrief } from "@/lib/types";

const TOOLS = [
  { href: "/musa", icon: Sparkles, label: "Musa Pipeline", desc: "Busque referencias e gere copy", color: "text-green-400", bg: "bg-green-500/10", border: "hover:border-green-500/20" },
  { href: "/copy-lab", icon: PenTool, label: "Copy Lab", desc: "Copy standalone para qualquer formato", color: "text-violet-400", bg: "bg-violet-500/10", border: "hover:border-violet-500/20" },
  { href: "/briefs", icon: FileText, label: "Briefs", desc: "Decodifique briefings de clientes", color: "text-amber-400", bg: "bg-amber-500/10", border: "hover:border-amber-500/20" },
  { href: "/clients", icon: Users, label: "Clientes", desc: "Gerencie perfis e brand voice", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "hover:border-emerald-500/20" },
  { href: "/carousel", icon: Layers, label: "Carrossel", desc: "Crie carrosseis visuais", color: "text-blue-400", bg: "bg-blue-500/10", border: "hover:border-blue-500/20" },
  { href: "/reports", icon: BarChart3, label: "Relatorios", desc: "Metricas e relatorios com IA", color: "text-rose-400", bg: "bg-rose-500/10", border: "hover:border-rose-500/20", badge: "Beta" },
  { href: "/calendar", icon: CalendarDays, label: "Calendario", desc: "Pipeline de conteudo visual", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "hover:border-cyan-500/20", badge: "Beta" },
  { href: "/brand", icon: BookOpen, label: "Brand Book", desc: "Identidade visual e guidelines", color: "text-purple-400", bg: "bg-purple-500/10", border: "hover:border-purple-500/20", badge: "Interno" },
];

const MODULE_LINKS: Record<string, string> = {
  "Musa Pipeline": "/musa",
  "Copy Lab": "/copy-lab",
  "Central de Briefs": "/briefs",
  "Hub de Clientes": "/clients",
  "Carrossel": "/carousel",
};

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

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
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Match an activity to its corresponding copy or brief by timestamp proximity */
function findMatchingCopy(activity: ActivityItem, copies: CopyHistoryItem[]): CopyHistoryItem | undefined {
  if (activity.type !== "copy") return undefined;
  // Match by closest timestamp (within 30s window)
  return copies.find((c) => {
    const diff = Math.abs(new Date(c.createdAt).getTime() - new Date(activity.createdAt).getTime());
    return diff < 30000;
  });
}

function findMatchingBrief(activity: ActivityItem, briefs: SavedBrief[]): SavedBrief | undefined {
  if (activity.type !== "brief") return undefined;
  return briefs.find((b) => {
    const diff = Math.abs(new Date(b.createdAt).getTime() - new Date(activity.createdAt).getTime());
    return diff < 30000;
  });
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copiado!");
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button
      onClick={(e) => { e.stopPropagation(); handleCopy(); }}
      className="p-1 rounded text-muted-foreground/50 hover:text-primary transition-colors"
      title="Copiar"
    >
      {copied ? <Check size={12} className="text-green-400" /> : <ClipboardCopy size={12} />}
    </button>
  );
}

function ActivityDetail({
  activity,
  copies,
  briefs,
}: {
  activity: ActivityItem;
  copies: CopyHistoryItem[];
  briefs: SavedBrief[];
}) {
  const matchingCopy = useMemo(() => findMatchingCopy(activity, copies), [activity, copies]);
  const matchingBrief = useMemo(() => findMatchingBrief(activity, briefs), [activity, briefs]);
  const moduleLink = MODULE_LINKS[activity.module];

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden"
    >
      <div className="px-4 pb-4 pt-1 space-y-3">
        {/* Metadata */}
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground/60">
          <span>{formatDate(activity.createdAt)}</span>
          <span>·</span>
          <span>{activity.module}</span>
          {moduleLink && (
            <>
              <span>·</span>
              <Link
                href={moduleLink}
                className="inline-flex items-center gap-1 text-primary/60 hover:text-primary transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                Abrir <ExternalLink size={10} />
              </Link>
            </>
          )}
        </div>

        {/* Copy Result */}
        {activity.type === "copy" && matchingCopy && (
          <div className="space-y-2.5">
            {/* Prompt */}
            <div className="bg-surface-2 rounded-xl p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-muted-foreground/50 uppercase tracking-wider font-semibold">Prompt</span>
              </div>
              <p className="text-xs text-muted-foreground">{matchingCopy.prompt}</p>
            </div>

            {/* Caption */}
            <div className="bg-surface-2 rounded-xl p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-muted-foreground/50 uppercase tracking-wider font-semibold">Caption</span>
                <CopyButton text={matchingCopy.result.caption} />
              </div>
              <p className="text-sm text-foreground whitespace-pre-line leading-relaxed line-clamp-6">
                {matchingCopy.result.caption}
              </p>
            </div>

            {/* Hashtags */}
            {matchingCopy.result.hashtags?.length > 0 && (
              <div className="bg-surface-2 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-muted-foreground/50 uppercase tracking-wider font-semibold">Hashtags</span>
                  <CopyButton text={matchingCopy.result.hashtags.join(" ")} />
                </div>
                <p className="text-xs text-accent break-all">{matchingCopy.result.hashtags.join(" ")}</p>
              </div>
            )}

            {/* CTA */}
            {matchingCopy.result.cta && (
              <div className="bg-surface-2 rounded-xl p-3">
                <span className="text-[10px] text-muted-foreground/50 uppercase tracking-wider font-semibold">CTA</span>
                <p className="text-xs text-foreground mt-1">{matchingCopy.result.cta}</p>
              </div>
            )}

            {/* Script */}
            {matchingCopy.result.script && (
              <div className="bg-surface-2 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-muted-foreground/50 uppercase tracking-wider font-semibold">Roteiro</span>
                  <CopyButton text={matchingCopy.result.script} />
                </div>
                <p className="text-xs text-foreground whitespace-pre-line font-mono leading-relaxed line-clamp-8">
                  {matchingCopy.result.script}
                </p>
              </div>
            )}

            {/* Platform badge */}
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] bg-primary/10 text-primary font-medium capitalize">
                {matchingCopy.platform}
              </span>
              {matchingCopy.copyType && (
                <span className="px-2 py-0.5 rounded text-[10px] bg-violet-500/10 text-violet-400 font-medium">
                  {matchingCopy.copyType}
                </span>
              )}
              {matchingCopy.tone && (
                <span className="px-2 py-0.5 rounded text-[10px] bg-surface-2 text-muted-foreground font-medium capitalize">
                  {matchingCopy.tone}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Brief Result */}
        {activity.type === "brief" && matchingBrief && (
          <div className="space-y-2.5">
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Tema", value: matchingBrief.decodedResult.topic },
                { label: "Plataforma", value: matchingBrief.decodedResult.platform },
                { label: "Formato", value: matchingBrief.decodedResult.format },
                { label: "Tom", value: matchingBrief.decodedResult.tone },
              ].map((item) => (
                <div key={item.label} className="bg-surface-2 rounded-xl p-2.5">
                  <span className="text-[10px] text-muted-foreground/50 uppercase tracking-wider font-semibold">{item.label}</span>
                  <p className="text-xs font-medium text-foreground mt-0.5 capitalize">{item.value}</p>
                </div>
              ))}
            </div>
            {matchingBrief.decodedResult.audience && (
              <div className="bg-surface-2 rounded-xl p-2.5">
                <span className="text-[10px] text-muted-foreground/50 uppercase tracking-wider font-semibold">Público</span>
                <p className="text-xs text-foreground mt-0.5">{matchingBrief.decodedResult.audience}</p>
              </div>
            )}
            {matchingBrief.decodedResult.summary && (
              <p className="text-xs text-muted-foreground italic px-1">{matchingBrief.decodedResult.summary}</p>
            )}
          </div>
        )}

        {/* Search — no stored data, just link */}
        {activity.type === "search" && (
          <div className="bg-surface-2 rounded-xl p-3 flex items-center gap-3">
            <Search size={14} className="text-green-400 shrink-0" />
            <p className="text-xs text-muted-foreground flex-1">{activity.title}</p>
            <Link
              href="/musa"
              className="text-[11px] text-primary hover:text-primary/80 transition-colors flex items-center gap-1 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              Buscar novamente <ExternalLink size={10} />
            </Link>
          </div>
        )}

        {/* Client — link to clients */}
        {activity.type === "client" && (
          <div className="bg-surface-2 rounded-xl p-3 flex items-center gap-3">
            <Users size={14} className="text-emerald-400 shrink-0" />
            <p className="text-xs text-muted-foreground flex-1">{activity.title}</p>
            <Link
              href="/clients"
              className="text-[11px] text-primary hover:text-primary/80 transition-colors flex items-center gap-1 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              Ver clientes <ExternalLink size={10} />
            </Link>
          </div>
        )}

        {/* Fallback for copy/brief without matching data */}
        {activity.type === "copy" && !matchingCopy && (
          <p className="text-xs text-muted-foreground/50 italic px-1">Detalhes do copy não disponíveis no histórico.</p>
        )}
        {activity.type === "brief" && !matchingBrief && (
          <p className="text-xs text-muted-foreground/50 italic px-1">Detalhes do brief não disponíveis no histórico.</p>
        )}
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { clients } = useWorkspace();
  const { briefs } = useBriefs();
  const { copies } = useCopyHistory();
  const { activities } = useActivities();

  const [greeting, setGreeting] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => { setGreeting(getGreeting()); }, []);

  const stats = useMemo(() => [
    { label: "Clientes", value: clients.length, icon: Users, color: "text-emerald-400" },
    { label: "Briefs", value: briefs.length, icon: FileText, color: "text-amber-400" },
    { label: "Copies", value: copies.length, icon: Copy, color: "text-violet-400" },
  ], [clients.length, briefs.length, copies.length]);

  const displayedActivities = showAll ? activities : activities.slice(0, 8);

  return (
    <div className="min-h-[calc(100vh-3.5rem)]">

      {/* ─── Main Content ─── */}
      <div className="flex flex-col items-center justify-start py-6 max-w-2xl mx-auto w-full px-4">

        {/* Hero Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 w-full"
        >
          <div className="relative inline-block mb-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", bounce: 0.3 }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/10 flex items-center justify-center mx-auto"
            >
              <Zap size={28} className="text-green-400" />
            </motion.div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            {greeting ? `${greeting} 👋` : "\u00A0"}
          </h1>
          <p className="text-muted-foreground mt-2 text-base">O que vamos criar hoje?</p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-3 gap-4 w-full mb-8"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.06 }}
              className="card p-4 text-center hover-lift"
            >
              <stat.icon size={16} className={cn("mx-auto mb-2", stat.color)} />
              <div className="text-2xl font-bold text-foreground tracking-tight">{stat.value}</div>
              <div className="text-[11px] text-muted-foreground/60 mt-0.5">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Start — Mobile tools (hidden on lg) */}
        <div className="grid grid-cols-2 gap-3 w-full mb-8 lg:hidden">
          {TOOLS.slice(0, 4).map((tool, i) => (
            <motion.div
              key={tool.href}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.05 }}
            >
              <Link
                href={tool.href}
                className="card p-4 flex flex-col items-center gap-2 text-center hover:border-primary/30 transition-all group"
              >
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", tool.bg)}>
                  <tool.icon size={18} className={tool.color} />
                </div>
                <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">
                  {tool.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-widest flex items-center gap-2">
              <Clock size={12} />
              Atividade Recente
            </h2>
            {activities.length > 0 && (
              <span className="text-[10px] text-muted-foreground/40">{activities.length} total</span>
            )}
          </div>

          <Card className="bg-card/50 border-white/[0.04] rounded-2xl backdrop-blur-sm">
            <CardContent className="p-0">
              {activities.length === 0 ? (
                <div className="text-center py-12 px-6">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.04] flex items-center justify-center mx-auto mb-4">
                    <TrendingUp size={20} className="text-muted-foreground/30" />
                  </div>
                  <p className="text-sm text-muted-foreground">Nenhuma atividade ainda</p>
                  <p className="text-xs text-muted-foreground/50 mt-1">
                    Comece buscando referencias ou gerando copy
                  </p>
                </div>
              ) : (
                <div>
                  {displayedActivities.map((activity, i) => {
                    const isExpanded = expandedId === activity.id;
                    return (
                      <div key={activity.id}>
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : activity.id)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors text-left"
                        >
                          <div className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center shrink-0">
                            {activity.type === "brief" && <FileText size={14} className="text-amber-400" />}
                            {activity.type === "copy" && <PenTool size={14} className="text-violet-400" />}
                            {activity.type === "client" && <Users size={14} className="text-emerald-400" />}
                            {activity.type === "search" && <Sparkles size={14} className="text-green-400" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground truncate">{activity.title}</p>
                            <p className="text-[11px] text-muted-foreground/50">{activity.module}</p>
                          </div>
                          <span className="text-[10px] text-muted-foreground/40 shrink-0 font-mono mr-1">
                            {timeAgo(activity.createdAt)}
                          </span>
                          <ChevronDown
                            size={14}
                            className={cn(
                              "text-muted-foreground/30 shrink-0 transition-transform duration-200",
                              isExpanded && "rotate-180"
                            )}
                          />
                        </button>

                        <AnimatePresence>
                          {isExpanded && (
                            <ActivityDetail
                              activity={activity}
                              copies={copies}
                              briefs={briefs}
                            />
                          )}
                        </AnimatePresence>

                        {i < displayedActivities.length - 1 && (
                          <Separator className="bg-white/[0.02] mx-4" />
                        )}
                      </div>
                    );
                  })}

                  {/* Show more / less */}
                  {activities.length > 8 && (
                    <button
                      onClick={() => setShowAll(!showAll)}
                      className="w-full py-3 text-center text-xs text-muted-foreground/50 hover:text-primary transition-colors border-t border-white/[0.02]"
                    >
                      {showAll ? "Mostrar menos" : `Ver todas (${activities.length})`}
                    </button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Client Avatars Row */}
        {clients.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full mt-8"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-widest flex items-center gap-2">
                <Users size={12} />
                Clientes
              </h2>
              <Link href="/clients" className="text-[10px] text-primary/60 hover:text-primary transition-colors">
                Ver todos
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {clients.slice(0, 6).map((client) => (
                <Link
                  key={client.id}
                  href={`/clients/${client.id}`}
                  className="card px-4 py-3 flex items-center gap-3 shrink-0 hover:border-primary/20 transition-all"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ backgroundColor: client.color }}
                  >
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{client.name}</p>
                    <p className="text-[10px] text-muted-foreground/50">{client.segment}</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
