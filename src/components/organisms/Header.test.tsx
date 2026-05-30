import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../../hooks/AuthContext";
import { ThemeProvider } from "../../theme/ThemeProvider";
import Header from "./Header";

// Mock localStorage for jsdom
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: () => ({
    matches: false,
    media: "",
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <ThemeProvider>
      <AuthProvider>
        <MemoryRouter>{ui}</MemoryRouter>
      </AuthProvider>
    </ThemeProvider>,
  );
}

describe("Header", () => {
  it("renders the UniMentor logo", async () => {
    renderWithProviders(<Header />);

    expect(await screen.findByText("UniMentor")).toBeInTheDocument();
  });

  it("renders nav links: Inicio and Mentores", async () => {
    renderWithProviders(<Header />);

    expect(
      await screen.findByRole("link", { name: /^inicio$/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /^mentores$/i }),
    ).toBeInTheDocument();
  });

  it("renders ThemeToggle component", async () => {
    renderWithProviders(<Header />);

    expect(
      await screen.findByRole("button", { name: /activar modo/i }),
    ).toBeInTheDocument();
  });

  it("renders Iniciar sesión link and Registrarse button when not authenticated", async () => {
    renderWithProviders(<Header />);

    expect(
      await screen.findByRole("link", { name: /iniciar sesión/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /registrarse/i }),
    ).toBeInTheDocument();
  });

  it("applies custom className when provided", async () => {
    const { container } = renderWithProviders(<Header className="test-class" />);

    await screen.findByText("UniMentor");
    const header = container.querySelector("header");
    expect(header?.className).toContain("test-class");
  });
});
