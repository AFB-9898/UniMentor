import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../../hooks/AuthContext";
import { ThemeProvider } from "../../theme/ThemeProvider";
import AppLayout from "./AppLayout";

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

function renderWithRouter(initialRoute: string) {
  return render(
    <ThemeProvider>
      <AuthProvider>
        <MemoryRouter initialEntries={[initialRoute]}>
          <Routes>
            <Route element={<AppLayout />}>
              <Route
                path="/"
                element={<main>Home page content</main>}
              />
              <Route
                path="/test"
                element={<main>Test page content</main>}
              />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    </ThemeProvider>,
  );
}

describe("AppLayout", () => {
  it("renders the Header with navigation", async () => {
    renderWithRouter("/");

    const inicioLinks = await screen.findAllByText("Inicio");
    expect(inicioLinks.length).toBeGreaterThanOrEqual(1);
  });

  it("renders the Footer with copyright", async () => {
    renderWithRouter("/");

    expect(await screen.findByText(/© 2026/)).toBeInTheDocument();
  });

  it("renders child route content via Outlet", async () => {
    renderWithRouter("/");

    expect(await screen.findByText("Home page content")).toBeInTheDocument();
  });

  it("renders different child route content", async () => {
    renderWithRouter("/test");

    expect(await screen.findByText("Test page content")).toBeInTheDocument();
  });
});
