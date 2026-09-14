import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/guard";
import { prisma } from "@/lib/db/prisma";
import { characterSchema } from "@/lib/validation/schemas";

export async function GET() {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  try {
    const characters = await prisma.character.findMany({
      where: { userId: auth.user!.id },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ characters });
  } catch (error) {
    console.error("Get my characters error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูลตัวละคร" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  try {
    const body = await req.json();
    const parsed = characterSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "ข้อมูลตัวละครไม่ถูกต้อง";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const character = await prisma.character.create({
      data: {
        userId: auth.user!.id,
        ...parsed.data,
      },
    });

    return NextResponse.json(
      { message: "สร้างตัวละครสำเร็จ", character },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create character error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการบันทึกตัวละคร" },
      { status: 500 }
    );
  }
}
