import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MentorDashboard from "./MentorDashboard";

const mockUseAuth = vi.fn();
vi.mock("../../hooks/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

const mockUseSessions = vi.fn();
vi.mock("../../hooks/SessionContext", () => ({
  useSessions: () => mockUseSessions(),
}));

const mockGetById = vi.fn();
const mockGetAverage = vi.fn();
vi.mock("../../services/mentorService", () => ({
  mockMentorService: {
    getById: (...args: unknown[]) => mockGetById(...args),
  },
}));
vi.mock("../../services/ratingService", () => ({
  mockRatingService: {
    getAverage: (...args: unknown[]) => mockGetAverage(...args),
  },
}));

const mentorProfile = {
  id: "1",
  name: "Carlos Mendoza",
  email: "carlos@ejemplo.com",
  role: "mentor" as const,
  specialty: ["React", "TypeScript"],
  rating: 4,
  sessionCount: 23,
  createdAt: "2026-01-15",
};

const sessions = [
  {
    id: "s1",
    mentorId: "1",
    studentId: "student-1",
    status: "confirmed" as const,
    date: "2026-06-15",
    topic: "Introducción a React con TypeScript",
    createdAt: new Date().toISOString(),
  },
  {
    id: "s2",
    mentorId: "1",
    studentId: "student-1",
    status: "pending" as const,
    date: "2026-06-20",
    topic: "Principios de UX",
    createdAt: new Date(Date.now() + 86400000).toISOString(),
  },
];

function renderDashboard() {
  return render(
    <MemoryRouter>
      <MentorDashboard />
    </MemoryRouter>,
  );
}

describe("MentorDashboard — student name in session cards", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: { id: "1", name: "Carlos Mendoza", role: "mentor" },
      isAuthenticated: true,
      isLoading: false,
    });
    mockUseSessions.mockReturnValue({ sessions, sessionsLoading: false });
    mockGetById.mockResolvedValue(mentorProfile);
    mockGetAverage.mockResolvedValue({ average: 4.5, count: 10 });
  });

  it("renders student name in each upcoming session card", async () => {
    renderDashboard();

    // Wait for profile data to load
    await waitFor(() => {
      expect(screen.getByText("Panel de Mentor")).toBeInTheDocument();
    });

    // Each session card should show the student name resolved via getUserName
    // student-1 → "Ana López"
    const anaElements = screen.getAllByText("Ana López");
    expect(anaElements.length).toBeGreaterThanOrEqual(2);

    // Session topics should still be visible
    expect(screen.getByText("Introducción a React con TypeScript")).toBeInTheDocument();
    expect(screen.getByText("Principios de UX")).toBeInTheDocument();
  });
});
