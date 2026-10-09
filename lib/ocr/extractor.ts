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
    bossCounter: 0,
    armorPenetration: 0,
    shieldBreak: 1425, // Default baseline game shield break (configurable)
    hit: 0,
    crit: 0,
    critDamage: 182.6, // Default baseline game crit damage % (configurable)
  };

  if (!rawText || !rawText.trim()) {
    return { stats: defaultStats, rawText: "", detectedCount: 0 };
  }

  const lines = rawText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const detected: Partial<CharacterStats> = {};

  // Clean and extract all numbers from a string (including Thai numerals)
  const extractNumbersFromLine = (str: string): number[] => {
    const thaiDigits = ["๐", "๑", "๒", "๓", "๔", "๕", "๖", "๗", "๘", "๙"];
    let normalized = str;
    thaiDigits.forEach((digit, idx) => {
      normalized = normalized.replaceAll(digit, idx.toString());
    });
    // Remove commas
    normalized = normalized.replace(/,/g, "");
    const matches = normalized.match(/[0-9]+(?:\.[0-9]+)?/g);
    return matches ? matches.map(Number) : [];
  };

  // Helper: check if line is defense, block, or resistance (which we want to skip for attack)
  const isDefenseLine = (line: string): boolean => {
    return /ป้อง|ต้าน|บล็อ|บลอ|ชีวิต|ปราณ|พละ|รากฐาน|วิชา|ความทนทาน/i.test(line);
  };

  // Scan line by line for Sword of Justice specific in-game layout
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const nums = extractNumbersFromLine(line);

    // Skip defense and attribute lines
    if (isDefenseLine(line)) {
      continue;
    }

    // 1. Hit & Crit Line (e.g. "(ความแมนยำ 1528 ครติคอล 1887 §")
    if (
      (/แมน|แม่น|hit|accuracy/i.test(line) || /คริ|ครต|ครด|crit/i.test(line)) &&
      nums.length >= 1
    ) {
      if (nums.length >= 2) {
        if (!detected.hit) detected.hit = nums[0];
        if (!detected.crit) detected.crit = nums[1];
      } else if (/แมน|แม่น|hit/i.test(line)) {
        if (!detected.hit) detected.hit = nums[0];
      } else if (/คริ|ครต|ครด|crit/i.test(line)) {
        if (!detected.crit) detected.crit = nums[0];
      }
      continue;
    }

    // 2. Boss Counter & School Counter Line (e.g. "[ปบาล 553 ขมส่านัก 749 3")
    if ((/ขม|ข่ม|สำนัก|บอส|บาล/i.test(line)) && nums.length >= 1) {
      if (nums.length >= 2) {
        if (!detected.bossCounter) detected.bossCounter = nums[0];
        if (!detected.schoolCounter) detected.schoolCounter = nums[1];
      } else if (/บอส|บาล/i.test(line)) {
        if (!detected.bossCounter) detected.bossCounter = nums[0];
      } else if (/สำนัก|ขม/i.test(line)) {
        if (!detected.schoolCounter) detected.schoolCounter = nums[0];
      }
      continue;
    }

    // 3. Elemental Attack Line (e.g. "sats} 2155 wna 0 3" or "โจมตีธาตุ 2155")
    if ((/ธาตุ|elem|sats/i.test(line)) && nums.length >= 1) {
      if (!detected.elementalAttack) detected.elementalAttack = nums[0];
      continue;
    }

    // 4. Attack & Armor Penetration Line (e.g. "Ta 9361 wun 3090 ซี" or "โจมตีกำลังภายใน 9361 เจาะเกราะ 3090")
    if (nums.length >= 2 && !detected.attack) {
      // First number > 2000 is attack, second is armor pen
      if (nums[0] > 2000 && nums[1] > 500) {
        detected.attack = nums[0];
        detected.armorPenetration = nums[1];
        continue;
      }
    } else if (nums.length === 1) {
      if (/โจมตี|กำลังภายใน|กำลังภายนอก|attack/i.test(line) && !detected.attack) {
        detected.attack = nums[0];
      } else if (/เจาะ|เกราะ|pen/i.test(line) && !detected.armorPenetration) {
        detected.armorPenetration = nums[0];
      }
    }
  }

  // Count how many of the 7 main in-picture stats were found
  let detectedCount = 0;
  if (detected.attack && detected.attack > 0) detectedCount++;
  if (detected.armorPenetration && detected.armorPenetration > 0) detectedCount++;
  if (detected.elementalAttack && detected.elementalAttack > 0) detectedCount++;
  if (detected.hit && detected.hit > 0) detectedCount++;
  if (detected.crit && detected.crit > 0) detectedCount++;
  if (detected.schoolCounter && detected.schoolCounter > 0) detectedCount++;
  if (detected.bossCounter && detected.bossCounter > 0) detectedCount++;

  return {
    stats: {
      ...defaultStats,
      ...detected,
    },
    rawText,
    detectedCount,
  };
}
