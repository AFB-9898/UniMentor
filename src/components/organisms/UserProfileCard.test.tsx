import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import UserProfileCard from "./UserProfileCard";
import type { Mentor, Student } from "../../types";

const mockMentor: Mentor = {
  id: "1",
  name: "Carlos Mendoza",
  email: "carlos@ejemplo.com",
  role: "mentor",
  specialty: ["React", "TypeScript"],
  rating: 4,
  sessionCount: 23,
  createdAt: "2026-01-15",
};

const mockStudent: Student = {
  id: "2",
  name: "Ana López",
  email: "ana@ejemplo.com",
  role: "student",
  university: "UPDS",
  career: "Ingeniería de Sistemas",
  createdAt: "2026-03-10",
};

describe("UserProfileCard", () => {
  it("renders mentor name and email", () => {
    render(<UserProfileCard user={mockMentor} />);

    expect(screen.getByText("Carlos Mendoza")).toBeInTheDocument();
    expect(screen.getByText("carlos@ejemplo.com")).toBeInTheDocument();
  });

  it("renders mentor specialties as badges", () => {
    render(<UserProfileCard user={mockMentor} />);

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("renders mentor rating stars", () => {
    render(<UserProfileCard user={mockMentor} />);

    expect(screen.getByText("(23 sesiones)")).toBeInTheDocument();
  });

  it("renders student name without specialty badges", () => {
    render(<UserProfileCard user={mockStudent} />);

    expect(screen.getByText("Ana López")).toBeInTheDocument();
    expect(screen.queryByText("React")).not.toBeInTheDocument();
  });

  it("does not show rating for students", () => {
    render(<UserProfileCard user={mockStudent} />);

    expect(screen.queryByText(/sesiones/)).not.toBeInTheDocument();
  });

  it("renders actions when provided", () => {
    const action = <button>Agendar sesión</button>;
    render(<UserProfileCard user={mockMentor} actions={action} />);

    expect(screen.getByText("Agendar sesión")).toBeInTheDocument();
  });

  it("does not render actions section when not provided", () => {
    const { container } = render(<UserProfileCard user={mockMentor} />);

    const borderT = container.querySelectorAll(".border-t");
    // No actions section means no border-t after the content
    expect(borderT.length).toBeLessThanOrEqual(1);
  });

  it("applies compact variant by default", () => {
    const { container } = render(<UserProfileCard user={mockMentor} />);

    expect(container.querySelector(".p-4")).toBeTruthy();
    expect(container.querySelector(".p-6")).toBeFalsy();
  });

  it("applies detailed variant when specified", () => {
    const { container } = render(
      <UserProfileCard user={mockMentor} variant="detailed" />,
    );

    expect(container.querySelector(".p-6")).toBeTruthy();
    expect(container.querySelector(".p-4")).toBeFalsy();
  });
});
