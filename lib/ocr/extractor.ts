import { CharacterStats } from "@/lib/calculator/types";

export interface OcrResult {
  stats: CharacterStats;
  rawText: string;
  detectedCount: number;
}

export function parseStatsFromText(rawText: string): OcrResult {
  const defaultStats: CharacterStats = {
    attack: 0,
    elementalAttack: 0,
    schoolCounter: 0,
    armorPenetration: 0,
    shieldBreak: 0,
    hit: 0,
    crit: 0,
    critDamage: 150, // Default base crit damage in game is 150%
  };

  if (!rawText || !rawText.trim()) {
    return { stats: defaultStats, rawText: "", detectedCount: 0 };
  }

  const lines = rawText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const fullText = lines.join(" ");

  // Helper to extract a clean number
  const extractNumber = (str: string): number => {
    // replace Thai numerals if any
    const thaiDigits = ["๐", "๑", "๒", "๓", "๔", "๕", "๖", "๗", "๘", "๙"];
    let normalized = str;
    thaiDigits.forEach((digit, idx) => {
      normalized = normalized.replaceAll(digit, idx.toString());
    });
    // Remove commas, take digits and optional decimal
    const match = normalized.replace(/,/g, "").match(/[0-9]+(?:\.[0-9]+)?/);
    return match ? parseFloat(match[0]) : 0;
  };

  // Check if a line contains any of the keywords
  const findValueForKeywords = (keywords: RegExp[]): number | null => {
    // 1. Check line with label + value
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (const kw of keywords) {
        if (kw.test(line)) {
          // Check if value is on the same line
          const afterKw = line.replace(kw, "");
          const val = extractNumber(afterKw);
          if (val > 0) return val;

          // Check next line
          if (i + 1 < lines.length) {
            const nextVal = extractNumber(lines[i + 1]);
            if (nextVal > 0) return nextVal;
          }
        }
      }
    }

    // 2. Check fullText regex with proximity
    for (const kw of keywords) {
      const match = fullText.match(new RegExp(kw.source + "[:\\s]*([0-9,.]+)", "i"));
      if (match && match[1]) {
        const val = extractNumber(match[1]);
        if (val > 0) return val;
      }
    }

    return null;
  };

  const detected: Partial<CharacterStats> = {};
  let detectedCount = 0;

  // 1. Attack (ดาเมจรวม / พลังโจมตี)
  const atkVal = findValueForKeywords([
    /ดาเมจรวม/i,
    /พลังโจมตี/i,
    /โจมตี/i,
    /attack/i,
    /atk/i,
    /外功攻击/i,
    /内功攻击/i,
    /攻击/i,
  ]);
  if (atkVal !== null && atkVal > 0) {
    detected.attack = atkVal;
    detectedCount++;
  }

  // 2. Elemental Attack (โจมตีธาตุทั้งหมด)
  const elemVal = findValueForKeywords([
    /โจมตีธาตุทั้งหมด/i,
    /โจมตีธาตุ/i,
    /ธาตุทั้งหมด/i,
    /ธาตุ/i,
    /elemental\s*attack/i,
    /elem\s*atk/i,
    /element/i,
    /元素攻击/i,
    /属性攻击/i,
  ]);
  if (elemVal !== null && elemVal > 0) {
    detected.elementalAttack = elemVal;
    detectedCount++;
  }

  // 3. School Counter (ข่มสำนัก)
  const schoolVal = findValueForKeywords([
    /ข่มสำนัก/i,
    /ข่ม/i,
    /ชนะทางสำนัก/i,
    /school\s*counter/i,
    /counter/i,
    /流派克制/i,
  ]);
  if (schoolVal !== null && schoolVal > 0) {
    detected.schoolCounter = schoolVal;
    detectedCount++;
  }

  // 4. Armor Penetration (เจาะเกราะ)
  const armVal = findValueForKeywords([
    /เจาะเกราะ/i,
    /ทะลวงเกราะ/i,
    /เจาะ/i,
    /armor\s*pen/i,
    /penetration/i,
    /破防/i,
  ]);
  if (armVal !== null && armVal > 0) {
    detected.armorPenetration = armVal;
    detectedCount++;
  }

  // 5. Shield Break (ทำลายโล่)
  const shieldVal = findValueForKeywords([
    /ทำลายโล่/i,
    /ทำลายพลังชี่/i,
    /ทำลาย/i,
    /shield\s*break/i,
    /break\s*shield/i,
    /破盾/i,
  ]);
  if (shieldVal !== null && shieldVal > 0) {
    detected.shieldBreak = shieldVal;
    detectedCount++;
  }

  // 6. Hit (ความแม่นยำ)
  const hitVal = findValueForKeywords([
    /ความแม่นยำ/i,
    /แม่นยำ/i,
    /hit/i,
    /accuracy/i,
    /命中/i,
  ]);
  if (hitVal !== null && hitVal > 0) {
    detected.hit = hitVal;
    detectedCount++;
  }

  // 7. Crit (คริติคอล)
  const critVal = findValueForKeywords([
    /คริติคอล/i,
    /โอกาสคริติคอล/i,
    /คริ/i,
    /crit(?:\s*rate)?/i,
    /critical/i,
    /会心/i,
  ]);
  if (critVal !== null && critVal > 0) {
    detected.crit = critVal;
    detectedCount++;
  }

  // 8. Crit Damage (ดาเมจคริติคอล)
  const critDmgVal = findValueForKeywords([
    /ดาเมจคริติคอล/i,
    /ความแรงคริ/i,
    /คริติคอลดาเมจ/i,
    /crit\s*dmg/i,
    /crit\s*damage/i,
    /critical\s*damage/i,
    /会心伤害/i,
  ]);
  if (critDmgVal !== null && critDmgVal > 0) {
    // If entered as 1.82, convert to 182%
    detected.critDamage = critDmgVal < 10 ? critDmgVal * 100 : critDmgVal;
    detectedCount++;
  }

  // Fallback heuristic: If very few keywords matched, but there are multiple numbers
  // Check if we can extract numbers in sequence or reasonable ranges
  if (detectedCount < 3) {
    const allNums = (fullText.match(/[0-9]{3,5}/g) || []).map(Number).filter((n) => n > 100);
    if (allNums.length >= 4) {
      if (!detected.attack && allNums[0]) detected.attack = allNums[0];
      if (!detected.elementalAttack && allNums[1]) detected.elementalAttack = allNums[1];
      if (!detected.armorPenetration && allNums[2]) detected.armorPenetration = allNums[2];
      if (!detected.shieldBreak && allNums[3]) detected.shieldBreak = allNums[3];
      if (!detected.crit && allNums[4]) detected.crit = allNums[4];
      if (!detected.hit && allNums[5]) detected.hit = allNums[5];
    }
  }

  return {
    stats: {
      ...defaultStats,
      ...detected,
    },
    rawText,
    detectedCount,
  };
}
