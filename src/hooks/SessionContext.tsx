import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Session, SessionStatus } from "../types";

type SessionContextType = {
  sessions: Session[];
  addSession: (session: Omit<Session, "id" | "createdAt">) => void;
  updateSessionStatus: (id: string, status: SessionStatus) => void;
};

const SessionContext = createContext<SessionContextType | null>(null);

let nextId = 1;

export function SessionProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>([]);

  const addSession = useCallback(
    (data: Omit<Session, "id" | "createdAt">) => {
      const newSession: Session = {
        ...data,
        id: String(nextId++),
        createdAt: new Date().toISOString(),
      };
      setSessions((prev) => [...prev, newSession]);
    },
    [],
  );

  const updateSessionStatus = useCallback((id: string, status: SessionStatus) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s)),
    );
  }, []);

  return (
    <SessionContext.Provider value={{ sessions, addSession, updateSessionStatus }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSessions() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSessions must be used within a SessionProvider");
  return ctx;
}
