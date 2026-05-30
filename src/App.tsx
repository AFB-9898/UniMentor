import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/AuthContext";
import { SessionProvider } from "./hooks/SessionContext";
import { ThemeProvider } from "./theme/ThemeProvider";
import { ToastProvider } from "./hooks/ToastContext";
import { ProtectedRoute, PublicOnlyRoute } from "./shared/components/ProtectedRoute";
import SplashScreen from "./components/screens/SplashScreen";
import BookingPage from "./components/screens/BookingPage";
import MySessionsPage from "./components/screens/MySessionsPage";
import LoginPage from "./components/screens/LoginPage";
import RegisterPage from "./components/screens/RegisterPage";
import MentorProfilePage from "./components/screens/MentorProfilePage";
import RatingPage from "./components/screens/RatingPage";
import MentorDashboard from "./components/screens/MentorDashboard";
import StudentDashboard from "./components/screens/StudentDashboard";
import AppLayout from "./components/organisms/AppLayout";
import LandingPage from "./components/screens/LandingPage";
import MentorsPage from "./components/screens/MentorsPage";

/** Wraps protected routes with SessionProvider + AppLayout */
function ProtectedLayout() {
  return (
    <SessionProvider>
      <AppLayout />
    </SessionProvider>
  );
}

function AppContent() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      <Routes>
        {/* ── Public routes (no SessionProvider) ── */}
        <Route path="/" element={<LandingPage />} />

        <Route element={<AppLayout />}>
          <Route path="/mentors" element={<MentorsPage />} />
          <Route path="/mentor/:mentorId" element={<MentorProfilePage />} />
        </Route>
        <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />

        {/* ── Protected routes (SessionProvider scoped here) ── */}
        <Route element={<ProtectedLayout />}>
          {/* Role router — /app redirects based on role */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <RoleDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/dashboard"
            element={
              <ProtectedRoute roles={["mentor"]}>
                <MentorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/book/:mentorId"
            element={
              <ProtectedRoute roles={["student"]}>
                <BookingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/rate/:sessionId"
            element={
              <ProtectedRoute roles={["student"]}>
                <RatingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/my-sessions"
            element={
              <ProtectedRoute>
                <MySessionsPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </div>
  );
}

/** Redirects to the correct dashboard based on user role */
function RoleDashboard() {
  const { user } = useAuth();

  if (user?.role === "mentor") {
    return <Navigate to="/app/dashboard" replace />;
  }

  return <StudentDashboard />;
}

/** Wraps auth loading to show splash screen for at least 3s */
function AppRouter() {
  const { isLoading, isAuthenticated } = useAuth();
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      const timer = setTimeout(() => setMinTimeElapsed(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  // Show splash only for non-authenticated users during loading + minimum time
  if (!isAuthenticated && (isLoading || !minTimeElapsed)) {
    return <SplashScreen />;
  }

  return <AppContent />;
}

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
