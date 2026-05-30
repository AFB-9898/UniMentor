type SkeletonVariant = "text" | "card" | "avatar";

interface SkeletonProps {
  variant?: SkeletonVariant;
  lines?: number;
  className?: string;
}

const variantClasses: Record<SkeletonVariant, string> = {
  text: "h-4 rounded bg-gray-200 dark:bg-gray-700",
  card: "h-32 rounded-lg bg-gray-200 dark:bg-gray-700",
  avatar: "h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0",
};

/**
 * Skeleton — placeholder atom for loading state.
 *
 * - `text`: single line (use `lines` for multiple)
 * - `card`: rectangular card placeholder
 * - `avatar`: circular avatar placeholder
 */
export default function Skeleton({
  variant = "text",
  lines = 1,
  className = "",
}: SkeletonProps) {
  if (variant === "card") {
    return (
      <div
        className={`animate-pulse ${variantClasses.card} ${className}`}
        aria-hidden="true"
      />
    );
  }

  if (variant === "avatar") {
    return (
      <div
        className={`animate-pulse ${variantClasses.avatar} ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <div className={`animate-pulse space-y-2 ${className}`} aria-hidden="true">
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className={variantClasses.text}
          style={{ width: `${80 - i * 15}%` }}
        />
      ))}
    </div>
  );
}
