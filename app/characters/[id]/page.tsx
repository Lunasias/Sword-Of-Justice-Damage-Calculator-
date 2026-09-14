"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { LoadingState, ErrorState } from "@/components/ui/States";
import {
  Calculator,
  Copy,
  ArrowLeft,
  User,
  Globe,
  Lock,
  Calendar,
  Shield,
} from "lucide-react";

export default function CharacterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();

  const id = params?.id as string;
  const [character, setCharacter] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchChar = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/characters/${id}`);
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "ไม่พบข้อมูลตัวละครนี้");
        }
        const data = await res.json();
        setCharacter(data.character);
      } catch (err: any) {
        setError(err.message || "เกิดข้อผิดพลาดในการโหลด");
      } finally {
        setIsLoading(false);
      }
    };
    fetchChar();
  }, [id]);

  const handleUseInCalculator = () => {
    if (!character) return;
    sessionStorage.setItem("load_character", JSON.stringify(character));
    router.push("/calculator?load=" + character.id);
  };

  const handleDuplicate = async () => {
    if (!user) {
      showToast("กรุณาเข้าสู่ระบบก่อนคัดลอกตัวละคร", "error");
      router.push("/login");
      return;
    }

    try {
      const res = await fetch("/api/characters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${character.name} (คัดลอก)`,
          description: character.description || "",
          visibility: "PRIVATE",
          attack: character.attack,
          elementalAttack: character.elementalAttack,
          schoolCounter: character.schoolCounter,
          armorPenetration: character.armorPenetration,
          shieldBreak: character.shieldBreak,
          hit: character.hit,
          crit: character.crit,
          critDamage: character.critDamage,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "เกิดข้อผิดพลาด");
      }

      showToast(`คัดลอก "${character.name}" ไปยังตัวละครของคุณแล้ว`, "success");
      router.push("/characters");
    } catch (err: any) {
      showToast(err.message || "เกิดข้อผิดพลาด", "error");
    }
  };

  if (isLoading) return <LoadingState message="กำลังโหลดรายละเอียดตัวละคร..." />;
  if (error || !character) return <ErrorState message={error || "ไม่พบข้อมูล"} />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8">
      {/* Back link */}
      <div>
        <Link
          href="/characters/public"
          className="inline-flex items-center gap-1.5 text-xs font-ui text-ash hover:text-pure transition-colors mb-4"
        >
          <ArrowLeft size={14} /> กลับไปยังตัวละครสาธารณะ
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-steel/40">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <h1 className="font-display text-3xl sm:text-4xl text-pure font-light">
                {character.name}
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-mono flex items-center gap-1 ${
                  character.visibility === "PUBLIC"
                    ? "bg-cyan-signal/10 text-cyan-signal border border-cyan-signal/20"
                    : "bg-steel/30 text-ash border border-steel/40"
                }`}
              >
                {character.visibility === "PUBLIC" ? (
                  <>
                    <Globe size={11} /> สาธารณะ
                  </>
                ) : (
                  <>
                    <Lock size={11} /> ส่วนตัว
                  </>
                )}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-ui text-ash">
              <span className="flex items-center gap-1">
                <User size={13} className="text-fog" />
                สร้างโดย {character.user?.username || "ไม่ระบุ"}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={13} className="text-fog" />
                อัปเดตเมื่อ {new Date(character.updatedAt).toLocaleDateString("th-TH")}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button variant="primary" size="md" onClick={handleUseInCalculator}>
              <Calculator size={15} className="mr-1.5" />
              ใช้คำนวณ
            </Button>
            <Button variant="secondary" size="md" onClick={handleDuplicate}>
              <Copy size={15} className="mr-1.5" />
              คัดลอกบิลด์
            </Button>
          </div>
        </div>
      </div>

      {/* Description */}
      {character.description && (
        <div className="p-6 rounded-card bg-graphite/30 border border-steel/40">
          <h3 className="text-xs font-mono text-ash uppercase tracking-wider mb-2">
            คำอธิบายบิลด์
          </h3>
          <p className="text-sm font-ui text-cloud leading-relaxed">
            {character.description}
          </p>
        </div>
      )}

      {/* All Stats Grid */}
      <div className="rounded-card bg-graphite/30 border border-steel/40 p-6 md:p-8">
        <h3 className="font-display text-xl text-pure font-light mb-6 pb-3 border-b border-steel/30">
          คุณสมบัติและค่าสเตตัส
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-input bg-abyss/80 border border-steel/30">
            <span className="text-fog text-xs font-ui block mb-1">ดาเมจรวม</span>
            <span className="text-pure font-mono text-xl font-medium">
              {character.attack.toLocaleString()}
            </span>
          </div>

          <div className="p-4 rounded-input bg-abyss/80 border border-steel/30">
            <span className="text-fog text-xs font-ui block mb-1">โจมตีธาตุทั้งหมด</span>
            <span className="text-pure font-mono text-xl font-medium">
              {character.elementalAttack.toLocaleString()}
            </span>
          </div>

          <div className="p-4 rounded-input bg-abyss/80 border border-steel/30">
            <span className="text-fog text-xs font-ui block mb-1">ข่มสำนัก</span>
            <span className="text-pure font-mono text-xl font-medium">
              {character.schoolCounter.toLocaleString()}
            </span>
          </div>

          <div className="p-4 rounded-input bg-abyss/80 border border-steel/30">
            <span className="text-fog text-xs font-ui block mb-1">เจาะเกราะ</span>
            <span className="text-pure font-mono text-xl font-medium">
              {character.armorPenetration.toLocaleString()}
            </span>
          </div>

          <div className="p-4 rounded-input bg-abyss/80 border border-steel/30">
            <span className="text-fog text-xs font-ui block mb-1">ทำลายโล่</span>
            <span className="text-pure font-mono text-xl font-medium">
              {character.shieldBreak.toLocaleString()}
            </span>
          </div>

          <div className="p-4 rounded-input bg-abyss/80 border border-steel/30">
            <span className="text-fog text-xs font-ui block mb-1">ความแม่นยำ</span>
            <span className="text-pure font-mono text-xl font-medium">
              {character.hit.toLocaleString()}
            </span>
          </div>

          <div className="p-4 rounded-input bg-abyss/80 border border-steel/30">
            <span className="text-fog text-xs font-ui block mb-1">คริติคอล</span>
            <span className="text-pure font-mono text-xl font-medium">
              {character.crit.toLocaleString()}
            </span>
          </div>

          <div className="p-4 rounded-input bg-abyss/80 border border-steel/30">
            <span className="text-fog text-xs font-ui block mb-1">ดาเมจคริติคอล</span>
            <span className="text-pure font-mono text-xl font-medium">
              {character.critDamage}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
