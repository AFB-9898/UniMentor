import { Link } from "react-router-dom";
import { useSessions } from "../../hooks/SessionContext";
import { formatDate } from "../../utils/formatDate";

const statusLabels: Record<string, string> = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  completed: "Completada",
  cancelled: "Cancelada",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const mentorNames: Record<string, string> = {
  "1": "Carlos Mendoza",
  "2": "María García",
  "3": "Luis Torres",
};

export default function MySessionsPage() {
  const { sessions } = useSessions();

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Navegación */}
      <nav className="flex items-center gap-4 text-sm text-gray-500">
        <Link to="/" className="hover:text-primary transition-colors">
          ← Inicio
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Mis Sesiones</span>
      </nav>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Sesiones</h1>
          <p className="text-sm text-gray-500 mt-1">
            {sessions.length === 0
              ? "Todavía no agendaste ninguna sesión"
              : `Tenés ${sessions.length} sesión${sessions.length !== 1 ? "es" : ""} agendada${sessions.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Link
          to="/"
          className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-dark transition-colors"
        >
          + Nueva sesión
        </Link>
      </div>

      {sessions.length === 0 ? (
        <div className="bg-white p-12 rounded-lg border border-gray-200 text-center">
          <div className="text-5xl mb-4">📅</div>
          <p className="text-gray-500 mb-4">
          No tenés sesiones agendadas todavía. Buscá un mentor y agendá tu primera sesión.
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-dark transition-colors"
          >
            Buscar mentores
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="bg-white p-5 rounded-lg border border-gray-200 flex items-start gap-4"
            >
              {/* Avatar del mentor */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-lg font-bold shrink-0">
                {(mentorNames[session.mentorId] || "?").charAt(0)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {mentorNames[session.mentorId] || "Mentor desconocido"}
                  </h3>
                  <span
                    className={`shrink-0 px-2.5 py-0.5 text-xs font-medium rounded-full ${statusColors[session.status] || "bg-gray-100 text-gray-800"}`}
                  >
                    {statusLabels[session.status] || session.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1 truncate">{session.topic}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                  <span>📅 {formatDate(session.date)}</span>
                  <span>🆔 #{session.id}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
