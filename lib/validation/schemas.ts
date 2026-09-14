import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, { message: "ชื่อผู้ใช้ต้องมีความยาวอย่างน้อย 3 ตัวอักษร" })
    .max(30, { message: "ชื่อผู้ใช้ต้องมีความยาวไม่เกิน 30 ตัวอักษร" })
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message: "ชื่อผู้ใช้สามารถใช้ได้เฉพาะตัวอักษรภาษาอังกฤษ ตัวเลข ขีดล่าง และขีดกลางเท่านั้น",
    }),
  email: z
    .string()
    .email({ message: "รูปแบบอีเมลไม่ถูกต้อง" }),
  password: z
    .string()
    .min(6, { message: "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร" })
    .max(100, { message: "รหัสผ่านยาวเกินไป" }),
});

export const loginSchema = z.object({
  emailOrUsername: z
    .string()
    .min(1, { message: "กรุณากรอกชื่อผู้ใช้หรืออีเมล" }),
  password: z
    .string()
    .min(1, { message: "กรุณากรอกรหัสผ่าน" }),
});

export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(3, { message: "ชื่อผู้ใช้ต้องมีความยาวอย่างน้อย 3 ตัวอักษร" })
    .max(30, { message: "ชื่อผู้ใช้ต้องมีความยาวไม่เกิน 30 ตัวอักษร" })
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message: "ชื่อผู้ใช้สามารถใช้ได้เฉพาะตัวอักษรภาษาอังกฤษ ตัวเลข ขีดล่าง และขีดกลางเท่านั้น",
    })
    .optional(),
  bio: z
    .string()
    .max(300, { message: "คำแนะนำตัวต้องมีความยาวไม่เกิน 300 ตัวอักษร" })
    .optional(),
  avatarUrl: z
    .string()
    .url({ message: "URL รูปโปรไฟล์ไม่ถูกต้อง" })
    .or(z.literal(""))
    .optional(),
  currentPassword: z.string().optional(),
  newPassword: z
    .string()
    .min(6, { message: "รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร" })
    .optional(),
});

export const characterSchema = z.object({
  name: z
    .string()
    .min(1, { message: "กรุณากรอกชื่อตัวละคร" })
    .max(50, { message: "ชื่อตัวละครต้องมีความยาวไม่เกิน 50 ตัวอักษร" }),
  description: z
    .string()
    .max(500, { message: "คำอธิบายต้องมีความยาวไม่เกิน 500 ตัวอักษร" })
    .optional(),
  visibility: z.enum(["PUBLIC", "PRIVATE"], {
    errorMap: () => ({ message: "กรุณาเลือกสถานะการเผยแพร่ที่ถูกต้อง" }),
  }),
  attack: z.coerce
    .number({ invalid_type_error: "กรุณากรอกตัวเลข" })
    .min(0, { message: "ดาเมจรวมต้องไม่ต่ำกว่า 0" }),
  elementalAttack: z.coerce
    .number({ invalid_type_error: "กรุณากรอกตัวเลข" })
    .min(0, { message: "โจมตีธาตุทั้งหมดต้องไม่ต่ำกว่า 0" }),
  schoolCounter: z.coerce
    .number({ invalid_type_error: "กรุณากรอกตัวเลข" })
    .min(0, { message: "ข่มสำนักต้องไม่ต่ำกว่า 0" }),
  armorPenetration: z.coerce
    .number({ invalid_type_error: "กรุณากรอกตัวเลข" })
    .min(0, { message: "เจาะเกราะต้องไม่ต่ำกว่า 0" }),
  shieldBreak: z.coerce
    .number({ invalid_type_error: "กรุณากรอกตัวเลข" })
    .min(0, { message: "ทำลายโล่ต้องไม่ต่ำกว่า 0" }),
  hit: z.coerce
    .number({ invalid_type_error: "กรุณากรอกตัวเลข" })
    .min(0, { message: "ความแม่นยำต้องไม่ต่ำกว่า 0" }),
  crit: z.coerce
    .number({ invalid_type_error: "กรุณากรอกตัวเลข" })
    .min(0, { message: "คริติคอลต้องไม่ต่ำกว่า 0" }),
  critDamage: z.coerce
    .number({ invalid_type_error: "กรุณากรอกตัวเลข" })
    .min(100, { message: "ดาเมจคริติคอลต้องไม่ต่ำกว่า 100%" })
    .max(500, { message: "ดาเมจคริติคอลต้องไม่เกิน 500%" }),
});

export const skillInputSchema = z.object({
  name: z.string().min(1, { message: "กรุณาระบุชื่อสกิล" }),
  level: z.coerce
    .number()
    .min(1, { message: "ระดับสกิลต้องมีค่าอย่างน้อย 1" })
    .max(100, { message: "ระดับสกิลต้องไม่เกิน 100" }),
  multiplier: z.coerce
    .number()
    .min(1, { message: "ตัวคูณสกิลต้องมีค่าอย่างน้อย 1%" })
    .max(10000, { message: "ตัวคูณสกิลสูงเกินไป" }),
  type: z.string().optional(),
  element: z.string().optional(),
});

export const enemyInputSchema = z.object({
  defense: z.coerce.number().min(0, { message: "ป้องกันต้องไม่ต่ำกว่า 0" }),
  qiShield: z.coerce.number().min(0, { message: "โล่พลังชี่ต้องไม่ต่ำกว่า 0" }),
  schoolDefense: z.coerce.number().min(0, { message: "ป้องกันสำนักต้องไม่ต่ำกว่า 0" }),
  elementalResistance: z.coerce.number().min(0, { message: "ต้านทานธาตุต้องไม่ต่ำกว่า 0" }),
  block: z.coerce.number().min(0, { message: "บล็อกต้องไม่ต่ำกว่า 0" }),
  critResistance: z.coerce.number().min(0, { message: "ต้านทานคริติคอลต้องไม่ต่ำกว่า 0" }),
});
