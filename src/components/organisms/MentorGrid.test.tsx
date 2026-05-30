import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MentorGrid from "./MentorGrid";
import type { Mentor } from "../../types";

const mockMentors: Mentor[] = [
  {
    id: "1",
    name: "Carlos Mendoza",
    email: "carlos@ejemplo.com",
    role: "mentor",
    specialty: ["React", "TypeScript"],
    rating: 4,
    sessionCount: 23,
    createdAt: "2026-01-15",
  },
  {
    id: "2",
    name: "María García",
    email: "maria@ejemplo.com",
    role: "mentor",
    specialty: ["UX Design", "Figma"],
    rating: 5,
    sessionCount: 45,
    createdAt: "2025-11-20",
  },
];

describe("MentorGrid", () => {
  it("renders the title when provided", () => {
    render(
      <MemoryRouter>
        <MentorGrid mentors={mockMentors} title="Mentores destacados" />
      </MemoryRouter>,
    );

    expect(screen.getByText("Mentores destacados")).toBeInTheDocument();
  });

  it("renders all mentor cards", () => {
    render(
      <MemoryRouter>
        <MentorGrid mentors={mockMentors} />
      </MemoryRouter>,
    );

    expect(screen.getByText("Carlos Mendoza")).toBeInTheDocument();
    expect(screen.getByText("María García")).toBeInTheDocument();
  });

  it("shows loading state with status role", () => {
    render(
      <MemoryRouter>
        <MentorGrid mentors={[]} loading />
      </MemoryRouter>,
    );

    const loadingRegion = screen.getByRole("status", { name: /cargando/i });
    expect(loadingRegion).toBeInTheDocument();
  });

  it("does not show mentor names when loading", () => {
    render(
      <MemoryRouter>
        <MentorGrid mentors={[]} loading />
      </MemoryRouter>,
    );

    expect(screen.queryByText("Carlos Mendoza")).not.toBeInTheDocument();
  });

  it("shows empty message when no mentors and not loading", () => {
    render(
      <MemoryRouter>
        <MentorGrid mentors={[]} />
      </MemoryRouter>,
    );

    expect(
      screen.getByText("No se encontraron mentores"),
    ).toBeInTheDocument();
  });

  it("does not show empty message when loading", () => {
    render(
      <MemoryRouter>
        <MentorGrid mentors={[]} loading />
      </MemoryRouter>,
    );

    expect(
      screen.queryByText("No se encontraron mentores"),
    ).not.toBeInTheDocument();
  });

  it("renders without title when not provided", () => {
    render(
      <MemoryRouter>
        <MentorGrid mentors={mockMentors} />
      </MemoryRouter>,
    );

    expect(screen.getByText("Carlos Mendoza")).toBeInTheDocument();
    expect(screen.getByText("María García")).toBeInTheDocument();
  });
});
