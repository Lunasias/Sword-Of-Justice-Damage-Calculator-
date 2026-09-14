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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="inline-flex p-3 rounded-card bg-graphite border border-steel/60 text-iris mb-4">
            <Calculator size={28} />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-light text-pure">
            เข้าสู่ระบบ
          </h1>
          <p className="text-xs sm:text-sm font-ui text-ash mt-1">
            เข้าใช้งานเพื่อบันทึกบิลด์และจัดการตัวละครของคุณ
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
              className="w-full mt-2"
              isLoading={isLoading}
            >
              <LogIn size={15} className="mr-1.5" />
              เข้าสู่ระบบ
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-steel/30 text-center text-xs font-ui text-ash">
            ยังไม่มีบัญชีผู้ใช้?{" "}
            <Link href="/register" className="text-iris hover:underline font-medium">
              สมัครสมาชิกที่นี่
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
