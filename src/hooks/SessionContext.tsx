import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { Session, SessionStatus } from "../types";
import { mockSessionService } from "../services/sessionService";
import { mockRatingService } from "../services/ratingService";
import { useAuth } from "./AuthContext";

type SessionContextType = {
  sessions: Session[];
  sessionsLoading: boolean;
  addSession: (data: Omit<Session, "id" | "createdAt">) => Promise<void>;
  updateSessionStatus: (id: string, status: SessionStatus) => Promise<void>;
  rateSession: (id: string, rating: number) => Promise<void>;
};

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const { user, isLoading } = useAuth();

  // Load sessions for the authenticated user
  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      setSessions([]);
      setSessionsLoading(false);
      return;
    }
    setSessionsLoading(true);
    mockSessionService.listByUser(user.id).then((result) => {
      setSessions(result);
      setSessionsLoading(false);
    });
  }, [user, isLoading]);

  const addSession = useCallback(
    async (data: Omit<Session, "id" | "createdAt">) => {
      const newSession = await mockSessionService.create(data);
      setSessions((prev) => [...prev, newSession]);
    },
    [],
  );

  const updateSessionStatus = useCallback(
    async (id: string, status: SessionStatus) => {
      await mockSessionService.updateStatus(id, status);
      setSessions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status } : s)),
      );
    },
    [],
  );

  const rateSession = useCallback(async (sessionId: string, rating: number) => {
    await mockRatingService.submitRating(sessionId, rating);
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, rating } : s)),
    );
  }, []);

  return (
    <SessionContext.Provider
      value={{ sessions, sessionsLoading, addSession, updateSessionStatus, rateSession }}
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
