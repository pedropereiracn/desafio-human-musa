"use client";

import { useCallback } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useClients } from "@/hooks/useClients";
import { storage } from "@/lib/storage";
import type { UserPreferences } from "@/lib/types";

const DEFAULT_PREFS: UserPreferences = {
  sidebarCollapsed: false,
  selectedClientId: undefined,
};

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [prefs, setPrefs] = useLocalStorage<UserPreferences>(
    storage.keys.preferences,
    DEFAULT_PREFS
  );
  const { clients } = useClients();

  const toggleSidebar = useCallback(() => {
    setPrefs((p) => ({ ...p, sidebarCollapsed: !p.sidebarCollapsed }));
  }, [setPrefs]);

  const selectClient = useCallback(
    (id: string | undefined) => {
      setPrefs((p) => ({ ...p, selectedClientId: id }));
    },
    [setPrefs]
  );

  return (
    <div className="min-h-screen flex">
      <Sidebar collapsed={prefs.sidebarCollapsed} onToggle={toggleSidebar} />

      <div
        className="flex-1 flex flex-col transition-all duration-200 workspace-content"
        style={{ marginLeft: prefs.sidebarCollapsed ? 64 : 240 }}
      >
        <TopBar
          clients={clients}
          selectedClientId={prefs.selectedClientId}
          onSelectClient={selectClient}
        />

        <main className="flex-1 p-6 pb-20 md:pb-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
