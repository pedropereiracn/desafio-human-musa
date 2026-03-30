"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useClients } from "@/hooks/useClients";
import type { ClientProfile } from "@/lib/types";

interface WorkspaceContextValue {
  clients: ClientProfile[];
  isLoaded: boolean;
  addClient: (data: Omit<ClientProfile, "id" | "createdAt" | "color">) => Promise<ClientProfile>;
  updateClient: (id: string, data: Partial<ClientProfile>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  getClient: (id: string) => ClientProfile | undefined;
  selectedClientId: string | undefined;
  setSelectedClientId: (id: string | undefined) => void;
  selectedClient: ClientProfile | undefined;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { clients, isLoaded, addClient, updateClient, deleteClient, getClient } = useClients();
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>();

  const selectedClient = selectedClientId ? clients.find((c) => c.id === selectedClientId) : undefined;

  return (
    <WorkspaceContext.Provider
      value={{
        clients,
        isLoaded,
        addClient,
        updateClient,
        deleteClient,
        getClient,
        selectedClientId,
        setSelectedClientId,
        selectedClient,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used within WorkspaceProvider");
  return ctx;
}
