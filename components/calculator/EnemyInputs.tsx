"use client";

import React from "react";
import { EnemyStats } from "@/lib/calculator/types";
import { InputField } from "@/components/ui/InputField";
import { SectionHeading } from "@/components/calculator/SectionHeading";

interface EnemyInputsProps {
  enemy: EnemyStats;
  onChange: (enemy: EnemyStats) => void;
}

export function EnemyInputs({ enemy, onChange }: EnemyInputsProps) {
  const updateField = (field: keyof EnemyStats, value: number) => {
    onChange({
      ...enemy,
      [field]: Math.max(0, isNaN(value) ? 0 : value),
    });
  };

  return (
    <div className="space-y-4">
      <SectionHeading
        title="ข้อมูลศัตรู"
        description="ระบุค่าพลังป้องกันและคุณสมบัติต้านทานของเป้าหมาย"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InputField
          label="ป้องกัน"
          tooltip="พลังป้องกันกายภาพ/เวทของศัตรู"
          type="number"
          min={0}
          value={enemy.defense || ""}
          onChange={(e) => updateField("defense", parseFloat(e.target.value) || 0)}
          placeholder="0"
          showClear
          onClear={() => updateField("defense", 0)}
        />

        <InputField
          label="โล่พลังชี่"
          tooltip="เกราะโล่พลังชี่ที่ดูดซับความเสียหายของศัตรู (ลดทอนได้ด้วยทำลายโล่)"
          type="number"
          min={0}
          value={enemy.qiShield || ""}
          onChange={(e) => updateField("qiShield", parseFloat(e.target.value) || 0)}
          placeholder="0"
          showClear
          onClear={() => updateField("qiShield", 0)}
        />

        <InputField
          label="ป้องกันสำนัก"
          tooltip="ค่าป้องกันการโจมตีจากสำนักของเป้าหมาย (หักลบพูลดาเมจโดยตรง)"
          type="number"
          min={0}
          value={enemy.schoolDefense || ""}
          onChange={(e) => updateField("schoolDefense", parseFloat(e.target.value) || 0)}
          placeholder="0"
          showClear
          onClear={() => updateField("schoolDefense", 0)}
        />

        <InputField
          label="ต้านทานธาตุ"
          tooltip="ค่าต้านทานความเสียหายจากธาตุของศัตรู"
          type="number"
          min={0}
          value={enemy.elementalResistance || ""}
          onChange={(e) => updateField("elementalResistance", parseFloat(e.target.value) || 0)}
          placeholder="0"
          showClear
          onClear={() => updateField("elementalResistance", 0)}
        />

        <InputField
          label="บล็อก"
          tooltip="ค่าการบล็อกการโจมตีของศัตรู"
          type="number"
          min={0}
          value={enemy.block || ""}
          onChange={(e) => updateField("block", parseFloat(e.target.value) || 0)}
          placeholder="0"
          showClear
          onClear={() => updateField("block", 0)}
        />

        <InputField
          label="ต้านทานคริติคอล"
          tooltip="ค่าต้านทานโอกาสติดคริติคอลของศัตรู"
          type="number"
          min={0}
          value={enemy.critResistance || ""}
          onChange={(e) => updateField("critResistance", parseFloat(e.target.value) || 0)}
          placeholder="0"
          showClear
          onClear={() => updateField("critResistance", 0)}
        />
      </div>
    </div>
  );
}
