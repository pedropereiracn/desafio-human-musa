"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "motion/react";
import { ArrowRight, Sparkles, PenTool, FileText, Users, BarChart3, CalendarDays, Zap } from "lucide-react";

const FEATURES = [
  { icon: Sparkles, title: "Musa Pipeline", desc: "Busque referências virais reais e gere copy com IA", accent: "from-green-500/20 to-emerald-500/20 text-green-400" },
  { icon: PenTool, title: "Copy Lab", desc: "Gere copy standalone para qualquer formato em segundos", accent: "from-violet-500/20 to-purple-500/20 text-violet-400" },
  { icon: FileText, title: "Central de Briefs", desc: "Decodifique briefings bagunçados de clientes com IA", accent: "from-amber-500/20 to-yellow-500/20 text-amber-400" },
  { icon: Users, title: "Hub de Clientes", desc: "Gerencie brand voice e perfis de todos os seus clientes", accent: "from-emerald-500/20 to-teal-500/20 text-emerald-400" },
  { icon: BarChart3, title: "Relatórios", desc: "Transforme métricas brutas em relatórios profissionais", accent: "from-blue-500/20 to-cyan-500/20 text-blue-400" },
  { icon: CalendarDays, title: "Calendário", desc: "Visualize seu pipeline de conteúdo no calendário", accent: "from-rose-500/20 to-pink-500/20 text-rose-400" },
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

/* Inline Musa lyre icon */
function MusaLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hero-lg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4ADE80"/>
          <stop offset="100%" stopColor="#22C55E"/>
        </linearGradient>
        <linearGradient id="hero-lg2" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#22C55E" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#4ADE80" stopOpacity="0.8"/>
        </linearGradient>
      </defs>
      <path d="M16 12C16 12 12 12 12 18V38C12 48 20 56 32 56C44 56 52 48 52 38V18C52 12 48 12 48 12" stroke="url(#hero-lg1)" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <line x1="16" y1="12" x2="48" y2="12" stroke="url(#hero-lg1)" strokeWidth="3.5" strokeLinecap="round"/>
      <line x1="24" y1="16" x2="24" y2="44" stroke="url(#hero-lg2)" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 4"/>
      <line x1="32" y1="14" x2="32" y2="48" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" opacity="0.9"/>
      <line x1="40" y1="16" x2="40" y2="44" stroke="url(#hero-lg2)" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 4"/>
      <circle cx="32" cy="30" r="4" fill="#22C55E" opacity="0.9"/>
      <circle cx="32" cy="30" r="7" fill="none" stroke="#4ADE80" strokeWidth="1" opacity="0.4"/>
    </svg>
  );
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
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Scroll Progress */}
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

      {/* Ambient background blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-green-500/[0.03] blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-violet-400/[0.03] blur-[100px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-background/60 border-b border-white/[0.04]">
        <div className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <MusaLogo size={36} />
            <span className="font-bold text-lg text-foreground tracking-tight" style={{ fontFamily: "var(--font-display)" }}>musa</span>
          </div>
          <Link
            href="/"
            className="btn-primary flex items-center gap-2 !py-2 !px-5 text-sm"
          >
            Entrar
            <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center px-6 relative z-10">
        <div className="flex flex-col items-center justify-center min-h-[85vh] text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs text-muted-foreground border border-white/[0.06] bg-white/[0.02] mb-8"
          >
            <Zap size={12} className="text-green-400" />
            Workspace completo para agências
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-display text-foreground mb-6 relative"
          >
            O workspace que sua<br />
            agência <span className="gradient-text">precisava.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed mb-12"
          >
            Referências virais, geração de copy, gestão de clientes e relatórios — tudo com IA nativa, num lugar só.
          </motion.p>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="flex items-center justify-center gap-3 mb-10"
          >
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-background" />
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 border-2 border-background" />
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 border-2 border-background" />
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-300 to-emerald-500 border-2 border-background" />
            </div>
            <span className="text-sm text-muted-foreground">Usado por agências em todo Brasil</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
          >
            <Link
              href="/"
              className="group btn-primary inline-flex items-center gap-2 !px-8 !py-4 !text-base !shadow-xl !shadow-green-500/20"
            >
              Entrar no Workspace
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-16 py-14 border-y border-white/[0.04] w-full max-w-3xl"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-extrabold text-foreground tracking-tight">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-xs text-muted-foreground mt-1.5 tracking-wide">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mt-16 mb-20 w-full">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="card hover-lift p-6 flex flex-col gap-4"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.accent} flex items-center justify-center`}>
                <f.icon size={20} />
              </div>
              <h3 className="font-semibold text-foreground">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between text-xs text-muted-foreground/50">
          <span>Musa — Feito para o desafio Human Academy</span>
          <span>Powered by Claude AI</span>
        </div>
      </footer>
    </div>
  );
}
