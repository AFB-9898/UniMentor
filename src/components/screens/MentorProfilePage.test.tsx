import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import MentorProfilePage from "./MentorProfilePage";

// Mock the auth hook before any imports
const mockUseAuth = vi.fn();
vi.mock("../../hooks/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock mentorService
const mockUpdateProfile = vi.fn();
vi.mock("../../services/mentorService", () => ({
  mockMentorService: {
    getById: vi.fn(),
    updateProfile: (...args: unknown[]) => mockUpdateProfile(...args),
  },
}));

import { mockMentorService } from "../../services/mentorService";
const mockedGetById = vi.mocked(mockMentorService.getById);

const ownerMentor = {
  id: "1",
  name: "Carlos Mendoza",
  email: "carlos@ejemplo.com",
  role: "mentor" as const,
  bio: "Apasionado por la tecnología y la educación.",
  specialty: ["React", "TypeScript"],
  rating: 4,
  sessionCount: 23,
  createdAt: "2026-01-15",
};

function renderPage(mentorId = "1") {
  return render(
    <MemoryRouter initialEntries={[`/mentor/${mentorId}`]}>
      <Routes>
        <Route path="/mentor/:mentorId" element={<MentorProfilePage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("MentorProfilePage — Ownership Gating (R1)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetById.mockResolvedValue(ownerMentor);
  });

  it("renders Edit button when the logged-in user is the mentor owner", async () => {
    mockUseAuth.mockReturnValue({
      user: { id: "1", name: "Carlos Mendoza", role: "mentor" },
      isAuthenticated: true,
      isLoading: false,
    });

    renderPage("1");

    expect(await screen.findByRole("button", { name: /editar perfil/i })).toBeInTheDocument();
  });

  it("does NOT render Edit button for a non-owner user", async () => {
    mockUseAuth.mockReturnValue({
      user: { id: "999", name: "Otro Usuario", role: "student" },
      isAuthenticated: true,
      isLoading: false,
    });

    renderPage("1");

    await waitFor(() => {
      expect(screen.getAllByText("Carlos Mendoza").length).toBeGreaterThan(0);
    });
    expect(screen.queryByRole("button", { name: /editar perfil/i })).not.toBeInTheDocument();
  });

  it("does NOT render Edit button when no user is logged in", async () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });

    renderPage("1");

    await waitFor(() => {
      expect(screen.getAllByText("Carlos Mendoza").length).toBeGreaterThan(0);
    });
    expect(screen.queryByRole("button", { name: /editar perfil/i })).not.toBeInTheDocument();
  });
});

describe("MentorProfilePage — Bio Inline Edit (R2)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetById.mockResolvedValue(ownerMentor);
    mockUseAuth.mockReturnValue({
      user: { id: "1", name: "Carlos Mendoza", role: "mentor" },
      isAuthenticated: true,
      isLoading: false,
    });
  });

  it("switches bio paragraph to textarea when Edit is clicked", async () => {
    const user = userEvent.setup();
    renderPage("1");

    const editButton = await screen.findByRole("button", { name: /editar perfil/i });
    await user.click(editButton);

    const textarea = screen.getByRole("textbox", { name: /biografía/i });
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveValue(ownerMentor.bio);
  });

  it("restores paragraph view when Cancel is clicked after editing", async () => {
    const user = userEvent.setup();
    renderPage("1");

    const editButton = await screen.findByRole("button", { name: /editar perfil/i });
    await user.click(editButton);

    const textarea = screen.getByRole("textbox", { name: /biografía/i });
    await user.clear(textarea);
    await user.type(textarea, "Changed bio text");

    const cancelButton = screen.getByRole("button", { name: /cancelar/i });
    await user.click(cancelButton);

    // After cancel, the bio section should show paragraph with original text
    expect(screen.queryByRole("textbox", { name: /biografía/i })).not.toBeInTheDocument();
    expect(screen.getByText(ownerMentor.bio)).toBeInTheDocument();
  });

  it("shows an empty textarea with placeholder when bio is empty", async () => {
    mockedGetById.mockResolvedValue({ ...ownerMentor, bio: "" });

    const user = userEvent.setup();
    renderPage("1");

    const editButton = await screen.findByRole("button", { name: /editar perfil/i });
    await user.click(editButton);

    const textarea = screen.getByRole("textbox", { name: /biografía/i });
    expect(textarea).toHaveValue("");
    expect(textarea).toHaveAttribute("placeholder");
  });
});

describe("MentorProfilePage — Specialties Inline Edit (R3)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetById.mockResolvedValue(ownerMentor);
    mockUseAuth.mockReturnValue({
      user: { id: "1", name: "Carlos Mendoza", role: "mentor" },
      isAuthenticated: true,
      isLoading: false,
    });
  });

  it("shows remove buttons for each specialty in edit mode", async () => {
    const user = userEvent.setup();
    renderPage("1");

    const editButton = await screen.findByRole("button", { name: /editar perfil/i });
    await user.click(editButton);

    // React aparece en UserProfileCard + specialties section
    expect(screen.getAllByText("React").length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText("TypeScript").length).toBeGreaterThanOrEqual(2);

    // Remove buttons should be visible
    const removeButtons = screen.getAllByRole("button", { name: /eliminar/i });
    expect(removeButtons).toHaveLength(2);
  });

  it("removes a specialty when its remove button is clicked", async () => {
    const user = userEvent.setup();
    renderPage("1");

    const editButton = await screen.findByRole("button", { name: /editar perfil/i });
    await user.click(editButton);

    const removeButtons = screen.getAllByRole("button", { name: /eliminar/i });
    await user.click(removeButtons[0]);

    // React eliminado de la sección editable, pero UserProfileCard aún lo muestra
    expect(screen.getAllByText("TypeScript").length).toBeGreaterThanOrEqual(2);
  });

  it("adds a new specialty when typed and submitted", async () => {
    const user = userEvent.setup();
    renderPage("1");

    const editButton = await screen.findByRole("button", { name: /editar perfil/i });
    await user.click(editButton);

    const addInput = screen.getByPlaceholderText(/nueva especialidad/i);
    await user.type(addInput, "Node.js{enter}");

    expect(screen.getByText("Node.js")).toBeInTheDocument();
  });

  it("restores original specialties on Cancel after add/remove", async () => {
    const user = userEvent.setup();
    renderPage("1");

    const editButton = await screen.findByRole("button", { name: /editar perfil/i });
    await user.click(editButton);

    // Remove "React"
    const removeButtons = screen.getAllByRole("button", { name: /eliminar/i });
    await user.click(removeButtons[0]);

    // Add "Node.js"
    const addInput = screen.getByPlaceholderText(/nueva especialidad/i);
    await user.type(addInput, "Node.js{enter}");

    // Cancel
    const cancelButton = screen.getByRole("button", { name: /cancelar/i });
    await user.click(cancelButton);

    // Después de cancelar: modo read-only, React aparece en card + specialties section
    expect(screen.getAllByText("React").length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText("TypeScript").length).toBeGreaterThanOrEqual(2);
    expect(screen.queryByText("Node.js")).not.toBeInTheDocument();
  });

  it("shows add control when mentor has no specialties in edit mode", async () => {
    mockedGetById.mockResolvedValue({ ...ownerMentor, specialty: [] });

    const user = userEvent.setup();
    renderPage("1");

    const editButton = await screen.findByRole("button", { name: /editar perfil/i });
    await user.click(editButton);

    expect(screen.getByPlaceholderText(/nueva especialidad/i)).toBeInTheDocument();
  });
});

describe("MentorProfilePage — Save via updateProfile (R4)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetById.mockResolvedValue(ownerMentor);
    mockUpdateProfile.mockResolvedValue(ownerMentor);
    mockUseAuth.mockReturnValue({
      user: { id: "1", name: "Carlos Mendoza", role: "mentor" },
      isAuthenticated: true,
      isLoading: false,
    });
  });

  it("calls updateProfile with changed bio and exits edit mode on Save", async () => {
    const user = userEvent.setup();
    // Make the mock return the updated mentor data
    mockUpdateProfile.mockResolvedValue({
      ...ownerMentor,
      bio: "Updated bio text",
    });
    renderPage("1");

    // Enter edit mode
    const editButton = await screen.findByRole("button", { name: /editar perfil/i });
    await user.click(editButton);

    // Change bio
    const textarea = screen.getByRole("textbox", { name: /biografía/i });
    await user.clear(textarea);
    await user.type(textarea, "Updated bio text");

    // Click save
    const saveButton = screen.getByRole("button", { name: /guardar/i });
    await user.click(saveButton);

    expect(mockUpdateProfile).toHaveBeenCalledWith("1", {
      bio: "Updated bio text",
      specialty: ["React", "TypeScript"],
    });

    // Edit mode should exit and paragraph should show updated text
    await waitFor(() => {
      expect(screen.queryByRole("textbox", { name: /biografía/i })).not.toBeInTheDocument();
    });
    expect(screen.getByText("Updated bio text")).toBeInTheDocument();
  });

  it("calls updateProfile when specialties were changed", async () => {
    const user = userEvent.setup();
    renderPage("1");

    const editButton = await screen.findByRole("button", { name: /editar perfil/i });
    await user.click(editButton);

    // Remove "TypeScript"
    const removeButtons = screen.getAllByRole("button", { name: /eliminar/i });
    await user.click(removeButtons[1]);

    // Save
    const saveButton = screen.getByRole("button", { name: /guardar/i });
    await user.click(saveButton);

    expect(mockUpdateProfile).toHaveBeenCalledWith("1", {
      bio: ownerMentor.bio,
      specialty: ["React"],
    });
  });
});

describe("MentorProfilePage — Cancel Revert (R5)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetById.mockResolvedValue(ownerMentor);
    mockUseAuth.mockReturnValue({
      user: { id: "1", name: "Carlos Mendoza", role: "mentor" },
      isAuthenticated: true,
      isLoading: false,
    });
  });

  it("restores both bio and specialties on Cancel after edits", async () => {
    const user = userEvent.setup();
    renderPage("1");

    const editButton = await screen.findByRole("button", { name: /editar perfil/i });
    await user.click(editButton);

    // Change bio
    const textarea = screen.getByRole("textbox", { name: /biografía/i });
    await user.clear(textarea);
    await user.type(textarea, "Modified bio");

    // Remove the first specialty
    const removeButtons = screen.getAllByRole("button", { name: /eliminar/i });
    await user.click(removeButtons[0]);

    // Cancel
    const cancelButton = screen.getByRole("button", { name: /cancelar/i });
    await user.click(cancelButton);

    // Bio restored
    expect(screen.queryByText("Modified bio")).not.toBeInTheDocument();
    expect(screen.getByText(ownerMentor.bio)).toBeInTheDocument();

    // Specialties restored: aparecen en UserProfileCard + specialties section
    expect(screen.getAllByText("React").length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText("TypeScript").length).toBeGreaterThanOrEqual(2);
  });
});

describe("MentorProfilePage — Loading State (R6)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetById.mockResolvedValue(ownerMentor);
    // Return a promise that never resolves during test
    mockUpdateProfile.mockImplementation(
      () => new Promise(() => {}), // never resolves
    );
    mockUseAuth.mockReturnValue({
      user: { id: "1", name: "Carlos Mendoza", role: "mentor" },
      isAuthenticated: true,
      isLoading: false,
    });
  });

  it("disables Save and Cancel buttons while saving", async () => {
    const user = userEvent.setup();
    renderPage("1");

    const editButton = await screen.findByRole("button", { name: /editar perfil/i });
    await user.click(editButton);

    const saveButton = screen.getByRole("button", { name: /guardar/i });
    await user.click(saveButton);

    // Both buttons should be disabled
    expect(saveButton).toBeDisabled();
    expect(screen.getByRole("button", { name: /cancelar/i })).toBeDisabled();
  });
});

describe("MentorProfilePage — Error Handling (R7)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetById.mockResolvedValue(ownerMentor);
    mockUpdateProfile.mockRejectedValue(new Error("Network error"));
    mockUseAuth.mockReturnValue({
      user: { id: "1", name: "Carlos Mendoza", role: "mentor" },
      isAuthenticated: true,
      isLoading: false,
    });
  });

  it("shows inline error when save fails and stays in edit mode", async () => {
    const user = userEvent.setup();
    renderPage("1");

    const editButton = await screen.findByRole("button", { name: /editar perfil/i });
    await user.click(editButton);

    const saveButton = screen.getByRole("button", { name: /guardar/i });
    await user.click(saveButton);

    // Error should be visible
    expect(await screen.findByRole("alert")).toHaveTextContent(/error/i);

    // Should still be in edit mode — textarea visible, drafts intact
    expect(screen.getByRole("textbox", { name: /biografía/i })).toBeInTheDocument();
  });
});

describe("MentorProfilePage — Double-Save Guard (R8)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetById.mockResolvedValue(ownerMentor);
    // Return a promise that stays pending so we can test double-click
    mockUpdateProfile.mockImplementation(
      () => new Promise(() => {}),
    );
    mockUseAuth.mockReturnValue({
      user: { id: "1", name: "Carlos Mendoza", role: "mentor" },
      isAuthenticated: true,
      isLoading: false,
    });
  });

  it("ignores second Save click while first save is in-flight", async () => {
    const user = userEvent.setup();
    renderPage("1");

    const editButton = await screen.findByRole("button", { name: /editar perfil/i });
    await user.click(editButton);

    const saveButton = screen.getByRole("button", { name: /guardar/i });

    // Click save twice rapidly
    await user.click(saveButton);
    await user.click(saveButton);

    // updateProfile should only have been called once
    expect(mockUpdateProfile).toHaveBeenCalledTimes(1);
  });
});
