import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Hero from "./Hero";

describe("Hero", () => {
  it("renders the main heading", () => {
    render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>,
    );

    expect(
      screen.getByText("Encontrá al mentor ideal para tu futuro profesional"),
    ).toBeInTheDocument();
  });

  it("renders the subheading text", () => {
    render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>,
    );

    expect(
      screen.getByText(
        "Conectá con profesionales experimentados que te guiarán en tu carrera universitaria",
      ),
    ).toBeInTheDocument();
  });

  it("renders a CTA button that links to /mentors", () => {
    render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>,
    );

    const cta = screen.getByRole("link", { name: /explorar mentores/i });
    expect(cta).toBeInTheDocument();
    expect(cta).toHaveAttribute("href", "/mentors");
  });
});
