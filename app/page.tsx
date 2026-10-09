"use client";

import React, { useState, useMemo } from "react";
import { CharacterStats, EnemyStats, SkillData } from "@/lib/calculator/types";
import { calculateTotalDamage } from "@/lib/calculator/engine";
import { StatSlot } from "@/components/deco/StatSlot";
import { ComparisonResult } from "@/components/deco/ComparisonResult";
import { DecoButton } from "@/components/deco/DecoButton";
import { DecoDivider } from "@/components/deco/DecoDivider";
import { DecoHeader } from "@/components/deco/DecoHeader";
import { DecoFooter } from "@/components/deco/DecoFooter";
import { DecoInput } from "@/components/deco/DecoInput";
import { Swords, Sliders, Sparkles, AlertCircle, ArrowDown } from "lucide-react";

// Standard End-Game Baseline Target (Section 43 Benchmark)
const DEFAULT_ENEMY: EnemyStats = {
  defense: 5022,
  qiShield: 1462,
  schoolDefense: 3476,
  elementalResistance: 380,
  block: 782,
  critResistance: 462,
};

const DEFAULT_SKILL: SkillData = {
  name: "สกิลหลักทดสอบ (มาตรฐาน)",
  level: 25,
  multiplier: 276,
  type: "ระเบิด",
  element: "สายฟ้า",
};

// Realistic sample presets for testing
const SAMPLE_BUILD_1: CharacterStats = {
  attack: 8185,
  elementalAttack: 2850,
  schoolCounter: 750,
  armorPenetration: 3850,
  shieldBreak: 1520,
  hit: 1350,
  crit: 1650,
  critDamage: 185.0,
};

const SAMPLE_BUILD_2: CharacterStats = {
  attack: 9250,
  elementalAttack: 1850,
  schoolCounter: 700,
  armorPenetration: 2750,
  shieldBreak: 1380,
  hit: 1280,
  crit: 1920,
  critDamage: 195.0,
};

const EMPTY_STATS: CharacterStats = {
  attack: 0,
  elementalAttack: 0,
  schoolCounter: 0,
  armorPenetration: 0,
  shieldBreak: 0,
  hit: 0,
  crit: 0,
  critDamage: 150,
};

export default function StatComparisonPage() {
  // Slot 1 (Left - Build I)
  const [stats1, setStats1] = useState<CharacterStats>(EMPTY_STATS);
  const [image1, setImage1] = useState<string | null>(null);

  // Slot 2 (Right - Build II)
  const [stats2, setStats2] = useState<CharacterStats>(EMPTY_STATS);
  const [image2, setImage2] = useState<string | null>(null);

  // Target & Skill configuration (optional tweak)
  const [enemyStats, setEnemyStats] = useState<EnemyStats>(DEFAULT_ENEMY);
  const [skillData, setSkillData] = useState<SkillData>(DEFAULT_SKILL);
  const [showConfig, setShowConfig] = useState(false);

  // Trigger comparison calculation
  const [hasCompared, setHasCompared] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Load presets
  const handleLoadSample1 = () => {
    setStats1(SAMPLE_BUILD_1);
    setValidationError(null);
  };

  const handleLoadSample2 = () => {
    setStats2(SAMPLE_BUILD_2);
    setValidationError(null);
  };

  const handleLoadBothSamples = () => {
    setStats1(SAMPLE_BUILD_1);
    setStats2(SAMPLE_BUILD_2);
    setValidationError(null);
  };

  // Reset everything (Stateless)
  const handleResetAll = () => {
    setStats1(EMPTY_STATS);
    setImage1(null);
    setStats2(EMPTY_STATS);
    setImage2(null);
    setHasCompared(false);
    setValidationError(null);
  };

  // Check if both sides have enough data
  const isReadyToCompare =
    (stats1.attack > 0 || stats1.armorPenetration > 0) &&
    (stats2.attack > 0 || stats2.armorPenetration > 0);

  const handleCompareClick = () => {
    if (!isReadyToCompare) {
      setValidationError(
        "กรุณาอัปโหลดภาพหรือระบุสเตตัสทั้งสองฝั่ง (ชุดที่ ๑ และ ชุดที่ ๒) ก่อนกดเปรียบเทียบ"
      );
      return;
    }
    setValidationError(null);
    setHasCompared(true);

    setTimeout(() => {
      document
        .getElementById("comparison-result-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Calculations
  const result1 = useMemo(() => {
    return calculateTotalDamage(stats1, skillData, enemyStats);
  }, [stats1, skillData, enemyStats]);

  const result2 = useMemo(() => {
    return calculateTotalDamage(stats2, skillData, enemyStats);
  }, [stats2, skillData, enemyStats]);

  return (
    <div className="min-h-screen bg-art-deco-grid text-[#F2F0E4] flex flex-col selection:bg-[#D4AF37]/30 selection:text-[#FFF5C0]">
      {/* Art Deco Symmetrical Top Header */}
      <DecoHeader onResetAll={handleResetAll} />

      {/* Main Page Canvas with Sunburst lighting */}
      <main className="flex-1 relative bg-sunburst pb-24">
        <div className="mx-auto max-w-content px-4 sm:px-6 pt-10 sm:pt-14 space-y-12">
          {/* ─── Hero Section (Centerline Symmetry) ─── */}
          <section className="text-center space-y-5 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 border border-[#D4AF37]/40 bg-[#141414]/90 px-4 py-1.5 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
              <Sparkles size={13} className="text-[#D4AF37]" />
              <span className="font-marcellus text-xs uppercase tracking-widest text-[#D4AF37]">
                THE GATSBY AESTHETIC • ZERO STORAGE STATELESS
              </span>
            </div>

            <h1 className="font-marcellus text-4xl sm:text-5xl md:text-6xl font-bold tracking-widest text-gold-gradient uppercase leading-tight">
              เปรียบเทียบสเตตัสตัวละคร
            </h1>

            <p className="font-body text-sm sm:text-base text-[#CCCCCC] max-w-2xl mx-auto leading-relaxed">
              อัปโหลดภาพสเตตัส ๒ ภาพแบบแบ่งหน้าจอซ้าย-ขวา ระบบจะดึงค่าคุณสมบัติจากภาพ
              และคำนวณเปรียบเทียบทันทีว่า <span className="text-[#D4AF37] font-semibold">ชุดไหนแรงกว่าและเพราะอะไร</span> โดยไม่มีการบันทึกข้อมูลใดๆ
            </p>

            {/* Quick Presets for Instant Test */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleLoadBothSamples}
                className="text-xs font-marcellus uppercase tracking-widest text-[#D4AF37] hover:text-[#F2E8C4] border-b border-[#D4AF37]/50 pb-0.5 hover:border-[#F2E8C4] transition-all flex items-center gap-1.5"
              >
                <Sparkles size={13} />
                <span>คลิกเพื่อทดสอบด้วยตัวอย่าง (Build I vs Build II)</span>
              </button>
            </div>
          </section>

          {/* ─── Split Screen 50/50 Layout (ซ้าย-ขวา แบ่งกลางจอ) ─── */}
          <section className="relative">
            {/* Center Vertical Divider with VS Emblem (Visible on Desktop) */}
            <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex-col items-center pointer-events-none">
              <div className="w-px h-16 bg-gradient-to-b from-transparent to-[#D4AF37]" />
              <div className="my-2 w-12 h-12 rotate-45 border-2 border-[#D4AF37] bg-[#0A0A0A] flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                <span className="-rotate-45 font-marcellus text-sm font-bold text-[#D4AF37]">
                  VS
                </span>
              </div>
              <div className="w-px h-16 bg-gradient-to-t from-transparent to-[#D4AF37]" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
              {/* Left Slot: Build I */}
              <div className="relative">
                <StatSlot
                  id="slot1"
                  romanNumeral="I"
                  title="ชุดที่ ๑ (BUILD I)"
                  subtitle="อัปโหลดภาพหรือระบุค่าสเตตัสฝั่งซ้าย"
                  stats={stats1}
                  onStatsChange={setStats1}
                  imagePreview={image1}
                  onImageChange={setImage1}
                  onLoadSample={handleLoadSample1}
                  sampleLabel="ตัวอย่าง I"
                />
              </div>

              {/* Right Slot: Build II */}
              <div className="relative">
                <StatSlot
                  id="slot2"
                  romanNumeral="II"
                  title="ชุดที่ ๒ (BUILD II)"
                  subtitle="อัปโหลดภาพหรือระบุค่าสเตตัสฝั่งขวา"
                  stats={stats2}
                  onStatsChange={setStats2}
                  imagePreview={image2}
                  onImageChange={setImage2}
                  onLoadSample={handleLoadSample2}
                  sampleLabel="ตัวอย่าง II"
                />
              </div>
            </div>
          </section>

          {/* ─── Central Compare Action ─── */}
          <section className="text-center pt-4 space-y-4">
            {validationError && (
              <div className="inline-flex items-center gap-2 p-3 bg-[#1A1110] border border-[#E5484D]/60 text-[#FFA0A0] text-xs font-body max-w-lg mx-auto">
                <AlertCircle size={16} className="shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            <div className="flex flex-col items-center justify-center gap-3">
              <DecoButton
                variant="solid"
                size="lg"
                onClick={handleCompareClick}
                icon={<Swords size={20} className="text-[#0A0A0A]" />}
                className="w-full sm:w-auto min-w-[280px] h-14 text-base font-bold shadow-[0_0_25px_rgba(212,175,55,0.4)]"
              >
                เปรียบเทียบสเตตัส (COMPARE BUILDS)
              </DecoButton>

              <span className="text-[11px] font-marcellus tracking-widest text-[#888888] uppercase">
                คำนวณผ่าน 11 ขั้นตอนสูตรแท้ของเกม SWORD OF JUSTICE
              </span>
            </div>
          </section>

          {/* ─── Advanced Target & Skill Settings (Optional Accordion) ─── */}
          <section className="max-w-2xl mx-auto">
            <button
              type="button"
              onClick={() => setShowConfig(!showConfig)}
              className="mx-auto flex items-center gap-2 text-xs font-marcellus uppercase tracking-widest text-[#888888] hover:text-[#D4AF37] transition-colors pb-1 border-b border-transparent hover:border-[#D4AF37]"
            >
              <Sliders size={13} />
              <span>
                {showConfig ? "ซ่อนการตั้งค่าเป้าหมายทดสอบ" : "ปรับแต่งค่าศัตรู & สกิลทดสอบ (ขั้นสูง)"}
              </span>
            </button>

            {showConfig && (
              <div className="mt-4 p-6 bg-[#141414] border border-[#D4AF37]/30 space-y-4 animate-fade-in-up">
                <h4 className="font-marcellus text-xs uppercase tracking-widest text-[#D4AF37]">
                  เป้าหมายทดสอบมาตรฐาน (TARGET STATS)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <DecoInput
                    label="พลังป้องกัน"
                    value={enemyStats.defense}
                    onChange={(e) =>
                      setEnemyStats({
                        ...enemyStats,
                        defense: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                  <DecoInput
                    label="โล่พลังชี่"
                    value={enemyStats.qiShield}
                    onChange={(e) =>
                      setEnemyStats({
                        ...enemyStats,
                        qiShield: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                  <DecoInput
                    label="ป้องกันสำนัก"
                    value={enemyStats.schoolDefense}
                    onChange={(e) =>
                      setEnemyStats({
                        ...enemyStats,
                        schoolDefense: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                  <DecoInput
                    label="ต้านทานธาตุ"
                    value={enemyStats.elementalResistance}
                    onChange={(e) =>
                      setEnemyStats({
                        ...enemyStats,
                        elementalResistance: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                  <DecoInput
                    label="ต้านทานคริ"
                    value={enemyStats.critResistance}
                    onChange={(e) =>
                      setEnemyStats({
                        ...enemyStats,
                        critResistance: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                  <DecoInput
                    label="ตัวคูณสกิล (%)"
                    unit="%"
                    value={skillData.multiplier}
                    onChange={(e) =>
                      setSkillData({
                        ...skillData,
                        multiplier: parseFloat(e.target.value) || 100,
                      })
                    }
                  />
                </div>
              </div>
            )}
          </section>

          {/* ─── Comparison Result & Detailed Breakdown ─── */}
          {hasCompared && isReadyToCompare && (
            <ComparisonResult
              stats1={stats1}
              stats2={stats2}
              result1={result1}
              result2={result2}
            />
          )}
        </div>
      </main>

      {/* Art Deco Architectural Footer */}
      <DecoFooter />
    </div>
  );
}
