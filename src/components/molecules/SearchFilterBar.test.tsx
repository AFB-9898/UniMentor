import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchFilterBar from "./SearchFilterBar";

const mockFields = [
  { key: "specialty", label: "Especialidad", options: ["React", "TypeScript"] },
  { key: "rating", label: "Calificación", options: ["3+", "4+"] },
];

describe("SearchFilterBar", () => {
  it("renders search input with placeholder", () => {
    render(
      <SearchFilterBar
        fields={mockFields}
        placeholder="Buscar mentor..."
        onFilter={vi.fn()}
      />,
    );

    expect(screen.getByPlaceholderText("Buscar mentor...")).toBeInTheDocument();
  });

  it("renders filter fields as select elements", () => {
    render(<SearchFilterBar fields={mockFields} onFilter={vi.fn()} />);

    expect(screen.getByText("Especialidad")).toBeInTheDocument();
    expect(screen.getByText("Calificación")).toBeInTheDocument();
  });

  it("calls onFilter when typing in search", () => {
    const handleFilter = vi.fn();
    render(
      <SearchFilterBar fields={mockFields} onFilter={handleFilter} />,
    );

    const input = screen.getByPlaceholderText("Buscar...");
    fireEvent.change(input, { target: { value: "React" } });

    expect(handleFilter).toHaveBeenCalledWith(
      expect.objectContaining({ search: "React" }),
    );
  });

  it("calls onFilter when selecting a filter option", () => {
    const handleFilter = vi.fn();
    render(<SearchFilterBar fields={mockFields} onFilter={handleFilter} />);

    const select = screen.getByLabelText("Especialidad");
    fireEvent.change(select, { target: { value: "React" } });

    expect(handleFilter).toHaveBeenCalledWith(
      expect.objectContaining({ specialty: "React" }),
    );
  });

  it("renders all filter options plus the default 'Todos'", () => {
    render(<SearchFilterBar fields={mockFields} onFilter={vi.fn()} />);

    const selects = screen.getAllByRole("combobox");
    expect(selects).toHaveLength(2);
  });
});
