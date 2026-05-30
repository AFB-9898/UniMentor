import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { mockMentorService } from "../../services/mentorService";
import Hero from "../molecules/Hero";
import MentorGrid from "../organisms/MentorGrid";
import type { Mentor } from "../../types";

export default function LandingPage() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mockMentorService.list().then((result) => {
      // Order by rating desc, then sessionCount desc for "featured" selection
      const sorted = [...result].sort((a, b) =>
        b.rating !== a.rating
          ? b.rating - a.rating
          : b.sessionCount - a.sessionCount,
      );
      setMentors(sorted);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Hero />

      <section className="max-w-7xl mx-auto px-4 pb-16">
        <MentorGrid
          mentors={mentors.slice(0, 3)}
          loading={loading}
          title="Mentores destacados"
        />

        {!loading && mentors.length > 0 && (
          <div className="text-center mt-8">
            <Link
              to="/mentors"
              className="inline-block px-6 py-3 border border-primary text-primary font-medium rounded-md hover:bg-primary hover:text-white transition-colors"
            >
              Ver todos los mentores
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
