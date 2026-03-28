"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import { useClients } from "@/hooks/useClients";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>();
  const { clients } = useClients();

  return (
    <div className="min-h-screen flex">
      <Sidebar />

      <div
        className="flex-1 flex flex-col workspace-content"
        style={{ marginLeft: 272 }}
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
