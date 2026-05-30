import { describe, it, expect } from "vitest";
import type { Mentor } from "../types";

describe("mentorService", () => {
  it("lists all mentors", async () => {
    const { mockMentorService } = await import("./mentorService.mock");
    const mentors = await mockMentorService.list();
    expect(mentors).toHaveLength(6);
    expect(mentors[0]).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      role: "mentor",
      specialty: expect.any(Array),
      rating: expect.any(Number),
    });
  });

  it("filters mentors by specialty", async () => {
    const { mockMentorService } = await import("./mentorService.mock");
    const mentors = await mockMentorService.list({ specialty: "React" });
    expect(mentors).toHaveLength(1);
    expect(mentors[0].name).toBe("Carlos Mendoza");
  });

  it("filters mentors by minimum rating", async () => {
    const { mockMentorService } = await import("./mentorService.mock");
    const mentors = await mockMentorService.list({ minRating: 4 });
    expect(mentors.length).toBeGreaterThanOrEqual(1);
    mentors.forEach((m: Mentor) => {
      expect(m.rating).toBeGreaterThanOrEqual(4);
    });
  });

  it("filters mentors by search term", async () => {
    const { mockMentorService } = await import("./mentorService.mock");
    const mentors = await mockMentorService.list({ search: "garcía" });
    expect(mentors).toHaveLength(1);
    expect(mentors[0].name).toBe("María García");
  });

  it("gets a mentor by ID", async () => {
    const { mockMentorService } = await import("./mentorService.mock");
    const mentors = await mockMentorService.list();
    const mentor = await mockMentorService.getById(mentors[0].id);
    expect(mentor).not.toBeNull();
    expect(mentor!.id).toBe(mentors[0].id);
  });

  it("returns null for non-existent mentor", async () => {
    const { mockMentorService } = await import("./mentorService.mock");
    const mentor = await mockMentorService.getById("non-existent");
    expect(mentor).toBeNull();
  });

  it("combines search and specialty filters", async () => {
    const { mockMentorService } = await import("./mentorService.mock");
    const mentors = await mockMentorService.list({
      search: "carlos",
      specialty: "React",
    });
    expect(mentors).toHaveLength(1);
  });

  describe("updateProfile", () => {
    it("returns the updated mentor when given valid id and bio data", async () => {
      const { mockMentorService } = await import("./mentorService.mock");
      const result = await mockMentorService.updateProfile("1", {
        bio: "New bio text",
      });

      expect(result.id).toBe("1");
      expect(result.bio).toBe("New bio text");
      // Verify the original mentor in the list was also mutated
      const mentor = await mockMentorService.getById("1");
      expect(mentor!.bio).toBe("New bio text");
    });

    it("returns the updated mentor when specialties are changed", async () => {
      const { mockMentorService } = await import("./mentorService.mock");
      const result = await mockMentorService.updateProfile("2", {
        specialty: ["UX Design", "User Research"],
      });

      expect(result.id).toBe("2");
      expect(result.specialty).toEqual(["UX Design", "User Research"]);
    });

    it("rejects with an error when the id does not exist", async () => {
      const { mockMentorService } = await import("./mentorService.mock");

      await expect(
        mockMentorService.updateProfile("non-existent", { bio: "test" }),
      ).rejects.toThrow("Mentor not found");
    });

    it("preserves unchanged fields when updating only bio", async () => {
      const { mockMentorService } = await import("./mentorService.mock");
      const result = await mockMentorService.updateProfile("1", {
        bio: "Only bio changed",
      });

      expect(result.name).toBe("Carlos Mendoza");
      expect(result.specialty).toEqual(["React", "TypeScript"]);
      expect(result.rating).toBe(4);
    });
  });
});
