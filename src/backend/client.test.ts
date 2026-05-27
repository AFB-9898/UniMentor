import { describe, it, expect } from "vitest";
import { insforge } from "./client";

describe("InsForge client", () => {
  it("exports an insforge object with expected modules", () => {
    expect(insforge).toBeDefined();
    expect(insforge.auth).toBeDefined();
    expect(insforge.database).toBeDefined();
    expect(insforge.storage).toBeDefined();
  });
});
