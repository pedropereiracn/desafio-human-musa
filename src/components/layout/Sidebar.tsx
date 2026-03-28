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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const NAV_ITEMS = [
  { href: "/", icon: LayoutDashboard, label: "Início" },
  { href: "/musa", icon: Sparkles, label: "Musa" },
  { href: "/copy-lab", icon: PenTool, label: "Copy Lab" },
  { href: "/briefs", icon: FileText, label: "Briefs" },
  { href: "/clients", icon: Users, label: "Clientes" },
  { href: "/carousel", icon: Layers, label: "Carrossel" },
];

const BETA_ITEMS = [
  { href: "/reports", icon: BarChart3, label: "Relatórios" },
  { href: "/calendar", icon: CalendarDays, label: "Calendário" },
];

/* Inline Musa lyre icon for sidebar */
function MusaIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sb-lg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4ADE80"/>
          <stop offset="100%" stopColor="#22C55E"/>
        </linearGradient>
        <linearGradient id="sb-lg2" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#22C55E" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#4ADE80" stopOpacity="0.8"/>
        </linearGradient>
      </defs>
      <path d="M16 12C16 12 12 12 12 18V38C12 48 20 56 32 56C44 56 52 48 52 38V18C52 12 48 12 48 12" stroke="url(#sb-lg1)" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <line x1="16" y1="12" x2="48" y2="12" stroke="url(#sb-lg1)" strokeWidth="3.5" strokeLinecap="round"/>
      <line x1="24" y1="16" x2="24" y2="44" stroke="url(#sb-lg2)" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 4"/>
      <line x1="32" y1="14" x2="32" y2="48" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" opacity="0.9"/>
      <line x1="40" y1="16" x2="40" y2="44" stroke="url(#sb-lg2)" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 4"/>
      <circle cx="32" cy="30" r="4" fill="#22C55E" opacity="0.9"/>
      <circle cx="32" cy="30" r="7" fill="none" stroke="#4ADE80" strokeWidth="1" opacity="0.4"/>
    </svg>
  );
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 z-50 bg-[#09090b]/90 backdrop-blur-xl border-r border-white/[0.04]"
      >
        {/* Logo */}
        <div className="h-14 flex items-center px-4 border-b border-white/[0.04] gap-2">
          <div className="shrink-0">
            <MusaIcon size={collapsed ? 28 : 32} />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="font-bold text-foreground tracking-tight overflow-hidden whitespace-nowrap"
                style={{ fontFamily: "var(--font-display)" }}
              >
                musa
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all relative",
                isActive(item.href)
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03]"
              )}
              title={collapsed ? item.label : undefined}
            >
              {isActive(item.href) && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-white/[0.06]"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                />
              )}
              <item.icon size={18} className={cn("shrink-0 relative z-10", isActive(item.href) && "text-primary")} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="overflow-hidden whitespace-nowrap relative z-10"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          ))}

          {/* Separator */}
          <div className="my-3 border-t border-white/[0.04]" />

          {BETA_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all relative",
                isActive(item.href)
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03]"
              )}
              title={collapsed ? item.label : undefined}
            >
              {isActive(item.href) && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-white/[0.06]"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                />
              )}
              <item.icon size={18} className={cn("shrink-0 relative z-10", isActive(item.href) && "text-primary")} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="overflow-hidden whitespace-nowrap flex items-center gap-2 relative z-10"
                  >
                    {item.label}
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-green-500/15 text-green-400 font-semibold uppercase tracking-wider">
                      Beta
                    </span>
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          ))}
        </nav>

        {/* Toggle */}
        <div className="p-2 border-t border-white/[0.04]">
          <button
            onClick={onToggle}
            className="w-full flex items-center justify-center py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/[0.03] transition-colors"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </motion.aside>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#09090b]/90 backdrop-blur-xl border-t border-white/[0.04]">
        <div className="flex items-center justify-around py-2 px-1">
          {[...NAV_ITEMS.slice(0, 4), NAV_ITEMS[5]].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-xs transition-colors",
                isActive(item.href)
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <item.icon size={20} />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
