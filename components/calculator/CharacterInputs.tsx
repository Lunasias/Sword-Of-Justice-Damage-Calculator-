"use client";

import React from "react";
import { CharacterStats } from "@/lib/calculator/types";
import { InputField } from "@/components/ui/InputField";
import { SectionHeading } from "@/components/calculator/SectionHeading";
import { RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface CharacterInputsProps {
  stats: CharacterStats;
  onChange: (stats: CharacterStats) => void;
  onReset: () => void;
  onLoadSample: () => void;
}

export function CharacterInputs({
  stats,
  onChange,
  onReset,
  onLoadSample,
}: CharacterInputsProps) {
  const updateField = (field: keyof CharacterStats, value: number) => {
    onChange({
      ...stats,
      [field]: Math.max(0, isNaN(value) ? 0 : value),
    });
  };

  return (
    <div className="space-y-4">
      <SectionHeading
        title="ข้อมูลตัวละคร"
        description="ระบุค่าสเตตัสตัวละครจากหน้าต่างคุณสมบัติในเกม"
        action={
          <div className="flex shrink-0 items-center gap-1.5">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={onLoadSample}
              className="px-2.5 text-xs text-neu-accent hover:text-neu-accent-light"
              title="โหลดค่าทดสอบมาตรฐาน"
            >
              <Sparkles size={13} />
              ตัวอย่างมาตรฐาน
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={onReset}
              className="px-2.5 text-neu-muted hover:text-neu-fg"
              title="รีเซ็ตค่าทั้งหมด"
              aria-label="รีเซ็ตค่าทั้งหมด"
            >
              <RotateCcw size={13} />
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InputField
          label="ดาเมจรวม"
          tooltip="ค่าพลังโจมตีรวมจากหน้าสเตตัสตัวละคร (เดิมเรียกว่ากองโจมตี)"
          type="number"
          min={0}
          value={stats.attack || ""}
          onChange={(e) => updateField("attack", parseFloat(e.target.value) || 0)}
          placeholder="0"
          showClear
          onClear={() => updateField("attack", 0)}
        />

        <InputField
          label="โจมตีธาตุทั้งหมด"
          tooltip="พลังโจมตีธาตุรวมทุกสายของตัวละคร (เดิมเรียกว่ากองโจมตีธาตุ)"
          type="number"
          min={0}
          value={stats.elementalAttack || ""}
          onChange={(e) => updateField("elementalAttack", parseFloat(e.target.value) || 0)}
          placeholder="0"
          showClear
          onClear={() => updateField("elementalAttack", 0)}
        />

        <InputField
          label="ข่มสำนัก"
          tooltip="ค่าข่มสำนักที่ช่วยเพิ่มดาเมจต่อเป้าหมายโดยตรง (เดิมเรียกว่าข่ม)"
          type="number"
          min={0}
          value={stats.schoolCounter || ""}
          onChange={(e) => updateField("schoolCounter", parseFloat(e.target.value) || 0)}
          placeholder="0"
          showClear
          onClear={() => updateField("schoolCounter", 0)}
        />

        <InputField
          label="เจาะเกราะ"
          tooltip="ค่าเจาะเกราะที่ช่วยลดพลังป้องกันของศัตรู"
          type="number"
          min={0}
          value={stats.armorPenetration || ""}
          onChange={(e) => updateField("armorPenetration", parseFloat(e.target.value) || 0)}
          placeholder="0"
          showClear
          onClear={() => updateField("armorPenetration", 0)}
        />

        <InputField
          label="ทำลายโล่"
          tooltip="ค่าทำลายโล่พลังชี่ของศัตรู"
          type="number"
          min={0}
          value={stats.shieldBreak || ""}
          onChange={(e) => updateField("shieldBreak", parseFloat(e.target.value) || 0)}
          placeholder="0"
          showClear
          onClear={() => updateField("shieldBreak", 0)}
        />

        <InputField
          label="ความแม่นยำ"
          tooltip="ค่าความแม่นยำในการโจมตีลดโอกาสถูกศัตรูบล็อก"
          type="number"
          min={0}
          value={stats.hit || ""}
          onChange={(e) => updateField("hit", parseFloat(e.target.value) || 0)}
          placeholder="0"
          showClear
          onClear={() => updateField("hit", 0)}
        />

        <InputField
          label="คริติคอล"
          tooltip="ค่าคริติคอลพื้นฐานเพื่อเพิ่มโอกาสติดคริติคอล"
          type="number"
          min={0}
          value={stats.crit || ""}
          onChange={(e) => updateField("crit", parseFloat(e.target.value) || 0)}
          placeholder="0"
          showClear
          onClear={() => updateField("crit", 0)}
        />

        <InputField
          label="ดาเมจคริติคอล"
          tooltip="ตัวคูณความเสียหายเมื่อโจมตีติดคริติคอล เช่น 182.6%"
          type="number"
          step="0.1"
          min={100}
          unit="%"
          value={stats.critDamage || ""}
          onChange={(e) => updateField("critDamage", parseFloat(e.target.value) || 100)}
          placeholder="150"
        />
      </div>
    </div>
  );
}
