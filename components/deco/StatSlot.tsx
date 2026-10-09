import React, { useRef, useState } from "react";
import { Upload, CheckCircle2, Loader2, Sparkles, X, SlidersHorizontal } from "lucide-react";
import { CharacterStats } from "@/lib/calculator/types";
import { recognizeStatsFromImage } from "@/lib/ocr/recognize";
import { DecoCard } from "./DecoCard";
import { DecoInput } from "./DecoInput";
import { DecoButton } from "./DecoButton";

interface StatSlotProps {
  id: "slot1" | "slot2";
  romanNumeral: "I" | "II";
  title: string;
  subtitle: string;
  stats: CharacterStats;
  onStatsChange: (stats: CharacterStats) => void;
  imagePreview: string | null;
  onImageChange: (imageSrc: string | null) => void;
  onLoadSample: () => void;
  sampleLabel?: string;
}

export function StatSlot({
  romanNumeral,
  title,
  subtitle,
  stats,
  onStatsChange,
  imagePreview,
  onImageChange,
  onLoadSample,
  sampleLabel = "โหลดตัวอย่าง",
}: StatSlotProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFileProcess = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("กรุณาเลือกไฟล์รูปภาพ (PNG, JPG, WebP)");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const src = e.target?.result as string;
      onImageChange(src);

      // Trigger OCR
      setIsScanning(true);
      setScanProgress(0);
      setScanStatus("กำลังเริ่มตรวจจับแผงสเตตัสในภาพ...");

      try {
        const ocrResult = await recognizeStatsFromImage(src, (progress, status) => {
          setScanProgress(progress);
          setScanStatus(status);
        });

        if (ocrResult.detectedCount > 0) {
          onStatsChange({
            ...stats,
            ...ocrResult.stats,
          });
          setScanStatus(`ตรวจพบสเตตัสสำเร็จ (${ocrResult.detectedCount}/7 ค่าจากหน้าต่างเกม)`);
        } else {
          setScanStatus("ตรวจไม่พบตัวเลขชัดเจน คุณสามารถกรอกสเตตัสได้ทันที");
        }
      } catch (err) {
        console.error(err);
        setScanStatus("เกิดข้อผิดพลาดในการสแกน คุณสามารถกรอกค่าสเตตัสได้โดยตรง");
      } finally {
        setIsScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleClear = () => {
    onImageChange(null);
    setScanStatus(null);
    onStatsChange({
      attack: 0,
      elementalAttack: 0,
      schoolCounter: 0,
      bossCounter: 0,
      armorPenetration: 0,
      shieldBreak: 1425,
      hit: 0,
      crit: 0,
      critDamage: 182.6,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const updateField = (field: keyof CharacterStats, val: number) => {
    onStatsChange({
      ...stats,
      [field]: Math.max(0, isNaN(val) ? 0 : val),
    });
  };

  const hasStats = stats.attack > 0 || stats.armorPenetration > 0;

  return (
    <DecoCard
      romanNumeral={romanNumeral}
      headerTitle={title}
      headerSubtitle={subtitle}
      headerAction={
        <div className="flex items-center gap-2">
          <DecoButton
            variant="ghost"
            size="sm"
            onClick={onLoadSample}
            icon={<Sparkles size={12} className="text-[#D4AF37]" />}
            className="text-[11px] h-8 px-2.5"
            title="โหลดค่าตัวอย่างสำหรับทดสอบ"
          >
            {sampleLabel}
          </DecoButton>
          {imagePreview && (
            <button
              type="button"
              onClick={handleClear}
              className="text-[#888888] hover:text-[#D4AF37] p-1.5 transition-colors"
              title="ล้างภาพนี้"
            >
              <X size={16} />
            </button>
          )}
        </div>
      }
      className="h-full flex flex-col justify-between"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileProcess(e.target.files[0]);
          }
        }}
      />

      {/* Image Upload / Preview Zone */}
      <div className="space-y-4">
        {!imagePreview ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`art-deco-double-frame group cursor-pointer transition-all duration-300 min-h-[220px] flex flex-col items-center justify-center p-6 text-center ${
              isDragOver
                ? "bg-[#1E3D59]/30 border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                : "bg-[#0E0E0E] hover:bg-[#161616] hover:border-[#D4AF37]"
            }`}
          >
            <div className="relative w-14 h-14 rotate-45 border border-[#D4AF37]/60 group-hover:border-[#D4AF37] flex items-center justify-center bg-[#141414] mb-4 transition-all duration-300 shadow-[0_0_12px_rgba(212,175,55,0.15)]">
              <div className="-rotate-45 text-[#D4AF37]">
                <Upload size={22} />
              </div>
            </div>

            <h4 className="font-marcellus text-sm font-semibold tracking-widest text-[#F2F0E4] uppercase mb-1">
              อัปโหลดภาพสเตตัสชุดที่ {romanNumeral}
            </h4>
            <p className="text-xs text-[#888888] font-body max-w-xs mb-3">
              ลากภาพหน้าจอตัวละครมาวางที่นี่ หรือคลิกเพื่อเลือกภาพ (ระบบตรวจจับเฉพาะสเตตัสที่แสดงในหน้าเกม)
            </p>
            <span className="font-marcellus text-[10px] uppercase tracking-widest text-[#D4AF37]/80 border-b border-[#D4AF37]/40 pb-0.5">
              รองรับภาพแคปเต็มจอ (16:9) หรือภาพตัดเฉพาะส่วน
            </span>
          </div>
        ) : (
          <div className="relative group">
            <div className="art-deco-double-frame bg-[#0A0A0A] overflow-hidden">
              <div className="relative max-h-[260px] overflow-hidden flex items-center justify-center bg-[#050505]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt={`สเตตัสชุดที่ ${romanNumeral}`}
                  className="w-full h-auto max-h-[260px] object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>

            <div className="absolute top-3 right-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-[#0A0A0A]/80 border border-[#D4AF37]/60 hover:border-[#D4AF37] text-[#D4AF37] px-2.5 py-1 text-[11px] font-marcellus uppercase tracking-widest backdrop-blur-sm transition-all"
              >
                เปลี่ยนภาพ
              </button>
            </div>
          </div>
        )}

        {/* OCR Scanning / Status Banner */}
        {isScanning ? (
          <div className="p-3 bg-[#1A1A1A] border-l-2 border-[#D4AF37] flex items-center gap-3">
            <Loader2 size={16} className="text-[#D4AF37] animate-spin shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-[#F2F0E4] font-body">{scanStatus}</p>
              <div className="w-full h-1 bg-[#222222] mt-1.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F2E8C4] transition-all duration-300"
                  style={{ width: `${Math.round(scanProgress * 100)}%` }}
                />
              </div>
            </div>
          </div>
        ) : scanStatus ? (
          <div className="p-2.5 bg-[#141414] border-l-2 border-[#D4AF37]/80 flex items-center gap-2 text-xs text-[#F2F0E4]">
            <CheckCircle2 size={14} className="text-[#D4AF37] shrink-0" />
            <span className="font-body">{scanStatus}</span>
          </div>
        ) : null}

        {/* Section Header: Only Stats from this picture */}
        <div className="flex items-center justify-between pt-2 border-t border-[#D4AF37]/20">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37]" />
            <span className="font-marcellus text-xs uppercase tracking-widest text-[#D4AF37]">
              สเตตัสที่แสดงในภาพเกม (7 ค่าหลัก)
            </span>
          </div>
          {hasStats && (
            <span className="text-[10px] text-[#888888] font-mono">
              (พร้อมคำนวณ)
            </span>
          )}
        </div>

        {/* 7 Stats from this game screen */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-1">
          <DecoInput
            romanNumeral="1"
            label="โจมตี (กำลังภายใน/ภายนอก)"
            value={stats.attack || ""}
            onChange={(e) => updateField("attack", parseFloat(e.target.value) || 0)}
            placeholder="0"
          />
          <DecoInput
            romanNumeral="2"
            label="เจาะเกราะ"
            value={stats.armorPenetration || ""}
            onChange={(e) => updateField("armorPenetration", parseFloat(e.target.value) || 0)}
            placeholder="0"
          />
          <DecoInput
            romanNumeral="3"
            label="โจมตีธาตุ"
            value={stats.elementalAttack || ""}
            onChange={(e) => updateField("elementalAttack", parseFloat(e.target.value) || 0)}
            placeholder="0"
          />
          <DecoInput
            romanNumeral="4"
            label="ความแม่นยำ"
            value={stats.hit || ""}
            onChange={(e) => updateField("hit", parseFloat(e.target.value) || 0)}
            placeholder="0"
          />
          <DecoInput
            romanNumeral="5"
            label="คริติคอล"
            value={stats.crit || ""}
            onChange={(e) => updateField("crit", parseFloat(e.target.value) || 0)}
            placeholder="0"
          />
          <DecoInput
            romanNumeral="6"
            label="ข่มสำนัก"
            value={stats.schoolCounter || ""}
            onChange={(e) => updateField("schoolCounter", parseFloat(e.target.value) || 0)}
            placeholder="0"
          />
          <div className="col-span-2 sm:col-span-1">
            <DecoInput
              romanNumeral="7"
              label="ข่มบอส"
              value={stats.bossCounter || ""}
              onChange={(e) => updateField("bossCounter", parseFloat(e.target.value) || 0)}
              placeholder="0"
            />
          </div>
        </div>

        {/* Customizable Remaining Stats: "ที่เหลือ ตั้งเป็นแบบสามารถตั้งเองได้" */}
        <div className="pt-3 border-t border-[#D4AF37]/15">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between p-2 bg-[#0E0E0E] hover:bg-[#181818] border border-[#D4AF37]/30 text-left transition-colors"
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={13} className="text-[#D4AF37]" />
              <span className="font-marcellus text-[11px] uppercase tracking-widest text-[#D4AF37]">
                สเตตัสเพิ่มเติมที่ไม่ได้แสดงในภาพ (ตั้งค่าเองได้)
              </span>
            </div>
            <span className="text-[10px] text-[#888888] font-mono">
              {showAdvanced ? "▲ ปิด" : "▼ เปิดแก้ไข (คริแรง & ทำลายโล่)"}
            </span>
          </button>

          {showAdvanced && (
            <div className="mt-2 p-3 bg-[#0A0A0A] border border-[#D4AF37]/25 grid grid-cols-2 gap-3 animate-fade-in-up">
              <DecoInput
                label="ดาเมจคริติคอล"
                unit="%"
                value={stats.critDamage || ""}
                onChange={(e) => updateField("critDamage", parseFloat(e.target.value) || 0)}
                placeholder="182.6"
              />
              <DecoInput
                label="ทำลายโล่"
                value={stats.shieldBreak || ""}
                onChange={(e) => updateField("shieldBreak", parseFloat(e.target.value) || 0)}
                placeholder="1425"
              />
            </div>
          )}
        </div>
      </div>
    </DecoCard>
  );
}
