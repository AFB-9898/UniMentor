import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { Session, SessionStatus } from "../types";
import { mockSessionService } from "../services/sessionService";
import { mockRatingService } from "../services/ratingService";

type SessionContextType = {
  sessions: Session[];
  addSession: (data: Omit<Session, "id" | "createdAt">) => void;
  updateSessionStatus: (id: string, status: SessionStatus) => void;
  rateSession: (id: string, rating: number) => Promise<void>;
};

const SessionContext = createContext<SessionContextType | null>(null);

let nextId = 4; // seed sessions usan ids 1-3

export function SessionProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>([]);

  // Cargar sesiones semilla al montar
  useEffect(() => {
    mockSessionService.listByUser("student-1").then((seedSessions) => {
      setSessions(seedSessions);
    });
  }, []);

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

  const rateSession = useCallback(async (sessionId: string, rating: number) => {
    await mockRatingService.submitRating(sessionId, rating);
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, rating } : s)),
    );
  }, []);

  return (
    <SessionContext.Provider
      value={{ sessions, addSession, updateSessionStatus, rateSession }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSessions() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSessions must be used within a SessionProvider");
  return ctx;
}
