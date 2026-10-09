import { createWorker } from "tesseract.js";
import { parseStatsFromText, OcrResult } from "./extractor";

export interface OcrProgressCallback {
  (progress: number, status: string): void;
}

/**
 * Preprocess image onto canvas to improve OCR recognition:
 * - Resizes if excessively large
 * - Grayscale
 * - Contrast stretch / threshold enhancement
 */
export async function preprocessImage(imageSrc: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(imageSrc);
        return;
      }

      // Limit max dimension to 1600px for speedy processing while retaining crisp text
      const maxDim = 1600;
      let width = img.width;
      let height = img.height;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      try {
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;

        // Enhance contrast and convert to grayscale
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          // Grayscale luminance
          let gray = 0.299 * r + 0.587 * g + 0.114 * b;

          // Contrast boost
          const contrast = 1.35;
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
    img.onerror = () => {
      resolve(imageSrc);
    };
    img.src = imageSrc;
  });
}

/**
 * Recognizes text from image using Tesseract.js in the browser
 */
export async function recognizeStatsFromImage(
  imageSrc: string,
  onProgress?: OcrProgressCallback
): Promise<OcrResult> {
  try {
    if (onProgress) onProgress(0.1, "กำลังปรับความคมชัดของภาพ...");
    const processedSrc = await preprocessImage(imageSrc);

    if (onProgress) onProgress(0.25, "กำลังเริ่มต้นระบบ OCR...");
    // Initialize tesseract worker with english and thai
    const worker = await createWorker("eng+tha", undefined, {
      logger: (m) => {
        if (m.status === "recognizing text" && onProgress) {
          const p = 0.3 + (m.progress || 0) * 0.65;
          onProgress(Math.min(0.95, p), `กำลังสแกนข้อความ (${Math.round((m.progress || 0) * 100)}%)...`);
        }
      },
    });

    if (onProgress) onProgress(0.5, "กำลังวิเคราะห์ตัวเลขและสเตตัส...");
    const result = await worker.recognize(processedSrc);
    await worker.terminate();

    if (onProgress) onProgress(1.0, "วิเคราะห์เสร็จสมบูรณ์");
    return parseStatsFromText(result.data.text);
  } catch (error) {
    console.error("OCR recognition error:", error);
    // If worker failed (e.g. language download block), fallback gracefully
    if (onProgress) onProgress(1.0, "ไม่สามารถดึงข้อมูลอัตโนมัติได้ สามารถกรอกสเตตัสด้วยตนเอง");
    return {
      stats: {
        attack: 0,
        elementalAttack: 0,
        schoolCounter: 0,
        armorPenetration: 0,
        shieldBreak: 0,
        hit: 0,
        crit: 0,
        critDamage: 150,
      },
      rawText: "",
      detectedCount: 0,
    };
  }
}
