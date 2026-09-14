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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="inline-flex p-3 rounded-card bg-graphite border border-steel/60 text-iris mb-4">
            <Calculator size={28} />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-light text-pure">
            สมัครสมาชิก
          </h1>
          <p className="text-xs sm:text-sm font-ui text-ash mt-1">
            สร้างบัญชีเพื่อบันทึกบิลด์ตัวละครและวิเคราะห์ค่าพลัง
          </p>
        </div>

        <div className="rounded-card bg-graphite/30 border border-steel/50 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-input bg-red-950/30 border border-red-500/30 text-red-400 text-xs font-ui">
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
              className="w-full mt-2"
              isLoading={isLoading}
            >
              <UserPlus size={15} className="mr-1.5" />
              สร้างบัญชีใหม่
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-steel/30 text-center text-xs font-ui text-ash">
            มีบัญชีผู้ใช้อยู่แล้ว?{" "}
            <Link href="/login" className="text-iris hover:underline font-medium">
              เข้าสู่ระบบที่นี่
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
