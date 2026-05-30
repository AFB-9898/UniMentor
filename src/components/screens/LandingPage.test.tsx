import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LandingPage from "./LandingPage";
import { mockMentorService } from "../../services/mentorService";

// Mock the mentor service
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
    specialty: ["React"],
    rating: 4,
    sessionCount: 23,
    createdAt: "2026-01-15",
  },
  {
    id: "2",
    name: "María García",
    email: "maria@ejemplo.com",
    role: "mentor",
    specialty: ["UX Design"],
    rating: 5,
    sessionCount: 45,
    createdAt: "2025-11-20",
  },
  {
    id: "3",
    name: "Luis Torres",
    email: "luis@ejemplo.com",
    role: "mentor",
    specialty: ["Node.js"],
    rating: 3,
    sessionCount: 12,
    createdAt: "2026-03-08",
  },
];

describe("LandingPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the Hero section with its heading", async () => {
    vi.mocked(mockMentorService.list).mockResolvedValue(mockMentors);

    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    );

    expect(
      await screen.findByText("Encontrá al mentor ideal para tu futuro profesional"),
    ).toBeInTheDocument();
  });

  it("renders up to 3 mentor cards from the service", async () => {
    vi.mocked(mockMentorService.list).mockResolvedValue(mockMentors);

    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(mockMentorService.list).toHaveBeenCalledTimes(1);
    });

    expect(await screen.findByText("Carlos Mendoza")).toBeInTheDocument();
    expect(screen.getByText("María García")).toBeInTheDocument();
    expect(screen.getByText("Luis Torres")).toBeInTheDocument();
  });

  it("renders a link to view all mentors", async () => {
    vi.mocked(mockMentorService.list).mockResolvedValue(mockMentors);

    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole("link", { name: /ver todos los mentores/i }),
    ).toBeInTheDocument();
  });

  it("has a link to /mentors for viewing all mentors", async () => {
    vi.mocked(mockMentorService.list).mockResolvedValue(mockMentors);

    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    );

    const link = await screen.findByRole("link", { name: /ver todos los mentores/i });
    expect(link).toHaveAttribute("href", "/mentors");
  });

  it("calls mockMentorService.list on mount", async () => {
    vi.mocked(mockMentorService.list).mockResolvedValue(mockMentors);

    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(mockMentorService.list).toHaveBeenCalled();
    });
  });
});
