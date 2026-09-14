"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { Button } from "@/components/ui/Button";
import { CharacterCard, CharacterCardData } from "@/components/character/CharacterCard";
import { LoadingState, EmptyState } from "@/components/ui/States";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  Calculator,
  UserCheck,
  Globe,
  Lock,
  PlusCircle,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [characters, setCharacters] = useState<CharacterCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/characters");
        if (res.ok) {
          const data = await res.json();
          setCharacters(data.characters || []);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, [user]);

  if (authLoading) return <LoadingState message="กำลังโหลดแดชบอร์ด..." />;

  if (!user) {
    return (
      <div className="max-w-content mx-auto px-4 sm:px-6 py-20 text-center">
        <EmptyState
          title="จำเป็นต้องเข้าสู่ระบบ"
          description="กรุณาเข้าสู่ระบบเพื่อเข้าสู่แดชบอร์ดส่วนตัวของคุณ"
          actionLabel="เข้าสู่ระบบทันที"
          onAction={() => (window.location.href = "/login")}
        />
      </div>
    );
  }

  const publicCount = characters.filter((c) => c.visibility === "PUBLIC").length;
  const privateCount = characters.filter((c) => c.visibility === "PRIVATE").length;
  const recentCharacters = characters.slice(0, 3);

  return (
    <div className="mx-auto max-w-content space-y-10 px-4 py-8 sm:px-6 md:py-12">
      <PageHeader
        eyebrow="ภาพรวมบัญชี"
        title="แดชบอร์ด"
        description={`ยินดีต้อนรับกลับ, ${user.username}`}
        actions={
          <>
            <Link href="/calculator">
              <Button variant="primary" size="md">
                <Calculator size={15} />
                เริ่มคำนวณ
              </Button>
            </Link>
            <Link href="/characters">
              <Button variant="secondary" size="md">
                <PlusCircle size={15} />
                สร้างตัวละคร
              </Button>
            </Link>
          </>
        }
      />

      {/* Metric Data Blocks — numbers are engraved into the surface. */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        {/* จำนวนตัวละคร */}
        <div className="flex flex-col justify-between rounded-card bg-neu-base p-6 shadow-neu-inset transition-all duration-300 ease-out hover:shadow-neu-inset-deep">
          <div className="mb-4 flex items-center justify-between gap-2 text-xs font-ui text-neu-muted">
            <span>จำนวนตัวละครทั้งหมด</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neu-base text-neu-accent shadow-neu-inset-deep">
              <UserCheck size={16} />
            </span>
          </div>
          <div className="mb-1 font-numeric text-4xl font-bold tracking-tight text-neu-fg sm:text-5xl">
            {characters.length}
          </div>
          <span className="text-[11px] font-ui text-neu-muted">บิลด์ที่คุณบันทึกไว้ในระบบ</span>
        </div>

        {/* ตัวละครสาธารณะ */}
        <div className="flex flex-col justify-between rounded-card bg-neu-base p-6 shadow-neu-inset transition-all duration-300 ease-out hover:shadow-neu-inset-deep">
          <div className="mb-4 flex items-center justify-between gap-2 text-xs font-ui text-neu-muted">
            <span>ตัวละครสาธารณะ</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neu-base text-neu-teal shadow-neu-inset-deep">
              <Globe size={16} />
            </span>
          </div>
          <div className="mb-1 font-numeric text-4xl font-bold tracking-tight text-neu-fg sm:text-5xl">
            {publicCount}
          </div>
          <span className="text-[11px] font-ui text-neu-muted">เปิดให้ผู้เล่นอื่นดูและนำไปคำนวณ</span>
        </div>

        {/* ตัวละครส่วนตัว */}
        <div className="flex flex-col justify-between rounded-card bg-neu-base p-6 shadow-neu-inset transition-all duration-300 ease-out hover:shadow-neu-inset-deep">
          <div className="mb-4 flex items-center justify-between gap-2 text-xs font-ui text-neu-muted">
            <span>ตัวละครส่วนตัว</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neu-base text-neu-muted shadow-neu-inset-deep">
              <Lock size={16} />
            </span>
          </div>
          <div className="mb-1 font-numeric text-4xl font-bold tracking-tight text-neu-fg sm:text-5xl">
            {privateCount}
          </div>
          <span className="text-[11px] font-ui text-neu-muted">มองเห็นและใช้งานได้เฉพาะคุณ</span>
        </div>
      </div>

      {/* Recent Characters Section */}
      <div className="space-y-6">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold tracking-tight text-neu-fg">
                ตัวละครล่าสุด
              </h2>
              <p className="mt-0.5 text-xs font-ui text-neu-muted">
                บิลด์ตัวละครที่คุณสร้างหรือแก้ไขล่าสุด
              </p>
            </div>

            <Link
              href="/characters"
              className="inline-flex items-center gap-1 rounded-lg text-xs font-ui text-neu-accent transition-colors duration-300 hover:text-neu-accent-light focus-neu"
            >
              ดูตัวละครทั้งหมด ({characters.length}) <ArrowRight size={13} />
            </Link>
          </div>
          <div className="mt-4 h-px bg-neu-shadow-dark/40 shadow-[0_1px_0_rgb(255_255_255/0.6)]" />
        </div>

        {isLoading ? (
          <LoadingState message="กำลังโหลดข้อมูลบิลด์..." />
        ) : recentCharacters.length === 0 ? (
          <EmptyState
            title="ยังไม่มีตัวละคร"
            description="คุณยังไม่ได้สร้างบิลด์ตัวละครใดๆ เริ่มต้นสร้างตัวละครแรกเลยตอนนี้"
            actionLabel="สร้างตัวละคร"
            onAction={() => (window.location.href = "/characters")}
          />
        ) : (
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {recentCharacters.map((char) => (
              <CharacterCard key={char.id} character={char} />
            ))}
          </div>
        )}
      </div>

      {/* Quick Action Banner — recessed, marking the end of the page content. */}
      <div className="flex flex-col items-center justify-between gap-6 rounded-card bg-neu-base p-8 shadow-neu-inset sm:flex-row">
        <div>
          <h3 className="mb-1 font-display text-xl font-bold tracking-tight text-neu-fg">
            สำรวจบิลด์ของชุมชน
          </h3>
          <p className="text-xs font-ui text-neu-muted">
            ค้นหาและคัดลอกตัวละครยอดนิยมจากผู้เล่นชั้นนำของ Sword of Justice เพื่อเปรียบเทียบสเตตัส
          </p>
        </div>
        <Link href="/characters/public">
          <Button variant="secondary" size="md">
            ดูตัวละครสาธารณะ →
          </Button>
        </Link>
      </div>
    </div>
  );
}
