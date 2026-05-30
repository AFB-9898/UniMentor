import { describe, it, expect } from "vitest";

describe("ratingService", () => {
  it("submits a rating for a completed session", async () => {
    const { mockRatingService } = await import("./ratingService.mock");
    const { mockSessionService } = await import("./sessionService.mock");

    // Create and complete a session first
    const session = await mockSessionService.create({
      mentorId: "mentor-1",
      studentId: "student-1",
      topic: "Rating test",
      date: "2026-06-15",
    });
    await mockSessionService.updateStatus(session.id, "completed");

    // Submit rating
    const rated = await mockRatingService.submitRating(session.id, 5);
    expect(rated.sessionId).toBe(session.id);
    expect(rated.rating).toBe(5);
  });

  it("prevents rating a non-completed session", async () => {
    const { mockRatingService } = await import("./ratingService.mock");
    const { mockSessionService } = await import("./sessionService.mock");

    const session = await mockSessionService.create({
      mentorId: "mentor-1",
      studentId: "student-1",
      topic: "No rating for pending",
      date: "2026-06-20",
    });

    await expect(
      mockRatingService.submitRating(session.id, 3),
    ).rejects.toThrow("completed");
  });

  it("prevents double rating on the same session", async () => {
    const { mockRatingService } = await import("./ratingService.mock");
    const { mockSessionService } = await import("./sessionService.mock");

    const session = await mockSessionService.create({
      mentorId: "mentor-1",
      studentId: "student-1",
      topic: "Double rating test",
      date: "2026-06-25",
    });
    await mockSessionService.updateStatus(session.id, "completed");

    await mockRatingService.submitRating(session.id, 4);
    await expect(
      mockRatingService.submitRating(session.id, 5),
    ).rejects.toThrow("already");
  });

  it("gets average rating for a mentor", async () => {
    const { mockRatingService } = await import("./ratingService.mock");
    const avg = await mockRatingService.getAverage("mentor-1");
    expect(avg).toHaveProperty("average");
    expect(avg).toHaveProperty("count");
    expect(typeof avg.average).toBe("number");
  });

  it("mentor average rating updates when a new rating is added (BR-03)", async () => {
    const { mockRatingService } = await import("./ratingService.mock");
    const { mockSessionService } = await import("./sessionService.mock");

    // Create 2 completed sessions and rate them
    const s1 = await mockSessionService.create({
      mentorId: "mentor-2",
      studentId: "student-1",
      topic: "BR-03 test 1",
      date: "2026-07-01",
    });
    await mockSessionService.updateStatus(s1.id, "completed");
    await mockRatingService.submitRating(s1.id, 3);

    const s2 = await mockSessionService.create({
      mentorId: "mentor-2",
      studentId: "student-1",
      topic: "BR-03 test 2",
      date: "2026-07-05",
    });
    await mockSessionService.updateStatus(s2.id, "completed");
    await mockRatingService.submitRating(s2.id, 5);

    const avg = await mockRatingService.getAverage("mentor-2");
    expect(avg.average).toBe(4); // (3 + 5) / 2 = 4
    expect(avg.count).toBe(2);
  });
});
