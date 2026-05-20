import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import RatingStars from "./components/atoms/RatingStars";
import SearchFilterBar from "./components/molecules/SearchFilterBar";
import UserProfileCard from "./components/organisms/UserProfileCard";
import SessionBookingForm from "./components/organisms/SessionBookingForm";
import type { Mentor } from "./types";

const mockMentors: Mentor[] = [
  { id: "1", name: "Carlos Mendoza", email: "carlos@ejemplo.com", role: "mentor", specialty: ["React", "TypeScript"], rating: 4, sessionCount: 23, createdAt: "2026-01-15" },
  { id: "2", name: "María García", email: "maria@ejemplo.com", role: "mentor", specialty: ["UX Design", "Figma"], rating: 5, sessionCount: 45, createdAt: "2025-11-20" },
  { id: "3", name: "Luis Torres", email: "luis@ejemplo.com", role: "mentor", specialty: ["Node.js", "PostgreSQL"], rating: 3, sessionCount: 12, createdAt: "2026-03-08" },
];

const filterFields = [
  { key: "specialty", label: "Especialidad", options: ["React", "TypeScript", "UX Design", "Figma", "Node.js", "PostgreSQL"] },
  { key: "rating", label: "Calificación", options: ["3+", "4+", "5"] },
];

function HomePage() {
  const [rating, setRating] = useState(0);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const filteredMentors = mockMentors.filter((m) => {
    if (filters.search && !m.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.specialty && !m.specialty.includes(filters.specialty)) return false;
    if (filters.rating) {
      const min = Number.parseInt(filters.rating);
      if (m.rating < min) return false;
    }
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary">UniMentor</h1>
        <p className="text-gray-500">Plataforma de Mentorías Universitarias</p>
      </div>

      {/* RatingStars — demo interactiva */}
      <section className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg font-semibold mb-3">⭐ RatingStars</h2>
        <p className="text-sm text-gray-500 mb-3">Componente reutilizable de calificación.</p>
        <div className="flex items-center gap-4">
          <RatingStars value={rating} interactive onChange={setRating} size="lg" />
          <span className="text-sm text-gray-500">{rating} / 5</span>
        </div>
        <p className="text-xs text-gray-400 mt-2">Hacé clic en las estrellas para calificar</p>
      </section>

      {/* SearchFilterBar */}
      <section>
        <h2 className="text-lg font-semibold mb-3">🔍 SearchFilterBar</h2>
        <SearchFilterBar
          fields={filterFields}
          placeholder="Buscar mentor por nombre..."
          onFilter={(f) => setFilters(f)}
        />
      </section>

      {/* Resultados con UserProfileCard */}
      <section>
        <h2 className="text-lg font-semibold mb-3">👤 UserProfileCard</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {filteredMentors.map((mentor) => (
            <UserProfileCard
              key={mentor.id}
              user={mentor}
              variant="compact"
              actions={
                <button className="px-4 py-1.5 bg-primary text-white text-sm rounded-md hover:bg-primary-dark transition-colors">
                  Agendar sesión
                </button>
              }
            />
          ))}
        </div>
        {filteredMentors.length === 0 && (
          <p className="text-gray-400 text-center py-8">No hay mentores que coincidan con los filtros</p>
        )}
      </section>

      {/* SessionBookingForm — demo con validación */}
      <section className="max-w-md mx-auto">
        <SessionBookingForm mentors={mockMentors} />
      </section>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  );
}

export default App;
