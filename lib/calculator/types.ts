/**
 * Types and interfaces for 逆水寒手游 Damage Calculator
 */

export interface CharacterStats {
  /** ดาเมจรวม (Panel Attack / Total Attack) */
  attack: number;
  /** ดาเมจรวมต่ำสุด (Optional Min Attack for range) */
  attackMin?: number;
  /** ดาเมจรวมสูงสุด (Optional Max Attack for range) */
  attackMax?: number;
  /** โจมตีธาตุทั้งหมด (Total Elemental Attack) */
  elementalAttack: number;
  /** ข่มสำนัก (School Counter) */
  schoolCounter: number;
  /** เจาะเกราะ (Armor Penetration) */
  armorPenetration: number;
  /** ทำลายโล่ (Shield Break) */
  shieldBreak: number;
  /** ความแม่นยำ (Hit) */
  hit: number;
  /** คริติคอล (Critical) */
  crit: number;
  /** ดาเมจคริติคอล (Crit Damage Multiplier %, e.g. 182.6 for 182.6%) */
  critDamage: number;
  /** ข่มบอส (Boss Counter) */
  bossCounter?: number;
}

export interface SkillData {
  /** ชื่อสกิล */
  name: string;
  /** ระดับสกิล */
  level: number;
  /** ตัวคูณสกิล (% e.g. 276 for 276%) */
  multiplier: number;
  /** ประเภทสกิล (e.g. ระเบิด, ต่อเนื่อง, ควบคุม) */
  type?: string;
  /** ธาตุ (e.g. สายฟ้า, ไฟ, น้ำแข็ง, ลม, พิษ, ไร้ธาตุ) */
  element?: string;
}

export interface EnemyStats {
  /** ป้องกัน (Defense) */
  defense: number;
  /** โล่พลังชี่ (Qi Shield) */
  qiShield: number;
  /** ป้องกันสำนัก (School Defense) */
  schoolDefense: number;
  /** ต้านทานธาตุ (Elemental Resistance) */
  elementalResistance: number;
  /** บล็อก (Block) */
  block: number;
  /** ต้านทานคริติคอล (Critical Resistance) */
  critResistance: number;
}

export type HitFormulaType = "standard_delta" | "proportional";

export interface CalculationOptions {
  hitFormula?: HitFormulaType;
  /** Additional same-type percentage increases (additive, e.g. +10% -> 0.10) */
  additiveModifiers?: number[];
  /** Additional different-type percentage multipliers (multiplicative, e.g. 1.05) */
  multiplicativeModifiers?: number[];
}

export interface CalculationBreakdownStage {
  stepNumber: number;
  title: string;
  description: string;
  formula: string;
  value: number | string;
  unit?: string;
}

export interface CalculationResult {
  /** 1. พลังโจมตีจากสกิล (Skill Attack) */
  skillAttack: number;
  /** 2. ดาเมจรวมเริ่มต้น (Initial Damage Pool) */
  initialDamagePool: number;
  /** 3. การลดจากโล่พลังชี่ (Effective Qi Shield absorbed / reduction) */
  effectiveShieldReduction: number;
  /** โล่พลังชี่ที่เหลือ (Remaining Qi Shield) */
  remainingShield: number;
  /** 4. การลดจากป้องกันสำนัก (School Defense deduction) */
  schoolDefenseDeduction: number;
  /** ค่าพูลหลังหักป้องกันสำนัก (Pool after school defense) */
  afterSchoolDefensePool: number;
  /** 5. การคำนวณเจาะเกราะ (Remaining Defense) */
  remainingDefense: number;
  /** 6. การลดจากป้องกัน (Defense Reduction Rate %) */
  defenseReductionRate: number;
  /** ค่าพูลปกติที่เหลือ (Remaining Normal Pool) */
  remainingNormalPool: number;
  /** 7. การคำนวณโจมตีธาตุทั้งหมด (Elemental Pool) */
  elementalPool: number;
  /** รวมพูลดาเมจ (Combined Damage Pool) */
  combinedPool: number;
  /** 8. ดาเมจสุดท้าย / ดาเมจปกติ (Normal Damage) */
  normalDamage: number;
  /** 9. โอกาสคริติคอล (Critical Chance Rate %) */
  critChanceRate: number;
  /** 10. ดาเมจคริติคอล (Critical Damage) */
  criticalDamage: number;
  /** 11. ดาเมจเฉลี่ย (Average Damage) */
  averageDamage: number;
  /** อัตราความแม่นยำ (Hit Rate %) */
  hitRate: number;
  /** รายละเอียดการคำนวณแต่ละขั้นตอน */
  stages: CalculationBreakdownStage[];
}
