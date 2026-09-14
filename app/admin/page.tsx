"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { LoadingState, EmptyState, ErrorState } from "@/components/ui/States";
import { useToast } from "@/components/ui/Toast";
import {
  Shield,
  Users,
  Database,
  Lock,
  Globe,
  Ban,
  Trash2,
  CheckCircle,
  Search,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface AdminStats {
  userCount: number;
  totalCharacters: number;
  publicCharacters: number;
  privateCharacters: number;
}

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: "USER" | "ADMIN";
  isSuspended: boolean;
  createdAt: string;
  _count: {
    characters: number;
  };
}

export default function AdminDashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { showToast } = useToast();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [userSearch, setUserSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"users" | "characters">("users");

  // Confirm modals
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchAdminData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [statsRes, usersRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/users"),
      ]);

      if (!statsRes.ok || !usersRes.ok) {
        throw new Error("ไม่มีสิทธิ์เข้าถึงส่วนผู้ดูแลระบบ หรือเซสชันหมดอายุ");
      }

      const statsData = await statsRes.json();
      const usersData = await usersRes.json();

      setStats(statsData.stats);
      setUsers(usersData.users || []);
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ดูแลระบบ");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "ADMIN") {
      fetchAdminData();
    } else if (!authLoading) {
      setIsLoading(false);
    }
  }, [user, authLoading]);

  const handleToggleSuspend = async (targetUser: AdminUser) => {
    try {
      const res = await fetch(`/api/admin/users/${targetUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isSuspended: !targetUser.isSuspended }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "เกิดข้อผิดพลาด");
      }

      showToast(
        targetUser.isSuspended
          ? `ปลดระงับผู้ใช้ "${targetUser.username}" แล้ว`
          : `ระงับผู้ใช้ "${targetUser.username}" เรียบร้อยแล้ว`,
        "success"
      );
      fetchAdminData();
    } catch (err: any) {
      showToast(err.message || "ไม่สามารถดำเนินการได้", "error");
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/admin/users/${userToDelete.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "เกิดข้อผิดพลาดในการลบผู้ใช้");
      }

      showToast(`ลบผู้ใช้ "${userToDelete.username}" เรียบร้อยแล้ว`, "success");
      setUserToDelete(null);
      fetchAdminData();
    } catch (err: any) {
      showToast(err.message || "ไม่สามารถลบผู้ใช้ได้", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  if (authLoading) return <LoadingState message="กำลังตรวจสอบสิทธิ์ผู้ดูแลระบบ..." />;

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="max-w-content mx-auto px-4 sm:px-6 py-20 text-center">
        <EmptyState
          title="ไม่มีสิทธิ์เข้าถึง"
          description="ส่วนนี้สงวนไว้สำหรับผู้ดูแลระบบเท่านั้น หากคุณเป็นผู้ดูแลกรุณาเข้าสู่ระบบด้วยบัญชีแอดมิน"
          actionLabel="กลับสู่หน้าแรก"
          onAction={() => (window.location.href = "/")}
        />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchAdminData} />;
  }

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-steel/40">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield size={20} className="text-iris" />
            <span className="text-xs font-mono text-iris uppercase tracking-wider">
              แผงควบคุมระบบ
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl text-pure font-light">
            การจัดการระบบผู้ดูแล
          </h1>
          <p className="text-xs sm:text-sm font-ui text-ash mt-1">
            ตรวจสอบสถิติระบบ บริหารจัดการผู้ใช้งาน และตรวจสอบเนื้อหาตัวละคร
          </p>
        </div>
      </div>

      {/* 4 Stats Cards (Section 30) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* จำนวนผู้ใช้ */}
        <div className="p-5 rounded-card bg-graphite/30 border border-steel/50">
          <div className="flex items-center justify-between text-ash text-xs font-ui mb-2">
            <span>จำนวนผู้ใช้</span>
            <Users size={16} className="text-iris" />
          </div>
          <div className="font-display text-3xl font-light text-pure">
            {stats?.userCount ?? "-"}
          </div>
          <span className="text-[10px] font-mono text-fog mt-1 block">บัญชีทั้งหมดในระบบ</span>
        </div>

        {/* จำนวนตัวละคร */}
        <div className="p-5 rounded-card bg-graphite/30 border border-steel/50">
          <div className="flex items-center justify-between text-ash text-xs font-ui mb-2">
            <span>จำนวนตัวละคร</span>
            <Database size={16} className="text-cloud" />
          </div>
          <div className="font-display text-3xl font-light text-pure">
            {stats?.totalCharacters ?? "-"}
          </div>
          <span className="text-[10px] font-mono text-fog mt-1 block">บิลด์ที่สร้างทั้งหมด</span>
        </div>

        {/* ตัวละครสาธารณะ */}
        <div className="p-5 rounded-card bg-graphite/30 border border-steel/50">
          <div className="flex items-center justify-between text-ash text-xs font-ui mb-2">
            <span>ตัวละครสาธารณะ</span>
            <Globe size={16} className="text-cyan-signal" />
          </div>
          <div className="font-display text-3xl font-light text-pure text-cyan-signal">
            {stats?.publicCharacters ?? "-"}
          </div>
          <span className="text-[10px] font-mono text-fog mt-1 block">เผยแพร่สู่ชุมชน</span>
        </div>

        {/* ตัวละครส่วนตัว */}
        <div className="p-5 rounded-card bg-graphite/30 border border-steel/50">
          <div className="flex items-center justify-between text-ash text-xs font-ui mb-2">
            <span>ตัวละครส่วนตัว</span>
            <Lock size={16} className="text-ash" />
          </div>
          <div className="font-display text-3xl font-light text-pure">
            {stats?.privateCharacters ?? "-"}
          </div>
          <span className="text-[10px] font-mono text-fog mt-1 block">ใช้งานส่วนตัว</span>
        </div>
      </div>

      {/* User Management Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-card bg-graphite/20 border border-steel/40">
          <div>
            <h3 className="font-display text-lg text-pure font-light">
              จัดการผู้ใช้งาน ({filteredUsers.length})
            </h3>
            <p className="text-xs font-ui text-ash">
              ค้นหา ดูสิทธิ์ และจัดการระงับการใช้งานบัญชีผู้ใช้
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="ค้นหาชื่อหรืออีเมล..."
              className="w-full h-9 pl-9 pr-3 rounded-input bg-abyss/80 text-pure text-xs font-ui border border-steel/60 focus:border-iris focus:outline-none"
            />
            <Search size={14} className="absolute left-3 top-2.5 text-fog" />
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto rounded-card border border-steel/40 bg-graphite/20">
          <table className="w-full text-left text-xs font-ui">
            <thead className="bg-abyss/80 text-ash border-b border-steel/40">
              <tr>
                <th className="p-3.5">ผู้ใช้</th>
                <th className="p-3.5">อีเมล</th>
                <th className="p-3.5">ระดับสิทธิ์</th>
                <th className="p-3.5">จำนวนบิลด์</th>
                <th className="p-3.5">สถานะ</th>
                <th className="p-3.5 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-steel/30">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-steel/20 transition-colors">
                  <td className="p-3.5 font-medium text-pure">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-steel/50 flex items-center justify-center text-[10px] font-mono">
                        {u.username[0]?.toUpperCase()}
                      </div>
                      <span>{u.username}</span>
                    </div>
                  </td>
                  <td className="p-3.5 text-ash font-mono">{u.email}</td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                        u.role === "ADMIN"
                          ? "bg-iris/20 text-iris border border-iris/40 font-semibold"
                          : "bg-steel/30 text-ash"
                      }`}
                    >
                      {u.role === "ADMIN" ? "แอดมิน" : "ผู้ใช้ทั่วไป"}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-cloud">{u._count?.characters || 0}</td>
                  <td className="p-3.5">
                    {u.isSuspended ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-red-500/20 text-red-400 border border-red-500/30">
                        ถูกระงับ
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-400">
                        ปกติ
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {u.id !== user.id && (
                        <>
                          <Button
                            size="sm"
                            variant={u.isSuspended ? "secondary" : "danger"}
                            onClick={() => handleToggleSuspend(u)}
                            className="h-7 px-2.5 text-[11px]"
                          >
                            {u.isSuspended ? "ปลดระงับ" : "ระงับผู้ใช้"}
                          </Button>
                          <button
                            type="button"
                            onClick={() => setUserToDelete(u)}
                            className="p-1.5 text-ash hover:text-red-400 rounded hover:bg-red-500/10 transition-colors"
                            title="ลบผู้ใช้"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                      {u.id === user.id && (
                        <span className="text-[11px] text-fog font-mono">บัญชีปัจจุบัน</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete User Modal */}
      <Modal
        isOpen={Boolean(userToDelete)}
        onClose={() => setUserToDelete(null)}
        title="ยืนยันการลบผู้ใช้"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs font-ui text-ash leading-relaxed">
            คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้{" "}
            <span className="text-pure font-semibold font-mono">
              {userToDelete?.username}
            </span>
            ? บิลด์ตัวละครทั้งหมดของผู้ใช้นี้จะถูกลบออกจากระบบด้วย
          </p>
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-steel/30">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setUserToDelete(null)}
            >
              ยกเลิก
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              isLoading={isProcessing}
              onClick={handleDeleteUser}
            >
              ลบผู้ใช้
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
