import { insforge } from "../backend/client";

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

export const ratingService: RatingService = {
  async submitRating(sessionId, rating) {
    if (rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    // Fetch session from DB
    const { data: session, error: fetchError } = await insforge.database
      .from("sessions")
      .select("*")
      .eq("id", sessionId)
      .maybeSingle();

    if (fetchError || !session) {
      throw new Error("Session not found");
    }
    if (session.status !== "completed") {
      throw new Error("Session must be completed before rating");
    }
    if (session.rating != null) {
      throw new Error("Session already rated");
    }

    // Store rating on the session row
    const { error: updateError } = await insforge.database
      .from("sessions")
      .update({ rating })
      .eq("id", sessionId)
      .select("*")
      .single();

    if (updateError) {
      console.error("Error submitting rating:", updateError);
      throw new Error("Error al guardar la calificación");
    }

    // Recalculate mentor average rating (BR-03)
    await recalcMentorAverage(session.mentor_id);

    return { sessionId, rating };
  },

  async getAverage(mentorId) {
    const { data: sessions, error } = await insforge.database
      .from("sessions")
      .select("rating")
      .eq("mentor_id", mentorId)
      .not("rating", "is", null);

    if (error) {
      console.error("Error fetching ratings:", error);
      return { average: 0, count: 0 };
    }

    const ratings = (sessions ?? [])
      .map((s: Record<string, unknown>) => Number(s.rating))
      .filter((r: number) => r > 0);

    if (ratings.length === 0) {
      return { average: 0, count: 0 };
    }

    const total = ratings.reduce((sum: number, r: number) => sum + r, 0);
    return {
      average: Math.round(total / ratings.length),
      count: ratings.length,
    };
  },
};

// Backward-compatible alias for existing imports
export const mockRatingService = ratingService;

async function recalcMentorAverage(mentorId: string): Promise<void> {
  const avg = await ratingService.getAverage(mentorId);

  // Update the mentor's average rating in the DB
  await insforge.database
    .from("mentors")
    .update({ rating: avg.average })
    .eq("id", mentorId);
}
