import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { SessionProvider, useSessions } from "./SessionContext";

// Mock useAuth before any imports
const mockUseAuth = vi.fn();
vi.mock("./AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock listByUser to verify the call argument
const mockListByUser = vi.fn();
vi.mock("../services/sessionService", () => ({
  mockSessionService: {
    listByUser: (...args: unknown[]) => mockListByUser(...args),
  },
}));

const fakeSession = {
  id: "x1",
  mentorId: "1",
  studentId: "student-1",
  status: "pending" as const,
  date: "2026-06-15",
  topic: "Test session from auth",
  createdAt: new Date().toISOString(),
};

function TestConsumer() {
  const { sessions } = useSessions();
  return (
    <div>
      <span data-testid="count">{sessions.length}</span>
      {sessions.map((s) => (
        <div key={s.id} data-testid="session-topic">
          {s.topic}
        </div>
      ))}
    </div>
  );
}

describe("SessionContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads sessions by user.id from useAuth (not hardcoded)", async () => {
    // Auth says user.id is "999" — a non-hardcoded value
    mockUseAuth.mockReturnValue({
      user: { id: "999" },
      isLoading: false,
      isAuthenticated: true,
    });
    mockListByUser.mockResolvedValue([fakeSession]);

    render(
      <SessionProvider>
        <TestConsumer />
      </SessionProvider>,
    );

    // Must call listByUser with the auth user's ID, not "student-1"
    await waitFor(() => {
      expect(mockListByUser).toHaveBeenCalledWith("999");
    });
  });

  it("does NOT fetch sessions while auth isLoading is true", async () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: true,
      isAuthenticated: false,
    });
    mockListByUser.mockResolvedValue([fakeSession]);

    render(
      <SessionProvider>
        <TestConsumer />
      </SessionProvider>,
    );

    // Give a tick for the effect to run
    await new Promise((r) => setTimeout(r, 50));

    expect(mockListByUser).not.toHaveBeenCalled();
    expect(screen.getByTestId("count").textContent).toBe("0");
  });

  it("keeps sessions empty when user is null after loading", async () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
    mockListByUser.mockResolvedValue([fakeSession]);

    render(
      <SessionProvider>
        <TestConsumer />
      </SessionProvider>,
    );

    await new Promise((r) => setTimeout(r, 50));

    expect(mockListByUser).not.toHaveBeenCalled();
    expect(screen.getByTestId("count").textContent).toBe("0");
  });
});
