import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import RatingStars from "./RatingStars";

describe("RatingStars", () => {
  it("renders the container with rating label", () => {
    render(<RatingStars value={3} />);
    const group = screen.getByRole("img");
    expect(group).toHaveAttribute("aria-label", "3 de 5 estrellas");
  });

  it("renders correct number of filled stars", () => {
    const { container } = render(<RatingStars value={4} />);
    const filled = container.querySelectorAll(".text-amber-400");
    expect(filled).toHaveLength(4);
  });

  it("renders empty stars for remaining", () => {
    const { container } = render(<RatingStars value={2} />);
    const empty = container.querySelectorAll(".text-gray-300");
    expect(empty).toHaveLength(3);
  });

  it("calls onChange when interactive star is clicked", () => {
    const handleChange = vi.fn();
    render(<RatingStars value={0} interactive onChange={handleChange} />);

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(5);
    fireEvent.click(buttons[0]);

    expect(handleChange).toHaveBeenCalledWith(1);
  });

  it("does NOT render buttons when not interactive", () => {
    render(<RatingStars value={3} />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("does NOT call onChange when not interactive", () => {
    const handleChange = vi.fn();
    render(<RatingStars value={3} onChange={handleChange} />);

    const group = screen.getByRole("img");
    fireEvent.click(group);

    expect(handleChange).not.toHaveBeenCalled();
  });

  it("applies cursor-pointer when interactive", () => {
    const { container } = render(<RatingStars value={3} interactive />);
    const spans = container.querySelectorAll(".cursor-pointer");
    expect(spans.length).toBeGreaterThan(0);
  });

  it("renders with different sizes", () => {
    const { container: sm } = render(<RatingStars value={3} size="sm" />);
    expect(sm.querySelector(".text-lg")).toBeTruthy();

    const { container: lg } = render(<RatingStars value={3} size="lg" />);
    expect(lg.querySelector(".text-4xl")).toBeTruthy();
  });
});
