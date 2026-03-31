"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import {
  Eye, Users, Globe, Bot, Monitor, Smartphone,
  Clock, MapPin, ExternalLink, Shield, RefreshCw,
  AlertTriangle, Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PageView {
  id: string;
  path: string;
  visitor_id: string;
  session_id: string;
  ip_hash: string;
  user_agent: string;
  referrer: string;
  country: string;
  city: string;
  region: string;
  is_bot: boolean;
  is_first_visit: boolean;
  device_type: string;
  browser: string;
  os: string;
  screen_width: number;
  created_at: string;
}

interface Summary {
  totalPageViews: number;
  uniqueVisitors: number;
  uniqueIPs: number;
  firstVisits: number;
  botRequests: number;
  topPaths: [string, number][];
  topReferrers: [string, number][];
  countries: [string, number][];
  hourlyTimeline: [string, number][];
}

interface AnalyticsData {
  summary: Summary;
  views: PageView[];
  bots: PageView[];
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "agora";
  if (mins < 60) return `${mins}min atrás`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h atrás`;
  const days = Math.floor(hours / 24);
  return `${days}d atrás`;
}

const COUNTRY_FLAGS: Record<string, string> = {
  BR: "🇧🇷", US: "🇺🇸", PT: "🇵🇹", GB: "🇬🇧", DE: "🇩🇪",
  FR: "🇫🇷", ES: "🇪🇸", JP: "🇯🇵", CA: "🇨🇦", AU: "🇦🇺",
  IN: "🇮🇳", MX: "🇲🇽", AR: "🇦🇷", CL: "🇨🇱", CO: "🇨🇴",
};

export default function AnalyticsPage() {
  const [key, setKey] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState(7);
  const [tab, setTab] = useState<"overview" | "live" | "bots">("overview");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/track?key=${key}&days=${days}`);
      if (!res.ok) {
        setAuthenticated(false);
        return;
      }
      const json = await res.json();
      setData(json);
      setAuthenticated(true);
    } catch {
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, [key, days]);

  useEffect(() => {
    const saved = sessionStorage.getItem("musa_analytics_key");
    if (saved) {
      setKey(saved);
      setAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (authenticated && key) {
      sessionStorage.setItem("musa_analytics_key", key);
      fetchData();
    }
  }, [authenticated, key, days, fetchData]);

  if (!authenticated) {
    return (
      <div className="max-w-md mx-auto pt-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
          <Shield size={28} className="text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Analytics Interno</h1>
        <p className="text-sm text-muted-foreground">Acesso restrito. Digite a chave.</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setAuthenticated(true);
          }}
          className="space-y-3"
        >
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Chave de acesso"
            className="input-field w-full text-center"
            autoFocus
          />
          <button type="submit" className="btn-primary w-full">
            Acessar
          </button>
        </form>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center pt-20">
        <RefreshCw size={24} className="text-primary animate-spin" />
      </div>
    );
  }

  const { summary } = data;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <Activity size={24} className="text-primary" />
            Analytics
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Rastreamento completo de acessos ao MUSA
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="input-field text-xs !py-1.5"
          >
            <option value={1}>Últimas 24h</option>
            <option value={3}>3 dias</option>
            <option value={7}>7 dias</option>
            <option value={30}>30 dias</option>
          </select>
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2 rounded-lg border border-border hover:border-primary/30 text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Page Views", value: summary.totalPageViews, icon: Eye, color: "text-blue-400" },
          { label: "Visitantes Únicos", value: summary.uniqueVisitors, icon: Users, color: "text-green-400" },
          { label: "IPs Únicos", value: summary.uniqueIPs, icon: Globe, color: "text-purple-400" },
          { label: "Primeiro Acesso", value: summary.firstVisits, icon: Monitor, color: "text-amber-400" },
          { label: "Bot Requests", value: summary.botRequests, icon: Bot, color: "text-red-400" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-4"
          >
            <stat.icon size={16} className={cn("mb-2", stat.color)} />
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <div className="text-[11px] text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-border">
        {(["overview", "live", "bots"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "pb-3 text-sm font-medium transition-colors relative capitalize",
              tab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t === "overview" ? "Visão Geral" : t === "live" ? "Acessos ao Vivo" : "Bots Detectados"}
            {t === "bots" && summary.botRequests > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] bg-red-500/20 text-red-400 font-bold">
                {summary.botRequests}
              </span>
            )}
            {tab === t && (
              <motion.div layoutId="analytics-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Top Pages */}
          <div className="card p-4 space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Eye size={14} />
              Páginas Mais Acessadas
            </h3>
            <div className="space-y-2">
              {summary.topPaths.map(([path, count]) => (
                <div key={path} className="flex items-center justify-between">
                  <span className="text-sm text-foreground font-mono truncate">{path}</span>
                  <span className="text-xs text-muted-foreground font-bold tabular-nums">{count}</span>
                </div>
              ))}
              {summary.topPaths.length === 0 && (
                <p className="text-xs text-muted-foreground">Sem dados</p>
              )}
            </div>
          </div>

          {/* Referrers */}
          <div className="card p-4 space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <ExternalLink size={14} />
              De Onde Vieram
            </h3>
            <div className="space-y-2">
              {summary.topReferrers.map(([ref, count]) => (
                <div key={ref} className="flex items-center justify-between">
                  <span className="text-sm text-foreground truncate">{ref}</span>
                  <span className="text-xs text-muted-foreground font-bold tabular-nums">{count}</span>
                </div>
              ))}
              {summary.topReferrers.length === 0 && (
                <p className="text-xs text-muted-foreground">Acesso direto ou sem referrer</p>
              )}
            </div>
          </div>

          {/* Countries */}
          <div className="card p-4 space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <MapPin size={14} />
              Países
            </h3>
            <div className="space-y-2">
              {summary.countries.map(([country, count]) => (
                <div key={country} className="flex items-center justify-between">
                  <span className="text-sm text-foreground">
                    {COUNTRY_FLAGS[country] || "🌍"} {country}
                  </span>
                  <span className="text-xs text-muted-foreground font-bold tabular-nums">{count}</span>
                </div>
              ))}
              {summary.countries.length === 0 && (
                <p className="text-xs text-muted-foreground">Sem dados de geolocalização</p>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === "live" && (
        <div className="space-y-2">
          {data.views.map((view) => (
            <div
              key={view.id}
              className="card p-3 flex items-center gap-3"
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                view.device_type === "mobile" ? "bg-purple-500/10" : "bg-blue-500/10"
              )}>
                {view.device_type === "mobile" ? (
                  <Smartphone size={14} className="text-purple-400" />
                ) : (
                  <Monitor size={14} className="text-blue-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground font-mono">{view.path}</span>
                  {view.is_first_visit && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-green-500/20 text-green-400 font-bold">
                      NOVO
                    </span>
                  )}
                  {view.country && (
                    <span className="text-xs">{COUNTRY_FLAGS[view.country] || view.country}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span>{view.browser} · {view.os}</span>
                  <span className="font-mono">{view.ip_hash.slice(0, 8)}...</span>
                  {view.city && <span>{view.city}</span>}
                  {view.referrer && (
                    <span className="truncate max-w-[200px]">via {view.referrer}</span>
                  )}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock size={10} />
                  {timeAgo(view.created_at)}
                </div>
                <div className="text-[10px] text-muted-foreground/50 font-mono">
                  {view.visitor_id.slice(0, 8)}
                </div>
              </div>
            </div>
          ))}
          {data.views.length === 0 && (
            <div className="card p-12 text-center">
              <Eye size={32} className="text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Nenhum acesso humano registrado neste período</p>
            </div>
          )}
        </div>
      )}

      {tab === "bots" && (
        <div className="space-y-2">
          {summary.botRequests === 0 ? (
            <div className="card p-12 text-center">
              <Bot size={32} className="text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Nenhum bot detectado neste período</p>
            </div>
          ) : (
            <>
              <div className="card p-4 bg-red-500/5 border-red-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={16} className="text-red-400" />
                  <h3 className="text-sm font-semibold text-red-400">
                    {summary.botRequests} requisição(ões) de bot detectada(s)
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Bots podem ser crawlers legítimos (Google, Bing) ou scrapers automatizados.
                </p>
              </div>
              {data.bots.map((view) => (
                <div
                  key={view.id}
                  className="card p-3 flex items-center gap-3 border-red-500/10"
                >
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                    <Bot size={14} className="text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground font-mono">{view.path}</span>
                      {view.country && <span className="text-xs">{COUNTRY_FLAGS[view.country] || view.country}</span>}
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {view.user_agent}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
                    <Clock size={10} />
                    {timeAgo(view.created_at)}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
