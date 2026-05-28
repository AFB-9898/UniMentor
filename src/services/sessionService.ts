import type { Session, SessionStatus } from "../types";

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

let nextId = 4;
const sessions: Session[] = [
  {
    id: "1",
    mentorId: "1",
    studentId: "student-1",
    status: "completed",
    date: "2026-05-20",
    topic: "Introducción a React con TypeScript",
    notes: "El mentor me explicó los fundamentos.",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    mentorId: "2",
    studentId: "student-1",
    status: "confirmed",
    date: "2026-06-01",
    topic: "Principios de UX Design",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    mentorId: "3",
    studentId: "student-1",
    status: "pending",
    date: "2026-06-10",
    topic: "Modelado de bases de datos relacionales",
    createdAt: new Date().toISOString(),
  },
];

export const mockSessionService: SessionService = {
  async listByUser(userId) {
    return sessions
      .filter((s) => s.studentId === userId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  },

  async getById(id) {
    return sessions.find((s) => s.id === id) ?? null;
  },

  async create(data) {
    const newSession: Session = {
      id: String(nextId++),
      mentorId: data.mentorId,
      studentId: data.studentId,
      status: "pending",
      date: data.date,
      topic: data.topic,
      notes: data.notes,
      createdAt: new Date().toISOString(),
    };
    sessions.push(newSession);
    return newSession;
  },

  async updateStatus(id, status) {
    const index = sessions.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error(`Session ${id} not found`);
    }
    sessions[index] = { ...sessions[index], status };
    return sessions[index];
  },
};
