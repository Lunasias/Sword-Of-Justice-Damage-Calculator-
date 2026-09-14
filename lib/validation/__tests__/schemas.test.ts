import { describe, it, expect } from "vitest";
import {
  registerSchema,
  loginSchema,
  characterSchema,
} from "../schemas";

describe("Validation Schemas with Thai error messages", () => {
  it("should validate valid registration data", () => {
    const valid = {
      username: "master_sword",
      email: "player@example.com",
      password: "password123",
    };
    const result = registerSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("should reject invalid email with Thai error", () => {
    const invalid = {
      username: "master_sword",
      email: "not-an-email",
      password: "password123",
    };
    const result = registerSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("รูปแบบอีเมลไม่ถูกต้อง");
    }
  });

  it("should reject short password with Thai error", () => {
    const invalid = {
      username: "master_sword",
      email: "player@example.com",
      password: "123",
    };
    const result = registerSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร"
      );
    }
  });

  it("should validate character stats and reject negative numbers", () => {
    const invalidChar = {
      name: "ตัวละครทดสอบ",
      visibility: "PRIVATE",
      attack: -50,
      elementalAttack: 100,
      schoolCounter: 50,
      armorPenetration: 200,
      shieldBreak: 100,
      hit: 500,
      crit: 600,
      critDamage: 150,
    };
    const result = characterSchema.safeParse(invalidChar);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("ดาเมจรวมต้องไม่ต่ำกว่า 0");
    }
  });
});
