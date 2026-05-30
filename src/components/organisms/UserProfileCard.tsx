import type { Mentor, Student } from "../../types";
import RatingStars from "../atoms/RatingStars";

type UserProfileCardProps = {
  /** Datos del usuario (mentor o estudiante) */
  user: Mentor | Student;
  /** Muestra versión compacta o detallada */
  variant?: "compact" | "detailed";
  /** Botones de acción adicionales */
  actions?: React.ReactNode;
};


export default function UserProfileCard({
  user,
  variant = "compact",
  actions,
}: UserProfileCardProps) {
  const isMentor = user.role === "mentor";
  const mentor = isMentor ? (user as Mentor) : null;

  return (
    <div className={`
      bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm
      ${variant === "detailed" ? "p-6" : "p-4"}
    `}>
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className={`
          rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0
          ${variant === "detailed" ? "w-16 h-16 text-2xl" : "w-12 h-12 text-lg"}
        `}>
          {user.name.charAt(0).toUpperCase()}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{user.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>

          {isMentor && mentor && (
            <div className="mt-1 flex items-center gap-2">
              <RatingStars value={mentor.rating} size="sm" />
              <span className="text-xs text-gray-400 dark:text-gray-500">
                ({mentor.sessionCount} sesiones)
              </span>
            </div>
          )}

          {/* Badges de especialidad (solo mentores) */}
          {isMentor && mentor && mentor.specialty.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {mentor.specialty.map((spec) => (
                <span
                  key={spec}
                  className="px-2 py-0.5 bg-secondary/10 dark:bg-secondary/20 text-secondary text-xs rounded-full font-medium"
                >
                  {spec}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Acciones */}
      {actions && (
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex gap-2 justify-end">
          {actions}
        </div>
      )}
    </div>
  );
}
