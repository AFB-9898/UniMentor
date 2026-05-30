import type { Mentor } from "../../types";
import UserProfileCard from "./UserProfileCard";
import Skeleton from "../../shared/components/Skeleton";

type MentorGridProps = {
  mentors: Mentor[];
  loading?: boolean;
  title?: string;
};

export default function MentorGrid({
  mentors,
  loading = false,
  title,
}: MentorGridProps) {
  if (loading) {
    return (
      <section aria-label="Cargando mentores" role="status">
        {title && (
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            {title}
          </h2>
        )}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="card" />
          ))}
        </div>
      </section>
    );
  }

  if (mentors.length === 0) {
    return (
      <section>
        {title && (
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            {title}
          </h2>
        )}
        <p className="text-gray-400 dark:text-gray-500 text-center py-12">
          No se encontraron mentores
        </p>
      </section>
    );
  }

  return (
    <section>
      {title && (
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          {title}
        </h2>
      )}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mentors.map((mentor) => (
          <UserProfileCard key={mentor.id} user={mentor} />
        ))}
      </div>
    </section>
  );
}
