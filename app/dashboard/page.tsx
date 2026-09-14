"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { Button } from "@/components/ui/Button";
import { CharacterCard, CharacterCardData } from "@/components/character/CharacterCard";
import { LoadingState, EmptyState } from "@/components/ui/States";
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
    <div className="max-w-content mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-iris uppercase tracking-wider block mb-1">
            ภาพรวมบัญชี
          </span>
          <h1 className="font-display text-3xl sm:text-4xl text-pure font-light">
            แดชบอร์ด
          </h1>
          <p className="text-xs sm:text-sm font-ui text-ash mt-1">
            ยินดีต้อนรับกลับ, <span className="text-pure font-medium">{user.username}</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/calculator">
            <Button variant="primary" size="md">
              <Calculator size={15} className="mr-1.5" />
              เริ่มคำนวณ
            </Button>
          </Link>
          <Link href="/characters">
            <Button variant="secondary" size="md">
              <PlusCircle size={15} className="mr-1.5" />
              สร้างตัวละคร
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Data Blocks (Section 29) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* จำนวนตัวละคร */}
        <div className="rounded-card bg-graphite/30 border border-steel/50 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between text-ash text-xs font-ui mb-3">
            <span>จำนวนตัวละครทั้งหมด</span>
            <UserCheck size={16} className="text-iris" />
          </div>
          <div className="font-display text-4xl sm:text-5xl font-light text-pure mb-1">
            {characters.length}
          </div>
          <span className="text-[11px] font-mono text-fog">บิลด์ที่คุณบันทึกไว้ในระบบ</span>
        </div>

        {/* ตัวละครสาธารณะ */}
        <div className="rounded-card bg-graphite/30 border border-steel/50 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between text-ash text-xs font-ui mb-3">
            <span>ตัวละครสาธารณะ</span>
            <Globe size={16} className="text-cyan-signal" />
          </div>
          <div className="font-display text-4xl sm:text-5xl font-light text-pure mb-1">
            {publicCount}
          </div>
          <span className="text-[11px] font-mono text-fog">เปิดให้ผู้เล่นอื่นดูและนำไปคำนวณ</span>
        </div>

        {/* ตัวละครส่วนตัว */}
        <div className="rounded-card bg-graphite/30 border border-steel/50 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between text-ash text-xs font-ui mb-3">
            <span>ตัวละครส่วนตัว</span>
            <Lock size={16} className="text-ash" />
          </div>
          <div className="font-display text-4xl sm:text-5xl font-light text-pure mb-1">
            {privateCount}
          </div>
          <span className="text-[11px] font-mono text-fog">มองเห็นและใช้งานได้เฉพาะคุณ</span>
        </div>
      </div>

      {/* Recent Characters Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-steel/30">
          <div>
            <h2 className="font-display text-xl text-pure font-light">
              ตัวละครล่าสุด
            </h2>
            <p className="text-xs font-ui text-ash">บิลด์ตัวละครที่คุณสร้างหรือแก้ไขล่าสุด</p>
          </div>

          <Link
            href="/characters"
            className="text-xs font-ui text-iris hover:underline flex items-center gap-1"
          >
            ดูตัวละครทั้งหมด ({characters.length}) <ArrowRight size={13} />
          </Link>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentCharacters.map((char) => (
              <CharacterCard key={char.id} character={char} />
            ))}
          </div>
        )}
      </div>

      {/* Quick Action Banner */}
      <div className="p-8 rounded-card bg-abyss border border-steel/40 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-display text-xl text-pure font-light mb-1">
            สำรวจบิลด์ของชุมชน
          </h3>
          <p className="text-xs font-ui text-ash">
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
