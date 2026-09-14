"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { InputField } from "@/components/ui/InputField";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { Calculator, UserPlus } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const { showToast } = useToast();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !email.trim() || !password) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    if (password.length < 6) {
      setError("รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
      return;
    }

    if (password !== confirmPassword) {
      setError("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "สมัครสมาชิกไม่สำเร็จ");
      }

      showToast("สมัครสมาชิกและเข้าสู่ระบบสำเร็จ ยินดีต้อนรับ!", "success");
      await refreshUser();
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-[28px] bg-neu-base text-neu-accent shadow-neu-inset-deep">
            <Calculator size={30} />
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-neu-fg sm:text-3xl">
            สมัครสมาชิก
          </h1>
          <p className="mt-2 text-xs font-ui text-neu-muted sm:text-sm">
            สร้างบัญชีเพื่อบันทึกบิลด์ตัวละครและวิเคราะห์ค่าพลัง
          </p>
        </div>

        <div className="rounded-card bg-neu-base p-6 shadow-neu-extruded sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-well bg-neu-base p-4 text-xs font-ui text-neu-danger shadow-neu-inset-sm">
                {error}
              </div>
            )}

            <InputField
              label="ชื่อผู้ใช้"
              tooltip="ภาษาอังกฤษและตัวเลข 3-30 ตัวอักษร"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="เช่น shadow_blade"
              required
            />

            <InputField
              label="อีเมล"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />

            <InputField
              label="รหัสผ่าน"
              type="password"
              tooltip="ความยาวอย่างน้อย 6 ตัวอักษร"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <InputField
              label="ยืนยันรหัสผ่าน"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="mt-2 w-full"
              isLoading={isLoading}
            >
              <UserPlus size={15} />
              สร้างบัญชีใหม่
            </Button>
          </form>

          <div className="mt-8 text-center text-xs font-ui text-neu-muted">
            <div className="mb-6 h-px bg-neu-shadow-dark/40 shadow-[0_1px_0_rgb(255_255_255/0.6)]" />
            มีบัญชีผู้ใช้อยู่แล้ว?{" "}
            <Link
              href="/login"
              className="rounded-md font-semibold text-neu-accent transition-colors duration-300 hover:text-neu-accent-light focus-neu"
            >
              เข้าสู่ระบบที่นี่
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
