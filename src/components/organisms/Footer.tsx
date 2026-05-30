import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Links */}
          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
            >
              Inicio
            </Link>
            <Link
              to="/mentors"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
            >
              Mentores
            </Link>
          </nav>

          {/* Brand and copyright */}
          <div className="text-sm text-gray-400 dark:text-gray-500">
            <span>UniMentor</span>
            <span className="mx-2">·</span>
            <span>© 2026 UniMentor</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
