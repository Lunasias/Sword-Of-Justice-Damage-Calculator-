import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guard";
import { prisma } from "@/lib/db/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    const character = await prisma.character.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    if (!character) {
      return NextResponse.json(
        { error: "ไม่พบข้อมูลตัวละครนี้" },
        { status: 404 }
      );
    }

    return NextResponse.json({ character });
  } catch (error) {
    console.error("Admin get character error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูลตัวละคร" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    await prisma.character.delete({
      where: { id },
    });

    return NextResponse.json({ message: "ลบตัวละครเรียบร้อยแล้วโดยผู้ดูแลระบบ" });
  } catch (error) {
    console.error("Admin delete character error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการลบตัวละคร" },
      { status: 500 }
    );
  }
}
