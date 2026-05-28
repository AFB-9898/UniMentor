import { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/AuthContext";
import { SessionProvider } from "./hooks/SessionContext";
import { ThemeProvider } from "./theme/ThemeProvider";
import ThemeToggle from "./components/atoms/ThemeToggle";
import { ProtectedRoute, PublicOnlyRoute } from "./shared/components/ProtectedRoute";
import RatingStars from "./components/atoms/RatingStars";
import SearchFilterBar from "./components/molecules/SearchFilterBar";
import UserProfileCard from "./components/organisms/UserProfileCard";
import BookingPage from "./components/screens/BookingPage";
import MySessionsPage from "./components/screens/MySessionsPage";
import LoginPage from "./components/screens/LoginPage";
import RegisterPage from "./components/screens/RegisterPage";
import MentorProfilePage from "./components/screens/MentorProfilePage";
import RatingPage from "./components/screens/RatingPage";
import MentorDashboard from "./components/screens/MentorDashboard";
import StudentDashboard from "./components/screens/StudentDashboard";
import type { Mentor } from "./types";

const mockMentors: Mentor[] = [
  { id: "1", name: "Carlos Mendoza", email: "carlos@ejemplo.com", role: "mentor", specialty: ["React", "TypeScript"], rating: 4, sessionCount: 23, createdAt: "2026-01-15" },
  { id: "2", name: "María García", email: "maria@ejemplo.com", role: "mentor", specialty: ["UX Design", "Figma"], rating: 5, sessionCount: 45, createdAt: "2025-11-20" },
  { id: "3", name: "Luis Torres", email: "luis@ejemplo.com", role: "mentor", specialty: ["Node.js", "PostgreSQL"], rating: 3, sessionCount: 12, createdAt: "2026-03-08" },
];

const filterFields = [
  { key: "specialty", label: "Especialidad", options: ["React", "TypeScript", "UX Design", "Figma", "Node.js", "PostgreSQL"] },
  { key: "rating", label: "Calificación", options: ["3+", "4+", "5"] },
];

function HomePage() {
  const [rating, setRating] = useState(0);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const filteredMentors = mockMentors.filter((m) => {
    if (filters.search && !m.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.specialty && !m.specialty.includes(filters.specialty)) return false;
    if (filters.rating) {
      const min = Number.parseInt(filters.rating);
      if (m.rating < min) return false;
    }
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header con navegación y auth */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">UniMentor</h1>
          <p className="text-gray-500 dark:text-gray-400">Plataforma de Mentorías Universitarias</p>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {user?.name}
              </span>
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
            </>
          ) : (
            <>
              <Link
                to="/my-sessions"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Mis Sesiones
              </Link>
              <Link
                to="/login"
                className="px-4 py-2 bg-primary text-white text-sm rounded-md hover:bg-primary-dark transition-colors"
              >
                Iniciar sesión
              </Link>
            </>
          )}
        </div>
      </div>

      {/* RatingStars — demo interactiva */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">⭐ RatingStars</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Componente reutilizable de calificación.</p>
        <div className="flex items-center gap-4">
          <RatingStars value={rating} interactive onChange={setRating} size="lg" />
          <span className="text-sm text-gray-500 dark:text-gray-400">{rating} / 5</span>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Hacé clic en las estrellas para calificar</p>
      </section>

      {/* SearchFilterBar */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">🔍 SearchFilterBar</h2>
        <SearchFilterBar
          fields={filterFields}
          placeholder="Buscar mentor por nombre..."
          onFilter={(f) => setFilters(f)}
        />
      </section>

      {/* Resultados con UserProfileCard */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">👤 Mentores disponibles</h2>
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
          <p className="text-gray-400 dark:text-gray-500 text-center py-8">No hay mentores que coincidan con los filtros</p>
        )}
      </section>
    </div>
  );
}

function HomePageRouter() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Once auth is resolved, redirect mentors to their dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.role === "mentor") {
      navigate("/dashboard", { replace: true });
    }
  }, [user, isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Authenticated students see the student dashboard
  if (isAuthenticated && user?.role === "student") {
    return <StudentDashboard />;
  }

  // Unauthenticated users see the public homepage with demo sections
  return <HomePage />;
}

function AppContent() {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
        <Routes>
          <Route path="/" element={<HomePageRouter />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={["mentor"]}>
                <MentorDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
          <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />
          <Route
            path="/book/:mentorId"
            element={
              <ProtectedRoute roles={["student"]}>
                <BookingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentor/:mentorId"
            element={<MentorProfilePage />}
          />
          <Route
            path="/rate/:sessionId"
            element={
              <ProtectedRoute roles={["student"]}>
                <RatingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-sessions"
            element={
              <ProtectedRoute>
                <MySessionsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </SessionProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
