import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "../password";

describe("Authentication password helpers", () => {
  it("should hash and verify passwords correctly", async () => {
    const raw = "SuperSecret123!";
    const hashed = await hashPassword(raw);

    expect(hashed).not.toBe(raw);
    const isCorrect = await verifyPassword(raw, hashed);
    expect(isCorrect).toBe(true);

    const isWrong = await verifyPassword("WrongPassword", hashed);
    expect(isWrong).toBe(false);
  });
});
