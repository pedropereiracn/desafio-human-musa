"use client";

import { useState, useCallback } from "react";
import { Lightbulb, PenTool, Loader2, RotateCcw, RefreshCw, ArrowRight, Eye, Heart, MessageCircle, Trophy, Layers } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import SearchForm from "@/components/SearchForm";
import BriefDecoder from "@/components/BriefDecoder";
import StepIndicator from "@/components/StepIndicator";
import ReferenceCard from "@/components/ReferenceCard";
import IdeaCard from "@/components/IdeaCard";
import CopyOutput from "@/components/CopyOutput";
import ExportButton from "@/components/ExportButton";
import { SkeletonGrid, SkeletonIdea } from "@/components/ui/Skeleton";
import { useActivities } from "@/hooks/useActivities";
import { useCopyHistory } from "@/hooks/useCopyHistory";
import type { Platform, Format, Step, AnalyzedReference, Idea, CopyResult } from "@/lib/types";

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
}

type InputTab = "quick" | "brief";

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};
const staggerItem = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

export default function MusaPage() {
  const [inputTab, setInputTab] = useState<InputTab>("quick");
  const [currentStep, setCurrentStep] = useState<Step>("search");
  const [completedSteps, setCompletedSteps] = useState<Step[]>([]);

  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [format, setFormat] = useState<Format>("reels");
  const [searchLoading, setSearchLoading] = useState(false);

  const [references, setReferences] = useState<AnalyzedReference[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [ideasLoading, setIdeasLoading] = useState(false);
  const [copyResult, setCopyResult] = useState<CopyResult | null>(null);
  const [copyLoading, setCopyLoading] = useState(false);

  const router = useRouter();
  const { addActivity } = useActivities();
  const { addCopy } = useCopyHistory();

  const logActivity = useCallback((type: "search" | "copy" | "brief" | "client", title: string) => {
    addActivity({ type, title, module: "Musa Pipeline" });
  }, [addActivity]);

  const handleSearch = useCallback(async (searchTopic: string, searchPlatform: Platform, searchFormat: Format) => {
    setTopic(searchTopic);
    setPlatform(searchPlatform);
    setFormat(searchFormat);
    setSearchLoading(true);
    setReferences([]);
    setIdeas([]);
    setSelectedIdea(null);
    setCopyResult(null);

    try {
      const searchRes = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: searchTopic, platform: searchPlatform }),
      });

      if (!searchRes.ok) throw new Error("Search failed");
      const searchData = await searchRes.json();
      const rawRefs = searchData.references;

      if (searchData.fallback) {
        setPlatform("tiktok");
        toast.info("Instagram sem posts virais — buscando no TikTok...");
      }

      toast.info("Analisando referências com IA...");

      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          references: rawRefs,
          topic: searchTopic,
          format: searchFormat,
        }),
      });

      if (!analyzeRes.ok) throw new Error("Analysis failed");
      const { analyses } = await analyzeRes.json();

      const analyzed: AnalyzedReference[] = rawRefs.map((ref: AnalyzedReference) => {
        const analysis = analyses?.find((a: { id: string; analysis: string; relevanceScore: number; hookType?: string; emotionalTrigger?: string }) => a.id === ref.id);
        return {
          ...ref,
          analysis: analysis?.analysis || "",
          relevanceScore: analysis?.relevanceScore || 5,
          hookType: analysis?.hookType || undefined,
          emotionalTrigger: analysis?.emotionalTrigger || undefined,
        };
      });

      analyzed.sort((a: AnalyzedReference, b: AnalyzedReference) => b.relevanceScore - a.relevanceScore);

      setReferences(analyzed);
      setCurrentStep("references");
      setCompletedSteps(["references"]);
      toast.success(`${analyzed.length} referências encontradas`);
      logActivity("search", `Busca: "${searchTopic}" no ${searchPlatform}`);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Erro ao buscar referências. Verifique a conexão e tente novamente.");
    } finally {
      setSearchLoading(false);
    }
  }, [logActivity]);

  const handleGenerateIdeas = useCallback(async () => {
    setIdeasLoading(true);
    setIdeas([]);
    setSelectedIdea(null);
    setCopyResult(null);

    try {
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ references, topic, platform, format }),
      });

      if (!res.ok) throw new Error("Ideas generation failed");
      const { ideas: generatedIdeas } = await res.json();

      setIdeas(generatedIdeas);
      setCurrentStep("ideas");
      setCompletedSteps(prev => prev.includes("ideas") ? prev : [...prev, "ideas" as Step]);
      toast.success("5 ideias criativas geradas");
    } catch (error) {
      console.error("Ideas error:", error);
      toast.error("Erro ao gerar ideias. Tente novamente.");
    } finally {
      setIdeasLoading(false);
    }
  }, [references, topic, platform, format]);

  const handleSelectIdea = useCallback((idea: Idea) => {
    setSelectedIdea(idea);
  }, []);

  const handleGenerateCopy = useCallback(async () => {
    if (!selectedIdea) return;
    setCopyLoading(true);
    setCopyResult(null);

    try {
      const res = await fetch("/api/copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: selectedIdea, topic, platform, format }),
      });

      if (!res.ok) throw new Error("Copy generation failed");
      const copy = await res.json();

      setCopyResult(copy);
      setCurrentStep("copy");
      setCompletedSteps(prev => prev.includes("copy") ? prev : [...prev, "copy" as Step]);
      toast.success("Copy pronto para produção!");
      logActivity("copy", `Copy: "${selectedIdea.title}"`);

      await addCopy({
        module: "musa",
        prompt: topic,
        result: copy,
        platform,
      });
    } catch (error) {
      console.error("Copy error:", error);
      toast.error("Erro ao gerar copy. Tente novamente.");
    } finally {
      setCopyLoading(false);
    }
  }, [selectedIdea, topic, platform, format, logActivity, addCopy]);

  const handleReset = useCallback(() => {
    setCurrentStep("search");
    setCompletedSteps([]);
    setReferences([]);
    setIdeas([]);
    setSelectedIdea(null);
    setCopyResult(null);
    setTopic("");
  }, []);

  const showResults = currentStep !== "search" || references.length > 0;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      {showResults && (
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-foreground">Musa Pipeline</h1>
            <p className="text-sm text-muted-foreground">Referências → Ideias → Copy</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleReset}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground border border-border hover:border-primary/20 transition-colors"
          >
            <RotateCcw size={14} />
            Nova busca
          </motion.button>
        </div>
      )}

      {/* Hero + Input Section */}
      {currentStep === "search" && !references.length && (
        <div className="max-w-xl mx-auto pt-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-foreground mb-3">
              Encontre o que <span className="gradient-text">viraliza.</span>
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Busque conteúdo viral real, gere ideias criativas e produza copy pronto para postar.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 mb-6 border-b border-border">
            <button
              onClick={() => setInputTab("quick")}
              className={`pb-3 text-sm font-medium transition-colors relative ${
                inputTab === "quick" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Busca Rápida
              {inputTab === "quick" && (
                <motion.div layoutId="musa-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
            <button
              onClick={() => setInputTab("brief")}
              className={`pb-3 text-sm font-medium transition-colors relative ${
                inputTab === "brief" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Colar Briefing
              {inputTab === "brief" && (
                <motion.div layoutId="musa-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          </div>

          <div className="card p-6">
            {inputTab === "quick" ? (
              <SearchForm onSearch={handleSearch} isLoading={searchLoading} />
            ) : (
              <BriefDecoder onSearchFromBrief={handleSearch} isLoading={searchLoading} />
            )}
          </div>
        </div>
      )}

      {/* Loading */}
      {searchLoading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex flex-col items-center justify-center py-12 gap-4 mb-8">
            <Loader2 size={28} className="text-primary animate-spin" />
            <div className="text-center">
              <p className="font-medium text-foreground">Buscando referências virais...</p>
              <p className="text-sm text-muted-foreground mt-1">
                Analisando conteúdo sobre &quot;{topic}&quot; no {platform}
              </p>
            </div>
          </div>
          <SkeletonGrid count={8} />
        </motion.div>
      )}

      {/* Results */}
      {showResults && !searchLoading && (
        <>
          <StepIndicator currentStep={currentStep} onStepClick={setCurrentStep} completedSteps={completedSteps} />

          <AnimatePresence mode="wait">
            {currentStep === "references" && (() => {
              const avgViews = references.length > 0 ? references.reduce((s, r) => s + (r.views || 0), 0) / references.length : 0;
              const avgLikes = references.length > 0 ? references.reduce((s, r) => s + r.likes, 0) / references.length : 0;
              const avgComments = references.length > 0 ? references.reduce((s, r) => s + r.comments, 0) / references.length : 0;
              const topRef = references.length > 0 ? references.reduce((best, r) => ((r.views || 0) + r.likes > (best.views || 0) + best.likes ? r : best), references[0]) : null;

              const hookCounts: Record<string, number> = {};
              const triggerCounts: Record<string, number> = {};
              references.forEach(r => {
                if (r.hookType) hookCounts[r.hookType] = (hookCounts[r.hookType] || 0) + 1;
                if (r.emotionalTrigger) triggerCounts[r.emotionalTrigger] = (triggerCounts[r.emotionalTrigger] || 0) + 1;
              });
              const topHooks = Object.entries(hookCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);
              const topTriggers = Object.entries(triggerCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);
              const hasPatterns = topHooks.length > 0 || topTriggers.length > 0;

              return (
              <motion.div key="refs" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Referências encontradas</h2>
                    <p className="text-sm text-muted-foreground">{references.length} posts sobre &quot;{topic}&quot; no {platform}</p>
                  </div>
                  <motion.button whileTap={{ scale: 0.98 }} onClick={handleGenerateIdeas} disabled={ideasLoading} className="flex items-center gap-2 btn-primary !py-2.5 !px-5 disabled:opacity-50">
                    {ideasLoading ? <Loader2 size={16} className="animate-spin" /> : <Lightbulb size={16} />}
                    Gerar Ideias
                    <ArrowRight size={14} />
                  </motion.button>
                </div>

                {/* Summary Bar */}
                <div className="card rounded-xl p-4 mb-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                  <span className="font-medium text-foreground">{references.length} referências</span>
                  <span className="text-muted-foreground">Média:</span>
                  {avgViews > 0 && (
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Eye size={14} className="text-blue-400" />
                      {formatNumber(Math.round(avgViews))}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Heart size={14} className="text-red-400" />
                    {formatNumber(Math.round(avgLikes))}
                  </span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <MessageCircle size={14} className="text-purple-400" />
                    {formatNumber(Math.round(avgComments))}
                  </span>
                  {topRef && (
                    <span className="flex items-center gap-1.5 text-muted-foreground ml-auto">
                      <Trophy size={14} className="text-amber-400" />
                      Top: @{topRef.author} ({formatNumber((topRef.views || 0) + topRef.likes)})
                    </span>
                  )}
                </div>

                {/* Patterns */}
                {hasPatterns && (
                  <div className="card rounded-xl p-4 mb-6 space-y-3">
                    <h3 className="text-sm font-semibold text-foreground">Padrões Detectados</h3>
                    <div className="flex flex-wrap gap-4">
                      {topHooks.length > 0 && (
                        <div>
                          <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1.5">Top Hooks</p>
                          <div className="flex flex-wrap gap-1.5">
                            {topHooks.map(([hook, count]) => (
                              <span key={hook} className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/15 text-primary">
                                {hook} ({count})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {topTriggers.length > 0 && (
                        <div>
                          <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1.5">Gatilhos Emocionais</p>
                          <div className="flex flex-wrap gap-1.5">
                            {topTriggers.map(([trigger, count]) => (
                              <span key={trigger} className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/15 text-amber-400">
                                {trigger} ({count})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {references.map((ref) => (
                    <motion.div key={ref.id} variants={staggerItem}><ReferenceCard reference={ref} /></motion.div>
                  ))}
                </motion.div>
              </motion.div>
              );
            })()}

            {currentStep === "ideas" && (
              <motion.div key="ideas" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Ideias de Conteúdo</h2>
                    <p className="text-sm text-muted-foreground">Selecione uma ideia para gerar o copy completo</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button whileTap={{ scale: 0.98 }} onClick={handleGenerateIdeas} disabled={ideasLoading} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors disabled:opacity-50">
                      {ideasLoading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                      Novas ideias
                    </motion.button>
                    {selectedIdea && (
                      <motion.button whileTap={{ scale: 0.98 }} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={handleGenerateCopy} disabled={copyLoading} className="flex items-center gap-2 btn-primary !py-2.5 !px-5 disabled:opacity-50">
                        {copyLoading ? <Loader2 size={16} className="animate-spin" /> : <PenTool size={16} />}
                        Gerar Copy
                        <ArrowRight size={14} />
                      </motion.button>
                    )}
                  </div>
                </div>
                {ideasLoading ? (
                  <div className="max-w-2xl mx-auto space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => <SkeletonIdea key={i} />)}
                  </div>
                ) : (
                  <motion.div variants={staggerContainer} initial="hidden" animate="show" className="max-w-2xl mx-auto space-y-3">
                    {ideas.map((idea, i) => (
                      <motion.div key={idea.id} variants={staggerItem}>
                        <IdeaCard idea={idea} index={i} selected={selectedIdea?.id === idea.id} onSelect={handleSelectIdea} />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            )}

            {currentStep === "copy" && copyResult && (
              <motion.div key="copy" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Copy Pronto</h2>
                    <p className="text-sm text-muted-foreground">Baseado em: &quot;{selectedIdea?.title}&quot;</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button whileTap={{ scale: 0.98 }} onClick={handleGenerateCopy} disabled={copyLoading} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors disabled:opacity-50">
                      {copyLoading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                      Outra versão
                    </motion.button>
                    <ExportButton copy={copyResult} topic={topic} ideaTitle={selectedIdea?.title || ""} />
                  </div>
                </div>
                {format === "carrossel" && (
                  <motion.button
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      sessionStorage.setItem("carousel-context", JSON.stringify({
                        caption: copyResult.caption,
                        hashtags: copyResult.hashtags,
                        cta: copyResult.cta,
                        notes: copyResult.notes,
                      }));
                      router.push(`/carousel?topic=${encodeURIComponent(topic)}&platform=${platform}`);
                    }}
                    className="w-full max-w-2xl mx-auto flex items-center justify-center gap-2 btn-primary !py-3 mb-4"
                  >
                    <Layers size={18} />
                    Criar Carrossel Visual
                    <ArrowRight size={16} />
                  </motion.button>
                )}
                <div className="max-w-2xl mx-auto">
                  <CopyOutput copy={copyResult} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
