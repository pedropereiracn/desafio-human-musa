"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "motion/react";
import { ArrowRight, Sparkles, PenTool, FileText, Users, BarChart3, CalendarDays } from "lucide-react";

const FEATURES = [
  { icon: Sparkles, title: "Musa Pipeline", desc: "Busque referências virais reais e gere copy com IA" },
  { icon: PenTool, title: "Copy Lab", desc: "Gere copy standalone para qualquer formato em segundos" },
  { icon: FileText, title: "Central de Briefs", desc: "Decodifique briefings bagunçados de clientes com IA" },
  { icon: Users, title: "Hub de Clientes", desc: "Gerencie brand voice e perfis de todos os seus clientes" },
  { icon: BarChart3, title: "Relatórios", desc: "Transforme métricas brutas em relatórios profissionais" },
  { icon: CalendarDays, title: "Calendário", desc: "Visualize seu pipeline de conteúdo no calendário" },
];

const STATS = [
  { value: 500, suffix: "+", label: "copies gerados" },
  { value: 12, suffix: "x", label: "mais rápido" },
  { value: 7, suffix: "", label: "módulos integrados" },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1500;
    const step = Math.max(1, Math.floor(value / (duration / 16)));
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, value]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function LandingPage() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Scroll Progress */}
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/50">
        <div className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto w-full">
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
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center px-6">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs text-muted-foreground border border-border mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Workspace completo para agências
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-display text-foreground mb-6 relative"
          >
            <span className="light-sweep rounded-2xl absolute inset-0 pointer-events-none" />
            O workspace que sua<br />
            agência <span className="gradient-text">precisava.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed mb-10"
          >
            Referências virais, geração de copy, gestão de clientes e relatórios — tudo com IA nativa, num lugar só.
          </motion.p>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-3 mb-10"
          >
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full bg-indigo-500 border-2 border-background" />
              <div className="w-7 h-7 rounded-full bg-violet-500 border-2 border-background" />
              <div className="w-7 h-7 rounded-full bg-blue-500 border-2 border-background" />
              <div className="w-7 h-7 rounded-full bg-cyan-500 border-2 border-background" />
            </div>
            <span className="text-sm text-muted-foreground">Usado por agências em todo Brasil</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link
              href="/"
              className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-white font-semibold text-base hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
            >
              Entrar no Workspace
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>

        {/* Stats with Counter Animations */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-12 py-12 border-y border-border/50 w-full max-w-3xl"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-extrabold text-foreground tracking-tight">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mt-16 mb-12">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="card hover-lift p-5 flex flex-col gap-3"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <f.icon size={18} className="text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
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
