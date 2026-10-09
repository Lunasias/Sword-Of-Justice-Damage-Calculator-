import { describe, it, expect } from "vitest";
import { parseStatsFromText } from "../extractor";

describe("OCR Stat Extractor", () => {
  it("should parse standard Thai character stats panel text", () => {
    const sampleText = `
      คุณสมบัติพื้นฐาน
      ดาเมจรวม: 8,185
      โจมตีธาตุทั้งหมด: 2,073
      ข่มสำนัก: 721
      เจาะเกราะ: 3,150
      ทำลายโล่: 1,425
      ความแม่นยำ: 1,232
      คริติคอล: 1,686
      ดาเมจคริติคอล: 182.6%
    `;

    const res = parseStatsFromText(sampleText);
    expect(res.stats.attack).toBe(8185);
    expect(res.stats.elementalAttack).toBe(2073);
    expect(res.stats.schoolCounter).toBe(721);
    expect(res.stats.armorPenetration).toBe(3150);
    expect(res.stats.shieldBreak).toBe(1425);
    expect(res.stats.hit).toBe(1232);
    expect(res.stats.crit).toBe(1686);
    expect(res.stats.critDamage).toBe(182.6);
    expect(res.detectedCount).toBe(8);
  });

  it("should parse multi-line or alternate keywords", () => {
    const sampleText = `
      พลังโจมตี
      9500
      ธาตุรวม
      3100
      ชนะทางสำนัก 850
      ทะลวงเกราะ 3800
      ทำลาย 1600
      แม่นยำ 1400
      คริ 2100
      ความแรงคริ 195%
    `;

    const res = parseStatsFromText(sampleText);
    expect(res.stats.attack).toBe(9500);
    expect(res.stats.elementalAttack).toBe(3100);
    expect(res.stats.schoolCounter).toBe(850);
    expect(res.stats.armorPenetration).toBe(3800);
    expect(res.stats.shieldBreak).toBe(1600);
    expect(res.stats.hit).toBe(1400);
    expect(res.stats.crit).toBe(2100);
    expect(res.stats.critDamage).toBe(195);
  });
});
