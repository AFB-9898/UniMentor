import { mockSessionService } from "./sessionService";
import { mockMentorService } from "./mentorService";

export interface RatingResult {
  sessionId: string;
  rating: number;
}

export interface MentorAverage {
  average: number;
  count: number;
}

export interface RatingService {
  submitRating(sessionId: string, rating: number): Promise<RatingResult>;
  getAverage(mentorId: string): Promise<MentorAverage>;
}

// In-memory store for ratings (tracks which sessions have been rated)
const ratings = new Map<string, number>();

export const mockRatingService: RatingService = {
  async submitRating(sessionId, rating) {
    if (rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    const session = await mockSessionService.getById(sessionId);
    if (!session) {
      throw new Error("Session not found");
    }
    if (session.status !== "completed") {
      throw new Error("Session must be completed before rating");
    }
    if (ratings.has(sessionId)) {
      throw new Error("Session already rated");
    }

    // Store the rating
    ratings.set(sessionId, rating);

    // Update mentor's average rating (BR-03)
    const mentor = await mockMentorService.getById(session.mentorId);
    if (mentor) {
      const avg = await getAverageForMentor(session.mentorId);
      mentor.rating = avg.average;
    }

    return { sessionId, rating };
  },

  async getAverage(mentorId) {
    return getAverageForMentor(mentorId);
  },
};

async function getAverageForMentor(mentorId: string): Promise<MentorAverage> {
  // Get all sessions for this mentor
  const allSessions = await mockSessionService.listByUser("student-1");
  const mentorSessions = allSessions.filter((s) => s.mentorId === mentorId);

  // Count ratings from memory
  let total = 0;
  let count = 0;

  for (const session of mentorSessions) {
    const saved = ratings.get(session.id);
    if (saved !== undefined) {
      total += saved;
      count++;
    }
  }

  return {
    average: count > 0 ? Math.round(total / count) : 0,
    count,
  };
}
