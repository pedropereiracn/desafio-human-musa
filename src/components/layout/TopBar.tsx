"use client";

import { usePathname } from "next/navigation";
import { ChevronRight, User } from "lucide-react";
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
  "/reports": "Relatórios",
  "/calendar": "Calendário",
};

export default function TopBar({ clients, selectedClientId, onSelectClient }: TopBarProps) {
  const pathname = usePathname();
  const moduleName = MODULE_NAMES[pathname] || "Musa";

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-white/[0.04] bg-[#050507]/80 backdrop-blur-xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Workspace</span>
        <ChevronRight size={14} className="text-muted-foreground/50" />
        <span className="text-foreground font-medium">{moduleName}</span>
      </div>

      {/* Client Selector */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <select
            value={selectedClientId || ""}
            onChange={(e) => onSelectClient(e.target.value || undefined)}
            className="appearance-none bg-surface-2 border border-border rounded-lg pl-8 pr-8 py-1.5 text-sm text-foreground cursor-pointer hover:border-primary/30 transition-colors focus:outline-none focus:border-primary/50"
          >
            <option value="">Todos os clientes</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <User size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <ChevronRight size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none rotate-90" />
        </div>
      </div>
    </header>
  );
}
