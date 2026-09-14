"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { User, Copy, Calculator, Globe, Lock, Trash2, Edit2 } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { useToast } from "@/components/ui/Toast";

export interface CharacterCardData {
  id: string;
  name: string;
  description?: string | null;
  visibility: "PUBLIC" | "PRIVATE";
  attack: number;
  elementalAttack: number;
  schoolCounter: number;
  armorPenetration: number;
  shieldBreak: number;
  hit: number;
  crit: number;
  critDamage: number;
  userId: string;
  updatedAt?: string | Date;
  user?: {
    id?: string;
    username: string;
    avatarUrl?: string | null;
  };
}

interface CharacterCardProps {
  character: CharacterCardData;
  onDelete?: (id: string) => void;
  onEdit?: (character: CharacterCardData) => void;
}

export function CharacterCard({
  character,
  onDelete,
  onEdit,
}: CharacterCardProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();

  const isOwner = user?.id === character.userId;
  const isAdmin = user?.role === "ADMIN";

  const handleUseInCalculator = () => {
    // Store in session storage or URL param for calculator to load
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
        throw new Error(err.error || "เกิดข้อผิดพลาดในการคัดลอก");
      }

      showToast(`คัดลอก "${character.name}" ไปยังตัวละครของคุณแล้ว`, "success");
      router.push("/characters");
    } catch (err: any) {
      showToast(err.message || "เกิดข้อผิดพลาด", "error");
    }
  };

  return (
    <div className="group rounded-card bg-graphite/30 border border-steel/40 hover:border-steel/80 p-5 flex flex-col justify-between transition-all duration-200">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <Link
              href={`/characters/${character.id}`}
              className="font-display text-base text-pure font-light group-hover:text-iris transition-colors"
            >
              {character.name}
            </Link>
            {character.user && (
              <div className="flex items-center gap-1.5 text-xs font-ui text-ash mt-0.5">
                <User size={12} className="text-fog" />
                <span>โดย {character.user.username}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono flex items-center gap-1 ${
                character.visibility === "PUBLIC"
                  ? "bg-cyan-signal/10 text-cyan-signal border border-cyan-signal/20"
                  : "bg-steel/30 text-ash border border-steel/40"
              }`}
            >
              {character.visibility === "PUBLIC" ? (
                <>
                  <Globe size={10} /> สาธารณะ
                </>
              ) : (
                <>
                  <Lock size={10} /> ส่วนตัว
                </>
              )}
            </span>
          </div>
        </div>

        {/* Description */}
        {character.description && (
          <p className="text-xs font-ui text-ash line-clamp-2 mb-4 leading-relaxed">
            {character.description}
          </p>
        )}

        {/* Key Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 rounded-input bg-abyss/80 border border-steel/30 text-xs font-mono my-4">
          <div>
            <span className="text-fog text-[10px] block">ดาเมจรวม</span>
            <span className="text-cloud font-medium">{character.attack.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-fog text-[10px] block">โจมตีธาตุ</span>
            <span className="text-cloud font-medium">{character.elementalAttack.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-fog text-[10px] block">เจาะเกราะ</span>
            <span className="text-cloud font-medium">{character.armorPenetration.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-fog text-[10px] block">คริติคอล</span>
            <span className="text-cloud font-medium">{character.crit.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-steel/30 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            size="sm"
            variant="primary"
            onClick={handleUseInCalculator}
            className="text-xs h-8 px-3"
          >
            <Calculator size={13} className="mr-1" />
            ใช้คำนวณ
          </Button>

          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={handleDuplicate}
            className="text-xs h-8 px-2 text-ash hover:text-pure"
            title="คัดลอกตัวละครนี้"
          >
            <Copy size={13} className="mr-1" />
            คัดลอก
          </Button>
        </div>

        <div className="flex items-center gap-1">
          {onEdit && (isOwner || isAdmin) && (
            <button
              type="button"
              onClick={() => onEdit(character)}
              className="p-1.5 text-ash hover:text-pure rounded hover:bg-steel/40 transition-colors"
              title="แก้ไขตัวละคร"
            >
              <Edit2 size={14} />
            </button>
          )}

          {onDelete && (isOwner || isAdmin) && (
            <button
              type="button"
              onClick={() => onDelete(character.id)}
              className="p-1.5 text-ash hover:text-red-400 rounded hover:bg-red-500/10 transition-colors"
              title="ลบตัวละคร"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
