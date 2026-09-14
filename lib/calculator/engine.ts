import {
  CharacterStats,
  SkillData,
  EnemyStats,
  CalculationOptions,
  CalculationResult,
  CalculationBreakdownStage,
} from "./types";
import { CalculatorConfig, DEFAULT_CALCULATOR_CONFIG } from "./config";

/**
 * 1. Calculate Skill Attack from Skill Level
 * Formula: 923 + 81 * (Skill Level - 15)
 */
export function calculateSkillAttack(
  level: number,
  config: CalculatorConfig = DEFAULT_CALCULATOR_CONFIG
): number {
  const safeLevel = Math.max(1, Math.round(level));
  return (
    config.skillAttackBase +
    config.skillAttackPerLevel * (safeLevel - config.skillAttackBaseLevel)
  );
}

/**
 * Effective panel attack calculation.
 * If min and max attack are provided, use average. Otherwise use standard attack.
 */
export function getPanelAttack(stats: CharacterStats): number {
  if (
    stats.attackMin !== undefined &&
    stats.attackMax !== undefined &&
    stats.attackMin > 0 &&
    stats.attackMax > 0
  ) {
    return (stats.attackMin + stats.attackMax) / 2;
  }
  return stats.attack;
}

/**
 * 2. Calculate Qi Shield & Shield Break Reduction
 * Section 43 Baseline:
 * Enemy Qi Shield = 1462, Shield Break = 1425
 * -> Excess Shield = 1462 - 1425 = 37
 * -> Remaining Shield = 37 * 0.5 = 18.50
 * -> Effective Shield Reduction = 1462 - 18.50 = 1443.50
 */
export function calculateQiShieldReduction(
  qiShield: number,
  shieldBreak: number
): { effectiveReduction: number; remainingShield: number } {
  if (qiShield <= 0) {
    return { effectiveReduction: 0, remainingShield: 0 };
  }

  if (shieldBreak >= qiShield) {
    // Shield is fully negated
    return { effectiveReduction: qiShield, remainingShield: 0 };
  }

  const excessShield = Math.max(0, qiShield - shieldBreak);
  const remainingShield = excessShield * 0.5;
  const effectiveReduction = Math.max(0, qiShield - remainingShield);

  return {
    effectiveReduction,
    remainingShield,
  };
}

/**
 * 3. Calculate Armor Penetration & Defense Reduction
 * Formula:
 * Remaining Defense = max(Enemy Defense - Armor Penetration, 0)
 * Defense Reduction = Remaining Defense / (Remaining Defense + 2860)
 */
export function calculateArmorPenetration(
  defense: number,
  armorPenetration: number,
  config: CalculatorConfig = DEFAULT_CALCULATOR_CONFIG
): { remainingDefense: number; defenseReductionRate: number } {
  const remainingDefense = Math.max(0, defense - armorPenetration);
  const defenseReductionRate =
    remainingDefense > 0
      ? remainingDefense / (remainingDefense + config.defenseReductionConstant)
      : 0;

  return {
    remainingDefense,
    defenseReductionRate,
  };
}

/**
 * 4. Calculate Elemental Damage Pool
 * Formula: Elemental Attack * (1 - Elemental Resistance / (Elemental Resistance + 530))
 */
export function calculateElementalDamage(
  elementalAttack: number,
  elementalResistance: number,
  config: CalculatorConfig = DEFAULT_CALCULATOR_CONFIG
): number {
  if (elementalAttack <= 0) return 0;
  const safeRes = Math.max(0, elementalResistance);
  const reductionFactor = safeRes / (safeRes + config.elementalResistanceConstant);
  return elementalAttack * (1 - reductionFactor);
}

/**
 * 5. Calculate Critical Chance and Critical Damage
 * Formula:
 * Remaining Crit = max(0, Crit - Crit Resistance)
 * Crit Chance = 1.15 * Remaining Crit / (Remaining Crit + 938)
 */
export function calculateCritical(
  crit: number,
  critResistance: number,
  critDamagePercent: number,
  normalDamage: number,
  config: CalculatorConfig = DEFAULT_CALCULATOR_CONFIG
): {
  remainingCrit: number;
  critChanceRate: number;
  criticalDamage: number;
  averageDamage: number;
} {
  const remainingCrit = Math.max(0, crit - critResistance);
  const critChanceRate =
    remainingCrit > 0
      ? Math.min(
          1,
          (config.critChanceMultiplier * remainingCrit) /
            (remainingCrit + config.critChanceDivisorConstant)
        )
      : 0;

  const critMultiplier = Math.max(1, critDamagePercent / 100);
  const criticalDamage = normalDamage * critMultiplier;
  const averageDamage =
    normalDamage * (1 - critChanceRate) + criticalDamage * critChanceRate;

  return {
    remainingCrit,
    critChanceRate,
    criticalDamage,
    averageDamage,
  };
}

/**
 * 6. Isolated Hit / Block calculation
 * Configurable so formula can be modified without altering other systems.
 */
export function calculateHitBlock(
  hit: number,
  block: number,
  options?: CalculationOptions
): number {
  if (options?.hitFormula === "proportional") {
    if (hit + block <= 0) return 1.0;
    return Math.min(1.0, Math.max(0.2, hit / (hit + block * 0.5)));
  }

  // Standard delta calculation: Baseline 95%, modulated by hit - block
  const delta = hit - block;
  if (delta >= 0) {
    return Math.min(1.0, 0.95 + (delta / 5000) * 0.05);
  } else {
    return Math.max(0.1, 0.95 - (Math.abs(delta) / 2000) * 0.5);
  }
}

/**
 * Primary Damage Calculator Function
 * Orchestrates the full 11-stage calculation process and returns breakdown
 */
export function calculateTotalDamage(
  character: CharacterStats,
  skill: SkillData,
  enemy: EnemyStats,
  options?: CalculationOptions,
  config: CalculatorConfig = DEFAULT_CALCULATOR_CONFIG
): CalculationResult {
  // 1. พลังโจมตีจากสกิล
  const skillAttack = calculateSkillAttack(skill.level, config);

  // 2. ดาเมจรวมเริ่มต้น
  const panelAttack = getPanelAttack(character);
  const initialDamagePool = skillAttack + panelAttack + character.schoolCounter;

  // 3. การลดจากโล่พลังชี่
  const { effectiveReduction: effectiveShieldReduction, remainingShield } =
    calculateQiShieldReduction(enemy.qiShield, character.shieldBreak);

  // 4. การลดจากป้องกันสำนัก
  const schoolDefenseDeduction = enemy.schoolDefense;
  const afterSchoolDefensePool = Math.max(
    0,
    initialDamagePool - effectiveShieldReduction - schoolDefenseDeduction
  );

  // 5. การคำนวณเจาะเกราะ
  const { remainingDefense, defenseReductionRate } = calculateArmorPenetration(
    enemy.defense,
    character.armorPenetration,
    config
  );

  // 6. การลดจากป้องกัน
  const remainingNormalPool = afterSchoolDefensePool * (1 - defenseReductionRate);

  // 7. การคำนวณโจมตีธาตุทั้งหมด
  const elementalPool = calculateElementalDamage(
    character.elementalAttack,
    enemy.elementalResistance,
    config
  );

  // รวมพูลดาเมจ
  const combinedPool = remainingNormalPool + elementalPool;

  // 8. ดาเมจสุดท้าย (ดาเมจปกติ)
  const skillMultiplier = Math.max(0, skill.multiplier / 100);

  // Percentage modifiers calculation
  // Same-type additive modifiers
  const additiveSum = (options?.additiveModifiers || []).reduce(
    (acc, v) => acc + v,
    0
  );
  const additiveFactor = 1 + additiveSum;

  // Different-type multiplicative modifiers
  const multiplicativeFactor = (options?.multiplicativeModifiers || []).reduce(
    (acc, v) => acc * v,
    1
  );

  const normalDamage =
    combinedPool * skillMultiplier * additiveFactor * multiplicativeFactor;

  // 9, 10, 11. โอกาสคริติคอล, ดาเมจคริติคอล, ดาเมจเฉลี่ย
  const { critChanceRate, criticalDamage, averageDamage } = calculateCritical(
    character.crit,
    enemy.critResistance,
    character.critDamage,
    normalDamage,
    config
  );

  const hitRate = calculateHitBlock(character.hit, enemy.block, options);

  // 11 Stages of Transparent Calculation Breakdown (as required by Section 23)
  const stages: CalculationBreakdownStage[] = [
    {
      stepNumber: 1,
      title: "1. พลังโจมตีจากสกิล",
      description: "คำนวณจากระดับเลเวลของสกิลตามสูตรเกม",
      formula: `923 + 81 × (${skill.level} - 15)`,
      value: Math.round(skillAttack * 100) / 100,
      unit: "หน่วย",
    },
    {
      stepNumber: 2,
      title: "2. ดาเมจรวมเริ่มต้น",
      description: "พลังโจมตีจากสกิล + ดาเมจรวม + ข่มสำนัก",
      formula: `${skillAttack} + ${panelAttack} + ${character.schoolCounter}`,
      value: Math.round(initialDamagePool * 100) / 100,
      unit: "หน่วย",
    },
    {
      stepNumber: 3,
      title: "3. การลดจากโล่พลังชี่",
      description: "หักลบด้วยโล่พลังชี่ที่มีผลหลังการทำลายโล่ (เหลือโล่ " + remainingShield.toFixed(2) + ")",
      formula: `โล่ที่มีผลดูดซับ: ${effectiveShieldReduction.toFixed(2)} จาก ${enemy.qiShield}`,
      value: Math.round(effectiveShieldReduction * 100) / 100,
      unit: "หน่วย",
    },
    {
      stepNumber: 4,
      title: "4. การลดจากป้องกันสำนัก",
      description: "หักลบค่าป้องกันสำนักของศัตรูโดยตรงจากพูลดาเมจ",
      formula: `พูลดาเมจคงเหลือหลังหัก: ${afterSchoolDefensePool.toFixed(2)}`,
      value: Math.round(schoolDefenseDeduction * 100) / 100,
      unit: "หน่วย",
    },
    {
      stepNumber: 5,
      title: "5. การคำนวณเจาะเกราะ",
      description: "พลังป้องกันของศัตรูหลังหักลบเจาะเกราะ",
      formula: `max(${enemy.defense} - ${character.armorPenetration}, 0)`,
      value: Math.round(remainingDefense * 100) / 100,
      unit: "หน่วย",
    },
    {
      stepNumber: 6,
      title: "6. การลดจากป้องกัน",
      description: "อัตราการลดทอนดาเมจจากพลังป้องกันคงเหลือ",
      formula: `${remainingDefense} / (${remainingDefense} + 2860)`,
      value: (defenseReductionRate * 100).toFixed(2),
      unit: "%",
    },
    {
      stepNumber: 7,
      title: "7. การคำนวณโจมตีธาตุทั้งหมด",
      description: "พูลดาเมจธาตุหลังหักต้านทานธาตุ",
      formula: `${character.elementalAttack} × (1 - ${enemy.elementalResistance} / (${enemy.elementalResistance} + 530))`,
      value: Math.round(elementalPool * 100) / 100,
      unit: "หน่วย",
    },
    {
      stepNumber: 8,
      title: "8. ดาเมจสุดท้าย",
      description: "ดาเมจปกติที่สร้างได้ (พูลรวม × ตัวคูณสกิล)",
      formula: `(${remainingNormalPool.toFixed(2)} + ${elementalPool.toFixed(2)}) × ${(skill.multiplier / 100).toFixed(2)}`,
      value: Math.round(normalDamage),
      unit: "ดาเมจ",
    },
    {
      stepNumber: 9,
      title: "9. โอกาสคริติคอล",
      description: "โอกาสติดคริติคอลหลังหักต้านทานคริติคอล",
      formula: `1.15 × (${character.crit} - ${enemy.critResistance}) / ((${character.crit} - ${enemy.critResistance}) + 938)`,
      value: (critChanceRate * 100).toFixed(2),
      unit: "%",
    },
    {
      stepNumber: 10,
      title: "10. ดาเมจคริติคอล",
      description: "ดาเมจปกติคูณด้วยดาเมจคริติคอล",
      formula: `${Math.round(normalDamage)} × ${(character.critDamage / 100).toFixed(4)}`,
      value: Math.round(criticalDamage),
      unit: "ดาเมจ",
    },
    {
      stepNumber: 11,
      title: "11. ดาเมจเฉลี่ย",
      description: "ดาเมจคาดหวังเฉลี่ยตามโอกาสคริติคอล",
      formula: `(ดาเมจปกติ × ${(1 - critChanceRate).toFixed(3)}) + (ดาเมจคริติคอล × ${critChanceRate.toFixed(3)})`,
      value: Math.round(averageDamage),
      unit: "ดาเมจ",
    },
  ];

  return {
    skillAttack,
    initialDamagePool,
    effectiveShieldReduction,
    remainingShield,
    schoolDefenseDeduction,
    afterSchoolDefensePool,
    remainingDefense,
    defenseReductionRate,
    remainingNormalPool,
    elementalPool,
    combinedPool,
    normalDamage,
    critChanceRate,
    criticalDamage,
    averageDamage,
    hitRate,
    stages,
  };
}
