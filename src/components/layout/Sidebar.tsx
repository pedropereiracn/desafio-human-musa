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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const NAV_ITEMS = [
  { href: "/", icon: LayoutDashboard, label: "Inicio" },
  { href: "/musa", icon: Sparkles, label: "Musa" },
  { href: "/copy-lab", icon: PenTool, label: "Copy Lab" },
  { href: "/briefs", icon: FileText, label: "Briefs" },
  { href: "/clients", icon: Users, label: "Clientes" },
  { href: "/carousel", icon: Layers, label: "Carrossel" },
];

const BETA_ITEMS = [
  { href: "/reports", icon: BarChart3, label: "Relatorios" },
  { href: "/calendar", icon: CalendarDays, label: "Calendario" },
];

const INTERNAL_ITEMS = [
  { href: "/brand", icon: BookOpen, label: "Brand Book" },
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

function NavItem({
  item,
  isActive,
  collapsed,
  badge,
}: {
  item: { href: string; icon: React.ComponentType<{ size?: number; className?: string }>; label: string };
  isActive: boolean;
  collapsed: boolean;
  badge?: { text: string; variant: "green" | "violet" };
}) {
  const content = (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all relative group",
        isActive
          ? "text-foreground font-medium"
          : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03]"
      )}
    >
      {isActive && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute inset-0 rounded-xl bg-white/[0.06]"
          transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
        />
      )}
      <item.icon
        size={18}
        className={cn("shrink-0 relative z-10 transition-colors", isActive && "text-primary")}
      />
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="overflow-hidden whitespace-nowrap flex items-center gap-2 relative z-10"
          >
            {item.label}
            {badge && (
              <Badge
                variant="outline"
                className={cn(
                  "text-[9px] px-1.5 py-0 h-4 rounded-full font-semibold uppercase tracking-wider border-0",
                  badge.variant === "green"
                    ? "bg-green-500/15 text-green-400"
                    : "bg-violet-500/15 text-violet-400"
                )}
              >
                {badge.text}
              </Badge>
            )}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" className="bg-surface-1 border-white/[0.06] text-foreground">
          <div className="flex items-center gap-2">
            {item.label}
            {badge && (
              <span className={cn(
                "text-[9px] px-1 py-0.5 rounded-full font-semibold uppercase",
                badge.variant === "green" ? "bg-green-500/15 text-green-400" : "bg-violet-500/15 text-violet-400"
              )}>
                {badge.text}
              </span>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
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
        className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 z-50 bg-[#09090b]/40 backdrop-blur-2xl border-r border-white/[0.07]"
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
                className="font-extrabold text-lg text-foreground tracking-tight overflow-hidden whitespace-nowrap"
              >
                MUSA
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              isActive={isActive(item.href)}
              collapsed={collapsed}
            />
          ))}

          <div className="py-2 px-1">
            <Separator className="bg-white/[0.04]" />
          </div>

          {BETA_ITEMS.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              isActive={isActive(item.href)}
              collapsed={collapsed}
              badge={{ text: "Beta", variant: "green" }}
            />
          ))}

          <div className="py-2 px-1">
            <Separator className="bg-white/[0.04]" />
          </div>

          {INTERNAL_ITEMS.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              isActive={isActive(item.href)}
              collapsed={collapsed}
              badge={{ text: "Interno", variant: "violet" }}
            />
          ))}
        </nav>

        {/* Toggle */}
        <div className="p-2 border-t border-white/[0.04]">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="w-full justify-center text-muted-foreground hover:text-foreground rounded-xl"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </Button>
        </div>
      </motion.aside>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#09090b]/40 backdrop-blur-2xl border-t border-white/[0.07]">
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
