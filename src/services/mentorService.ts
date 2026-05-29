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
