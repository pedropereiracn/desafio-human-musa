"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Sparkles, PenTool, FileText, UserPlus, Clock, Users, BarChart3 } from "lucide-react";
import { useClients } from "@/hooks/useClients";
import { useBriefs } from "@/hooks/useBriefs";
import { useCopyHistory } from "@/hooks/useCopyHistory";
import { useActivities } from "@/hooks/useActivities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const QUICK_ACTIONS = [
  { href: "/musa", icon: Sparkles, label: "Nova Busca", color: "bg-primary/10 text-primary" },
  { href: "/copy-lab", icon: PenTool, label: "Gerar Copy", color: "bg-violet-500/10 text-violet-400" },
  { href: "/briefs", icon: FileText, label: "Novo Brief", color: "bg-amber-500/10 text-amber-400" },
  { href: "/clients", icon: UserPlus, label: "Add Cliente", color: "bg-emerald-500/10 text-emerald-400" },
];

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
  if (mins < 60) return `${mins}min atras`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h atras`;
  const days = Math.floor(hours / 24);
  return `${days}d atras`;
}

export default function DashboardPage() {
  const { clients } = useClients();
  const { briefs } = useBriefs();
  const { copies } = useCopyHistory();
  const { activities } = useActivities();

  const stats = useMemo(() => ({
    clients: clients.length,
    briefs: briefs.length,
    copies: copies.length,
  }), [clients.length, briefs.length, copies.length]);

  const recentActivities = activities.slice(0, 5);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Greeting + Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-green-500/[0.08] via-transparent to-violet-500/[0.05] border border-white/[0.06]"
      >
        <div className="relative z-10">
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
            {getGreeting()} 👋
          </h1>
          <p className="text-muted-foreground mt-1">O que vamos criar hoje?</p>
        </div>
        {/* Decorative orb */}
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-green-500/[0.06] blur-2xl" />
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {QUICK_ACTIONS.map((action, i) => (
          <motion.div
            key={action.href}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              href={action.href}
              className="card p-4 flex flex-col items-center gap-3 text-center hover:border-primary/30 transition-all group"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.color}`}>
                <action.icon size={20} />
              </div>
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {action.label}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats */}
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <BarChart3 size={14} />
            Resumo
          </h2>
          <Card className="bg-card border-white/[0.06] rounded-2xl">
            <CardContent className="p-4 space-y-0">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Clientes</span>
                <span className="text-lg font-bold text-foreground">{stats.clients}</span>
              </div>
              <Separator className="bg-white/[0.04]" />
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Briefs</span>
                <span className="text-lg font-bold text-foreground">{stats.briefs}</span>
              </div>
              <Separator className="bg-white/[0.04]" />
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Copies gerados</span>
                <span className="text-lg font-bold text-foreground">{stats.copies}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="md:col-span-2 space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Clock size={14} />
            Atividade Recente
          </h2>
          <Card className="bg-card border-white/[0.06] rounded-2xl">
            <CardContent className="p-4">
              {recentActivities.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground text-sm">Nenhuma atividade ainda</p>
                  <p className="text-muted-foreground/60 text-xs mt-1">
                    Comece buscando referencias ou gerando copy
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center shrink-0">
                        {activity.type === "brief" && <FileText size={14} className="text-amber-400" />}
                        {activity.type === "copy" && <PenTool size={14} className="text-pink-400" />}
                        {activity.type === "client" && <Users size={14} className="text-emerald-400" />}
                        {activity.type === "search" && <Sparkles size={14} className="text-indigo-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.module}</p>
                      </div>
                      <span className="text-xs text-muted-foreground/60 shrink-0">
                        {timeAgo(activity.createdAt)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Client Cards */}
      {clients.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Users size={14} />
            Clientes
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {clients.slice(0, 4).map((client) => (
              <Link
                key={client.id}
                href="/clients"
                className="card p-4 hover:border-primary/30 transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: client.color }}
                  >
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{client.name}</p>
                    <p className="text-xs text-muted-foreground">{client.segment}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
