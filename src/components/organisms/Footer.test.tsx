import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Footer from "./Footer";

describe("Footer", () => {
  it("renders the brand name", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );

    expect(screen.getByText("UniMentor")).toBeInTheDocument();
  });

  it("renders vision and mission sections", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );

    expect(screen.getByText("Nuestra Visión")).toBeInTheDocument();
    expect(screen.getByText("Nuestra Misión")).toBeInTheDocument();
  });

  it("renders location: UPDS Tarija", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Universidad Privada Domingo Savio/)).toBeInTheDocument();
    expect(screen.getByText(/Tarija, Bolivia/)).toBeInTheDocument();
  });

  it("renders copyright with UPDS Tarija", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );

    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${currentYear} UniMentor`))).toBeInTheDocument();
    expect(screen.getByText(/UPDS Tarija/)).toBeInTheDocument();
  });

  it("renders nav links with correct hrefs", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );

    // Inicio appears twice (brand logo + nav), so use getAllByRole
    const inicioLinks = screen.getAllByRole("link", { name: /inicio/i });
    expect(inicioLinks.length).toBeGreaterThanOrEqual(1);
    expect(inicioLinks[0]).toHaveAttribute("href", "/");

    const mentoresLinks = screen.getAllByRole("link", { name: /mentores/i });
    expect(mentoresLinks.length).toBeGreaterThanOrEqual(1);
    expect(mentoresLinks[0]).toHaveAttribute("href", "/mentors");
  });

  it("renders a description paragraph", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );

    expect(
      screen.getByText(/conectamos estudiantes universitarios/i),
    ).toBeInTheDocument();
  });
});
