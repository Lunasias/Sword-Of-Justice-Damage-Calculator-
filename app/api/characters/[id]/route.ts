import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { requireAuth } from "@/lib/auth/guard";
import { prisma } from "@/lib/db/prisma";
import { characterSchema } from "@/lib/validation/schemas";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();

    const character = await prisma.character.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
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

    // Authorization check
    if (character.visibility === "PRIVATE") {
      if (!session || (session.userId !== character.userId && session.role !== "ADMIN")) {
        return NextResponse.json(
          { error: "ตัวละครนี้ถูกตั้งค่าเป็นส่วนตัว" },
          { status: 403 }
        );
      }
    }

    return NextResponse.json({ character });
  } catch (error) {
    console.error("Get character error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการโหลดตัวละคร" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    const character = await prisma.character.findUnique({
      where: { id },
    });

    if (!character) {
      return NextResponse.json(
        { error: "ไม่พบข้อมูลตัวละครนี้" },
        { status: 404 }
      );
    }

    // Ownership check
    if (character.userId !== auth.user!.id && auth.user!.role !== "ADMIN") {
      return NextResponse.json(
        { error: "คุณไม่มีสิทธิ์แก้ไขตัวละครนี้" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = characterSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "ข้อมูลตัวละครไม่ถูกต้อง";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const updatedCharacter = await prisma.character.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({
      message: "บันทึกการเปลี่ยนแปลงสำเร็จ",
      character: updatedCharacter,
    });
  } catch (error) {
    console.error("Update character error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการบันทึกตัวละคร" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    const character = await prisma.character.findUnique({
      where: { id },
    });

    if (!character) {
      return NextResponse.json(
        { error: "ไม่พบข้อมูลตัวละครนี้" },
        { status: 404 }
      );
    }

    // Ownership check
    if (character.userId !== auth.user!.id && auth.user!.role !== "ADMIN") {
      return NextResponse.json(
        { error: "คุณไม่มีสิทธิ์ลบตัวละครนี้" },
        { status: 403 }
      );
    }

    await prisma.character.delete({
      where: { id },
    });

    return NextResponse.json({ message: "ลบตัวละครเรียบร้อยแล้ว" });
  } catch (error) {
    console.error("Delete character error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการลบตัวละคร" },
      { status: 500 }
    );
  }
}
