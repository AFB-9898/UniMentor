import type { Mentor } from "../types";

export interface MentorFilters {
  search?: string;
  specialty?: string;
  minRating?: number;
}

export interface MentorService {
  list(filters?: MentorFilters): Promise<Mentor[]>;
  getById(id: string): Promise<Mentor | null>;
  updateProfile(id: string, data: { bio?: string; specialty?: string[] }): Promise<Mentor>;
}

const mockMentors: Mentor[] = [
  {
    id: "1",
    name: "Carlos Mendoza",
    email: "carlos@ejemplo.com",
    role: "mentor",
    bio: "Ingeniero de software con 8+ años de experiencia en desarrollo web. Especialista en React y TypeScript. Mentor apasionado por ayudar a estudiantes a dar sus primeros pasos en la industria tech.",
    specialty: ["React", "TypeScript"],
    rating: 4,
    sessionCount: 23,
    createdAt: "2026-01-15",
  },
  {
    id: "2",
    name: "María García",
    email: "maria@ejemplo.com",
    role: "mentor",
    bio: "Diseñadora UX/UI con enfoque en productos digitales. Trabajó con startups y empresas globales. Cree firmemente que el buen diseño empieza por entender al usuario.",
    specialty: ["UX Design", "Figma"],
    rating: 5,
    sessionCount: 45,
    createdAt: "2025-11-20",
  },
  {
    id: "3",
    name: "Luis Torres",
    email: "luis@ejemplo.com",
    role: "mentor",
    bio: "Backend developer especializado en Node.js y bases de datos. Contribuidor de proyectos open source. Me encanta enseñar las bases sólidas que todo dev debería tener.",
    specialty: ["Node.js", "PostgreSQL"],
    rating: 3,
    sessionCount: 12,
    createdAt: "2026-03-08",
  },
];

function applyFilters(mentors: Mentor[], filters?: MentorFilters): Mentor[] {
  if (!filters) return mentors;

  return mentors.filter((m) => {
    if (filters.search && !m.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.specialty && !m.specialty.includes(filters.specialty)) {
      return false;
    }
    if (filters.minRating !== undefined && m.rating < filters.minRating) {
      return false;
    }
    return true;
  });
}

export const mockMentorService: MentorService = {
  async list(filters) {
    return applyFilters(mockMentors, filters);
  },

  async getById(id) {
    return mockMentors.find((m) => m.id === id) ?? null;
  },

  async updateProfile(id, data) {
    const index = mockMentors.findIndex((m) => m.id === id);
    if (index === -1) {
      throw new Error("Mentor not found");
    }

    const updated: Mentor = {
      ...mockMentors[index],
      ...(data.bio !== undefined && { bio: data.bio }),
      ...(data.specialty !== undefined && { specialty: data.specialty }),
    };

    mockMentors[index] = updated;
    return updated;
  },
};
