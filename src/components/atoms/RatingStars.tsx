type RatingStarsProps = {
  /** Valor actual (0 a 5) */
  value: number;
  /** Si es true, el usuario puede clickear para calificar */
  interactive?: boolean;
  /** Callback cuando cambia el valor (solo si interactive=true) */
  onChange?: (value: number) => void;
  /** Tamaño de las estrellas */
  size?: "sm" | "md" | "lg";
};

const sizeMap = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl",
};

/**
 * RatingStars — Componente reutilizable de calificación por estrellas.
 *
 * Reutilización:
 * - Vista de perfil de mentor (mostrar rating promedio)
 * - Feedback post-sesión (calificar al mentor)
 * - Reseñas en el marketplace
 *
 * Props: value, interactive, onChange, size
 */
export default function RatingStars({
  value,
  interactive = false,
  onChange,
  size = "md",
}: RatingStarsProps) {
  const stars = [1, 2, 3, 4, 5];

  function handleClick(star: number) {
    if (interactive && onChange) {
      onChange(star);
    }
  }

  return (
    <div className={`flex gap-1 ${sizeMap[size]}`} role="img" aria-label={`${value} de 5 estrellas`}>
      {stars.map((star) => {
        const filled = star <= value;
        return (
          <span
            key={star}
            onClick={() => handleClick(star)}
            className={`
              ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}
              ${filled ? "text-amber-400" : "text-gray-300"}
            `}
            role={interactive ? "button" : undefined}
            aria-label={`${star} estrella${star > 1 ? "s" : ""}`}
          >
            {filled ? "★" : "☆"}
          </span>
        );
      })}
    </div>
  );
}
