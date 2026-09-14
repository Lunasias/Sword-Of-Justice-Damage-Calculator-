"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { InputField } from "@/components/ui/InputField";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { LoadingState, EmptyState } from "@/components/ui/States";
import { User, KeyRound, Shield } from "lucide-react";

export default function ProfilePage() {
  const { user, isLoading: authLoading, refreshUser } = useAuth();
  const { showToast } = useToast();

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setBio(user.bio || "");
      setAvatarUrl(user.avatarUrl || "");
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          bio,
          avatarUrl,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "เกิดข้อผิดพลาดในการอัปเดต");
      }

      await refreshUser();
      showToast("บันทึกข้อมูลโปรไฟล์เรียบร้อยแล้ว", "success");
    } catch (err: any) {
      showToast(err.message || "เกิดข้อผิดพลาด", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast("กรุณากรอกรหัสผ่านปัจจุบัน", "error");
      return;
    }
    if (newPassword.length < 6) {
      showToast("รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("รหัสผ่านใหม่ไม่ตรงกัน", "error");
      return;
    }

    setIsChangingPass(true);
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "รหัสผ่านไม่ถูกต้อง");
      }

      showToast("เปลี่ยนรหัสผ่านเรียบร้อยแล้ว", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      showToast(err.message || "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน", "error");
    } finally {
      setIsChangingPass(false);
    }
  };

  if (authLoading) return <LoadingState message="กำลังตรวจสอบข้อมูลบัญชี..." />;

  if (!user) {
    return (
      <div className="max-w-content mx-auto px-4 sm:px-6 py-20 text-center">
        <EmptyState
          title="จำเป็นต้องเข้าสู่ระบบ"
          description="กรุณาเข้าสู่ระบบเพื่อจัดการโปรไฟล์ของคุณ"
          actionLabel="เข้าสู่ระบบทันที"
          onAction={() => (window.location.href = "/login")}
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-mono text-iris uppercase tracking-wider block mb-1">
          การจัดการบัญชี
        </span>
        <h1 className="font-display text-3xl sm:text-4xl text-pure font-light">
          โปรไฟล์ผู้ใช้
        </h1>
        <p className="text-xs sm:text-sm font-ui text-ash mt-1">
          จัดการข้อมูลส่วนตัว ชื่อผู้ใช้ และการตั้งค่าความปลอดภัย
        </p>
      </div>

      {/* Main Profile Info Form */}
      <div className="rounded-card bg-graphite/30 border border-steel/50 p-6 md:p-8">
        <div className="flex items-center gap-3 pb-4 mb-6 border-b border-steel/30">
          <div className="p-2.5 rounded-nav bg-abyss text-iris border border-steel/50">
            <User size={18} />
          </div>
          <div>
            <h3 className="font-display text-lg text-pure font-light">ข้อมูลทั่วไป</h3>
            <p className="text-xs font-ui text-ash">ข้อมูลที่จะแสดงต่อผู้เล่นคนอื่นเมื่อแชร์ตัวละคร</p>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <InputField
            label="ชื่อผู้ใช้"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ชื่อผู้ใช้ของคุณ"
            required
          />

          <InputField
            label="อีเมล (อ่านอย่างเดียว)"
            value={user.email}
            disabled
            className="opacity-70 cursor-not-allowed bg-steel/20"
          />

          <InputField
            label="รูปโปรไฟล์ (URL รูปภาพ)"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://example.com/avatar.png"
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-ui font-medium text-cloud/90">
              คำแนะนำตัว
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="แนะนำตัวสั้นๆ สไตล์การเล่น หรือกิลด์ที่สังกัด..."
              className="w-full p-3 rounded-input bg-abyss/80 text-pure text-xs font-ui border border-steel/60 focus:border-iris focus:outline-none placeholder:text-fog"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-steel/30">
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
              บันทึก
            </Button>
          </div>
        </form>
      </div>

      {/* Change Password Form */}
      <div className="rounded-card bg-graphite/30 border border-steel/50 p-6 md:p-8">
        <div className="flex items-center gap-3 pb-4 mb-6 border-b border-steel/30">
          <div className="p-2.5 rounded-nav bg-abyss text-iris border border-steel/50">
            <KeyRound size={18} />
          </div>
          <div>
            <h3 className="font-display text-lg text-pure font-light">เปลี่ยนรหัสผ่าน</h3>
            <p className="text-xs font-ui text-ash">อัปเดตรหัสผ่านใหม่เพื่อความปลอดภัยของบัญชี</p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <InputField
            label="รหัสผ่านปัจจุบัน"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <InputField
            label="รหัสผ่านใหม่"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="ความยาวอย่างน้อย 6 ตัวอักษร"
            required
          />

          <InputField
            label="ยืนยันรหัสผ่านใหม่"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
            required
          />

          <div className="flex justify-end pt-4 border-t border-steel/30">
            <Button type="submit" variant="secondary" size="sm" isLoading={isChangingPass}>
              เปลี่ยนรหัสผ่าน
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
