"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, User, MessageSquare } from "lucide-react";
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
  selectedClient?: ClientProfile;
  onSelectClient: (id: string | undefined) => void;
}

const MODULE_NAMES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/musa": "Musa Pipeline",
  "/copy-lab": "Copy Lab",
  "/briefs": "Central de Briefs",
  "/clients": "Hub de Clientes",
  "/reports": "Relatorios",
  "/calendar": "Calendario",
  "/carousel": "Carrossel",
  "/brand": "Brand Book",
};

export default function TopBar({ clients, selectedClientId, selectedClient, onSelectClient }: TopBarProps) {
  const pathname = usePathname();
  const moduleName = MODULE_NAMES[pathname] || "Musa";
  const isHome = pathname === "/dashboard";
  const isClientDetail = pathname.startsWith("/clients/") && pathname !== "/clients";

  return (
    <header className="h-14 flex items-center justify-between px-3 md:px-6 bg-[#09090b]/35 backdrop-blur-2xl border-b border-white/[0.07]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm min-w-0">
        {isHome ? (
          <span className="text-foreground font-medium">Dashboard</span>
        ) : isClientDetail ? (
          <>
            <Link
              href="/dashboard"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Workspace
            </Link>
            <ChevronRight size={14} className="text-muted-foreground/50" />
            <Link
              href="/clients"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Clientes
            </Link>
            <ChevronRight size={14} className="text-muted-foreground/50" />
            <span className="text-foreground font-medium">Perfil</span>
          </>
        ) : (
          <>
            <Link
              href="/dashboard"
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
        {selectedClient && selectedClient.brandVoice && (
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/5 border border-primary/15 max-w-[200px]">
            <MessageSquare size={10} className="text-primary shrink-0" />
            <span className="text-[11px] text-primary/80 truncate">{selectedClient.brandVoice}</span>
          </div>
        )}
        <Select
          value={selectedClientId || "all"}
          onValueChange={(value) => onSelectClient(value === "all" ? undefined : value)}
        >
          <SelectTrigger className="w-[140px] md:w-[200px] h-9 rounded-xl bg-surface-2 border-white/[0.06] text-sm hover:border-primary/30 transition-colors focus:ring-primary/20">
            <div className="flex items-center gap-2">
              {selectedClient ? (
                <div
                  className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[9px] font-bold shrink-0"
                  style={{ backgroundColor: selectedClient.color }}
                >
                  {selectedClient.name.charAt(0).toUpperCase()}
                </div>
              ) : (
                <User size={14} className="text-muted-foreground" />
              )}
              <SelectValue placeholder="Todos os clientes" />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-surface-1 border-white/[0.06] rounded-xl">
            <SelectItem value="all" className="rounded-lg text-sm">Todos os clientes</SelectItem>
            {clients.map((c) => (
              <SelectItem key={c.id} value={c.id} className="rounded-lg text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded flex items-center justify-center text-white text-[8px] font-bold shrink-0"
                    style={{ backgroundColor: c.color }}
                  >
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  {c.name}
                  {c.brandVoice && (
                    <MessageSquare size={10} className="text-primary/50 ml-auto" />
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </header>
  );
}
