import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guard";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const [userCount, totalCharacters, publicCharacters, privateCharacters] =
      await Promise.all([
        prisma.user.count(),
        prisma.character.count(),
        prisma.character.count({ where: { visibility: "PUBLIC" } }),
        prisma.character.count({ where: { visibility: "PRIVATE" } }),
      ]);

    return NextResponse.json({
      stats: {
        userCount,
        totalCharacters,
        publicCharacters,
        privateCharacters,
      },
    });
  } catch (error) {
    console.error("Admin get stats error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงสถิติระบบ" },
      { status: 500 }
    );
  }
}
