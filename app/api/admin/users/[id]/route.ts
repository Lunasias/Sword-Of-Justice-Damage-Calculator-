import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guard";
import { prisma } from "@/lib/db/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    const body = await req.json();

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "ไม่พบผู้ใช้นี้ในระบบ" },
        { status: 404 }
      );
    }

    // Prevent self-demotion or self-suspension if you are the current admin
    if (user.id === auth.user!.id && (body.role === "USER" || body.isSuspended === true)) {
      return NextResponse.json(
        { error: "ไม่สามารถระงับหรือลดระดับบัญชีของตนเองได้" },
        { status: 400 }
      );
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(typeof body.isSuspended === "boolean" ? { isSuspended: body.isSuspended } : {}),
        ...(body.role && ["USER", "ADMIN"].includes(body.role) ? { role: body.role } : {}),
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isSuspended: true,
      },
    });

    return NextResponse.json({
      message: "อัปเดตสถานะผู้ใช้เรียบร้อยแล้ว",
      user: updated,
    });
  } catch (error) {
    console.error("Admin update user error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการอัปเดตผู้ใช้" },
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

    if (id === auth.user!.id) {
      return NextResponse.json(
        { error: "ไม่สามารถลบบัญชีผู้ดูแลของตนเองได้" },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: "ลบผู้ใช้และข้อมูลทั้งหมดเรียบร้อยแล้ว" });
  } catch (error) {
    console.error("Admin delete user error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการลบผู้ใช้" },
      { status: 500 }
    );
  }
}
