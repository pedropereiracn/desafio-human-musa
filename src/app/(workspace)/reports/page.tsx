"use client";

import { useState, useCallback } from "react";
import { BarChart3, Loader2, FileBarChart } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useActivities } from "@/hooks/useActivities";
import { LoadingPulse, SkeletonReport } from "@/components/ui/Skeleton";
import { trackFeatureClick } from "@/components/Analytics";

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
  const { addActivity } = useActivities();

  const handleGenerate = useCallback(async () => {
    if (!metricsText.trim()) return;
    trackFeatureClick("reports:gerar-relatorio");
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

      await addActivity({
        type: "copy",
        title: `Relatório: ${clientName.trim() || "sem cliente"}`,
        module: "Relatórios",
      });
    } catch {
      toast.error("Erro ao gerar relatório. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [metricsText, clientName, addActivity]);

  const handleLoadExample = () => {
    setMetricsText(EXAMPLE_METRICS);
    setClientName("Clínica Derma Glow");
  };

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

      {/* Empty State */}
      {!report && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-8 flex flex-col items-center text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
            <FileBarChart size={28} className="text-accent" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">Relatórios com IA</h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            Cole métricas de qualquer plataforma e gere relatórios profissionais com IA — pronto para enviar ao cliente.
          </p>
        </motion.div>
      )}

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
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">Cole as métricas</label>
          <textarea
            value={metricsText}
            onChange={(e) => setMetricsText(e.target.value)}
            placeholder="Cole aqui as métricas brutas do período — pode ser texto livre, tabela, ou dados copiados de qualquer ferramenta..."
            rows={6}
            className="input-field resize-none font-mono"
          />
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleGenerate}
          disabled={!metricsText.trim() || loading}
          className={cn(
            "w-full btn-primary justify-center",
            (!metricsText.trim() || loading) && "opacity-50 cursor-not-allowed"
          )}
        >
          {loading ? (
            <><Loader2 size={18} className="animate-spin" /> Gerando relatório...</>
          ) : (
            <><BarChart3 size={18} /> Gerar Relatório</>
          )}
        </motion.button>
      </div>

      {/* Loading State */}
      {loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <LoadingPulse
            message="Gerando relatório com IA..."
            submessage={clientName.trim() ? `Analisando métricas de ${clientName}` : "Analisando métricas e gerando insights"}
          />
          <SkeletonReport />
        </motion.div>
      )}

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
