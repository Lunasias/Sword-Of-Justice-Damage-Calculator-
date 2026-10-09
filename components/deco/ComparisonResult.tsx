import React, { useState } from "react";
import {
  Trophy,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Flame,
  Zap,
  ChevronDown,
  ChevronUp,
  Award,
} from "lucide-react";
import { CharacterStats, CalculationResult } from "@/lib/calculator/types";
import { DecoCard } from "./DecoCard";
import { DecoDivider } from "./DecoDivider";
import { DecoButton } from "./DecoButton";

interface ComparisonResultProps {
  stats1: CharacterStats;
  stats2: CharacterStats;
  result1: CalculationResult;
  result2: CalculationResult;
  onScrollToTop?: () => void;
}

export function ComparisonResult({
  stats1,
  stats2,
  result1,
  result2,
  onScrollToTop,
}: ComparisonResultProps) {
  const [showDetailedStages, setShowDetailedStages] = useState(false);

  // Determine winner based on Average Expected Damage
  const avg1 = result1.averageDamage;
  const avg2 = result2.averageDamage;
  const diffAvg = avg1 - avg2;
  const pctAvg = avg2 > 0 ? ((diffAvg) / avg2) * 100 : 0;

  const winner: "1" | "2" | "tie" =
    Math.abs(diffAvg) < 1 ? "tie" : diffAvg > 0 ? "1" : "2";

  const winnerTitle =
    winner === "1"
      ? "ชุดที่ ๑ (BUILD I) มีประสิทธิภาพดาเมจสูงกว่า"
      : winner === "2"
      ? "ชุดที่ ๒ (BUILD II) มีประสิทธิภาพดาเมจสูงกว่า"
      : "ทั้งสองชุดมีประสิทธิภาพดาเมจเท่ากัน";

  const winnerPercent = Math.abs(pctAvg).toFixed(2);
  const winnerDiffDmg = Math.abs(Math.round(diffAvg)).toLocaleString();

  // Factors explaining WHY the winner is stronger
  const factors: { title: string; description: string; winner: "1" | "2" | "tie"; icon: React.ReactNode }[] = [];

  // 1. Armor penetration factor
  const penDiff = stats1.armorPenetration - stats2.armorPenetration;
  if (Math.abs(penDiff) > 0) {
    const penWinner = penDiff > 0 ? "1" : "2";
    const higherPen = penWinner === "1" ? stats1.armorPenetration : stats2.armorPenetration;
    const lowerPen = penWinner === "1" ? stats2.armorPenetration : stats1.armorPenetration;
    const higherRate = penWinner === "1" ? result1.defenseReductionRate : result2.defenseReductionRate;
    const lowerRate = penWinner === "1" ? result2.defenseReductionRate : result1.defenseReductionRate;

    factors.push({
      title: "การเจาะเกราะทะลวงการป้องกัน (Armor Penetration)",
      description: `ชุดที่ ${penWinner === "1" ? "๑" : "๒"} มีค่าเจาะเกราะสูงกว่า (+${Math.abs(penDiff).toLocaleString()}) ทำให้ศัตรูเหลือเกราะน้อยลงและลดทอนดาเมจลงเหลือ ${(higherRate * 100).toFixed(1)}% (เทียบกับ ${(lowerRate * 100).toFixed(1)}% ของอีกชุด)`,
      winner: penWinner,
      icon: <ShieldAlert size={16} className="text-[#D4AF37]" />,
    });
  }

  // 2. Attack vs Elemental
  const atkDiff = stats1.attack - stats2.attack;
  if (Math.abs(atkDiff) > 0) {
    const atkWinner = atkDiff > 0 ? "1" : "2";
    factors.push({
      title: "พลังโจมตีรวม (Total Attack Pool)",
      description: `ชุดที่ ${atkWinner === "1" ? "๑" : "๒"} มีดาเมจรวมหน้าสเตตัสสูงกว่า (+${Math.abs(atkDiff).toLocaleString()}) ช่วยขยายดาเมจรวมเริ่มต้นก่อนคิดตัวคูณสกิล`,
      winner: atkWinner,
      icon: <TrendingUp size={16} className="text-[#D4AF37]" />,
    });
  }

  // 3. Elemental Attack
  const elemDiff = stats1.elementalAttack - stats2.elementalAttack;
  if (Math.abs(elemDiff) > 0) {
    const elemWinner = elemDiff > 0 ? "1" : "2";
    factors.push({
      title: "การโจมตีธาตุทั้งหมด (Elemental Attack)",
      description: `ชุดที่ ${elemWinner === "1" ? "๑" : "๒"} มีโจมตีธาตุมากกว่า (+${Math.abs(elemDiff).toLocaleString()}) ซึ่งช่วยเพิ่มพูลดาเมจธาตุที่ทะลุการป้องกันปกติโดยตรง`,
      winner: elemWinner,
      icon: <Flame size={16} className="text-[#D4AF37]" />,
    });
  }

  // 4. Critical & Crit Damage
  const critRateDiff = result1.critChanceRate - result2.critChanceRate;
  const critDmgDiff = stats1.critDamage - stats2.critDamage;
  if (Math.abs(critRateDiff) > 0.005 || Math.abs(critDmgDiff) > 0.5) {
    const critImpact1 = result1.critChanceRate * (stats1.critDamage / 100);
    const critImpact2 = result2.critChanceRate * (stats2.critDamage / 100);
    const critWinner = critImpact1 >= critImpact2 ? "1" : "2";

    factors.push({
      title: "อัตราและตัวคูณคริติคอล (Critical Potency)",
      description: `ชุดที่ ${critWinner === "1" ? "๑" : "๒"} มีประสิทธิภาพคริติคอลโดยรวมดีกว่า (โอกาสคริ ${( (critWinner === "1" ? result1.critChanceRate : result2.critChanceRate) * 100).toFixed(1)}% ความแรง ${(critWinner === "1" ? stats1.critDamage : stats2.critDamage).toFixed(1)}%) ส่งผลให้ค่าดาเมจเฉลี่ยในระยะยาวสูงขึ้น`,
      winner: critWinner,
      icon: <Zap size={16} className="text-[#D4AF37]" />,
    });
  }

  // Overall strategic verdict text
  const getStrategicReasoning = () => {
    if (winner === "tie") {
      return "ทั้งสองชุดมีค่าสเตตัสและดาเมจเฉลี่ยที่ได้จากการคำนวณใกล้เคียงกัน สามารถเลือกใช้ได้ตามความสะดวกของออปชั่นรอง";
    }

    const winningStats = winner === "1" ? stats1 : stats2;
    const losingStats = winner === "1" ? stats2 : stats1;
    const winningResult = winner === "1" ? result1 : result2;
    const losingResult = winner === "1" ? result2 : result1;

    let reasons: string[] = [];

    if (winningStats.armorPenetration > losingStats.armorPenetration) {
      reasons.push(
        `มีค่าเจาะเกราะสูงกว่า (${winningStats.armorPenetration.toLocaleString()} vs ${losingStats.armorPenetration.toLocaleString()}) ซึ่งทะลวงพลังป้องกันของบอสได้อย่างมหาศาล`
      );
    }
    if (winningResult.critChanceRate > losingResult.critChanceRate && winningStats.critDamage >= losingStats.critDamage) {
      reasons.push(
        `มีโอกาสคริติคอล (${(winningResult.critChanceRate * 100).toFixed(1)}%) และความแรงคริ (${winningStats.critDamage}%) ที่คุ้มค่ากว่า`
      );
    }
    if (winningStats.attack > losingStats.attack) {
      reasons.push(`มีพลังโจมตีรวมตั้งต้นที่หนากว่า (+${(winningStats.attack - losingStats.attack).toLocaleString()})`);
    }
    if (winningStats.elementalAttack > losingStats.elementalAttack) {
      reasons.push(`มีดาเมจธาตุเสริมสูงกว่า (+${(winningStats.elementalAttack - losingStats.elementalAttack).toLocaleString()})`);
    }

    if (reasons.length === 0) {
      reasons.push("มีผลลัพธ์รวมของตัวคูณและพูลดาเมจที่สมดุลกว่าต่อเป้าหมายมาตรฐาน");
    }

    return `ชุดที่ ${winner === "1" ? "๑" : "๒"} ได้เปรียบชัดเจนเนื่องจาก ${reasons.join(" และ ")} ทำให้สร้างดาเมจเฉลี่ยสูงกว่าอีกชุดอย่างมีนัยสำคัญ`;
  };

  const statRows: { label: string; v1: number | string; v2: number | string; unit?: string }[] = [
    { label: "ดาเมจเฉลี่ยต่อการโจมตี", v1: Math.round(result1.averageDamage).toLocaleString(), v2: Math.round(result2.averageDamage).toLocaleString(), unit: "DMG" },
    { label: "ดาเมจคริติคอลสูงสุด", v1: Math.round(result1.criticalDamage).toLocaleString(), v2: Math.round(result2.criticalDamage).toLocaleString(), unit: "DMG" },
    { label: "ดาเมจปกติ (ไม่คริ)", v1: Math.round(result1.normalDamage).toLocaleString(), v2: Math.round(result2.normalDamage).toLocaleString(), unit: "DMG" },
    { label: "โอกาสคริติคอล", v1: `${(result1.critChanceRate * 100).toFixed(2)}%`, v2: `${(result2.critChanceRate * 100).toFixed(2)}%` },
    { label: "อัตราความแม่นยำ", v1: `${(result1.hitRate * 100).toFixed(2)}%`, v2: `${(result2.hitRate * 100).toFixed(2)}%` },
    { label: "โจมตี (กำลังภายใน/ภายนอก)", v1: stats1.attack.toLocaleString(), v2: stats2.attack.toLocaleString() },
    { label: "เจาะเกราะ", v1: stats1.armorPenetration.toLocaleString(), v2: stats2.armorPenetration.toLocaleString() },
    { label: "โจมตีธาตุ", v1: stats1.elementalAttack.toLocaleString(), v2: stats2.elementalAttack.toLocaleString() },
    { label: "ความแม่นยำ", v1: stats1.hit.toLocaleString(), v2: stats2.hit.toLocaleString() },
    { label: "คริติคอล", v1: stats1.crit.toLocaleString(), v2: stats2.crit.toLocaleString() },
    { label: "ข่มสำนัก", v1: stats1.schoolCounter.toLocaleString(), v2: stats2.schoolCounter.toLocaleString() },
    { label: "ข่มบอส", v1: (stats1.bossCounter || 0).toLocaleString(), v2: (stats2.bossCounter || 0).toLocaleString() },
    { label: "ดาเมจคริติคอล (ตั้งค่าเอง)", v1: `${stats1.critDamage}%`, v2: `${stats2.critDamage}%` },
    { label: "ทำลายโล่ (ตั้งค่าเอง)", v1: stats1.shieldBreak.toLocaleString(), v2: stats2.shieldBreak.toLocaleString() },
  ];

  return (
    <div id="comparison-result-section" className="space-y-8 animate-fade-in-up">
      {/* ─── Grand Art Deco Winner Banner ─── */}
      <div className="relative border-2 border-[#D4AF37] bg-[#141414] p-8 md:p-12 shadow-[0_0_30px_rgba(212,175,55,0.25)] overflow-hidden">
        {/* Sunburst radial halo */}
        <div className="absolute inset-0 bg-sunburst-center pointer-events-none" />

        {/* Stepped Corner Brackets */}
        <span className="art-deco-corner-tl" />
        <span className="art-deco-corner-tr" />
        <span className="art-deco-corner-bl" />
        <span className="art-deco-corner-br" />

        <div className="relative z-10 text-center space-y-4 max-w-4xl mx-auto">
          {/* Winner Trophy / Laurel */}
          <div className="mx-auto w-16 h-16 rotate-45 border-2 border-[#D4AF37] bg-[#0A0A0A] flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.4)]">
            <div className="-rotate-45 text-[#D4AF37]">
              <Trophy size={32} />
            </div>
          </div>

          <p className="font-marcellus text-xs uppercase tracking-theatrical text-[#D4AF37]">
            VERDICT • ผลการเปรียบเทียบดาเมจ
          </p>

          <h2 className="font-marcellus text-3xl sm:text-4xl md:text-5xl font-bold tracking-widest text-gold-gradient uppercase">
            {winnerTitle}
          </h2>

          {winner !== "tie" && (
            <div className="inline-flex items-center gap-3 bg-[#0A0A0A]/90 border border-[#D4AF37]/60 px-6 py-2.5 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              <span className="font-marcellus text-sm uppercase tracking-widest text-[#888888]">
                ส่วนต่างดาเมจเฉลี่ย:
              </span>
              <span className="font-mono text-xl sm:text-2xl font-bold text-[#F2E8C4]">
                +{winnerPercent}%
              </span>
              <span className="text-xs text-[#888888] font-mono">
                (+{winnerDiffDmg} ดาเมจต่อฮิต)
              </span>
            </div>
          )}

          {/* Grand Strategic Summary */}
          <div className="p-4 bg-[#0A0A0A]/60 border-y border-[#D4AF37]/30 max-w-3xl mx-auto mt-4">
            <p className="text-sm sm:text-base text-[#F2F0E4] font-body leading-relaxed">
              &ldquo;{getStrategicReasoning()}&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* ─── Breakdown: WHY is it stronger? (เพราะอะไร) ─── */}
      <div className="space-y-4">
        <DecoDivider title="วิเคราะห์เจาะลึก: เพราะอะไรถึงแรงกว่า" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {factors.map((factor, idx) => (
            <div
              key={idx}
              className={`p-5 bg-[#141414] border transition-all duration-300 relative ${
                factor.winner === winner
                  ? "border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.15)]"
                  : "border-[#D4AF37]/30"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rotate-45 border border-[#D4AF37] bg-[#0A0A0A] flex items-center justify-center shrink-0 mt-0.5">
                  <div className="-rotate-45">{factor.icon}</div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-marcellus text-sm font-semibold tracking-wide text-[#F2F0E4]">
                      {factor.title}
                    </h4>
                    {factor.winner !== "tie" && (
                      <span className="text-[10px] font-marcellus uppercase px-2 py-0.5 border border-[#D4AF37]/60 text-[#D4AF37] bg-[#0A0A0A]">
                        ชุดที่ {factor.winner === "1" ? "๑" : "๒"} ชนะ
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#888888] font-body leading-relaxed">
                    {factor.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Head-to-Head Comparison Table (ตารางเปรียบเทียบเคียงข้าง) ─── */}
      <DecoCard
        headerTitle="ตารางเปรียบเทียบสเตตัสเคียงข้าง (HEAD-TO-HEAD MATRIX)"
        headerSubtitle="เปรียบเทียบค่าคุณสมบัติและผลลัพธ์การคำนวณของทั้งสองชุดอย่างแม่นยำ"
        withCorners
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-[#D4AF37]/50 text-xs font-marcellus uppercase tracking-widest text-[#D4AF37]">
                <th className="py-3 px-4">รายการสเตตัส</th>
                <th className="py-3 px-4 text-center">ชุดที่ ๑ (BUILD I)</th>
                <th className="py-3 px-4 text-center">ชุดที่ ๒ (BUILD II)</th>
                <th className="py-3 px-4 text-center">ผลต่าง (DELTA)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4AF37]/15 text-sm font-mono">
              {statRows.map((row, idx) => {
                const isHighlight = idx < 3; // First 3 are damage outcomes
                return (
                  <tr
                    key={idx}
                    className={`transition-colors hover:bg-[#1A1A1A] ${
                      isHighlight ? "bg-[#181818] font-semibold text-[#F2F0E4]" : "text-[#CCCCCC]"
                    }`}
                  >
                    <td className="py-3.5 px-4 font-body flex items-center gap-2">
                      <div className="w-1 h-1 rotate-45 bg-[#D4AF37]" />
                      <span>{row.label}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center text-[#F2F0E4]">
                      {row.v1}
                    </td>
                    <td className="py-3.5 px-4 text-center text-[#F2F0E4]">
                      {row.v2}
                    </td>
                    <td className="py-3.5 px-4 text-center text-xs">
                      {row.v1 === row.v2 ? (
                        <span className="text-[#888888]">-</span>
                      ) : (
                        <span className="text-[#D4AF37]">
                          เปรียบเทียบแล้ว
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </DecoCard>

      {/* ─── 11-Stage Formula Accordion ─── */}
      <div className="border border-[#D4AF37]/30 bg-[#141414]">
        <button
          type="button"
          onClick={() => setShowDetailedStages(!showDetailedStages)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#1A1A1A] transition-colors"
        >
          <div className="flex items-center gap-3">
            <Award size={18} className="text-[#D4AF37]" />
            <span className="font-marcellus text-sm font-semibold tracking-widest text-[#D4AF37] uppercase">
              เจาะลึกสูตรการคำนวณ 11 ขั้นตอน (CALCULATION STAGES)
            </span>
          </div>
          <div className="text-[#D4AF37]">
            {showDetailedStages ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </button>

        {showDetailedStages && (
          <div className="p-6 border-t border-[#D4AF37]/25 space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {result1.stages.map((st1, idx) => {
                const st2 = result2.stages[idx];
                return (
                  <div
                    key={idx}
                    className="p-3 bg-[#0A0A0A] border border-[#D4AF37]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <span className="font-marcellus text-[#D4AF37] font-semibold">
                        {st1.title}
                      </span>
                      <p className="text-[11px] text-[#888888] font-body mt-0.5">
                        {st1.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-6 font-mono shrink-0">
                      <div>
                        <span className="text-[10px] text-[#888888] block">ชุดที่ ๑</span>
                        <span className="text-[#F2F0E4] font-bold">{st1.value} {st1.unit || ""}</span>
                      </div>
                      <div className="text-[#888888]">vs</div>
                      <div>
                        <span className="text-[10px] text-[#888888] block">ชุดที่ ๒</span>
                        <span className="text-[#F2F0E4] font-bold">{st2 ? `${st2.value} ${st2.unit || ""}` : "-"}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
