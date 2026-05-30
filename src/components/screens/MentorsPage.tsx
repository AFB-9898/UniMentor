import { useState, useEffect } from "react";
import { mockMentorService } from "../../services/mentorService";
import SearchFilterBar from "../molecules/SearchFilterBar";
import MentorGrid from "../organisms/MentorGrid";
import type { Mentor } from "../../types";

const filterFields = [
  {
    key: "specialty",
    label: "Especialidad",
    options: [
      "React",
      "TypeScript",
      "UX Design",
      "Figma",
      "Node.js",
      "PostgreSQL",
      "Python",
      "Machine Learning",
      "React Native",
      "Flutter",
      "AWS",
      "DevOps",
    ],
  },
  {
    key: "rating",
    label: "Calificación",
    options: ["3+", "4+", "5"],
  },
];

export default function MentorsPage() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Record<string, string>>({});

  useEffect(() => {
    setLoading(true);
    mockMentorService
      .list()
      .then((result) => {
        setMentors(result);
        setLoading(false);
      });
  }, []);

  const filteredMentors = mentors.filter((m) => {
    if (filters.search && !m.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.specialty && !m.specialty.includes(filters.specialty)) {
      return false;
    }
    if (filters.rating) {
      const min = Number.parseInt(filters.rating);
      if (m.rating < min) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        Todos los mentores
      </h1>

      <SearchFilterBar
        fields={filterFields}
        placeholder="Buscar mentor por nombre..."
        onFilter={setFilters}
      />

      <MentorGrid mentors={filteredMentors} loading={loading} />
    </div>
  );
}
