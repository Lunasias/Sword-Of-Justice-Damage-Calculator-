import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/guard";
import { prisma } from "@/lib/db/prisma";
import { updateProfileSchema } from "@/lib/validation/schemas";
import { verifyPassword, hashPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  try {
    const body = await req.json();
    const parsed = updateProfileSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "ข้อมูลไม่ถูกต้อง";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { username, bio, avatarUrl, currentPassword, newPassword } = parsed.data;

    // Check if user exists
    const currentUser = await prisma.user.findUnique({
      where: { id: auth.user!.id },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: "ไม่พบข้อมูลผู้ใช้" },
        { status: 404 }
      );
    }

    const updateData: {
      username?: string;
      bio?: string;
      avatarUrl?: string;
      passwordHash?: string;
    } = {};

    if (username && username !== currentUser.username) {
      // Check username collision
      const existing = await prisma.user.findUnique({
        where: { username },
      });
      if (existing && existing.id !== currentUser.id) {
        return NextResponse.json(
          { error: "ชื่อผู้ใช้นี้ถูกใช้งานแล้ว" },
          { status: 400 }
        );
      }
      updateData.username = username;
    }

    if (bio !== undefined) {
      updateData.bio = bio;
    }

    if (avatarUrl !== undefined) {
      updateData.avatarUrl = avatarUrl;
    }

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "กรุณาระบุรหัสผ่านปัจจุบันเพื่อเปลี่ยนรหัสผ่าน" },
          { status: 400 }
        );
      }
      const isMatch = await verifyPassword(currentPassword, currentUser.passwordHash);
      if (!isMatch) {
        return NextResponse.json(
          { error: "รหัสผ่านปัจจุบันไม่ถูกต้อง" },
          { status: 400 }
        );
      }
      updateData.passwordHash = await hashPassword(newPassword);
    }

    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        avatarUrl: true,
        bio: true,
      },
    });

    if (updateData.username) {
      await createSession({
        userId: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
      });
    }

    return NextResponse.json({
      message: "บันทึกข้อมูลโปรไฟล์เรียบร้อยแล้ว",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์" },
      { status: 500 }
    );
  }
}
