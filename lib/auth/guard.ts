import { NextResponse } from "next/server";
import { getSession } from "./session";
import { prisma } from "../db/prisma";

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    return {
      error: NextResponse.json(
        { error: "กรุณาเข้าสู่ระบบเพื่อดำเนินการ" },
        { status: 401 }
      ),
      session: null,
      user: null,
    };
  }

  // Double check user status in database
  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isSuspended: true,
      },
    });

    if (!user || user.isSuspended) {
      return {
        error: NextResponse.json(
          { error: "บัญชีของคุณถูกระงับหรือไม่มีอยู่ในระบบ" },
          { status: 403 }
        ),
        session: null,
        user: null,
      };
    }

    return { error: null, session, user };
  } catch (err) {
    console.error("Auth verification error:", err);
    return {
      error: NextResponse.json(
        { error: "เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์" },
        { status: 500 }
      ),
      session: null,
      user: null,
    };
  }
}

export async function requireAdmin() {
  const auth = await requireAuth();
  if (auth.error) return auth;

  if (auth.user?.role !== "ADMIN") {
    return {
      error: NextResponse.json(
        { error: "ไม่มีสิทธิ์เข้าถึงส่วนผู้ดูแลระบบ" },
        { status: 403 }
      ),
      session: null,
      user: null,
    };
  }

  return auth;
}
