import { createWorker } from "tesseract.js";
import { parseStatsFromText, OcrResult } from "./extractor";

export interface OcrProgressCallback {
  (progress: number, status: string): void;
}

/**
 * Preprocesses and crops the Sword of Justice character stats panel if a full screenshot is provided.
 */
export async function preprocessAndCropImage(imageSrc: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const origW = img.width;
      const origH = img.height;
      const aspectRatio = origW / origH;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(imageSrc);
        return;
      }

      let sx = 0;
      let sy = 0;
      let sWidth = origW;
      let sHeight = origH;

      // In Sword of Justice, standard game screenshots are widescreen (16:9 ~ 1.77, or > 1.3)
      // The attack stats panel is located in the right lower-middle area:
      // x: ~66% to 99%, y: ~48% to 85%
      if (aspectRatio > 1.35) {
        sx = Math.round(origW * 0.65);
        sy = Math.round(origH * 0.46);
        sWidth = Math.round(origW * 0.34);
        sHeight = Math.round(origH * 0.40);
      }

      // Render onto canvas with clean dimensions
      canvas.width = sWidth;
      canvas.height = sHeight;
      ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight);

      try {
        const imgData = ctx.getImageData(0, 0, sWidth, sHeight);
        const data = imgData.data;

        // Enhance contrast for dark background game panels:
        // Text is white/light gold on dark semi-transparent panel
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          // Grayscale luminance
          let gray = 0.299 * r + 0.587 * g + 0.114 * b;

          // Boost contrast to make text stand out against dark gradient
          const contrast = 1.45;
          gray = (gray - 128) * contrast + 128;
          gray = Math.max(0, Math.min(255, gray));

          data[i] = gray;
          data[i + 1] = gray;
          data[i + 2] = gray;
        }

        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      } catch {
        resolve(imageSrc);
      }
    };
    img.onerror = () => resolve(imageSrc);
    img.src = imageSrc;
  });
}

/**
 * Recognizes stats from image using Tesseract.js with targeted stat panel recognition.
 */
export async function recognizeStatsFromImage(
  imageSrc: string,
  onProgress?: OcrProgressCallback
): Promise<OcrResult> {
  try {
    if (onProgress) onProgress(0.15, "กำลังโฟกัสแผงสเตตัสในภาพ...");
    const croppedSrc = await preprocessAndCropImage(imageSrc);

    if (onProgress) onProgress(0.3, "กำลังเริ่มระบบ OCR สแกนภาษาไทย...");
    const worker = await createWorker("tha+eng", undefined, {
      logger: (m) => {
        if (m.status === "recognizing text" && onProgress) {
          const p = 0.35 + (m.progress || 0) * 0.6;
          onProgress(Math.min(0.95, p), `กำลังสแกนตัวเลขสเตตัส (${Math.round((m.progress || 0) * 100)}%)...`);
        }
      },
    });

    if (onProgress) onProgress(0.6, "กำลังประมวลผลข้อความและตัวเลข...");
    const result = await worker.recognize(croppedSrc);
    await worker.terminate();

    const parsed = parseStatsFromText(result.data.text);

    // If cropped area found fewer than 2 stats, try scanning the full image once as fallback
    if (parsed.detectedCount < 2 && croppedSrc !== imageSrc) {
      if (onProgress) onProgress(0.8, "กำลังสแกนภาพเต็มเพิ่มเติม...");
      const fullWorker = await createWorker("tha+eng");
      const fullResult = await fullWorker.recognize(imageSrc);
      await fullWorker.terminate();
      const fallbackParsed = parseStatsFromText(fullResult.data.text);
      if (fallbackParsed.detectedCount > parsed.detectedCount) {
        if (onProgress) onProgress(1.0, `ตรวจพบ ${fallbackParsed.detectedCount} สเตตัส`);
        return fallbackParsed;
      }
    }

    if (onProgress) {
      onProgress(
        1.0,
        parsed.detectedCount > 0
          ? `ตรวจพบสเตตัสสำเร็จ (${parsed.detectedCount}/7 ค่า)`
          : "ตรวจไม่พบตัวเลขชัดเจน คุณสามารถกรอกสเตตัสได้ทันที"
      );
    }

    return parsed;
  } catch (error) {
    console.error("OCR recognition error:", error);
    if (onProgress) {
      onProgress(1.0, "ระบบ OCR ไม่สามารถอ่านค่าได้ สามารถกรอกตัวเลขโดยตรง");
    }
    return {
      stats: {
        attack: 0,
        elementalAttack: 0,
        schoolCounter: 0,
        bossCounter: 0,
        armorPenetration: 0,
        shieldBreak: 1425,
        hit: 0,
        crit: 0,
        critDamage: 182.6,
      },
      rawText: "",
      detectedCount: 0,
    };
  }
}
