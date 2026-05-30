import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "../../theme/ThemeProvider";
import ThemeToggle from "./ThemeToggle";

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

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it("renders the toggle button", () => {
    renderWithTheme(<ThemeToggle />);

    expect(
      screen.getByRole("button", { name: /activar modo/i }),
    ).toBeInTheDocument();
  });

  it("applies custom className when provided", () => {
    renderWithTheme(<ThemeToggle className="custom-class" />);

    const button = screen.getByRole("button", { name: /activar modo/i });
    expect(button.className).toContain("custom-class");
  });

  it("renders without className without error", () => {
    renderWithTheme(<ThemeToggle />);

    const button = screen.getByRole("button", { name: /activar modo/i });
    expect(button).toBeInTheDocument();
  });
});
