import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MySessionsPage from "./MySessionsPage";

const mockUseAuth = vi.fn();
vi.mock("../../hooks/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

const mockUseSessions = vi.fn();
vi.mock("../../hooks/SessionContext", () => ({
  useSessions: () => mockUseSessions(),
}));

const sessions = [
  {
    id: "s1",
    mentorId: "1",
    studentId: "student-1",
    status: "confirmed" as const,
    date: "2026-06-15",
    topic: "React con TypeScript",
    createdAt: "2026-06-01T00:00:00Z",
  },
  {
    id: "s2",
    mentorId: "2",
    studentId: "student-1",
    status: "completed" as const,
    date: "2026-05-20",
    topic: "UX Design",
    createdAt: "2026-05-15T00:00:00Z",
  },
];

function renderPage() {
  return render(
    <MemoryRouter>
      <MySessionsPage />
    </MemoryRouter>,
  );
}

describe("MySessionsPage — conditional name display by role", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSessions.mockReturnValue({ sessions });
  });

  it("shows student name when user is mentor", () => {
    mockUseAuth.mockReturnValue({
      user: { id: "1", name: "Carlos Mendoza", role: "mentor" },
      isAuthenticated: true,
      isLoading: false,
    });

    renderPage();

    // As mentor, sees student name: "Ana López" for student-1
    expect(screen.getAllByText("Ana López").length).toBeGreaterThanOrEqual(1);
    // Session topics still visible
    expect(screen.getByText("React con TypeScript")).toBeInTheDocument();
  });

  it("shows mentor name when user is student (existing behavior)", () => {
    mockUseAuth.mockReturnValue({
      user: { id: "student-1", name: "Ana López", role: "student" },
      isAuthenticated: true,
      isLoading: false,
    });

    renderPage();

    // As student, sees mentor name: "Carlos Mendoza" for mentorId "1"
    expect(screen.getByText("Carlos Mendoza")).toBeInTheDocument();
    // Second session mentor: "María García" for mentorId "2"
    expect(screen.getByText("María García")).toBeInTheDocument();
    // Should NOT show "Ana López" (her own name) in the card
    expect(screen.queryByText("Ana López")).not.toBeInTheDocument();
  });
});
