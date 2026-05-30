import { describe, it, expect } from "vitest";

describe("getUserName", () => {
  it("returns mapped name for known student ID", async () => {
    const { getUserName } = await import("./userService.mock");
    expect(getUserName("student-1")).toBe("Ana López");
  });

  it("returns mapped name for known mentor ID", async () => {
    const { getUserName } = await import("./userService.mock");
    expect(getUserName("1")).toBe("Carlos Mendoza");
  });

  it("returns mapped name for mock auth ID", async () => {
    const { getUserName } = await import("./userService.mock");
    expect(getUserName("s1")).toBe("Abraham Estudiante");
  });

  it("returns fallback for unknown ID", async () => {
    const { getUserName } = await import("./userService.mock");
    expect(getUserName("unknown-99")).toBe("Usuario desconocido");
  });
});
