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

  // Declared as data so the eight stat tiles share one markup pattern.
  const statTiles = [
    { label: "ดาเมจรวม", value: character.attack.toLocaleString() },
    { label: "โจมตีธาตุทั้งหมด", value: character.elementalAttack.toLocaleString() },
    { label: "ข่มสำนัก", value: character.schoolCounter.toLocaleString() },
    { label: "เจาะเกราะ", value: character.armorPenetration.toLocaleString() },
    { label: "ทำลายโล่", value: character.shieldBreak.toLocaleString() },
    { label: "ความแม่นยำ", value: character.hit.toLocaleString() },
    { label: "คริติคอล", value: character.crit.toLocaleString() },
    { label: "ดาเมจคริติคอล", value: `${character.critDamage}%` },
  ];

  const isPublic = character.visibility === "PUBLIC";

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6 md:py-12">
      {/* Masthead */}
      <div>
        <Link
          href="/characters/public"
          className="mb-6 inline-flex items-center gap-1.5 rounded-lg text-xs font-ui text-neu-muted transition-colors duration-300 hover:text-neu-accent focus-neu"
        >
          <ArrowLeft size={14} /> กลับไปยังตัวละครสาธารณะ
        </Link>

        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <h1 className="font-display text-3xl font-extrabold tracking-tight text-neu-fg sm:text-4xl">
                {character.name}
              </h1>
              <span
                className={`flex items-center gap-1.5 rounded-full bg-neu-base px-3 py-1.5 text-xs font-ui font-medium shadow-neu-inset-sm ${
                  isPublic ? "text-neu-teal" : "text-neu-muted"
                }`}
              >
                {isPublic ? (
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

            <div className="flex flex-wrap items-center gap-4 text-xs font-ui text-neu-muted">
              <span className="flex items-center gap-1.5">
                <User size={13} />
                สร้างโดย {character.user?.username || "ไม่ระบุ"}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={13} />
                อัปเดตเมื่อ {new Date(character.updatedAt).toLocaleDateString("th-TH")}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <Button variant="primary" size="md" onClick={handleUseInCalculator}>
              <Calculator size={15} />
              ใช้คำนวณ
            </Button>
            <Button variant="secondary" size="md" onClick={handleDuplicate}>
              <Copy size={15} />
              คัดลอกบิลด์
            </Button>
          </div>
        </div>

        <div className="mt-6 h-px bg-neu-shadow-dark/40 shadow-[0_1px_0_rgb(255_255_255/0.6)]" />
      </div>

      {/* Description — recessed, so prose reads as a note set into the surface */}
      {character.description && (
        <div className="rounded-card bg-neu-base p-6 shadow-neu-inset">
          <h3 className="mb-3 text-[11px] font-ui font-medium uppercase tracking-widest text-neu-muted">
            คำอธิบายบิลด์
          </h3>
          <p className="text-sm font-ui leading-relaxed text-neu-fg">{character.description}</p>
        </div>
      )}

      {/* All stats */}
      <div className="rounded-card bg-neu-base p-6 shadow-neu-extruded md:p-8">
        <h3 className="font-display text-xl font-bold tracking-tight text-neu-fg">
          คุณสมบัติและค่าสเตตัส
        </h3>
        <div className="my-5 h-px bg-neu-shadow-dark/40 shadow-[0_1px_0_rgb(255_255_255/0.6)]" />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {statTiles.map((tile) => (
            <div
              key={tile.label}
              className="rounded-well bg-neu-base p-4 shadow-neu-inset transition-all duration-300 ease-out hover:shadow-neu-inset-deep"
            >
              <span className="mb-1.5 block text-[11px] font-ui text-neu-muted">{tile.label}</span>
              <span className="font-numeric text-xl font-bold tracking-tight text-neu-fg">
                {tile.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
