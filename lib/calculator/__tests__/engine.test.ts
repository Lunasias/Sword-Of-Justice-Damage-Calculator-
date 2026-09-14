import { describe, it, expect } from "vitest";
import {
  calculateSkillAttack,
  calculateQiShieldReduction,
  calculateArmorPenetration,
  calculateElementalDamage,
  calculateCritical,
  calculateTotalDamage,
} from "../engine";
import { CharacterStats, SkillData, EnemyStats } from "../types";

describe("逆水寒手游 Damage Calculator Engine", () => {
  // Section 43 Baseline Dataset
  const sampleCharacter: CharacterStats = {
    attack: 8185,
    elementalAttack: 2073,
    schoolCounter: 721,
    armorPenetration: 3150,
    shieldBreak: 1425,
    hit: 1232,
    crit: 1686,
    critDamage: 182.6,
  };

  const sampleSkill: SkillData = {
    name: "ค้นหาความพ่ายแพ้",
    level: 25,
    multiplier: 276,
    type: "ระเบิด",
    element: "สายฟ้า",
  };

  const sampleEnemy: EnemyStats = {
    defense: 5022,
    qiShield: 1462,
    schoolDefense: 3476,
    elementalResistance: 380,
    block: 782,
    critResistance: 462,
  };

  it("should calculate exact Skill Attack for Level 25", () => {
    const skillAttack = calculateSkillAttack(25);
    expect(skillAttack).toBe(1733);
  });

  it("should match Section 43 exact regression baseline", () => {
    const result = calculateTotalDamage(sampleCharacter, sampleSkill, sampleEnemy);

    // 1. Skill Attack: 1733
    expect(result.skillAttack).toBe(1733);

    // 2. Initial damage pool: 10639
    expect(result.initialDamagePool).toBe(10639);

    // 3. Effective shield reduction: 1443.50, Remaining shield: ~18.50
    expect(result.effectiveShieldReduction).toBeCloseTo(1443.5, 1);
    expect(result.remainingShield).toBeCloseTo(18.5, 1);

    // 4. After school defense: 5719.50
    expect(result.afterSchoolDefensePool).toBeCloseTo(5719.5, 1);

    // 5. Remaining defense: 1872
    expect(result.remainingDefense).toBe(1872);

    // 6. Defense reduction: approximately 39.56% (0.3956)
    expect(result.defenseReductionRate * 100).toBeCloseTo(39.56, 1);

    // Remaining normal pool: approximately 3456.84
    expect(result.remainingNormalPool).toBeCloseTo(3456.84, 1);

    // 7. Elemental pool: approximately 1207.35
    expect(result.elementalPool).toBeCloseTo(1207.35, 1);

    // Combined pool: approximately 4664.19
    expect(result.combinedPool).toBeCloseTo(4664.19, 1);

    // 8. Normal damage: approximately 12873
    expect(Math.round(result.normalDamage)).toBe(12873);

    // 9. Critical chance: approximately 65.11%
    expect(result.critChanceRate * 100).toBeCloseTo(65.11, 1);

    // 10. Critical damage: approximately 23506
    expect(Math.round(result.criticalDamage)).toBe(23506);

    // 11. Average damage should be between normal and crit
    expect(result.averageDamage).toBeGreaterThan(result.normalDamage);
    expect(result.averageDamage).toBeLessThan(result.criticalDamage);

    // 11 stages breakdown presence
    expect(result.stages.length).toBe(11);
    expect(result.stages[0].title).toBe("1. พลังโจมตีจากสกิล");
    expect(result.stages[10].title).toBe("11. ดาเมจเฉลี่ย");
  });

  it("should handle shield break greater than or equal to Qi shield", () => {
    const { effectiveReduction, remainingShield } = calculateQiShieldReduction(
      1000,
      1200
    );
    expect(remainingShield).toBe(0);
    expect(effectiveReduction).toBe(1000);
  });

  it("should handle armor penetration greater than defense", () => {
    const { remainingDefense, defenseReductionRate } = calculateArmorPenetration(
      1500,
      2000
    );
    expect(remainingDefense).toBe(0);
    expect(defenseReductionRate).toBe(0);
  });

  it("should handle 0 elemental attack", () => {
    const elementalPool = calculateElementalDamage(0, 500);
    expect(elementalPool).toBe(0);
  });

  it("should handle enemy crit resistance higher than character crit", () => {
    const crit = calculateCritical(500, 800, 180, 10000);
    expect(crit.remainingCrit).toBe(0);
    expect(crit.critChanceRate).toBe(0);
    expect(crit.criticalDamage).toBe(18000);
    expect(crit.averageDamage).toBe(10000);
  });
});
