"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, User } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ClientProfile } from "@/lib/types";

interface TopBarProps {
  clients: ClientProfile[];
  selectedClientId?: string;
  onSelectClient: (id: string | undefined) => void;
}

const MODULE_NAMES: Record<string, string> = {
  "/": "Dashboard",
  "/musa": "Musa Pipeline",
  "/copy-lab": "Copy Lab",
  "/briefs": "Central de Briefs",
  "/clients": "Hub de Clientes",
  "/reports": "Relatorios",
  "/calendar": "Calendario",
  "/carousel": "Carrossel",
  "/brand": "Brand Book",
};

export default function TopBar({ clients, selectedClientId, onSelectClient }: TopBarProps) {
  const pathname = usePathname();
  const moduleName = MODULE_NAMES[pathname] || "Musa";
  const isHome = pathname === "/";

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-white/[0.04] bg-[#050507]/80 backdrop-blur-xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        {isHome ? (
          <span className="text-foreground font-medium">Dashboard</span>
        ) : (
          <>
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Workspace
            </Link>
            <ChevronRight size={14} className="text-muted-foreground/50" />
            <span className="text-foreground font-medium">{moduleName}</span>
          </>
        )}
      </div>

      {/* Client Selector */}
      <div className="flex items-center gap-3">
        <Select
          value={selectedClientId || "all"}
          onValueChange={(value) => onSelectClient(value === "all" ? undefined : value)}
        >
          <SelectTrigger className="w-[180px] h-9 rounded-xl bg-surface-2 border-white/[0.06] text-sm hover:border-primary/30 transition-colors focus:ring-primary/20">
            <div className="flex items-center gap-2">
              <User size={14} className="text-muted-foreground" />
              <SelectValue placeholder="Todos os clientes" />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-surface-1 border-white/[0.06] rounded-xl">
            <SelectItem value="all" className="rounded-lg text-sm">Todos os clientes</SelectItem>
            {clients.map((c) => (
              <SelectItem key={c.id} value={c.id} className="rounded-lg text-sm">
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </header>
  );
}
