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

/**
 * Build tile. The whole card is extruded; the stat matrix inside is carved
 * with `insetDeep`, so the numbers read as engraved into the card body.
 */
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

  const stats = [
    { label: "ดาเมจรวม", value: character.attack },
    { label: "โจมตีธาตุ", value: character.elementalAttack },
    { label: "เจาะเกราะ", value: character.armorPenetration },
    { label: "คริติคอล", value: character.crit },
  ];

  return (
    <div className="group flex flex-col justify-between rounded-card bg-neu-base p-6 shadow-neu-extruded transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-neu-lifted">
      <div>
        {/* Header */}
        <div className="mb-2 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/characters/${character.id}`}
              className="font-display text-base font-bold tracking-tight text-neu-fg transition-colors duration-300 group-hover:text-neu-accent focus-neu"
            >
              {character.name}
            </Link>
            {character.user && (
              <div className="mt-1 flex items-center gap-1.5 text-xs font-ui text-neu-muted">
                <User size={12} className="text-neu-muted" />
                <span>โดย {character.user.username}</span>
              </div>
            )}
          </div>

          <span
            className={`flex shrink-0 items-center gap-1.5 rounded-full bg-neu-base px-2.5 py-1 text-[10px] font-medium shadow-neu-inset-sm ${
              character.visibility === "PUBLIC" ? "text-neu-teal" : "text-neu-muted"
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

        {/* Description */}
        {character.description && (
          <p className="mb-4 line-clamp-2 text-xs font-ui leading-relaxed text-neu-muted">
            {character.description}
          </p>
        )}

        {/* Engraved stat matrix */}
        <div className="my-5 grid grid-cols-2 gap-3 rounded-well bg-neu-base p-3.5 shadow-neu-inset-deep sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <span className="mb-0.5 block text-[10px] font-ui text-neu-muted">{stat.label}</span>
              <span className="font-numeric text-sm font-semibold text-neu-fg">
                {stat.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-2 pt-4">
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            size="sm"
            variant="primary"
            onClick={handleUseInCalculator}
            className="px-3"
          >
            <Calculator size={13} />
            ใช้คำนวณ
          </Button>

          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={handleDuplicate}
            className="px-2.5 text-neu-muted hover:text-neu-fg"
            title="คัดลอกตัวละครนี้"
          >
            <Copy size={13} />
            คัดลอก
          </Button>
        </div>

        <div className="flex items-center gap-1.5">
          {onEdit && (isOwner || isAdmin) && (
            <button
              type="button"
              onClick={() => onEdit(character)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-neu-base text-neu-muted shadow-neu-sm transition-all duration-300 ease-out hover:text-neu-fg hover:shadow-neu-extruded active:translate-y-0.5 active:shadow-neu-inset-sm focus-neu"
              title="แก้ไขตัวละคร"
              aria-label="แก้ไขตัวละคร"
            >
              <Edit2 size={14} />
            </button>
          )}

          {onDelete && (isOwner || isAdmin) && (
            <button
              type="button"
              onClick={() => onDelete(character.id)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-neu-base text-neu-muted shadow-neu-sm transition-all duration-300 ease-out hover:text-neu-danger hover:shadow-neu-extruded active:translate-y-0.5 active:shadow-neu-inset-sm focus-neu"
              title="ลบตัวละคร"
              aria-label="ลบตัวละคร"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
