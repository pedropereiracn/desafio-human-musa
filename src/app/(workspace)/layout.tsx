"use client";

import { useState, useCallback } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import { useClients } from "@/hooks/useClients";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>();
  const { clients } = useClients();

  const toggleSidebar = useCallback(() => {
    setCollapsed((c) => !c);
  }, []);

  return (
    <div className="min-h-screen flex">
      <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />

      <div
        className="flex-1 flex flex-col transition-all duration-200 workspace-content"
        style={{ marginLeft: collapsed ? 64 : 240 }}
      >
        <TopBar
          clients={clients}
          selectedClientId={selectedClientId}
          onSelectClient={setSelectedClientId}
        />

        <main className="flex-1 px-6 py-4 pb-20 md:pb-4 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
