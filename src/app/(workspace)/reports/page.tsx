"use client";

import { useState, useCallback } from "react";
import { BarChart3, Loader2, TrendingUp, TrendingDown, Users, Eye, Heart, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ReportResult {
  title: string;
  period: string;
  summary: string;
  metrics: Record<string, string>;
  highlights: string[];
  recommendations: string[];
  conclusion: string;
}

const EXAMPLE_METRICS = `Impressões: 245.892
Alcance: 89.340
Engajamento: 12.456 (5,07%)
Novos seguidores: +1.234
Melhor post: Carrossel "5 dicas de skincare" - 3.2K likes
Stories views média: 2.100
Reels views média: 15.400
Saves: 890
Shares: 456`;

export default function ReportsPage() {
  const [metricsText, setMetricsText] = useState("");
  const [clientName, setClientName] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<ReportResult | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!metricsText.trim()) return;
    setLoading(true);
    setReport(null);

    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ metricsText: metricsText.trim(), clientName: clientName.trim() || undefined }),
      });

      if (!res.ok) throw new Error("Erro");
      const data = await res.json();
      setReport(data);
      toast.success("Relatório gerado!");
    } catch {
      toast.error("Erro ao gerar relatório. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [metricsText, clientName]);

  const handleLoadExample = () => {
    setMetricsText(EXAMPLE_METRICS);
    setClientName("Clínica Derma Glow");
  };

  // Demo stats
  const demoStats = [
    { label: "Impressões", value: "245.8K", change: "+12%", up: true, icon: Eye },
    { label: "Alcance", value: "89.3K", change: "+8%", up: true, icon: Users },
    { label: "Engajamento", value: "5.07%", change: "+0.3%", up: true, icon: Heart },
    { label: "Seguidores", value: "+1.234", change: "+15%", up: true, icon: ArrowUpRight },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            Relatórios
            <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent font-medium">Beta</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Transforme métricas brutas em relatórios profissionais com IA.
          </p>
        </div>
      </div>

      {/* Demo Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {demoStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon size={16} className="text-muted-foreground" />
              <span className={cn("text-xs font-medium flex items-center gap-0.5", stat.up ? "text-green-400" : "text-red-400")}>
                {stat.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {stat.change}
              </span>
            </div>
            <p className="text-xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Generator */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <BarChart3 size={18} />
            Gerar Relatório com IA
          </h2>
          <button
            onClick={handleLoadExample}
            className="text-xs text-accent hover:text-primary transition-colors"
          >
            Carregar exemplo
          </button>
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">Cliente (opcional)</label>
          <input
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Nome do cliente"
            className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">Cole as métricas</label>
          <textarea
            value={metricsText}
            onChange={(e) => setMetricsText(e.target.value)}
            placeholder="Cole aqui as métricas brutas do período — pode ser texto livre, tabela, ou dados copiados de qualquer ferramenta..."
            rows={6}
            className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 transition-colors resize-none font-mono"
          />
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleGenerate}
          disabled={!metricsText.trim() || loading}
          className={cn(
            "w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all",
            metricsText.trim() && !loading
              ? "bg-primary text-white hover:bg-primary/90"
              : "bg-surface-2 text-muted-foreground cursor-not-allowed border border-border"
          )}
        >
          {loading ? (
            <><Loader2 size={18} className="animate-spin" /> Gerando relatório...</>
          ) : (
            <><BarChart3 size={18} /> Gerar Relatório</>
          )}
        </motion.button>
      </div>

      {/* Report Result */}
      {report && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 space-y-5"
        >
          <div>
            <h2 className="text-lg font-bold text-foreground">{report.title}</h2>
            <p className="text-xs text-muted-foreground">{report.period}</p>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">{report.summary}</p>

          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(report.metrics).map(([key, value]) => (
              <div key={key} className="bg-surface-2 rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground capitalize">{key}</p>
                <p className="text-lg font-bold text-foreground mt-1">{value}</p>
              </div>
            ))}
          </div>

          {/* Highlights */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Destaques</h3>
            <ul className="space-y-1.5">
              {report.highlights.map((h, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">•</span> {h}
                </li>
              ))}
            </ul>
          </div>

          {/* Recommendations */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Recomendações</h3>
            <ul className="space-y-1.5">
              {report.recommendations.map((r, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-accent mt-0.5">→</span> {r}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-sm text-foreground bg-surface-2 rounded-lg p-3">{report.conclusion}</p>
        </motion.div>
      )}
    </div>
  );
}
