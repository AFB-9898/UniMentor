import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";
import { useSessions } from "../../hooks/SessionContext";
import { mockMentorService } from "../../services/mentorService";
import { mockRatingService } from "../../services/ratingService";
import RatingStars from "../atoms/RatingStars";
import { formatDate } from "../../utils/formatDate";
import { getUserName } from "../../services/userService";
import type { Mentor } from "../../types";

const statusLabels: Record<string, string> = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  completed: "Completada",
  cancelled: "Cancelada",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default function MentorDashboard() {
  const { user, logout } = useAuth();
  const { sessions } = useSessions();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Mentor | null>(null);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Fetch full mentor profile + rating stats
    Promise.all([
      mockMentorService.getById(user.id),
      mockRatingService.getAverage(user.id),
    ]).then(([mentor, rating]) => {
      setProfile(mentor);
      setAvgRating(rating.average);
      setLoading(false);
    });
  }, [user]);

  const mentor = profile ?? (user as Mentor | null);
  if (!mentor) return null;

  // Sessions where this mentor is the assigned mentor
  const mySessions = sessions.filter((s) => s.mentorId === mentor.id);
  const upcomingSessions = mySessions.filter(
    (s) => s.status === "pending" || s.status === "confirmed",
  );
  const completedSessions = mySessions.filter(
    (s) => s.status === "completed",
  );

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="space-y-3 flex-1">
                <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            ))}
          </div>
          <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Panel de Mentor
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Bienvenido, {mentor.name}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to={`/mentor/${mentor.id}`}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Ver perfil público
          </Link>
          <button
            onClick={() => { logout(); navigate("/"); }}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Perfil del mentor */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold shrink-0">
            {mentor.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {mentor.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{mentor.email}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <RatingStars value={avgRating || mentor.rating} size="sm" />
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                    {avgRating || mentor.rating}
                  </span>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {mentor.sessionCount} sesiones
                </p>
              </div>
            </div>

            {/* Especialidades */}
            <div className="flex flex-wrap gap-2 mt-3">
              {mentor.specialty.map((spec) => (
                <span
                  key={spec}
                  className="px-2.5 py-0.5 bg-secondary/10 text-secondary-dark text-xs font-medium rounded-full"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">
            Próximas sesiones
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">
            {upcomingSessions.length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">
            Completadas
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">
            {completedSessions.length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">
            Calificación
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {avgRating || mentor.rating}
            </span>
            <span className="text-sm text-gray-400 dark:text-gray-500">/ 5</span>
          </div>
        </div>
      </div>

      {/* Sesiones próximas */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Próximas sesiones
          </h2>
          <Link
            to="/my-sessions"
            className="text-sm text-primary hover:text-primary-dark transition-colors"
          >
            Ver todas →
          </Link>
        </div>

        {upcomingSessions.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-400 dark:text-gray-500">
              No tenés sesiones próximas.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {upcomingSessions.map((session) => (
              <div
                key={session.id}
                className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {session.topic}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    {getUserName(session.studentId)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    📅 {formatDate(session.date)}
                  </p>
                </div>
                <span
                  className={`shrink-0 px-2.5 py-0.5 text-xs font-medium rounded-full ${statusColors[session.status]}`}
                >
                  {statusLabels[session.status]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
