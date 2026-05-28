import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { mockMentorService } from "../../services/mentorService";
import { useSessions } from "../../hooks/SessionContext";
import { useAuth } from "../../hooks/AuthContext";
import RatingStars from "../atoms/RatingStars";
import SessionBookingForm from "../organisms/SessionBookingForm";
import type { Mentor } from "../../types";
import type { SessionFormData } from "../../shared/schemas/session.schema";

export default function BookingPage() {
  const { mentorId } = useParams<{ mentorId: string }>();
  const navigate = useNavigate();
  const { addSession } = useSessions();
  const { user } = useAuth();

  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!mentorId) {
      setLoading(false);
      return;
    }
    mockMentorService.getById(mentorId).then((result) => {
      setMentor(result);
      setLoading(false);
    });
  }, [mentorId]);

  function handleSubmit(data: SessionFormData) {
    if (!user) return;

    setIsSubmitting(true);

    addSession({
      mentorId: data.mentorId,
      studentId: user.id,
      status: "pending",
      topic: data.topic,
      date: data.date,
      notes: data.notes,
    });

    navigate("/my-sessions");
  }

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="space-y-2 flex-1">
                <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          </div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        </div>
      </div>
    );
  }

  /* ── Not found ── */
  if (!mentor) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="bg-white dark:bg-gray-800 p-12 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
            Mentor no encontrado
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            El mentor que buscas no existe.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block px-6 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-dark transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const mentors = [mentor]; // para SessionBookingForm

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Link to="/" className="hover:text-primary transition-colors">
          ← Inicio
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-gray-100 font-medium">
          {mentor.name}
        </span>
      </nav>

      {/* Info del mentor */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xl font-bold">
            {mentor.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {mentor.name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <RatingStars value={mentor.rating} size="sm" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {mentor.rating} · {mentor.sessionCount} sesiones
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {mentor.specialty.map((s) => (
            <span
              key={s}
              className="px-2.5 py-0.5 bg-secondary/10 text-secondary-dark text-xs font-medium rounded-full"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Formulario de agendamiento */}
      <SessionBookingForm
        mentors={mentors}
        defaultMentorId={mentor.id}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
