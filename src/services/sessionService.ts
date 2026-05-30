import type { Session, SessionStatus } from "../types";
import { insforge } from "../backend/client";

export interface CreateSessionData {
  mentorId: string;
  studentId: string;
  topic: string;
  date: string;
  notes?: string;
}

export interface SessionService {
  listByUser(userId: string): Promise<Session[]>;
  getById(id: string): Promise<Session | null>;
  create(data: CreateSessionData): Promise<Session>;
  updateStatus(id: string, status: SessionStatus): Promise<Session>;
}

/** Map a DB row (snake_case) to our Session type */
function mapSession(row: Record<string, unknown>): Session {
  return {
    id: row.id as string,
    mentorId: row.mentor_id as string,
    studentId: row.student_id as string,
    status: row.status as SessionStatus,
    date: (row.date as string).split("T")[0], // "2026-05-20T00:00:00.000Z" → "2026-05-20"
    topic: row.topic as string,
    notes: (row.notes as string) ?? undefined,
    rating: row.rating != null ? Number(row.rating) : undefined,
    createdAt: (row.created_at as string) ?? new Date().toISOString(),
  };
}

export const sessionService: SessionService = {
  async listByUser(userId) {
    const { data, error } = await insforge.database
      .from("sessions")
      .select("*")
      .or(`mentor_id.eq.${userId},student_id.eq.${userId}`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error listing sessions:", error);
      return [];
    }

    return (data ?? []).map(mapSession);
  },

  async getById(id) {
    const { data, error } = await insforge.database
      .from("sessions")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) return null;
    return mapSession(data);
  },

  async create(data) {
    const { data: inserted, error } = await insforge.database
      .from("sessions")
      .insert({
        mentor_id: data.mentorId,
        student_id: data.studentId,
        status: "pending",
        date: data.date,
        topic: data.topic,
        notes: data.notes ?? null,
      })
      .select("*")
      .single();

    if (error) {
      console.error("Error creating session:", error);
      throw new Error("Error al crear la sesión");
    }

    return mapSession(inserted);
  },

  async updateStatus(id, status) {
    const { data, error } = await insforge.database
      .from("sessions")
      .update({ status })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error("Error updating session:", error);
      throw new Error("Error al actualizar la sesión");
    }

    // When a session is completed, update the mentor's session count
    if (status === "completed") {
      try {
        const mentorId = data.mentor_id as string;
        const { count, error: countError } = await insforge.database
          .from("sessions")
          .select("*", { count: "exact", head: true })
          .eq("mentor_id", mentorId)
          .eq("status", "completed");

        if (!countError && count !== null) {
          await insforge.database
            .from("mentors")
            .update({ session_count: count })
            .eq("id", mentorId);
        }
      } catch {
        console.warn("Could not update mentor session_count");
      }
    }

    return mapSession(data);
  },
};

// Backward-compatible alias for existing imports
export const mockSessionService = sessionService;
