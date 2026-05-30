import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand & description */}
          <div>
            <Link to="/" className="text-lg font-bold text-primary hover:text-primary-dark transition-colors">
              UniMentor
            </Link>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Conectamos estudiantes universitarios con mentores profesionales
              para guiar su desarrollo profesional y académico.
            </p>
          </div>

          {/* Vision & Mission */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-3">
              Nuestra Visión
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Ser la plataforma líder en mentoría universitaria, formando
              profesionales preparados para los desafíos del futuro.
            </p>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-3 mt-4">
              Nuestra Misión
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Facilitar el acceso a mentorías de calidad, conectando a
              estudiantes con graduados experimentados que inspiren y guíen
              su camino profesional.
            </p>
          </div>

          {/* Location & Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-3">
              Ubicación
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Universidad Privada Domingo Savio (UPDS)
              <br />
              Tarija, Bolivia
            </p>
            <div className="mt-4 flex flex-col gap-2">
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
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-400 dark:text-gray-500">
          <span>© {new Date().getFullYear()} UniMentor — UPDS Tarija</span>
        </div>
      </div>
    </footer>
  );
}
