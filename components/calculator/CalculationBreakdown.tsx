"use client";

import React, { useState } from "react";
import { CalculationBreakdownStage } from "@/lib/calculator/types";
import { ChevronDown, ChevronUp, Eye, FileText } from "lucide-react";

interface CalculationBreakdownProps {
  stages: CalculationBreakdownStage[];
}

export function CalculationBreakdown({ stages }: CalculationBreakdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-card bg-graphite/30 border border-steel/50 overflow-hidden transition-all">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full p-5 flex items-center justify-between hover:bg-graphite/50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-nav bg-abyss text-iris border border-steel/50">
            <FileText size={16} />
          </div>
          <div>
            <h4 className="font-display text-base text-pure font-light">
              รายละเอียดการคำนวณ
            </h4>
            <p className="text-xs font-ui text-ash">
              แจกแจงสูตรคำนวณอย่างโปร่งใสทั้ง 11 ขั้นตอน
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-ui text-iris">
          <span>{isOpen ? "ซ่อนรายละเอียด" : "แสดงขั้นตอน"}</span>
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {isOpen && (
        <div className="p-5 md:p-6 border-t border-steel/40 bg-abyss/40 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stages.map((stage) => (
              <div
                key={stage.stepNumber}
                className="p-4 rounded-input bg-graphite/20 border border-steel/30 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-ui font-medium text-pure text-xs">
                      {stage.title}
                    </span>
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-steel/30 text-cloud">
                      ขั้นตอนที่ {stage.stepNumber}
                    </span>
                  </div>
                  <p className="text-xs font-ui text-ash mb-2 leading-relaxed">
                    {stage.description}
                  </p>
                  <div className="p-2 rounded bg-abyss/80 border border-steel/30 font-mono text-[11px] text-cloud/90 break-all mb-3">
                    {stage.formula}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-steel/20 text-xs">
                  <span className="text-fog font-ui">ผลลัพธ์ขั้นตอนนี้:</span>
                  <span className="font-mono text-cyan-signal font-semibold">
                    {typeof stage.value === "number"
                      ? stage.value.toLocaleString("th-TH")
                      : stage.value}{" "}
                    {stage.unit && <span className="text-ash font-normal">{stage.unit}</span>}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-[11px] font-ui text-fog flex items-center gap-2">
            <Eye size={12} className="text-iris" />
            <span>
              สูตรคำนวณทั้งหมดได้รับการปรับเทียบตามกลไกดาเมจของ Sword of Justice เวอร์ชันล่าสุด
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
