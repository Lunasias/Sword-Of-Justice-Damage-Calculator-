import { describe, it, expect } from "vitest";
import { parseStatsFromText } from "../extractor";

describe("OCR Stat Extractor", () => {
  it("should parse exact Sword of Justice in-game stat panel text", () => {
    const rawOcrText = `
      ง โซ        ซึ
      Ta 9361 wun 3090 ซี
      sats} 2155 wna 0 3
      (ความแมนยำ 1528 ครติคอล 1887 §
      [ปบาล   553 ขมส่านัก   749 3
      ของกันกําสัง     ป้องกัน.
      “wen, 4993 กาลงภายใน 5192
    `;

    const res = parseStatsFromText(rawOcrText);
    expect(res.stats.attack).toBe(9361);
    expect(res.stats.armorPenetration).toBe(3090);
    expect(res.stats.elementalAttack).toBe(2155);
    expect(res.stats.hit).toBe(1528);
    expect(res.stats.crit).toBe(1887);
    expect(res.stats.bossCounter).toBe(553);
    expect(res.stats.schoolCounter).toBe(749);
    expect(res.detectedCount).toBe(7);
  });

  it("should parse standard Thai character stats panel text", () => {
    const sampleText = `
      คุณสมบัติพื้นฐาน
      โจมตีกำลังภายใน 8185
      เจาะเกราะ 3150
      โจมตีธาตุ 2073
      ข่มสำนัก 721
      ความแม่นยำ 1232
      คริติคอล 1686
    `;

    const res = parseStatsFromText(sampleText);
    expect(res.stats.attack).toBe(8185);
    expect(res.stats.armorPenetration).toBe(3150);
    expect(res.stats.elementalAttack).toBe(2073);
    expect(res.stats.schoolCounter).toBe(721);
    expect(res.stats.hit).toBe(1232);
    expect(res.stats.crit).toBe(1686);
  });
});
