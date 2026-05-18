// UniMentor — Global TypeScript Interfaces

export type UserRole = "student" | "mentor";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  createdAt: string;
}

export interface Mentor extends User {
  role: "mentor";
  specialty: string[];
  rating: number;
  sessionCount: number;
}

export interface Student extends User {
  role: "student";
  university: string;
  career: string;
}

export type SessionStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface Session {
  id: string;
  mentorId: string;
  studentId: string;
  status: SessionStatus;
  date: string;
  topic: string;
  notes?: string;
  rating?: number;
  createdAt: string;
}
