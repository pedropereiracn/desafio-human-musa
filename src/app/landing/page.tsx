"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Sparkles, PenTool, FileText, Users, BarChart3, CalendarDays } from "lucide-react";

const FEATURES = [
  { icon: Sparkles, title: "Musa Pipeline", desc: "Busque referências virais reais e gere copy com IA" },
  { icon: PenTool, title: "Copy Lab", desc: "Gere copy standalone para qualquer formato em segundos" },
  { icon: FileText, title: "Central de Briefs", desc: "Decodifique briefings bagunçados de clientes com IA" },
  { icon: Users, title: "Hub de Clientes", desc: "Gerencie brand voice e perfis de todos os seus clientes" },
  { icon: BarChart3, title: "Relatórios", desc: "Transforme métricas brutas em relatórios profissionais" },
  { icon: CalendarDays, title: "Calendário", desc: "Visualize seu pipeline de conteúdo no calendário" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className="font-bold text-lg text-foreground tracking-tight">Musa</span>
        </div>
        <Link
          href="/"
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors"
        >
          Entrar
          <ArrowRight size={14} />
        </Link>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs text-muted-foreground border border-border mb-8">
            Workspace completo para agências
          </div>

          <h1 className="text-display text-foreground mb-6">
            O workspace que sua<br />
            agência <span className="gradient-text">precisava.</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed mb-10">
            Referências virais, geração de copy, gestão de clientes e relatórios — tudo com IA nativa, num lugar só.
          </p>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full bg-indigo-500 border-2 border-background" />
              <div className="w-7 h-7 rounded-full bg-violet-500 border-2 border-background" />
              <div className="w-7 h-7 rounded-full bg-blue-500 border-2 border-background" />
              <div className="w-7 h-7 rounded-full bg-cyan-500 border-2 border-background" />
            </div>
            <span className="text-sm text-muted-foreground">Usado por agências em todo Brasil</span>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-white font-semibold text-base hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
          >
            Entrar no Workspace
            <ArrowRight size={16} />
          </Link>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mt-20 mb-12"
        >
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              className="card p-5 flex flex-col gap-3"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <f.icon size={18} className="text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between text-xs text-muted-foreground/60">
          <span>Musa — Feito para o desafio Human Academy</span>
          <span>Powered by Claude AI</span>
        </div>
      </footer>
    </div>
  );
}
