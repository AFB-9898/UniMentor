import { describe, it, expect } from "vitest";
import type { Mentor } from "../types";

describe("mentorService", () => {
  it("lists all mentors", async () => {
    const { mockMentorService } = await import("./mentorService");
    const mentors = await mockMentorService.list();
    expect(mentors).toHaveLength(3);
    expect(mentors[0]).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      role: "mentor",
      specialty: expect.any(Array),
      rating: expect.any(Number),
    });
  });

  it("filters mentors by specialty", async () => {
    const { mockMentorService } = await import("./mentorService");
    const mentors = await mockMentorService.list({ specialty: "React" });
    expect(mentors).toHaveLength(1);
    expect(mentors[0].name).toBe("Carlos Mendoza");
  });

  it("filters mentors by minimum rating", async () => {
    const { mockMentorService } = await import("./mentorService");
    const mentors = await mockMentorService.list({ minRating: 4 });
    expect(mentors.length).toBeGreaterThanOrEqual(1);
    mentors.forEach((m: Mentor) => {
      expect(m.rating).toBeGreaterThanOrEqual(4);
    });
  });

  it("filters mentors by search term", async () => {
    const { mockMentorService } = await import("./mentorService");
    const mentors = await mockMentorService.list({ search: "garcía" });
    expect(mentors).toHaveLength(1);
    expect(mentors[0].name).toBe("María García");
  });

  it("gets a mentor by ID", async () => {
    const { mockMentorService } = await import("./mentorService");
    const mentors = await mockMentorService.list();
    const mentor = await mockMentorService.getById(mentors[0].id);
    expect(mentor).not.toBeNull();
    expect(mentor!.id).toBe(mentors[0].id);
  });

  it("returns null for non-existent mentor", async () => {
    const { mockMentorService } = await import("./mentorService");
    const mentor = await mockMentorService.getById("non-existent");
    expect(mentor).toBeNull();
  });

  it("combines search and specialty filters", async () => {
    const { mockMentorService } = await import("./mentorService");
    const mentors = await mockMentorService.list({
      search: "carlos",
      specialty: "React",
    });
    expect(mentors).toHaveLength(1);
  });
});
