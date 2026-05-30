import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/AuthContext";
import { SessionProvider } from "./hooks/SessionContext";
import { ThemeProvider } from "./theme/ThemeProvider";
import { ToastProvider } from "./hooks/ToastContext";
import { ProtectedRoute, PublicOnlyRoute } from "./shared/components/ProtectedRoute";
import BookingPage from "./components/screens/BookingPage";
import MySessionsPage from "./components/screens/MySessionsPage";
import LoginPage from "./components/screens/LoginPage";
import RegisterPage from "./components/screens/RegisterPage";
import MentorProfilePage from "./components/screens/MentorProfilePage";
import RatingPage from "./components/screens/RatingPage";
import MentorDashboard from "./components/screens/MentorDashboard";
import StudentDashboard from "./components/screens/StudentDashboard";

function HomePageRouter() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    } else if (user?.role === "mentor") {
      navigate("/dashboard", { replace: true });
    } else if (user?.role === "student") {
      navigate("/", { replace: true }); // StudentDashboard se renderiza abajo
    }
  }, [user, isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated && user?.role === "student") {
    return <StudentDashboard />;
  }

  // Mientras se redirige, no mostrar nada
  return null;
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
      <ToastProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
