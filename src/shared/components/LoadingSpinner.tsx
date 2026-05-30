type SpinnerSize = "sm" | "md" | "lg";

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  label?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: "w-4 h-4 border-2",
  md: "w-8 h-8 border-3",
  lg: "w-12 h-12 border-4",
};

/**
 * LoadingSpinner — animated spinner atom.
 *
 * Default size is `md`. Optional accessible label via `label` prop.
 */
export default function LoadingSpinner({
  size = "md",
  label,
}: LoadingSpinnerProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3"
      role="status"
      aria-label={label ?? "Cargando..."}
    >
      <div
        className={`
          ${sizeClasses[size]}
          border-primary/30 border-t-primary rounded-full animate-spin
        `}
      />
      {label && (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {label}
        </span>
      )}
    </div>
  );
}
