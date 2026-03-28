"use client";

import { useState, useCallback } from "react";
import { Sparkles, Lightbulb, PenTool, Loader2, RotateCcw } from "lucide-react";
import SearchForm from "@/components/SearchForm";
import BriefDecoder from "@/components/BriefDecoder";
import StepIndicator from "@/components/StepIndicator";
import ReferenceCard from "@/components/ReferenceCard";
import IdeaCard from "@/components/IdeaCard";
import CopyOutput from "@/components/CopyOutput";
import { Platform, Format, Step, AnalyzedReference, Idea, CopyResult } from "@/lib/types";

type InputTab = "quick" | "brief";

export default function Home() {
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
      // 1. Search via Apify
      const searchRes = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: searchTopic, platform: searchPlatform }),
      });

      if (!searchRes.ok) throw new Error("Search failed");
      const { references: rawRefs } = await searchRes.json();

      // 2. Analyze with Claude
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

      // Merge analyses into references
      const analyzed: AnalyzedReference[] = rawRefs.map((ref: AnalyzedReference) => {
        const analysis = analyses?.find((a: { id: string; analysis: string; relevanceScore: number }) => a.id === ref.id);
        return {
          ...ref,
          analysis: analysis?.analysis || "",
          relevanceScore: analysis?.relevanceScore || 5,
        };
      });

      // Sort by relevance
      analyzed.sort((a: AnalyzedReference, b: AnalyzedReference) => b.relevanceScore - a.relevanceScore);

      setReferences(analyzed);
      setCurrentStep("references");
      setCompletedSteps(["references"]);
    } catch (error) {
      console.error("Search error:", error);
      alert("Erro ao buscar referências. Verifique a conexão e tente novamente.");
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const handleGenerateIdeas = useCallback(async () => {
    setIdeasLoading(true);
    setIdeas([]);
    setSelectedIdea(null);
    setCopyResult(null);

    try {
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          references,
          topic,
          platform,
          format,
        }),
      });

      if (!res.ok) throw new Error("Ideas generation failed");
      const { ideas: generatedIdeas } = await res.json();

      setIdeas(generatedIdeas);
      setCurrentStep("ideas");
      setCompletedSteps(prev => prev.includes("ideas") ? prev : [...prev, "ideas" as Step]);
    } catch (error) {
      console.error("Ideas error:", error);
      alert("Erro ao gerar ideias. Tente novamente.");
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
        body: JSON.stringify({
          idea: selectedIdea,
          topic,
          platform,
          format,
        }),
      });

      if (!res.ok) throw new Error("Copy generation failed");
      const copy = await res.json();

      setCopyResult(copy);
      setCurrentStep("copy");
      setCompletedSteps(prev => prev.includes("copy") ? prev : [...prev, "copy" as Step]);
    } catch (error) {
      console.error("Copy error:", error);
      alert("Erro ao gerar copy. Tente novamente.");
    } finally {
      setCopyLoading(false);
    }
  }, [selectedIdea, topic, platform, format]);

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
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-foreground">Musa</h1>
              <p className="text-xs text-muted-foreground">Referências de conteúdo viral</p>
            </div>
          </div>
          {showResults && (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
            >
              <RotateCcw size={14} />
              Nova busca
            </button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Input Section */}
        {currentStep === "search" && !references.length && (
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-3">
                Encontre referências que <span className="text-primary">viralizam</span>
              </h2>
              <p className="text-muted-foreground">
                Busque conteúdo viral real, gere ideias criativas e produza copy pronto para postar.
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setInputTab("quick")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  inputTab === "quick"
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Busca Rápida
              </button>
              <button
                onClick={() => setInputTab("brief")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  inputTab === "brief"
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Colar Briefing
              </button>
            </div>

            {/* Input Forms */}
            <div className="bg-card border border-border rounded-2xl p-6">
              {inputTab === "quick" ? (
                <SearchForm onSearch={handleSearch} isLoading={searchLoading} />
              ) : (
                <BriefDecoder onSearchFromBrief={handleSearch} isLoading={searchLoading} />
              )}
            </div>
          </div>
        )}

        {/* Loading State */}
        {searchLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-pulse-glow">
              <Loader2 size={28} className="text-primary animate-spin" />
            </div>
            <div className="text-center">
              <p className="font-medium text-foreground">Buscando referências virais...</p>
              <p className="text-sm text-muted-foreground mt-1">
                Analisando conteúdo sobre &quot;{topic}&quot; no {platform}
              </p>
            </div>
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
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      Referências encontradas
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {references.length} posts sobre &quot;{topic}&quot; no {platform}
                    </p>
                  </div>
                  <button
                    onClick={handleGenerateIdeas}
                    disabled={ideasLoading}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all disabled:opacity-50"
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
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      Ideias de Conteúdo
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Selecione uma ideia para gerar o copy completo
                    </p>
                  </div>
                  {selectedIdea && (
                    <button
                      onClick={handleGenerateCopy}
                      disabled={copyLoading}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all disabled:opacity-50"
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
              </div>
            )}

            {/* Step: Copy */}
            {currentStep === "copy" && copyResult && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-foreground">
                    Copy Pronto
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Baseado em: &quot;{selectedIdea?.title}&quot;
                  </p>
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
      <footer className="border-t border-border mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-4 text-center text-xs text-muted-foreground">
          Musa — Feito para o desafio Human Academy
        </div>
      </footer>
    </div>
  );
}
