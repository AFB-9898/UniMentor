import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { mockSessionService } from "../../services/sessionService";
import { mockMentorService } from "../../services/mentorService";
import { mockRatingService } from "../../services/ratingService";
import RatingStars from "../atoms/RatingStars";
import type { Session, Mentor } from "../../types";

type PageState =
  | { phase: "loading" }
  | { phase: "not-found" }
  | { phase: "not-completed" }
  | { phase: "already-rated" }
  | { phase: "form" }
  | { phase: "submitting" }
  | { phase: "error"; message: string }
  | { phase: "success"; rating: number };

export default function RatingPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const [session, setSession] = useState<Session | null>(null);
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [pageState, setPageState] = useState<PageState>({ phase: "loading" });

  // Cargar sesión y mentor al montar
  useEffect(() => {
    if (!sessionId) {
      setPageState({ phase: "not-found" });
      return;
    }

    mockSessionService.getById(sessionId).then((s) => {
      if (!s) {
        setPageState({ phase: "not-found" });
        return;
      }

      setSession(s);

      // Si ya tiene rating, mostrar como ya calificada
      if (s.rating !== undefined) {
        setPageState({ phase: "already-rated" });
        return;
      }

      // Verificar estado
      if (s.status !== "completed") {
        setPageState({ phase: "not-completed" });
        return;
      }

      // Cargar datos del mentor
      mockMentorService.getById(s.mentorId).then((m) => {
        setMentor(m);
        setPageState({ phase: "form" });
      });
    });
  }, [sessionId]);

  async function handleSubmit() {
    if (!sessionId || selectedRating === 0) return;

    setPageState({ phase: "submitting" });

    try {
      await mockRatingService.submitRating(sessionId, selectedRating);
      setPageState({ phase: "success", rating: selectedRating });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al enviar la calificación";
      setPageState({ phase: "error", message });
    }
  }

  /* ── Loading ── */
  if (pageState.phase === "loading") {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="space-y-2 flex-1">
                <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-10 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </div>
    );
  }

  /* ── Not found ── */
  if (pageState.phase === "not-found") {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="bg-white dark:bg-gray-800 p-12 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
            Sesión no encontrada
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            La sesión que buscas no existe.
          </p>
          <Link
            to="/app/my-sessions"
            className="mt-6 inline-block px-6 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-dark transition-colors"
          >
            Volver a Mis Sesiones
          </Link>
        </div>
      </div>
    );
  }

  /* ── Not completed ── */
  if (pageState.phase === "not-completed") {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="bg-white dark:bg-gray-800 p-12 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-5xl mb-4">⏳</div>
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
            Sesión no completada
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Solo podés calificar sesiones que ya fueron completadas.
          </p>
          <Link
            to="/app/my-sessions"
            className="mt-6 inline-block px-6 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-dark transition-colors"
          >
            Volver a Mis Sesiones
          </Link>
        </div>
      </div>
    );
  }

  /* ── Already rated ── */
  if (pageState.phase === "already-rated") {
    const mentorName = mentor?.name ?? "Mentor";
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Link to="/app/my-sessions" className="hover:text-primary transition-colors">
            ← Mis Sesiones
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-gray-100 font-medium">Calificar</span>
        </nav>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700 text-center space-y-4">
          <div className="text-5xl">⭐</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Ya calificaste esta sesión
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Ya le diste una calificación a {mentorName} por esta sesión.
          </p>
          {session?.rating !== undefined && (
            <div className="flex justify-center">
              <RatingStars value={session.rating} size="lg" />
            </div>
          )}
          <Link
            to="/app/my-sessions"
            className="inline-block px-6 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-dark transition-colors mt-4"
          >
            Volver a Mis Sesiones
          </Link>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (pageState.phase === "error") {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
          <div className="text-5xl">❌</div>
          <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300">
            Error al calificar
          </h2>
          <p className="text-red-500">{pageState.message}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setPageState({ phase: "form" })}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Intentar de nuevo
            </button>
            <Link
              to="/app/my-sessions"
              className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-dark transition-colors"
            >
              Volver
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Success ── */
  if (pageState.phase === "success") {
    const mentorName = mentor?.name ?? "Mentor";
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Link to="/app/my-sessions" className="hover:text-primary transition-colors">
            ← Mis Sesiones
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-gray-100 font-medium">Calificar</span>
        </nav>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700 text-center space-y-4">
          <div className="text-5xl">🎉</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            ¡Gracias por tu calificación!
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Calificaste a {mentorName} con:
          </p>
          <div className="flex justify-center">
            <RatingStars value={pageState.rating} size="lg" />
          </div>
          <p className="text-2xl font-bold text-primary">
            {pageState.rating} / 5
          </p>
          <button
            onClick={() => navigate("/app/my-sessions")}
            className="inline-block px-6 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-dark transition-colors"
          >
            Volver a Mis Sesiones
          </button>
        </div>
      </div>
    );
  }

  /* ── Form ── */
  const mentorName = mentor?.name ?? "cargando...";
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Link to="/app/my-sessions" className="hover:text-primary transition-colors">
          ← Mis Sesiones
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-gray-100 font-medium">Calificar</span>
      </nav>

      {/* Info de la sesión */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xl font-bold">
            {mentorName.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {mentorName}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {session?.topic}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {session?.date
                ? new Date(session.date + "T00:00:00").toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Formulario de calificación */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 space-y-6">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            ¿Cómo fue tu experiencia?
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Seleccioná una calificación del 1 al 5
          </p>
        </div>

        <div className="flex justify-center py-4">
          <RatingStars
            value={selectedRating}
            interactive
            onChange={setSelectedRating}
            size="lg"
          />
        </div>

        {selectedRating > 0 && (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            {selectedRating === 1 && "Muy malo"}
            {selectedRating === 2 && "Malo"}
            {selectedRating === 3 && "Regular"}
            {selectedRating === 4 && "Bueno"}
            {selectedRating === 5 && "¡Excelente!"}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={selectedRating === 0 || pageState.phase === "submitting"}
          className="w-full py-3 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {pageState.phase === "submitting" ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Enviando...
            </span>
          ) : (
            "Enviar calificación"
          )}
        </button>
      </div>
    </div>
  );
}
