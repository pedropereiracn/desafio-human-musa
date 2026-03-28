"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  Sparkles,
  PenTool,
  FileText,
  Users,
  BarChart3,
  CalendarDays,
  Zap,
  Search,
  Brain,
  Lightbulb,
  Copy,
  Star,
  TrendingUp,
  Play,
  CheckCircle2,
  ChevronRight,
  Layers,
  MousePointer2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════ */

const TYPEWRITER_WORDS = [
  "referências virais",
  "copy profissional",
  "briefings complexos",
  "ideias originais",
  "scripts para Reels",
];

const PIPELINE_STEPS = [
  { icon: Search, label: "Busca", desc: "Referências virais de Instagram e TikTok", color: "text-green-400", bg: "bg-green-500/10" },
  { icon: Brain, label: "Análise", desc: "7 dimensões de viralidade com IA", color: "text-violet-400", bg: "bg-violet-500/10" },
  { icon: Lightbulb, label: "Ideação", desc: "5 ideias originais com hooks testados", color: "text-amber-400", bg: "bg-amber-500/10" },
  { icon: Copy, label: "Produção", desc: "Copy pronto para publicar", color: "text-emerald-400", bg: "bg-emerald-500/10" },
];

const FEATURES = [
  { icon: Sparkles, title: "Musa Pipeline", desc: "Busque referências reais, analise viralidade e gere copy — num fluxo único.", accent: "green", size: "large" },
  { icon: PenTool, title: "Copy Lab", desc: "Gere copy standalone para qualquer formato e plataforma em segundos.", accent: "violet", size: "medium" },
  { icon: FileText, title: "Brief Decoder", desc: "Cole briefings bagunçados de clientes e a IA estrutura tudo.", accent: "amber", size: "medium" },
  { icon: Users, title: "Hub de Clientes", desc: "Brand voice, perfil, plataformas preferidas — tudo organizado.", accent: "emerald", size: "small" },
  { icon: Layers, title: "Carrossel Builder", desc: "Crie carrosséis visuais diretamente na plataforma.", accent: "blue", size: "small" },
  { icon: BarChart3, title: "Relatórios", desc: "Transforme métricas brutas em relatórios profissionais com IA.", accent: "rose", size: "small" },
  { icon: CalendarDays, title: "Calendário", desc: "Visualize e gerencie seu pipeline de conteúdo.", accent: "cyan", size: "small" },
];

const TESTIMONIALS = [
  { name: "Marina Costa", role: "Head de Conteúdo", company: "Agência Pulso", text: "O Musa cortou nosso tempo de produção pela metade. O pipeline de referências → copy é absurdamente eficiente." },
  { name: "Lucas Ferreira", role: "Social Media Manager", company: "Studio Criativo", text: "Antes eu levava 2h por post pesquisando referências. Com o Musa faço em 15 minutos com qualidade muito maior." },
  { name: "Camila Souza", role: "Diretora Criativa", company: "Nex Digital", text: "A análise de viralidade mudou completamente como a gente pensa conteúdo. Os insights são realmente actionable." },
];

const STATS = [
  { value: 500, suffix: "+", label: "Copies gerados", icon: Copy },
  { value: 12, suffix: "x", label: "Mais rápido", icon: Zap },
  { value: 7, suffix: "", label: "Módulos integrados", icon: Layers },
  { value: 98, suffix: "%", label: "Satisfação", icon: Star },
];

const ACCENT_MAP: Record<string, string> = {
  green: "from-green-500/20 to-emerald-500/10 border-green-500/10 text-green-400",
  violet: "from-violet-500/20 to-purple-500/10 border-violet-500/10 text-violet-400",
  amber: "from-amber-500/20 to-yellow-500/10 border-amber-500/10 text-amber-400",
  emerald: "from-emerald-500/20 to-teal-500/10 border-emerald-500/10 text-emerald-400",
  blue: "from-blue-500/20 to-cyan-500/10 border-blue-500/10 text-blue-400",
  rose: "from-rose-500/20 to-pink-500/10 border-rose-500/10 text-rose-400",
  cyan: "from-cyan-500/20 to-sky-500/10 border-cyan-500/10 text-cyan-400",
};

/* ═══════════════════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════════════════ */

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
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

function Typewriter({ words }: { words: string[] }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex];
    const speed = isDeleting ? 30 : 60;

    if (!isDeleting && charIndex === current.length) {
      const timeout = setTimeout(() => setIsDeleting(true), 2000);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setCharIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, speed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, wordIndex, words]);

  return (
    <span className="gradient-text">
      {words[wordIndex].substring(0, charIndex)}
      <span className="animate-pulse text-primary">|</span>
    </span>
  );
}

/* Inline Musa logo — speech bubble + creative spark + AI circuits */
function MusaLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hero-g1" x1="10%" y1="90%" x2="90%" y2="10%">
          <stop offset="0%" stopColor="#16A34A" />
          <stop offset="50%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#4ADE80" />
        </linearGradient>
        <linearGradient id="hero-g2" x1="50%" y1="100%" x2="50%" y2="0%">
          <stop offset="0%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#86EFAC" />
        </linearGradient>
      </defs>
      {/* Speech bubble body */}
      <path d="M12 28C12 18.06 20.06 10 30 10H34C43.94 10 52 18.06 52 28V30C52 39.94 43.94 48 34 48H28L18 54V46.5C14.4 43.3 12 38.9 12 34V28Z" fill="url(#hero-g1)" />
      <path d="M16 27C16 20.37 21.37 15 28 15H36C42.63 15 48 20.37 48 27V30C48 36.63 42.63 42 36 42H28C21.37 42 16 36.63 16 30V27Z" fill="white" opacity="0.06" />
      {/* Main spark */}
      <path d="M46 12L48.5 7L51 12L56 14.5L51 17L48.5 22L46 17L41 14.5Z" fill="url(#hero-g2)" />
      {/* Secondary spark */}
      <path d="M38 6L39.2 3.5L40.4 6L43 7.2L40.4 8.4L39.2 11L38 8.4L35.5 7.2Z" fill="#4ADE80" opacity="0.7" />
      <circle cx="55" cy="9" r="1.5" fill="#86EFAC" opacity="0.5" />
      {/* AI circuit lines inside bubble */}
      <g opacity="0.35" stroke="#052e16" strokeWidth="1.2" strokeLinecap="round">
        <path d="M24 26H32L36 30" />
        <path d="M28 32H36" />
        <circle cx="24" cy="26" r="1.5" fill="#052e16" />
        <circle cx="36" cy="30" r="1.5" fill="#052e16" />
        <circle cx="28" cy="32" r="1.5" fill="#052e16" />
        <circle cx="36" cy="32" r="1.5" fill="#052e16" />
      </g>
    </svg>
  );
}

/* Dot grid background pattern — ClickMax inspired */
function DotGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />
      {/* Radial fade to edges */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--background)_70%)]" />
    </div>
  );
}

/* Aurora Boreal — green ambient light animation */
function AuroraBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Primary aurora — large green */}
      <motion.div
        animate={{ y: [0, -40, 10, -20, 0], x: [0, 20, -10, 15, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-20%] left-[-10%] w-[900px] h-[900px] rounded-full blur-[180px]"
        style={{ background: "radial-gradient(circle, rgba(34,197,94,0.08) 0%, rgba(16,185,129,0.04) 50%, transparent 70%)" }}
      />
      {/* Secondary aurora — emerald drift */}
      <motion.div
        animate={{ y: [0, 30, -20, 0], x: [0, -25, 10, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-15%] right-[-10%] w-[700px] h-[700px] rounded-full blur-[150px]"
        style={{ background: "radial-gradient(circle, rgba(74,222,128,0.06) 0%, rgba(5,150,105,0.03) 50%, transparent 70%)" }}
      />
      {/* Tertiary — mid-screen accent */}
      <motion.div
        animate={{ y: [0, -25, 15, 0], x: [0, 15, -20, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[30%] left-[40%] w-[500px] h-[500px] rounded-full blur-[130px]"
        style={{ background: "radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 60%)" }}
      />
      {/* Violet depth accent */}
      <motion.div
        animate={{ y: [0, 20, -10, 0], x: [0, -15, 5, 0] }}
        transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[10%] right-[5%] w-[400px] h-[400px] rounded-full blur-[120px]"
        style={{ background: "radial-gradient(circle, rgba(167,139,250,0.03) 0%, transparent 60%)" }}
      />
    </div>
  );
}

/* Pipeline Demo — the hero visual */
function PipelineDemo() {
  const [activeStep, setActiveStep] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!inView) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 2500);
    return () => clearInterval(interval);
  }, [inView]);

  const mockOutputs = [
    // Search
    <div key="search" className="space-y-2">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
        <Search size={12} className="text-green-400" />
        <span>Buscando &quot;skincare routine&quot; no Instagram...</span>
      </div>
      {[
        { views: "2.4M", engagement: "12.3%" },
        { views: "890K", engagement: "8.7%" },
        { views: "1.1M", engagement: "10.1%" },
      ].map((ref, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15 }}
          className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]"
        >
          <div className="w-8 h-8 rounded bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
            <Play size={10} className="text-green-400" />
          </div>
          <div className="flex-1">
            <div className="h-2 w-24 rounded bg-white/[0.06]" />
            <div className="h-1.5 w-16 rounded bg-white/[0.03] mt-1" />
          </div>
          <div className="text-right">
            <div className="text-[10px] text-green-400 font-mono">{ref.views}</div>
            <div className="text-[9px] text-muted-foreground">{ref.engagement}</div>
          </div>
        </motion.div>
      ))}
    </div>,
    // Analyze
    <div key="analyze" className="space-y-2">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
        <Brain size={12} className="text-violet-400" />
        <span>Analisando padrões de viralidade...</span>
      </div>
      {[
        { dim: "Hook Power", score: 92 },
        { dim: "Relatabilidade", score: 87 },
        { dim: "Valor Prático", score: 95 },
        { dim: "Storytelling", score: 78 },
      ].map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "100%" }}
          transition={{ delay: i * 0.2, duration: 0.5 }}
          className="space-y-1"
        >
          <div className="flex justify-between text-[10px]">
            <span className="text-muted-foreground">{item.dim}</span>
            <span className="text-violet-400 font-mono">{item.score}/100</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${item.score}%` }}
              transition={{ delay: i * 0.2 + 0.3, duration: 0.8 }}
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-400"
            />
          </div>
        </motion.div>
      ))}
    </div>,
    // Ideas
    <div key="ideas" className="space-y-2">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
        <Lightbulb size={12} className="text-amber-400" />
        <span>Gerando ideias originais...</span>
      </div>
      {[
        { title: "POV: Sua rotina de skincare em 30s", hook: "Hook visual" },
        { title: "3 produtos que mudaram minha pele", hook: "Lista viral" },
        { title: "Teste: qual skin type você é?", hook: "Interativo" },
      ].map((idea, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.2 }}
          className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]"
        >
          <div className="text-xs text-foreground font-medium">{idea.title}</div>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400">{idea.hook}</span>
          </div>
        </motion.div>
      ))}
    </div>,
    // Copy
    <div key="copy" className="space-y-2">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
        <Copy size={12} className="text-emerald-400" />
        <span>Produzindo copy final...</span>
      </div>
      <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] font-mono text-[10px] leading-relaxed text-muted-foreground">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-emerald-400">POV:</span> você descobriu que skincare
          <br />não precisa ser complicado 🧴
          <br />
          <br />3 passos. 2 minutos. Pele que brilha.
          <br />
          <br /><span className="text-muted-foreground/50">#skincare #rotina #beleza #viral</span>
        </motion.div>
      </div>
      <div className="flex items-center gap-2">
        <CheckCircle2 size={12} className="text-emerald-400" />
        <span className="text-[10px] text-emerald-400">Copy pronto para publicar</span>
      </div>
    </div>,
  ];

  return (
    <div ref={ref} className="relative">
      {/* Pipeline card */}
      <div className="card p-0 overflow-hidden border-white/[0.06]">
        {/* Steps header */}
        <div className="flex border-b border-white/[0.04]">
          {PIPELINE_STEPS.map((step, i) => (
            <button
              key={i}
              onClick={() => setActiveStep(i)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-3 text-xs transition-all relative",
                activeStep === i ? "text-foreground" : "text-muted-foreground/50"
              )}
            >
              <step.icon size={12} className={activeStep === i ? step.color : ""} />
              <span className="hidden sm:inline">{step.label}</span>
              {activeStep === i && (
                <motion.div
                  layoutId="pipeline-tab"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-green-500 to-violet-500"
                />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4 min-h-[220px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {mockOutputs[activeStep]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div className="h-[2px] bg-white/[0.02]">
          <motion.div
            key={activeStep}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.5, ease: "linear" }}
            className="h-full bg-gradient-to-r from-green-500/50 to-violet-500/50"
          />
        </div>
      </div>

      {/* Glow effect behind the card */}
      <div className="absolute -inset-4 -z-10 bg-gradient-to-r from-green-500/[0.05] to-violet-500/[0.05] rounded-3xl blur-xl" />
    </div>
  );
}

/* Marquee of logos */
function LogoMarquee() {
  const logos = [
    "Agência Pulso", "Studio Criativo", "Nex Digital", "Mídia Lab",
    "Criativa Co.", "Social Hub", "Conteúdo+", "Wave Digital",
  ];

  return (
    <div className="relative overflow-hidden py-6">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="flex gap-12 whitespace-nowrap"
      >
        {[...logos, ...logos].map((name, i) => (
          <span key={i} className="text-sm font-semibold text-muted-foreground/20 tracking-wider uppercase" style={{ fontFamily: "var(--font-display)" }}>
            {name}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════ */

export default function LandingPage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.97]);

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Scroll Progress */}
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

      <AuroraBackground />
      <DotGrid />

      {/* ─── Header ─── */}
      <header className="sticky top-0 z-50 backdrop-blur-3xl bg-background/30 border-b border-white/[0.06]">
        <div className="flex items-center justify-between px-6 py-3.5 max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <MusaLogo size={32} />
            <span className="font-extrabold text-xl text-foreground tracking-tight">
              MUSA
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#pipeline" className="hover:text-foreground transition-colors">Pipeline</a>
            <a href="#depoimentos" className="hover:text-foreground transition-colors">Depoimentos</a>
          </nav>
          <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg shadow-green-500/20">
            <Link href="/">
              Entrar
              <ArrowRight size={14} />
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 relative z-10">

        {/* ─── Hero ─── */}
        <motion.section
          ref={heroRef}
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative px-6 pt-20 pb-16 md:pt-28 md:pb-24"
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left — Copy */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Badge variant="outline" className="mb-6 px-3 py-1.5 text-xs rounded-full border-white/[0.08] bg-white/[0.02] text-muted-foreground gap-1.5">
                    <Zap size={12} className="text-green-400" />
                    Workspace completo para agencias
                  </Badge>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="text-display text-foreground mb-6"
                >
                  Transforme{" "}
                  <Typewriter words={TYPEWRITER_WORDS} />
                  <br />
                  <span className="text-muted-foreground/80">com inteligencia artificial.</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-lg text-muted-foreground max-w-md leading-relaxed mb-8"
                >
                  De referências virais a copy pronto para publicar — tudo num pipeline automatizado com IA.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                  className="flex flex-col sm:flex-row items-start gap-3"
                >
                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-xl shadow-green-500/25 text-base px-8 h-12">
                    <Link href="/">
                      Comece agora
                      <ArrowRight size={16} />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="rounded-xl text-base h-12 border-white/[0.08] hover:border-white/[0.15] bg-transparent">
                    <a href="#pipeline">
                      <Play size={14} className="text-primary" />
                      Ver demo
                    </a>
                  </Button>
                </motion.div>

                {/* Social proof mini */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-center gap-3 mt-10"
                >
                  <div className="flex -space-x-2">
                    {["from-green-400 to-green-600", "from-violet-400 to-violet-600", "from-emerald-400 to-teal-500", "from-amber-400 to-orange-500"].map((grad, i) => (
                      <div key={i} className={`w-7 h-7 rounded-full bg-gradient-to-br ${grad} border-2 border-background`} />
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={10} className="fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">Usado por agencias em todo Brasil</span>
                  </div>
                </motion.div>
              </div>

              {/* Right — Pipeline Demo */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <PipelineDemo />
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* ─── Logo Marquee ─── */}
        <section className="border-y border-white/[0.04]">
          <div className="max-w-6xl mx-auto">
            <LogoMarquee />
          </div>
        </section>

        {/* ─── Stats ─── */}
        <section className="px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.04] mb-3">
                    <stat.icon size={18} className="text-primary" />
                  </div>
                  <div className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1.5 tracking-wide">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Features Bento Grid ─── */}
        <section id="features" className="px-6 py-20">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <Badge variant="outline" className="mb-4 px-3 py-1 text-xs rounded-full border-white/[0.08] bg-white/[0.02] text-muted-foreground">
                Features
              </Badge>
              <h2 className="text-heading text-foreground mb-4">
                Tudo que sua agencia precisa.{" "}
                <span className="gradient-text">Num lugar so.</span>
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                7 modulos integrados que cobrem todo o fluxo de producao de conteudo.
              </p>
            </motion.div>

            {/* Bento grid */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              {FEATURES.map((f, i) => {
                const accent = ACCENT_MAP[f.accent] || ACCENT_MAP.green;
                const colSpan = f.size === "large" ? "md:col-span-6" : f.size === "medium" ? "md:col-span-3" : "md:col-span-2";

                return (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className={cn(
                      "group card hover-lift p-6 flex gap-4 relative overflow-hidden",
                      colSpan,
                      f.size === "large" ? "flex-row items-center" : "flex-col"
                    )}
                  >
                    {/* Gradient orb on hover */}
                    <div className={cn(
                      "absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-3xl bg-gradient-to-br",
                      accent.split(" ")[0],
                      accent.split(" ")[1]
                    )} />

                    <div className={cn(
                      "w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0 relative z-10",
                      accent
                    )}>
                      <f.icon size={20} />
                    </div>
                    <div className="relative z-10">
                      <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── Pipeline Section ─── */}
        <section id="pipeline" className="px-6 py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/[0.02] to-transparent pointer-events-none" />
          <div className="max-w-5xl mx-auto relative">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <Badge variant="outline" className="mb-4 px-3 py-1 text-xs rounded-full border-white/[0.08] bg-white/[0.02] text-muted-foreground">
                Pipeline
              </Badge>
              <h2 className="text-heading text-foreground mb-4">
                De referencia a copy.{" "}
                <span className="gradient-text">4 passos.</span>
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Um fluxo inteligente que conecta busca, analise, ideacao e producao.
              </p>
            </motion.div>

            {/* Pipeline steps — horizontal */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {PIPELINE_STEPS.map((step, i) => (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  className="card p-5 relative group"
                >
                  {/* Step number */}
                  <div className="absolute top-3 right-3 text-[10px] font-mono text-muted-foreground/30 font-bold">
                    0{i + 1}
                  </div>

                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", step.bg)}>
                    <step.icon size={18} className={step.color} />
                  </div>

                  <h3 className="font-semibold text-foreground mb-1">{step.label}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>

                  {/* Connector arrow (not on last) */}
                  {i < 3 && (
                    <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                      <ChevronRight size={16} className="text-white/[0.1]" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Testimonials ─── */}
        <section id="depoimentos" className="px-6 py-20">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <Badge variant="outline" className="mb-4 px-3 py-1 text-xs rounded-full border-white/[0.08] bg-white/[0.02] text-muted-foreground">
                Depoimentos
              </Badge>
              <h2 className="text-heading text-foreground mb-4">
                Quem usa, <span className="gradient-text">recomenda.</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {TESTIMONIALS.map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="card p-6 hover-lift"
                >
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={12} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                    &ldquo;{t.text}&rdquo;
                  </p>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {t.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role} @ {t.company}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Final CTA ─── */}
        <section className="px-6 py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/[0.03] to-transparent pointer-events-none" />
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-green-500/[0.04] blur-[150px]" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center relative z-10"
          >
            <h2 className="text-display text-foreground mb-6">
              Pronto para criar conteudo{" "}
              <span className="gradient-text">que viraliza?</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-md mx-auto">
              Entre no workspace e comece a produzir com inteligencia artificial agora.
            </p>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-2xl shadow-green-500/30 text-base px-10 h-13">
              <Link href="/">
                Entrar no Workspace
                <ArrowRight size={16} />
              </Link>
            </Button>
          </motion.div>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t border-white/[0.04] relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <MusaLogo size={24} />
              <span className="font-extrabold text-foreground text-base tracking-tight">MUSA</span>
            </div>

            <div className="flex items-center gap-6 text-xs text-muted-foreground/50">
              <span>Feito para o desafio Human Academy</span>
              <span className="hidden md:inline">|</span>
              <span className="flex items-center gap-1.5">
                Powered by <span className="text-muted-foreground">Claude AI</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] rounded-full border-white/[0.06] text-muted-foreground/40 px-2 py-0.5">
                Next.js
              </Badge>
              <Badge variant="outline" className="text-[10px] rounded-full border-white/[0.06] text-muted-foreground/40 px-2 py-0.5">
                Claude API
              </Badge>
              <Badge variant="outline" className="text-[10px] rounded-full border-white/[0.06] text-muted-foreground/40 px-2 py-0.5">
                Supabase
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
