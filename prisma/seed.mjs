import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const adminPasswordHash = await bcrypt.hash("admin123456", 10);
  const userPasswordHash = await bcrypt.hash("user123456", 10);

  // 1. Create Admin User
  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      email: "admin@justicedamage.com",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      bio: "ผู้ดูแลระบบหลักของแพลตฟอร์มคำนวณดาเมจ 逆水寒手游",
    },
  });

  // 2. Create Sample Player User
  const sampleUser = await prisma.user.upsert({
    where: { username: "swordmaster" },
    update: {},
    create: {
      username: "swordmaster",
      email: "swordmaster@example.com",
      passwordHash: userPasswordHash,
      role: "USER",
      bio: "ผู้เล่นสายทดสอบดาเมจและวิเคราะห์บิลด์ตัวละคร",
    },
  });

  // 3. Create Section 43 Baseline Public Character
  await prisma.character.create({
    data: {
      userId: sampleUser.id,
      name: "บิลด์มาตรฐาน (ค้นหาความพ่ายแพ้)",
      description: "บิลด์ทดสอบมาตรฐานตามคู่มือคำนวณดาเมจ เน้นเจาะเกราะและคริติคอลสูง",
      visibility: "PUBLIC",
      attack: 8185,
      elementalAttack: 2073,
      schoolCounter: 721,
      armorPenetration: 3150,
      shieldBreak: 1425,
      hit: 1232,
      crit: 1686,
      critDamage: 182.6,
    },
  });

  // 4. Create Another Sample Character
  await prisma.character.create({
    data: {
      userId: admin.id,
      name: "บิลด์ธาตุล้วน (โจมตีธาตุทั้งหมด)",
      description: "บิลด์เน้นค่าโจมตีธาตุทั้งหมดสูงเป็นพิเศษ เหมาะสำหรับสู้บอสที่มีต้านทานธาตุต่ำ",
      visibility: "PUBLIC",
      attack: 7500,
      elementalAttack: 3400,
      schoolCounter: 600,
      armorPenetration: 2800,
      shieldBreak: 1200,
      hit: 1350,
      crit: 1400,
      critDamage: 165.0,
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
