import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import RatingStars from "../atoms/RatingStars";
import { useSessions } from "../../hooks/SessionContext";
import type { Mentor } from "../../types";

const mockMentors: Mentor[] = [
  { id: "1", name: "Carlos Mendoza", email: "carlos@ejemplo.com", role: "mentor", specialty: ["React", "TypeScript"], rating: 4, sessionCount: 23, createdAt: "2026-01-15" },
  { id: "2", name: "María García", email: "maria@ejemplo.com", role: "mentor", specialty: ["UX Design", "Figma"], rating: 5, sessionCount: 45, createdAt: "2025-11-20" },
  { id: "3", name: "Luis Torres", email: "luis@ejemplo.com", role: "mentor", specialty: ["Node.js", "PostgreSQL"], rating: 3, sessionCount: 12, createdAt: "2026-03-08" },
];

export default function BookingPage() {
  const { mentorId } = useParams<{ mentorId: string }>();
  const navigate = useNavigate();
  const { addSession } = useSessions();

  const mentor = mockMentors.find((m) => m.id === mentorId);

  const [topic, setTopic] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!topic.trim()) {
      setError("El tema es obligatorio");
      return;
    }
    if (topic.trim().length < 5) {
      setError("El tema debe tener al menos 5 caracteres");
      return;
    }
    if (!date) {
      setError("Seleccioná una fecha");
      return;
    }

    addSession({
      mentorId: mentorId!,
      studentId: "student-1",
      status: "pending",
      topic: topic.trim(),
      date,
      notes: notes.trim() || undefined,
    });

    navigate("/my-sessions");
  }

  if (!mentor) {
    return (
      <div className="max-w-xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">Mentor no encontrado</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">El mentor que buscas no existe.</p>
        <Link to="/" className="mt-4 inline-block text-primary hover:underline">
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Navegación */}
      <nav className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
        <Link to="/" className="hover:text-primary transition-colors">
          ← Inicio
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-gray-100 font-medium">{mentor.name}</span>
      </nav>

      {/* Info del mentor */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xl font-bold">
            {mentor.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{mentor.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <RatingStars value={mentor.rating} size="sm" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {mentor.rating} · {mentor.sessionCount} sesiones
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {mentor.specialty.map((s) => (
            <span
              key={s}
              className="px-2.5 py-0.5 bg-secondary/10 text-secondary-dark text-xs font-medium rounded-full"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Agendar Sesión</h2>

        {/* Tema */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tema de la sesión</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => { setTopic(e.target.value); setError(""); }}
            placeholder="Ej: Consultoría sobre arquitectura React"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
          />
        </div>

        {/* Fecha */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Fecha</label>
          <input
            type="date"
            value={date}
            onChange={(e) => { setDate(e.target.value); setError(""); }}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
          />
        </div>

        {/* Notas */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Notas (opcional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Comentarios adicionales..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent resize-none"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        {/* Botones */}
        <div className="flex gap-3 pt-2">
          <Link
            to="/"
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-dark transition-colors"
          >
            Confirmar sesión
          </button>
        </div>
      </form>
    </div>
  );
}
