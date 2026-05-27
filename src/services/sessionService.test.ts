import { describe, it, expect } from "vitest";
import type { Session } from "../types";

describe("sessionService", () => {
  it("lists sessions for a student", async () => {
    const { mockSessionService } = await import("./sessionService");
    const sessions = await mockSessionService.listByUser("student-1");
    expect(Array.isArray(sessions)).toBe(true);
    sessions.forEach((s: Session) => {
      expect(s.studentId).toBe("student-1");
    });
  });

  it("creates a new session", async () => {
    const { mockSessionService } = await import("./sessionService");
    const session = await mockSessionService.create({
      mentorId: "mentor-1",
      studentId: "student-1",
      topic: "Test session",
      date: "2026-06-15",
    });
    expect(session.id).toBeDefined();
    expect(session.status).toBe("pending");
    expect(session.topic).toBe("Test session");
  });

  it("gets a session by ID", async () => {
    const { mockSessionService } = await import("./sessionService");
    const sessions = await mockSessionService.listByUser("student-1");
    if (sessions.length > 0) {
      const found = await mockSessionService.getById(sessions[0].id);
      expect(found).not.toBeNull();
      expect(found!.id).toBe(sessions[0].id);
    }
  });

  it("returns null for non-existent session", async () => {
    const { mockSessionService } = await import("./sessionService");
    const session = await mockSessionService.getById("non-existent");
    expect(session).toBeNull();
  });

  it("updates session status", async () => {
    const { mockSessionService } = await import("./sessionService");
    const session = await mockSessionService.create({
      mentorId: "mentor-1",
      studentId: "student-1",
      topic: "Status test",
      date: "2026-06-20",
    });
    const updated = await mockSessionService.updateStatus(session.id, "confirmed");
    expect(updated.status).toBe("confirmed");
  });

  it("returns sessions ordered by date descending", async () => {
    const { mockSessionService } = await import("./sessionService");
    const sessions = await mockSessionService.listByUser("student-1");
    for (let i = 1; i < sessions.length; i++) {
      expect(new Date(sessions[i - 1].createdAt).getTime())
        .toBeGreaterThanOrEqual(new Date(sessions[i].createdAt).getTime());
    }
  });
});
