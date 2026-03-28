"use client";

import { useState, useCallback } from "react";
import { Sparkles, Lightbulb, PenTool, Loader2, RotateCcw } from "lucide-react";
import SearchForm from "@/components/SearchForm";
import BriefDecoder from "@/components/BriefDecoder";
import StepIndicator from "@/components/StepIndicator";
import ReferenceCard from "@/components/ReferenceCard";
import IdeaCard from "@/components/IdeaCard";
import CopyOutput from "@/components/CopyOutput";
import ExportButton from "@/components/ExportButton";
import { SkeletonGrid, SkeletonIdea } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { Platform, Format, Step, AnalyzedReference, Idea, CopyResult } from "@/lib/types";

type InputTab = "quick" | "brief";

export default function Home() {
  const { toast } = useToast();
  const [inputTab, setInputTab] = useState<InputTab>("quick");
  const [currentStep, setCurrentStep] = useState<Step>("search");
  const [completedSteps, setCompletedSteps] = useState<Step[]>([]);

  // Search state
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [format, setFormat] = useState<Format>("reels");
  const [searchLoading, setSearchLoading] = useState(false);

  // References
  const [references, setReferences] = useState<AnalyzedReference[]>([]);

  // Ideas
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [ideasLoading, setIdeasLoading] = useState(false);

  // Copy
  const [copyResult, setCopyResult] = useState<CopyResult | null>(null);
  const [copyLoading, setCopyLoading] = useState(false);

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
      const { references: rawRefs } = await searchRes.json();

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
        const analysis = analyses?.find((a: { id: string; analysis: string; relevanceScore: number }) => a.id === ref.id);
        return {
          ...ref,
          analysis: analysis?.analysis || "",
          relevanceScore: analysis?.relevanceScore || 5,
        };
      });

      analyzed.sort((a: AnalyzedReference, b: AnalyzedReference) => b.relevanceScore - a.relevanceScore);

      setReferences(analyzed);
      setCurrentStep("references");
      setCompletedSteps(["references"]);
      toast(`${analyzed.length} referências encontradas`, "success");
    } catch (error) {
      console.error("Search error:", error);
      toast("Erro ao buscar referências. Verifique a conexão e tente novamente.", "error");
    } finally {
      setSearchLoading(false);
    }
  }, [toast]);

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
      toast("5 ideias criativas geradas", "success");
    } catch (error) {
      console.error("Ideas error:", error);
      toast("Erro ao gerar ideias. Tente novamente.", "error");
    } finally {
      setIdeasLoading(false);
    }
  }, [references, topic, platform, format, toast]);

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
      toast("Copy pronto para produção!", "success");
    } catch (error) {
      console.error("Copy error:", error);
      toast("Erro ao gerar copy. Tente novamente.", "error");
    } finally {
      setCopyLoading(false);
    }
  }, [selectedIdea, topic, platform, format, toast]);

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
    <div className="min-h-screen flex flex-col">
      {/* Header - Glassmorphism */}
      <header className="sticky top-0 z-40 glass border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-foreground tracking-tight">Musa</h1>
              <p className="text-[11px] text-muted-foreground/60">Powered by Claude AI</p>
            </div>
          </div>
          {showResults && (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground glass hover:bg-white/5 transition-all"
            >
              <RotateCcw size={14} />
              Nova busca
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        {/* Hero + Input Section */}
        {currentStep === "search" && !references.length && (
          <div className="max-w-xl mx-auto">
            {/* Hero */}
            <div className="aurora-bg text-center mb-10 py-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 glass rounded-full text-xs text-muted-foreground mb-6">
                <Sparkles size={12} className="text-primary" />
                Pipeline de 4 etapas com IA
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight leading-tight">
                Encontre referências<br />
                que <span className="gradient-text">viralizam</span>
              </h2>
              <p className="text-muted-foreground/70 max-w-md mx-auto leading-relaxed">
                Busque conteúdo viral real, gere ideias criativas e produza copy pronto para postar — tudo com inteligência artificial.
              </p>

              {/* Decorative particles */}
              <div className="relative mt-2">
                <div className="absolute -top-20 left-1/4 w-1 h-1 rounded-full bg-primary/30 animate-float" style={{ animationDelay: "0s" }} />
                <div className="absolute -top-16 right-1/3 w-1.5 h-1.5 rounded-full bg-accent/20 animate-float" style={{ animationDelay: "1s" }} />
                <div className="absolute -top-24 right-1/4 w-1 h-1 rounded-full bg-primary/20 animate-float" style={{ animationDelay: "2s" }} />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 glass rounded-xl p-1">
              <button
                onClick={() => setInputTab("quick")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  inputTab === "quick"
                    ? "bg-white/10 text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Busca Rápida
              </button>
              <button
                onClick={() => setInputTab("brief")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  inputTab === "brief"
                    ? "bg-white/10 text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Colar Briefing
              </button>
            </div>

            {/* Input Forms */}
            <div className="glass-card rounded-2xl p-6">
              {inputTab === "quick" ? (
                <SearchForm onSearch={handleSearch} isLoading={searchLoading} />
              ) : (
                <BriefDecoder onSearchFromBrief={handleSearch} isLoading={searchLoading} />
              )}
            </div>
          </div>
        )}

        {/* Loading State - Skeleton */}
        {searchLoading && (
          <div className="animate-fade-in">
            <div className="flex flex-col items-center justify-center py-12 gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center animate-glow-pulse">
                <Loader2 size={28} className="text-primary animate-spin" />
              </div>
              <div className="text-center">
                <p className="font-medium text-foreground">Buscando referências virais...</p>
                <p className="text-sm text-muted-foreground/60 mt-1">
                  Analisando conteúdo sobre &quot;{topic}&quot; no {platform}
                </p>
              </div>
            </div>
            <SkeletonGrid count={8} />
          </div>
        )}

        {/* Results */}
        {showResults && !searchLoading && (
          <>
            <StepIndicator
              currentStep={currentStep}
              onStepClick={setCurrentStep}
              completedSteps={completedSteps}
            />

            {/* Step: References */}
            {currentStep === "references" && (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      Referências encontradas
                    </h2>
                    <p className="text-sm text-muted-foreground/60">
                      {references.length} posts sobre &quot;{topic}&quot; no {platform}
                    </p>
                  </div>
                  <button
                    onClick={handleGenerateIdeas}
                    disabled={ideasLoading}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-medium text-sm shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {ideasLoading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Lightbulb size={16} />
                    )}
                    Gerar Ideias
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {references.map((ref, i) => (
                    <ReferenceCard key={ref.id} reference={ref} index={i} />
                  ))}
                </div>
              </div>
            )}

            {/* Step: Ideas */}
            {currentStep === "ideas" && (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      Ideias de Conteúdo
                    </h2>
                    <p className="text-sm text-muted-foreground/60">
                      Selecione uma ideia para gerar o copy completo
                    </p>
                  </div>
                  {selectedIdea && (
                    <button
                      onClick={handleGenerateCopy}
                      disabled={copyLoading}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-medium text-sm shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
                    >
                      {copyLoading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <PenTool size={16} />
                      )}
                      Gerar Copy
                    </button>
                  )}
                </div>

                {ideasLoading ? (
                  <div className="max-w-2xl mx-auto space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <SkeletonIdea key={i} />
                    ))}
                  </div>
                ) : (
                  <div className="max-w-2xl mx-auto space-y-3">
                    {ideas.map((idea, i) => (
                      <IdeaCard
                        key={idea.id}
                        idea={idea}
                        index={i}
                        selected={selectedIdea?.id === idea.id}
                        onSelect={handleSelectIdea}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step: Copy */}
            {currentStep === "copy" && copyResult && (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      Copy Pronto
                    </h2>
                    <p className="text-sm text-muted-foreground/60">
                      Baseado em: &quot;{selectedIdea?.title}&quot;
                    </p>
                  </div>
                  <ExportButton
                    copy={copyResult}
                    topic={topic}
                    ideaTitle={selectedIdea?.title || ""}
                  />
                </div>

                <div className="max-w-2xl mx-auto">
                  <CopyOutput copy={copyResult} />
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between text-xs text-muted-foreground/40">
          <span>Musa — Feito para o desafio Human Academy</span>
          <span className="flex items-center gap-1.5">
            <Sparkles size={10} className="text-primary/40" />
            Powered by Claude AI
          </span>
        </div>
      </footer>
    </div>
  );
}
