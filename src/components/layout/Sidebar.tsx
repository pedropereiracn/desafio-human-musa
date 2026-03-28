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
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/musa", icon: Sparkles, label: "Musa" },
  { href: "/copy-lab", icon: PenTool, label: "Copy Lab" },
  { href: "/briefs", icon: FileText, label: "Briefs" },
  { href: "/clients", icon: Users, label: "Clientes" },
];

const BETA_ITEMS = [
  { href: "/reports", icon: BarChart3, label: "Relatórios" },
  { href: "/calendar", icon: CalendarDays, label: "Calendário" },
];

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
        className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 z-50 bg-surface-1 border-r border-border"
      >
        {/* Logo */}
        <div className="h-14 flex items-center px-4 border-b border-border gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="font-bold text-foreground tracking-tight overflow-hidden whitespace-nowrap"
              >
                Musa
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                isActive(item.href)
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-2"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={18} className="shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          ))}

          {/* Separator */}
          <div className="my-3 border-t border-border" />

          {BETA_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors relative",
                isActive(item.href)
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-2"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={18} className="shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="overflow-hidden whitespace-nowrap flex items-center gap-2"
                  >
                    {item.label}
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent/20 text-accent font-medium">
                      Beta
                    </span>
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          ))}
        </nav>

        {/* Toggle */}
        <div className="p-2 border-t border-border">
          <button
            onClick={onToggle}
            className="w-full flex items-center justify-center py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </motion.aside>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-1/95 backdrop-blur-md border-t border-border">
        <div className="flex items-center justify-around py-2 px-1">
          {[...NAV_ITEMS.slice(0, 4), NAV_ITEMS[4]].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-xs transition-colors",
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
