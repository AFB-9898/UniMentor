import type { Mentor } from "../types";
import { insforge } from "../backend/client";

/**
 * Real UUIDs from the InsForge database seed.
 * Static mentors as fallback when DB is unreachable.
 */
const MENTORS: Mentor[] = [
  {
    id: "a0000000-0000-0000-0000-000000000001",
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
    id: "a0000000-0000-0000-0000-000000000002",
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
    id: "a0000000-0000-0000-0000-000000000003",
    name: "Luis Torres",
    email: "luis@ejemplo.com",
    role: "mentor",
    bio: "Backend developer especializado en Node.js y bases de datos. Contribuidor de proyectos open source. Me encanta enseñar las bases sólidas que todo dev debería tener.",
    specialty: ["Node.js", "PostgreSQL"],
    rating: 3,
    sessionCount: 12,
    createdAt: "2026-03-08",
  },
  {
    id: "a0000000-0000-0000-0000-000000000099",
    name: "Ana Martínez",
    email: "ana@ejemplo.com",
    role: "mentor",
    bio: "Data scientist con experiencia en machine learning y análisis de datos. PhD en Ciencias de la Computación. Disfruto hacer accesibles conceptos complejos.",
    specialty: ["Python", "Machine Learning"],
    rating: 5,
    sessionCount: 31,
    createdAt: "2026-02-10",
  },
  {
    id: "a0000000-0000-0000-0000-000000000098",
    name: "Roberto Sánchez",
    email: "roberto@ejemplo.com",
    role: "mentor",
    bio: "Desarrollador mobile con 6+ años en React Native y Flutter. He publicado apps con millones de descargas. Me apasiona mentorar a la próxima generación de devs mobile.",
    specialty: ["React Native", "Flutter"],
    rating: 4,
    sessionCount: 18,
    createdAt: "2026-04-01",
  },
  {
    id: "a0000000-0000-0000-0000-000000000097",
    name: "Laura Vega",
    email: "laura@ejemplo.com",
    role: "mentor",
    bio: "DevOps engineer especializada en infraestructura cloud y CI/CD. AWS Solutions Architect. Creo que la infraestructura debe ser simple, automatizada y bien documentada.",
    specialty: ["AWS", "DevOps"],
    rating: 4,
    sessionCount: 27,
    createdAt: "2026-01-22",
  },
];

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

/* ── Fallback sources (localStorage + static array) ── */

function loadRegisteredMentors(): Mentor[] {
  try {
    return JSON.parse(localStorage.getItem("unimentor_mentors") || "[]");
  } catch {
    return [];
  }
}

function allFallbackMentors(): Mentor[] {
  const registered = loadRegisteredMentors();
  const knownIds = new Set(MENTORS.map((m) => m.id));
  return [...MENTORS, ...registered.filter((m) => !knownIds.has(m.id))];
}

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

/* ── DB mapping ── */

interface MentorDbRow {
  id: string;
  specialty: string[];
  rating: number;
  session_count: number;
  users: {
    id: string;
    email: string;
    name: string;
    bio: string | null;
    created_at: string;
  } | null;
}

function mapMentor(row: MentorDbRow): Mentor {
  return {
    id: row.id,
    name: row.users?.name ?? "Unknown",
    email: row.users?.email ?? "",
    role: "mentor",
    bio: row.users?.bio ?? undefined,
    specialty: row.specialty ?? [],
    rating: row.rating ?? 0,
    sessionCount: row.session_count ?? 0,
    createdAt: row.users?.created_at?.split("T")[0] ?? "",
  };
}

/* ── DB query helpers ── */

async function fetchFromDb<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch {
    return null;
  }
}

/* ── Service implementation ── */

export const mentorService: MentorService = {
  async list(filters) {
    // Try DB first (cross-computer)
    const dbResult = await fetchFromDb(async () => {
      const { data, error } = await insforge.database
        .from("mentors")
        .select("*, users(*)");
      if (error) return null;
      return (data as unknown as MentorDbRow[])?.map(mapMentor) ?? null;
    });

    if (dbResult) {
      // DB is the source of truth. Fill in static-only mentors not in the DB
      // so all 6 seed mentors are visible (Ana, Roberto, Laura only exist locally).
      const dbIds = new Set(dbResult.map((m) => m.id));
      const extra = MENTORS.filter((m) => !dbIds.has(m.id));
      return applyFilters([...dbResult, ...extra], filters);
    }

    // Fallback: static + localStorage (when DB is unreachable)
    return applyFilters(allFallbackMentors(), filters);
  },

  async getById(id) {
    // Try DB first
    const dbResult = await fetchFromDb(async () => {
      const { data, error } = await insforge.database
        .from("mentors")
        .select("*, users(*)")
        .eq("id", id)
        .maybeSingle();
      if (error || !data) return null;
      return mapMentor(data as unknown as MentorDbRow);
    });

    if (dbResult) return dbResult;

    // Fallback: static + localStorage
    return allFallbackMentors().find((m) => m.id === id) ?? null;
  },

  async updateProfile(id, data) {
    // Try DB first
    const dbUpdated = await fetchFromDb(async () => {
      const updateData: Record<string, unknown> = {};
      if (data.specialty !== undefined) updateData.specialty = data.specialty;
      if (data.bio !== undefined) updateData.bio = data.bio;

      // Update mentor specialty
      if (data.specialty !== undefined) {
        await insforge.database
          .from("mentors")
          .update({ specialty: data.specialty })
          .eq("id", id);
      }

      // Update user bio
      if (data.bio !== undefined) {
        await insforge.database
          .from("users")
          .update({ bio: data.bio })
          .eq("id", id);
      }

      // Fetch updated mentor
      const { data: updated, error } = await insforge.database
        .from("mentors")
        .select("*, users(*)")
        .eq("id", id)
        .maybeSingle();

      if (error || !updated) return null;
      return mapMentor(updated as unknown as MentorDbRow);
    });

    if (dbUpdated) {
      // Also persist to localStorage for offline resilience
      try {
        const stored = JSON.parse(localStorage.getItem("unimentor_mentors") || "[]");
        const storedIndex = stored.findIndex((m: Mentor) => m.id === id);
        if (storedIndex >= 0) {
          stored[storedIndex] = { ...stored[storedIndex], ...data };
        }
        localStorage.setItem("unimentor_mentors", JSON.stringify(stored));
      } catch { /* ignore */ }
      return dbUpdated;
    }

    // Fallback: static + localStorage
    const mentor = allFallbackMentors().find((m) => m.id === id);
    if (!mentor) {
      throw new Error("Mentor not found");
    }

    const updated: Mentor = {
      ...mentor,
      ...(data.bio !== undefined && { bio: data.bio }),
      ...(data.specialty !== undefined && { specialty: data.specialty }),
    };

    // Update in-memory static array
    const staticIndex = MENTORS.findIndex((m) => m.id === id);
    if (staticIndex !== -1) {
      MENTORS[staticIndex] = updated;
    }

    // Persist to localStorage
    try {
      const stored = JSON.parse(localStorage.getItem("unimentor_mentors") || "[]");
      const storedIndex = stored.findIndex((m: Mentor) => m.id === id);
      if (storedIndex >= 0) {
        stored[storedIndex] = updated;
      } else {
        stored.push(updated);
      }
      localStorage.setItem("unimentor_mentors", JSON.stringify(stored));
    } catch { /* ignore */ }

    return updated;
  },
};

// Backward-compatible alias for existing imports
export const mockMentorService = mentorService;
