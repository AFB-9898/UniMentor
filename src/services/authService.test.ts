import { describe, it, expect } from "vitest";

describe("authService", () => {
  it("logs in with valid credentials", async () => {
    const { mockAuthService } = await import("./authService");
    const result = await mockAuthService.login({
      email: "student@test.com",
      password: "123456",
    });
    expect(result.user).toMatchObject({
      email: "student@test.com",
      role: "student",
    });
    expect(result.token).toBeTruthy();
  });

  it("logs in with mentor credentials", async () => {
    const { mockAuthService } = await import("./authService");
    const result = await mockAuthService.login({
      email: "carlos@ejemplo.com",
      password: "123456",
    });
    expect(result.user).toMatchObject({
      email: "carlos@ejemplo.com",
      role: "mentor",
    });
  });

  it("rejects invalid credentials", async () => {
    const { mockAuthService } = await import("./authService");
    await expect(
      mockAuthService.login({ email: "wrong@test.com", password: "wrong" }),
    ).rejects.toThrow("Credenciales inválidas");
  });

  it("registers a new student user", async () => {
    const { mockAuthService } = await import("./authService");
    const result = await mockAuthService.register({
      name: "Nuevo Estudiante",
      email: "nuevo@test.com",
      password: "abcdef",
      role: "student",
      university: "UNSA",
      career: "Ing. Software",
    });
    expect(result.user).toMatchObject({
      name: "Nuevo Estudiante",
      email: "nuevo@test.com",
      role: "student",
    });
    expect(result.token).toBeTruthy();
  });

  it("rejects registration with existing email", async () => {
    const { mockAuthService } = await import("./authService");
    await expect(
      mockAuthService.register({
        name: "Duplicado",
        email: "student@test.com",
        password: "abcdef",
        role: "student",
        university: "UNSA",
        career: "Ing. Software",
      }),
    ).rejects.toThrow("El email ya está registrado");
  });

  it("logs out and clears current user", async () => {
    const { mockAuthService } = await import("./authService");
    await mockAuthService.login({
      email: "student@test.com",
      password: "123456",
    });
    await mockAuthService.logout();
    const user = await mockAuthService.getCurrentUser();
    expect(user).toBeNull();
  });

  it("returns null for getCurrentUser when not logged in", async () => {
    const { mockAuthService } = await import("./authService");
    // Asegurarse de que no haya sesión activa después del test anterior
    await mockAuthService.logout();
    const user = await mockAuthService.getCurrentUser();
    expect(user).toBeNull();
  });
});
