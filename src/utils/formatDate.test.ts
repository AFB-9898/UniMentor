import { describe, it, expect } from "vitest";
import { formatDate } from "./formatDate";

describe("formatDate", () => {
  it("formats a Date object correctly", () => {
    const date = new Date(2026, 4, 20); // May 20, 2026 (local tz)
    expect(formatDate(date)).toBe("20 de mayo de 2026");
  });

  it("formats a date string at noon to avoid timezone shift", () => {
    expect(formatDate("2026-05-20T12:00:00")).toBe("20 de mayo de 2026");
  });

  it("formats ISO date strings at noon", () => {
    expect(formatDate("2026-01-15T12:00:00Z")).toBe("15 de enero de 2026");
  });

  it("handles end of year", () => {
    expect(formatDate("2026-12-31T12:00:00")).toBe("31 de diciembre de 2026");
  });

  it("handles start of year", () => {
    expect(formatDate("2026-01-01T12:00:00")).toBe("1 de enero de 2026");
  });
});
