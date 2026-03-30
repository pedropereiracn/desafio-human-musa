"use client";

import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import { WorkspaceProvider, useWorkspace } from "@/contexts/WorkspaceContext";

function WorkspaceInner({ children }: { children: React.ReactNode }) {
  const { clients, selectedClientId, selectedClient, setSelectedClientId } = useWorkspace();

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Sidebar />

      <div className="flex flex-col min-h-screen md:ml-[272px]">
        <TopBar
          clients={clients}
          selectedClientId={selectedClientId}
          selectedClient={selectedClient}
          onSelectClient={setSelectedClientId}
        />

        <main className="flex-1 px-4 sm:px-6 py-4 pb-20 md:pb-4 overflow-y-auto">
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
