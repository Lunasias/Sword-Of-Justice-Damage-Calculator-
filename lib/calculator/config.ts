import { HitFormulaType } from "./types";

export interface CalculatorConfig {
  /** Base level constant for skill attack formula: 923 + 81 * (level - 15) */
  skillAttackBase: number;
  skillAttackPerLevel: number;
  skillAttackBaseLevel: number;

  /** Defense reduction constant: defense / (defense + 2860) */
  defenseReductionConstant: number;

  /** Elemental resistance constant: 1 - elemRes / (elemRes + 530) */
  elementalResistanceConstant: number;

  /** Crit chance constants: 1.15 * remainingCrit / (remainingCrit + 938) */
  critChanceMultiplier: number;
  critChanceDivisorConstant: number;

  /** Hit calculation mode */
  defaultHitFormula: HitFormulaType;
}

export const DEFAULT_CALCULATOR_CONFIG: CalculatorConfig = {
  skillAttackBase: 923,
  skillAttackPerLevel: 81,
  skillAttackBaseLevel: 15,
  defenseReductionConstant: 2860,
  elementalResistanceConstant: 530,
  critChanceMultiplier: 1.15,
  critChanceDivisorConstant: 938,
  defaultHitFormula: "standard_delta",
};
