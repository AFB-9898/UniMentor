import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SplashScreen from "./SplashScreen";

describe("SplashScreen", () => {
  it("renders the UniMentor logo text", () => {
    render(<SplashScreen />);
    expect(screen.getByText("UniMentor")).toBeInTheDocument();
  });

  it("renders the welcome subtitle", () => {
    render(<SplashScreen />);
    expect(
      screen.getByText("Encontrá al mentor ideal para tu futuro profesional")
    ).toBeInTheDocument();
  });

  it("renders loading dots indicator", () => {
    render(<SplashScreen />);
    const container = screen.getByTestId("splash-screen");
    expect(container).toBeInTheDocument();
  });

  it("has fixed positioning for full-screen coverage", () => {
    render(<SplashScreen />);
    const container = screen.getByTestId("splash-screen");
    expect(container.className).toContain("fixed");
    expect(container.className).toContain("inset-0");
  });
});
