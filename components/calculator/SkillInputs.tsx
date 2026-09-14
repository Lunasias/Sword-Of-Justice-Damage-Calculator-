"use client";

import React from "react";
import { SkillData } from "@/lib/calculator/types";
import { InputField, SelectField } from "@/components/ui/InputField";

interface SkillInputsProps {
  skill: SkillData;
  onChange: (skill: SkillData) => void;
}

export function SkillInputs({ skill, onChange }: SkillInputsProps) {
  const updateField = <K extends keyof SkillData>(field: K, value: SkillData[K]) => {
    onChange({
      ...skill,
      [field]: value,
    });
  };

  const elementOptions = [
    { label: "สายฟ้า", value: "สายฟ้า" },
    { label: "ไฟ", value: "ไฟ" },
    { label: "น้ำแข็ง", value: "น้ำแข็ง" },
    { label: "ลม", value: "ลม" },
    { label: "พิษ", value: "พิษ" },
    { label: "ไร้ธาตุ", value: "ไร้ธาตุ" },
  ];

  const typeOptions = [
    { label: "ระเบิด (Burst)", value: "ระเบิด" },
    { label: "ต่อเนื่อง (DoT / Channeled)", value: "ต่อเนื่อง" },
    { label: "ควบคุม (Crowd Control)", value: "ควบคุม" },
    { label: "โจมตีปกติ (Basic Attack)", value: "โจมตีปกติ" },
  ];

  return (
    <div className="space-y-4">
      <div className="pb-2 border-b border-steel/30">
        <h3 className="font-display text-lg text-pure font-light">ข้อมูลสกิล</h3>
        <p className="text-xs font-ui text-ash">ระบุข้อมูลสกิลที่ต้องการคำนวณความเสียหาย</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="sm:col-span-2">
          <InputField
            label="ชื่อสกิล"
            tooltip="ชื่อของสกิล เช่น ค้นหาความพ่ายแพ้"
            value={skill.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="เช่น ค้นหาความพ่ายแพ้"
          />
        </div>

        <InputField
          label="ระดับสกิล"
          tooltip="ระดับเลเวลของสกิลที่อัปเกรดแล้วในเกม"
          type="number"
          min={1}
          max={100}
          unit="Lv."
          value={skill.level || ""}
          onChange={(e) => updateField("level", Math.max(1, parseInt(e.target.value, 10) || 1))}
          placeholder="25"
        />

        <InputField
          label="ตัวคูณสกิล"
          tooltip="อัตราเปอร์เซ็นต์ตัวคูณดาเมจของสกิล เช่น 276%"
          type="number"
          step="0.1"
          min={1}
          unit="%"
          value={skill.multiplier || ""}
          onChange={(e) => updateField("multiplier", Math.max(0, parseFloat(e.target.value) || 0))}
          placeholder="276"
        />

        <SelectField
          label="ประเภทสกิล"
          tooltip="รูปแบบลักษณะความเสียหายของสกิล"
          value={skill.type || "ระเบิด"}
          onChange={(e) => updateField("type", e.target.value)}
          options={typeOptions}
        />

        <SelectField
          label="ธาตุ"
          tooltip="ธาตุประจำตัวของสกิล"
          value={skill.element || "สายฟ้า"}
          onChange={(e) => updateField("element", e.target.value)}
          options={elementOptions}
        />
      </div>
    </div>
  );
}
