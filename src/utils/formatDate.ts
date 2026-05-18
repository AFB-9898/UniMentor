/**
 * Format a date string to a human-readable format.
 * TODO: Apply Extract Method refactoring — centralize date formatting here.
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
