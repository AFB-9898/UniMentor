import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../../hooks/AuthContext";
import { ThemeProvider } from "../../theme/ThemeProvider";
import Footer from "./Footer";

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

describe("Footer", () => {
  it("renders the brand name", () => {
    renderWithProviders(<Footer />);

    expect(screen.getByText("UniMentor")).toBeInTheDocument();
  });

  it("renders vision and mission sections", () => {
    renderWithProviders(<Footer />);

    expect(screen.getByText("Nuestra Visión")).toBeInTheDocument();
    expect(screen.getByText("Nuestra Misión")).toBeInTheDocument();
  });

  it("renders location: UPDS Tarija", () => {
    renderWithProviders(<Footer />);

    expect(screen.getByText(/Universidad Privada Domingo Savio/)).toBeInTheDocument();
    expect(screen.getByText(/Tarija, Bolivia/)).toBeInTheDocument();
  });

  it("renders copyright with UPDS Tarija", () => {
    renderWithProviders(<Footer />);

    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${currentYear} UniMentor`))).toBeInTheDocument();
    expect(screen.getByText(/UPDS Tarija/)).toBeInTheDocument();
  });

  it("renders nav links with correct hrefs", () => {
    renderWithProviders(<Footer />);

    // Inicio appears twice (brand logo + nav), so use getAllByRole
    const inicioLinks = screen.getAllByRole("link", { name: /inicio/i });
    expect(inicioLinks.length).toBeGreaterThanOrEqual(1);
    // By default (not logged in), Inicio links go to "/"
    expect(inicioLinks[0]).toHaveAttribute("href", "/");

    const mentoresLinks = screen.getAllByRole("link", { name: /mentores/i });
    expect(mentoresLinks.length).toBeGreaterThanOrEqual(1);
    expect(mentoresLinks[0]).toHaveAttribute("href", "/mentors");
  });

  it("renders a description paragraph", () => {
    renderWithProviders(<Footer />);

    expect(
      screen.getByText(/conectamos estudiantes universitarios/i),
    ).toBeInTheDocument();
  });
});
