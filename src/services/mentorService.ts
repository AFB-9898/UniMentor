import type { Mentor } from "../types";
import { mockMentors } from "../data/mockMentors";

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

const STORAGE_KEY = "unimentor_mentors";

/** Load mentors from localStorage, falling back to mock seed data */
function loadMentors(): Mentor[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Mentor[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // localStorage not available or corrupted — fall through
  }
  return [...mockMentors];
}

/** Persist mentors to localStorage */
function saveMentors(mentors: Mentor[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mentors));
  } catch {
    // localStorage not available — silently ignore
  }
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

/** In-memory cache, hydrated from localStorage on first access */
let cachedMentors: Mentor[] | null = null;

function getMentors(): Mentor[] {
  if (!cachedMentors) {
    cachedMentors = loadMentors();
  }
  return cachedMentors;
}

export const mockMentorService: MentorService = {
  async list(filters) {
    return applyFilters(getMentors(), filters);
  },

  async getById(id) {
    return getMentors().find((m) => m.id === id) ?? null;
  },

  async updateProfile(id, data) {
    const mentors = getMentors();
    const index = mentors.findIndex((m) => m.id === id);
    if (index === -1) {
      throw new Error("Mentor not found");
    }

    const updated: Mentor = {
      ...mentors[index],
      ...(data.bio !== undefined && { bio: data.bio }),
      ...(data.specialty !== undefined && { specialty: data.specialty }),
    };

    mentors[index] = updated;
    cachedMentors = mentors;
    saveMentors(mentors);
    return updated;
  },
};
