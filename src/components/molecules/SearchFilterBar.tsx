import { useState } from "react";

type FilterField = {
  key: string;
  label: string;
  options: string[];
};

type SearchFilterBarProps = {
  /** Configuración de los campos de filtro */
  fields: FilterField[];
  /** Placeholder del input de búsqueda */
  placeholder?: string;
  /** Callback cuando cambia la búsqueda o los filtros */
  onFilter: (filters: Record<string, string>) => void;
};

/**
 * SearchFilterBar — Barra de búsqueda + filtros dinámicos.
 *
 * Reutilización:
 * - Buscar mentores por nombre/especialidad
 * - Buscar estudiantes por universidad/carrera
 * - Filtrar historial de sesiones por estado/fecha
 *
 * Props: fields (config de filtros), onFilter (callback), placeholder
 */
export default function SearchFilterBar({
  fields,
  placeholder = "Buscar...",
  onFilter,
}: SearchFilterBarProps) {
  const [search, setSearch] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});

  function handleSearch(value: string) {
    setSearch(value);
    onFilter({ ...selectedFilters, search: value });
  }

  function handleFilter(key: string, value: string) {
    const updated = { ...selectedFilters, [key]: value };
    setSelectedFilters(updated);
    onFilter({ ...updated, search });
  }

  return (
    <div className="flex flex-wrap gap-4 items-end p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Búsqueda */}
      <div className="flex-1 min-w-[200px]">
        <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
        />
      </div>

      {/* Filtros dinámicos */}
      {fields.map((field) => (
        <div key={field.key} className="min-w-[150px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
          <select
            value={selectedFilters[field.key] || ""}
            onChange={(e) => handleFilter(field.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
          >
            <option value="">Todos</option>
            {field.options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
