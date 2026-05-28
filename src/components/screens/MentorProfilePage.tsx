import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { mockMentorService } from "../../services/mentorService";
import UserProfileCard from "../organisms/UserProfileCard";
import type { Mentor } from "../../types";

export default function MentorProfilePage() {
  const { mentorId } = useParams<{ mentorId: string }>();
  const navigate = useNavigate();
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mentorId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    mockMentorService.getById(mentorId).then((result) => {
      setMentor(result);
      setLoading(false);
    });
  }, [mentorId]);

  /* ── Loading state ── */
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1 space-y-3">
                <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Not found state ── */
  if (!mentor) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="bg-white dark:bg-gray-800 p-12 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
            Mentor no encontrado
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            El mentor que buscas no existe o ha sido dado de baja.
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

  /* ── Profile render ── */
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Link to="/" className="hover:text-primary transition-colors">
          Inicio
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-gray-100 font-medium">
          {mentor.name}
        </span>
      </nav>

      {/* Perfil del mentor — usa UserProfileCard en modo detailed */}
      <UserProfileCard user={mentor} variant="detailed" />

      {/* Biografía */}
      {mentor.bio && (
        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Acerca de
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {mentor.bio}
          </p>
        </section>
      )}

      {/* Especialidades */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
          Especialidades
        </h2>
        <div className="flex flex-wrap gap-2">
          {mentor.specialty.map((spec) => (
            <span
              key={spec}
              className="px-3 py-1 bg-secondary/10 text-secondary-dark text-sm font-medium rounded-full"
            >
              {spec}
            </span>
          ))}
        </div>
      </section>

      {/* Acciones */}
      <div className="flex gap-3">
        <button
          onClick={() => navigate(`/book/${mentor.id}`)}
          className="flex-1 px-6 py-3 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-dark transition-colors"
        >
          Agendar sesión con {mentor.name.split(" ")[0]}
        </button>
        <Link
          to="/"
          className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
