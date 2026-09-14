"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CharacterStats, SkillData, EnemyStats } from "@/lib/calculator/types";
import { calculateTotalDamage } from "@/lib/calculator/engine";
import { CharacterInputs } from "@/components/calculator/CharacterInputs";
import { SkillInputs } from "@/components/calculator/SkillInputs";
import { EnemyInputs } from "@/components/calculator/EnemyInputs";
import { DamageResult } from "@/components/calculator/DamageResult";
import { CalculationBreakdown } from "@/components/calculator/CalculationBreakdown";
import { CharacterSelector, SavedCharacter } from "@/components/calculator/CharacterSelector";
import { useToast } from "@/components/ui/Toast";
import { LoadingState } from "@/components/ui/States";

// Section 43 Baseline Dataset
const DEFAULT_CHARACTER: CharacterStats = {
  attack: 8185,
  elementalAttack: 2073,
  schoolCounter: 721,
  armorPenetration: 3150,
  shieldBreak: 1425,
  hit: 1232,
  crit: 1686,
  critDamage: 182.6,
};

const DEFAULT_SKILL: SkillData = {
  name: "ค้นหาความพ่ายแพ้",
  level: 25,
  multiplier: 276,
  type: "ระเบิด",
  element: "สายฟ้า",
};

const DEFAULT_ENEMY: EnemyStats = {
  defense: 5022,
  qiShield: 1462,
  schoolDefense: 3476,
  elementalResistance: 380,
  block: 782,
  critResistance: 462,
};

const EMPTY_CHARACTER: CharacterStats = {
  attack: 0,
  elementalAttack: 0,
  schoolCounter: 0,
  armorPenetration: 0,
  shieldBreak: 0,
  hit: 0,
  crit: 0,
  critDamage: 150,
};

function CalculatorContent() {
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const [characterStats, setCharacterStats] = useState<CharacterStats>(DEFAULT_CHARACTER);
  const [skillData, setSkillData] = useState<SkillData>(DEFAULT_SKILL);
  const [enemyStats, setEnemyStats] = useState<EnemyStats>(DEFAULT_ENEMY);
  const [activeCharacter, setActiveCharacter] = useState<SavedCharacter | null>(null);

  // Load from query or session if redirected from character card
  useEffect(() => {
    const loadId = searchParams.get("load");
    const stored = sessionStorage.getItem("load_character");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as SavedCharacter;
        if (!loadId || parsed.id === loadId) {
          setActiveCharacter(parsed);
          setCharacterStats({
            attack: parsed.attack,
            elementalAttack: parsed.elementalAttack,
            schoolCounter: parsed.schoolCounter,
            armorPenetration: parsed.armorPenetration,
            shieldBreak: parsed.shieldBreak,
            hit: parsed.hit,
            crit: parsed.crit,
            critDamage: parsed.critDamage,
          });
          showToast(`โหลดตัวละคร "${parsed.name}" เข้าสู่เครื่องคำนวณแล้ว`, "info");
        }
      } catch (err) {
        console.error("Failed to parse stored character", err);
      } finally {
        sessionStorage.removeItem("load_character");
      }
    }
  }, [searchParams, showToast]);

  // Real-time pure calculation
  const calculationResult = useMemo(() => {
    return calculateTotalDamage(characterStats, skillData, enemyStats);
  }, [characterStats, skillData, enemyStats]);

  const handleSelectCharacter = (char: SavedCharacter) => {
    setActiveCharacter(char);
    setCharacterStats({
      attack: char.attack,
      elementalAttack: char.elementalAttack,
      schoolCounter: char.schoolCounter,
      armorPenetration: char.armorPenetration,
      shieldBreak: char.shieldBreak,
      hit: char.hit,
      crit: char.crit,
      critDamage: char.critDamage,
    });
  };

  const handleClearActiveCharacter = () => {
    setActiveCharacter(null);
    showToast("ยกเลิกการเชื่อมโยงตัวละครแล้ว (สามารถปรับค่าต่อได้)", "info");
  };

  const handleResetCharacter = () => {
    setCharacterStats(EMPTY_CHARACTER);
    setActiveCharacter(null);
    showToast("รีเซ็ตค่าสเตตัสตัวละครแล้ว", "info");
  };

  const handleLoadSample = () => {
    setCharacterStats(DEFAULT_CHARACTER);
    setSkillData(DEFAULT_SKILL);
    setEnemyStats(DEFAULT_ENEMY);
    setActiveCharacter(null);
    showToast("โหลดชุดข้อมูลตัวอย่างมาตรฐานแล้ว", "success");
  };

  return (
    <div className="space-y-8">
      {/* Character Selector Bar (Section 26) */}
      <CharacterSelector
        currentStats={characterStats}
        onSelectCharacter={handleSelectCharacter}
        activeCharacter={activeCharacter}
        onClearActiveCharacter={handleClearActiveCharacter}
      />

      {/* Main 3-Column Calculator Layout (Section 11) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Character Stats (5 cols) */}
        <div className="lg:col-span-5 rounded-card bg-graphite/30 border border-steel/50 p-6">
          <CharacterInputs
            stats={characterStats}
            onChange={setCharacterStats}
            onReset={handleResetCharacter}
            onLoadSample={handleLoadSample}
          />
        </div>

        {/* Center Column: Skill & Enemy Configuration (4 cols) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="rounded-card bg-graphite/30 border border-steel/50 p-6">
            <SkillInputs skill={skillData} onChange={setSkillData} />
          </div>

          <div className="rounded-card bg-graphite/30 border border-steel/50 p-6">
            <EnemyInputs enemy={enemyStats} onChange={setEnemyStats} />
          </div>
        </div>

        {/* Right Column: Calculation Result (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <DamageResult result={calculationResult} />
        </div>
      </div>

      {/* Full 11-Stage Calculation Breakdown (Section 23) */}
      <CalculationBreakdown stages={calculationResult.stages} />
    </div>
  );
}

export default function CalculatorPage() {
  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-mono text-iris uppercase tracking-wider block mb-1">
          ระบบคำนวณดาเมจ
        </span>
        <h1 className="font-display text-3xl sm:text-4xl text-almost-white font-light">
          เครื่องคำนวณดาเมจ Sword of Justice
        </h1>
        <p className="text-xs sm:text-sm font-ui text-ash mt-1.5 leading-relaxed">
          ระบุข้อมูลตัวละคร ข้อมูลสกิล และคุณสมบัติของศัตรูเพื่อคำนวณดาเมจที่สร้างได้จริง
        </p>
      </div>

      <Suspense fallback={<LoadingState message="กำลังเตรียมเครื่องคำนวณ..." />}>
        <CalculatorContent />
      </Suspense>
    </div>
  );
}
