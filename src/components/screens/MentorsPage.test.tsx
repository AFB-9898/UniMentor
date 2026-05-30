import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MentorsPage from "./MentorsPage";
import { mockMentorService } from "../../services/mentorService";

vi.mock("../../services/mentorService", () => ({
  mockMentorService: {
    list: vi.fn(),
  },
}));

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
  {
    id: "3",
    name: "Luis Torres",
    email: "luis@ejemplo.com",
    role: "mentor",
    specialty: ["Node.js", "PostgreSQL"],
    rating: 3,
    sessionCount: 12,
    createdAt: "2026-03-08",
  },
];

describe("MentorsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the page title", async () => {
    vi.mocked(mockMentorService.list).mockResolvedValue(mockMentors);

    render(
      <MemoryRouter>
        <MentorsPage />
      </MemoryRouter>,
    );

    expect(await screen.findByText("Todos los mentores")).toBeInTheDocument();
  });

  it("renders all mentor cards", async () => {
    vi.mocked(mockMentorService.list).mockResolvedValue(mockMentors);

    render(
      <MemoryRouter>
        <MentorsPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(mockMentorService.list).toHaveBeenCalled();
    });

    expect(await screen.findByText("Carlos Mendoza")).toBeInTheDocument();
    expect(screen.getByText("María García")).toBeInTheDocument();
    expect(screen.getByText("Luis Torres")).toBeInTheDocument();
  });

  it("renders the SearchFilterBar", async () => {
    vi.mocked(mockMentorService.list).mockResolvedValue(mockMentors);

    render(
      <MemoryRouter>
        <MentorsPage />
      </MemoryRouter>,
    );

    expect(
      await screen.findByPlaceholderText("Buscar mentor por nombre..."),
    ).toBeInTheDocument();
  });

  it("calls mockMentorService.list on mount", async () => {
    vi.mocked(mockMentorService.list).mockResolvedValue(mockMentors);

    render(
      <MemoryRouter>
        <MentorsPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(mockMentorService.list).toHaveBeenCalled();
    });
  });
});
