"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { InputField } from "@/components/ui/InputField";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { Calculator, LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const { showToast } = useToast();

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!emailOrUsername.trim() || !password) {
      setError("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrUsername, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "เข้าสู่ระบบไม่สำเร็จ");
      }

      showToast("เข้าสู่ระบบสำเร็จ ยินดีต้อนรับ!", "success");
      await refreshUser();
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
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
            เข้าสู่ระบบ
          </h1>
          <p className="mt-2 text-xs font-ui text-neu-muted sm:text-sm">
            เข้าใช้งานเพื่อบันทึกบิลด์และจัดการตัวละครของคุณ
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
              label="ชื่อผู้ใช้ หรือ อีเมล"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              placeholder="username หรือ email@example.com"
              required
            />

            <InputField
              label="รหัสผ่าน"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              <LogIn size={15} />
              เข้าสู่ระบบ
            </Button>
          </form>

          <div className="mt-8 text-center text-xs font-ui text-neu-muted">
            <div className="mb-6 h-px bg-neu-shadow-dark/40 shadow-[0_1px_0_rgb(255_255_255/0.6)]" />
            ยังไม่มีบัญชีผู้ใช้?{" "}
            <Link
              href="/register"
              className="rounded-md font-semibold text-neu-accent transition-colors duration-300 hover:text-neu-accent-light focus-neu"
            >
              สมัครสมาชิกที่นี่
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
