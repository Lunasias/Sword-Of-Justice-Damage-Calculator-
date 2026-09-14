"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { LoadingState, EmptyState, ErrorState } from "@/components/ui/States";
import { PageHeader } from "@/components/ui/PageHeader";
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
    <div className="mx-auto max-w-content space-y-10 px-4 py-8 sm:px-6 md:py-12">
      <PageHeader
        eyebrow="แผงควบคุมระบบ"
        title="การจัดการระบบผู้ดูแล"
        description="ตรวจสอบสถิติระบบ บริหารจัดการผู้ใช้งาน และตรวจสอบเนื้อหาตัวละคร"
      />

      {/* 4 Stats Cards (Section 30) — carved wells, consistent with dashboard */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "จำนวนผู้ใช้",
            value: stats?.userCount,
            note: "บัญชีทั้งหมดในระบบ",
            icon: <Users size={16} />,
            accent: "text-neu-accent",
            valueAccent: "text-neu-fg",
          },
          {
            label: "จำนวนตัวละคร",
            value: stats?.totalCharacters,
            note: "บิลด์ที่สร้างทั้งหมด",
            icon: <Database size={16} />,
            accent: "text-neu-fg",
            valueAccent: "text-neu-fg",
          },
          {
            label: "ตัวละครสาธารณะ",
            value: stats?.publicCharacters,
            note: "เผยแพร่สู่ชุมชน",
            icon: <Globe size={16} />,
            accent: "text-neu-teal",
            valueAccent: "text-neu-teal",
          },
          {
            label: "ตัวละครส่วนตัว",
            value: stats?.privateCharacters,
            note: "ใช้งานส่วนตัว",
            icon: <Lock size={16} />,
            accent: "text-neu-muted",
            valueAccent: "text-neu-fg",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-card bg-neu-base p-5 shadow-neu-inset transition-all duration-300 ease-out hover:shadow-neu-inset-deep"
          >
            <div className="mb-3 flex items-center justify-between gap-2 text-xs font-ui text-neu-muted">
              <span>{card.label}</span>
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full bg-neu-base shadow-neu-inset-deep ${card.accent}`}
              >
                {card.icon}
              </span>
            </div>
            <div
              className={`font-numeric text-3xl font-bold tracking-tight ${card.valueAccent}`}
            >
              {card.value ?? "-"}
            </div>
            <span className="mt-1.5 block text-[10px] font-ui text-neu-muted">{card.note}</span>
          </div>
        ))}
      </div>

      {/* User Management Section */}
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-between gap-5 rounded-card bg-neu-base p-5 shadow-neu-inset sm:flex-row">
          <div>
            <h3 className="font-display text-lg font-bold tracking-tight text-neu-fg">
              จัดการผู้ใช้งาน ({filteredUsers.length})
            </h3>
            <p className="mt-0.5 text-xs font-ui text-neu-muted">
              ค้นหา ดูสิทธิ์ และจัดการระงับการใช้งานบัญชีผู้ใช้
            </p>
          </div>

          <div className="relative w-full shrink-0 sm:w-64">
            <input
              type="text"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="ค้นหาชื่อหรืออีเมล..."
              aria-label="ค้นหาผู้ใช้"
              className="h-11 w-full rounded-2xl bg-neu-base pl-11 pr-4 font-ui text-xs text-neu-fg shadow-neu-inset-deep transition-all duration-300 placeholder:text-neu-placeholder focus-neu-inset"
            />
            <Search
              size={15}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neu-muted"
            />
          </div>
        </div>

        {/* Users Table — carved basin, pressed header, floating rows */}
        <div className="overflow-x-auto rounded-card bg-neu-base p-3 shadow-neu-inset">
          <table className="w-full border-separate border-spacing-x-0 border-spacing-y-3 text-left text-xs font-ui">
            <thead>
              <tr className="text-neu-muted">
                <th className="rounded-l-xl bg-neu-base px-4 py-3 font-medium shadow-neu-inset-deep">
                  ผู้ใช้
                </th>
                <th className="bg-neu-base px-4 py-3 font-medium shadow-neu-inset-deep">อีเมล</th>
                <th className="bg-neu-base px-4 py-3 font-medium shadow-neu-inset-deep">ระดับสิทธิ์</th>
                <th className="bg-neu-base px-4 py-3 font-medium shadow-neu-inset-deep">จำนวนบิลด์</th>
                <th className="bg-neu-base px-4 py-3 font-medium shadow-neu-inset-deep">สถานะ</th>
                <th className="rounded-r-xl bg-neu-base px-4 py-3 text-right font-medium shadow-neu-inset-deep">
                  การจัดการ
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="group">
                  <td className="rounded-l-xl bg-neu-base px-4 py-3 font-medium text-neu-fg shadow-neu-sm transition-shadow duration-300 group-hover:shadow-neu-extruded">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neu-base font-numeric text-[10px] font-semibold text-neu-accent shadow-neu-inset-sm">
                        {u.username[0]?.toUpperCase()}
                      </span>
                      <span>{u.username}</span>
                    </div>
                  </td>
                  <td className="bg-neu-base px-4 py-3 font-numeric text-neu-muted shadow-neu-sm transition-shadow duration-300 group-hover:shadow-neu-extruded">
                    {u.email}
                  </td>
                  <td className="bg-neu-base px-4 py-3 shadow-neu-sm transition-shadow duration-300 group-hover:shadow-neu-extruded">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${
                        u.role === "ADMIN"
                          ? "bg-neu-accent text-white"
                          : "bg-neu-base text-neu-muted shadow-neu-inset-sm"
                      }`}
                    >
                      {u.role === "ADMIN" ? "แอดมิน" : "ผู้ใช้ทั่วไป"}
                    </span>
                  </td>
                  <td className="bg-neu-base px-4 py-3 font-numeric text-neu-fg shadow-neu-sm transition-shadow duration-300 group-hover:shadow-neu-extruded">
                    {u._count?.characters || 0}
                  </td>
                  <td className="bg-neu-base px-4 py-3 shadow-neu-sm transition-shadow duration-300 group-hover:shadow-neu-extruded">
                    {u.isSuspended ? (
                      <span className="rounded-full bg-neu-base px-2.5 py-1 text-[10px] font-medium text-neu-danger shadow-neu-inset-sm">
                        ถูกระงับ
                      </span>
                    ) : (
                      <span className="rounded-full bg-neu-base px-2.5 py-1 text-[10px] font-medium text-neu-teal shadow-neu-inset-sm">
                        ปกติ
                      </span>
                    )}
                  </td>
                  <td className="rounded-r-xl bg-neu-base px-4 py-3 text-right shadow-neu-sm transition-shadow duration-300 group-hover:shadow-neu-extruded">
                    <div className="flex items-center justify-end gap-2">
                      {u.id !== user.id && (
                        <>
                          <Button
                            size="sm"
                            variant={u.isSuspended ? "secondary" : "danger"}
                            onClick={() => handleToggleSuspend(u)}
                            className="px-3 text-[11px]"
                          >
                            {u.isSuspended ? "ปลดระงับ" : "ระงับผู้ใช้"}
                          </Button>
                          <button
                            type="button"
                            onClick={() => setUserToDelete(u)}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-neu-base text-neu-muted shadow-neu-sm transition-all duration-300 ease-out hover:text-neu-danger hover:shadow-neu-extruded active:translate-y-0.5 active:shadow-neu-inset-sm focus-neu"
                            title="ลบผู้ใช้"
                            aria-label="ลบผู้ใช้"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                      {u.id === user.id && (
                        <span className="font-numeric text-[11px] text-neu-muted">บัญชีปัจจุบัน</span>
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
          <p className="text-xs font-ui leading-relaxed text-neu-muted">
            คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้{" "}
            <span className="font-numeric font-semibold text-neu-fg">
              {userToDelete?.username}
            </span>
            ? บิลด์ตัวละครทั้งหมดของผู้ใช้นี้จะถูกลบออกจากระบบด้วย
          </p>
          <div className="flex items-center justify-end gap-3 pt-3">
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
