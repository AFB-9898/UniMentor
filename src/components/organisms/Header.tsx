import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";
import ThemeToggle from "../atoms/ThemeToggle";

type HeaderProps = {
  className?: string;
};

export default function Header({ className = "" }: HeaderProps) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  return (
    <header
      className={`w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold text-primary hover:text-primary-dark transition-colors"
        >
          <img
            src="/favicon.png"
            alt="UniMentor"
            className="w-8 h-8 object-contain"
          />
          UniMentor
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-6">
          <Link
            to="/"
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
          >
            Inicio
          </Link>
          <Link
            to="/mentors"
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
          >
            Mentores
          </Link>
        </nav>

        {/* Right side: ThemeToggle + Auth */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {!isLoading && !isAuthenticated && (
            <>
              <Link
                to="/login"
                className="text-sm text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-dark transition-colors"
              >
                Registrarse
              </Link>
            </>
          )}

          {!isLoading && isAuthenticated && user && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {user.name}
              </span>
              <button
                onClick={() => logout()}
                className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
