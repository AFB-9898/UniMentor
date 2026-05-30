import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { mockMentorService } from "../../services/mentorService";
import UserProfileCard from "../organisms/UserProfileCard";
import { useAuth } from "../../hooks/AuthContext";
import type { Mentor } from "../../types";

export default function MentorProfilePage() {
  const { mentorId } = useParams<{ mentorId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);

  /* ── Edit state ── */
  const [isEditing, setIsEditing] = useState(false);
  const [draftBio, setDraftBio] = useState("");
  const [draftSpecialties, setDraftSpecialties] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [newSpecialty, setNewSpecialty] = useState("");

  const originalsRef = useRef({ bio: "", specialties: [] as string[] });

  const isOwner = !!user && user.id === mentor?.id;

  useEffect(() => {
    if (!mentorId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    mockMentorService.getById(mentorId).then((result) => {
      setMentor(result);
      setLoading(false);
    });
  }, [mentorId]);

  /* ── Edit handlers ── */
  function handleStartEdit() {
    if (!mentor) return;
    originalsRef.current = {
      bio: mentor.bio ?? "",
      specialties: [...mentor.specialty],
    };
    setDraftBio(mentor.bio ?? "");
    setDraftSpecialties([...mentor.specialty]);
    setSaveError(null);
    setIsEditing(true);
  }

  function handleCancel() {
    setDraftBio(originalsRef.current.bio);
    setDraftSpecialties([...originalsRef.current.specialties]);
    setSaveError(null);
    setIsEditing(false);
  }

  async function handleSave() {
    if (!mentor || isSaving) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      const updated = await mockMentorService.updateProfile(mentor.id, {
        bio: draftBio,
        specialty: draftSpecialties,
      });
      setMentor(updated);
      setIsEditing(false);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Error al guardar los cambios",
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleRemoveSpecialty(spec: string) {
    setDraftSpecialties((prev) => prev.filter((s) => s !== spec));
  }

  function handleAddSpecialty(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = newSpecialty.trim();
    if (trimmed && !draftSpecialties.includes(trimmed)) {
      setDraftSpecialties((prev) => [...prev, trimmed]);
    }
    setNewSpecialty("");
  }

  /* ── Loading state ── */
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1 space-y-3">
                <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Not found state ── */
  if (!mentor) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="bg-white dark:bg-gray-800 p-12 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
            Mentor no encontrado
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            El mentor que buscas no existe o ha sido dado de baja.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block px-6 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-dark transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  /* ── Profile render ── */
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Link to="/" className="hover:text-primary transition-colors">
          Inicio
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-gray-100 font-medium">
          {mentor.name}
        </span>
      </nav>

      {/* Perfil del mentor */}
      <UserProfileCard user={mentor} variant="detailed" />

      {/* Botón Editar Perfil — solo para el dueño */}
      {isOwner && !isEditing && (
        <div className="flex justify-end">
          <button
            onClick={handleStartEdit}
            className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-dark transition-colors"
          >
            Editar Perfil
          </button>
        </div>
      )}

      {/* Biografía */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
          Acerca de
        </h2>
        {isEditing ? (
          <textarea
            aria-label="Biografía"
            value={draftBio}
            onChange={(e) => setDraftBio(e.target.value)}
            placeholder="Compartí tu experiencia, formación y lo que te apasiona de tu profesión."
            className="w-full min-h-[120px] p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-primary"
          />
        ) : (
          mentor.bio && (
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {mentor.bio}
            </p>
          )
        )}
        {!mentor.bio && !isEditing && (
          <p className="text-gray-400 dark:text-gray-500 italic">
            Sin biografía
          </p>
        )}
      </section>

      {/* Especialidades */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
          Especialidades
        </h2>
        {isEditing ? (
          <>
            <div className="flex flex-wrap gap-2 mb-3">
              {draftSpecialties.map((spec) => (
                <span
                  key={spec}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-secondary/10 text-secondary-dark text-sm font-medium rounded-full"
                >
                  {spec}
                  <button
                    type="button"
                    aria-label={`Eliminar ${spec}`}
                    onClick={() => handleRemoveSpecialty(spec)}
                    className="ml-1 text-secondary-dark hover:text-red-600 font-bold leading-none"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <form onSubmit={handleAddSpecialty} className="flex gap-2">
              <input
                type="text"
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                placeholder="Nueva especialidad"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-secondary text-white text-sm font-medium rounded-md hover:bg-secondary-dark transition-colors"
              >
                Agregar
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-wrap gap-2">
            {mentor.specialty.map((spec) => (
              <span
                key={spec}
                className="px-3 py-1 bg-secondary/10 text-secondary-dark text-sm font-medium rounded-full"
              >
                {spec}
              </span>
            ))}
          </div>
        )}
        {mentor.specialty.length === 0 && !isEditing && (
          <p className="text-gray-400 dark:text-gray-500 italic">
            Sin especialidades
          </p>
        )}
      </section>

      {/* Save / Cancel controls — solo en modo edición */}
      {isEditing && (
        <>
          {saveError && (
            <div
              role="alert"
              className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm rounded-md"
            >
              {saveError}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 px-6 py-3 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Guardando..." : "Guardar"}
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
          </div>
        </>
      )}

      {/* Acciones — solo cuando no estamos editando */}
      {!isEditing && (
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/app/book/${mentor.id}`)}
            className="flex-1 px-6 py-3 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-dark transition-colors"
          >
            Agendar sesión con {mentor.name.split(" ")[0]}
          </button>
          <Link
            to="/"
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      )}
    </div>
  );
}
