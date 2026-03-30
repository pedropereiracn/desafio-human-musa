"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  PenTool,
  FileText,
  Users,
  BarChart3,
  CalendarDays,
  Layers,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const TOOLS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Inicio", desc: "Visao geral do workspace", color: "text-white", bg: "bg-white/[0.06]", border: "hover:border-white/[0.10]" },
  { href: "/musa", icon: Sparkles, label: "Musa Pipeline", desc: "Busque referencias e gere copy", color: "text-green-400", bg: "bg-green-500/10", border: "hover:border-green-500/20" },
  { href: "/copy-lab", icon: PenTool, label: "Copy Lab", desc: "Copy standalone para qualquer formato", color: "text-violet-400", bg: "bg-violet-500/10", border: "hover:border-violet-500/20" },
  { href: "/briefs", icon: FileText, label: "Briefs", desc: "Decodifique briefings de clientes", color: "text-amber-400", bg: "bg-amber-500/10", border: "hover:border-amber-500/20" },
  { href: "/clients", icon: Users, label: "Clientes", desc: "Gerencie perfis e brand voice", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "hover:border-emerald-500/20" },
  { href: "/carousel", icon: Layers, label: "Carrossel", desc: "Crie carrosseis visuais", color: "text-blue-400", bg: "bg-blue-500/10", border: "hover:border-blue-500/20" },
  { href: "/reports", icon: BarChart3, label: "Relatorios", desc: "Metricas e relatorios com IA", color: "text-rose-400", bg: "bg-rose-500/10", border: "hover:border-rose-500/20", badge: "Beta" },
  { href: "/calendar", icon: CalendarDays, label: "Calendario", desc: "Pipeline de conteudo visual", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "hover:border-cyan-500/20", badge: "Beta" },
  { href: "/brand", icon: BookOpen, label: "Brand Book", desc: "Identidade visual e guidelines", color: "text-purple-400", bg: "bg-purple-500/10", border: "hover:border-purple-500/20", badge: "Interno" },
];

/* Inline Musa logo — speech bubble + spark */
function MusaIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sb-g1" x1="10%" y1="90%" x2="90%" y2="10%">
          <stop offset="0%" stopColor="#16A34A" />
          <stop offset="50%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#4ADE80" />
        </linearGradient>
        <linearGradient id="sb-g2" x1="50%" y1="100%" x2="50%" y2="0%">
          <stop offset="0%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#86EFAC" />
        </linearGradient>
      </defs>
      <path d="M12 28C12 18.06 20.06 10 30 10H34C43.94 10 52 18.06 52 28V30C52 39.94 43.94 48 34 48H28L18 54V46.5C14.4 43.3 12 38.9 12 34V28Z" fill="url(#sb-g1)" />
      <path d="M16 27C16 20.37 21.37 15 28 15H36C42.63 15 48 20.37 48 27V30C48 36.63 42.63 42 36 42H28C21.37 42 16 36.63 16 30V27Z" fill="white" opacity="0.06" />
      <path d="M46 12L48.5 7L51 12L56 14.5L51 17L48.5 22L46 17L41 14.5Z" fill="url(#sb-g2)" />
      <path d="M38 6L39.2 3.5L40.4 6L43 7.2L40.4 8.4L39.2 11L38 8.4L35.5 7.2Z" fill="#4ADE80" opacity="0.7" />
      <circle cx="55" cy="9" r="1.5" fill="#86EFAC" opacity="0.5" />
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

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 z-50 w-[272px] bg-[#09090b]/40 backdrop-blur-2xl border-r border-white/[0.07]">
        {/* Logo */}
        <div className="h-14 flex items-center px-5 border-b border-white/[0.04] gap-2.5">
          <MusaIcon size={32} />
          <span className="font-extrabold text-lg text-foreground tracking-tight">
            MUSA
          </span>
        </div>

        {/* Tools Nav */}
        <nav className="flex-1 py-3 px-3 space-y-1 overflow-y-auto">
          <h2 className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest px-1 mb-2">
            Ferramentas
          </h2>
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-xl border border-transparent transition-all",
                isActive(tool.href)
                  ? "bg-white/[0.04] border-white/[0.08]"
                  : "hover:bg-white/[0.02]",
                tool.border
              )}
            >
              <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", tool.bg)}>
                <tool.icon size={16} className={tool.color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground group-hover:text-white transition-colors truncate">
                    {tool.label}
                  </span>
                  {tool.badge && (
                    <Badge variant="outline" className={cn(
                      "text-[8px] px-1.5 py-0 h-3.5 rounded-full border-0 font-semibold uppercase tracking-wider",
                      tool.badge === "Interno"
                        ? "bg-violet-500/10 text-violet-400"
                        : "bg-green-500/10 text-green-400"
                    )}>
                      {tool.badge}
                    </Badge>
                  )}
                </div>
                <span className="text-[11px] text-muted-foreground/60 truncate block">{tool.desc}</span>
              </div>
              <ArrowRight size={12} className="text-muted-foreground/0 group-hover:text-muted-foreground/40 transition-all shrink-0" />
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#09090b]/40 backdrop-blur-2xl border-t border-white/[0.07]">
        <div className="flex items-center justify-around py-2 px-1">
          {[TOOLS[0], TOOLS[1], TOOLS[2], TOOLS[3], TOOLS[5]].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-xs transition-colors",
                isActive(item.href) ? "text-foreground" : "text-muted-foreground"
              )}
            >
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", isActive(item.href) ? item.bg : "")}>
                <item.icon size={18} className={isActive(item.href) ? item.color : ""} />
              </div>
              <span className="text-[10px]">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
