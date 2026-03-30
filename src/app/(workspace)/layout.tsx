"use client";

import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import { WorkspaceProvider, useWorkspace } from "@/contexts/WorkspaceContext";

function WorkspaceInner({ children }: { children: React.ReactNode }) {
  const { clients, selectedClientId, selectedClient, setSelectedClientId } = useWorkspace();

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
          selectedClient={selectedClient}
          onSelectClient={setSelectedClientId}
        />

        <main className="flex-1 px-6 py-4 pb-20 md:pb-4 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WorkspaceProvider>
      <WorkspaceInner>{children}</WorkspaceInner>
    </WorkspaceProvider>
  );
}
