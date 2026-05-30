import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";
import { useSessions } from "../../hooks/SessionContext";
import { mockMentorService } from "../../services/mentorService";
import ThemeToggle from "../atoms/ThemeToggle";
import SearchFilterBar from "../molecules/SearchFilterBar";
import UserProfileCard from "../organisms/UserProfileCard";
import Skeleton from "../../shared/components/Skeleton";
import type { Mentor } from "../../types";

const filterFields = [
  { key: "specialty", label: "Especialidad", options: ["React", "TypeScript", "UX Design", "Figma", "Node.js", "PostgreSQL"] },
  { key: "rating", label: "Calificación", options: ["3+", "4+", "5"] },
];

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const { sessions } = useSessions();
  const navigate = useNavigate();

  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Load mentors
  useEffect(() => {
    setLoading(true);
    mockMentorService.list().then((result) => {
      setMentors(result);
      setLoading(false);
    });
  }, []);

  const upcomingCount = sessions.filter(
    (s) => s.status === "pending" || s.status === "confirmed",
  ).length;
  const completedCount = sessions.filter((s) => s.status === "completed").length;

  const filteredMentors = mentors.filter((m) => {
    if (filters.search && !m.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.specialty && !m.specialty.includes(filters.specialty)) return false;
    if (filters.rating) {
      const min = Number.parseInt(filters.rating);
      if (m.rating < min) return false;
    }
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">UniMentor</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Bienvenido, {user?.name ?? "Estudiante"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            to="/my-sessions"
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Mis Sesiones
          </Link>
          <button
            onClick={() => { logout(); navigate("/"); }}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-6" aria-label="Cargando mentores">
          {/* Skeleton stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <Skeleton variant="text" lines={2} />
              </div>
            ))}
          </div>
          {/* Skeleton search */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <Skeleton variant="text" lines={1} className="mb-4" />
            <Skeleton variant="text" lines={1} />
          </div>
          {/* Skeleton cards */}
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2].map((i) => (
              <Skeleton key={i} variant="card" />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Stats rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                Próximas sesiones
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                {upcomingCount}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                Completadas
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                {completedCount}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                Mentores disponibles
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                {mentors.length}
              </p>
            </div>
          </div>

          {/* Búsqueda de mentores */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Buscar mentor
            </h2>
            <SearchFilterBar
              fields={filterFields}
              placeholder="Buscar mentor por nombre..."
              onFilter={setFilters}
            />
          </section>

          {/* Resultados */}
          <section>
            <div className="grid gap-4 md:grid-cols-2">
              {filteredMentors.map((mentor) => (
                <UserProfileCard
                  key={mentor.id}
                  user={mentor}
                  variant="compact"
                  actions={
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/mentor/${mentor.id}`)}
                        className="px-4 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        Ver perfil
                      </button>
                      <button
                        onClick={() => navigate(`/book/${mentor.id}`)}
                        className="px-4 py-1.5 bg-primary text-white text-sm rounded-md hover:bg-primary-dark transition-colors"
                      >
                        Agendar sesión
                      </button>
                    </div>
                  }
                />
              ))}
            </div>
            {filteredMentors.length === 0 && (
              <p className="text-gray-400 dark:text-gray-500 text-center py-8">
                No hay mentores que coincidan con los filtros
              </p>
            )}
          </section>
        </>
      )}
    </div>
  );
}
