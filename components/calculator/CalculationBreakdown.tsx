"use client";

import React, { useState } from "react";
import { CalculationBreakdownStage } from "@/lib/calculator/types";
import { ChevronDown, Eye, FileText } from "lucide-react";

interface CalculationBreakdownProps {
  stages: CalculationBreakdownStage[];
}

export function CalculationBreakdown({ stages }: CalculationBreakdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-card bg-neu-base shadow-neu-extruded transition-all duration-300">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 p-5 text-left transition-all duration-300 ease-out hover:shadow-neu-inset-sm focus-neu md:p-6"
      >
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-neu-base text-neu-accent shadow-neu-inset-deep">
            <FileText size={17} />
          </span>
          <div>
            <h4 className="font-display text-base font-bold tracking-tight text-neu-fg">
              รายละเอียดการคำนวณ
            </h4>
            <p className="mt-0.5 text-xs font-ui text-neu-muted">
              แจกแจงสูตรคำนวณอย่างโปร่งใสทั้ง 11 ขั้นตอน
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 text-xs font-ui text-neu-accent">
          <span className="hidden sm:inline">{isOpen ? "ซ่อนรายละเอียด" : "แสดงขั้นตอน"}</span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neu-base shadow-neu-extruded">
            <ChevronDown
              size={16}
              className={`transition-transform duration-300 ease-out ${isOpen ? "rotate-180" : ""}`}
            />
          </span>
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-500 ease-out ${
          isOpen ? "max-h-[40rem] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-4 p-5 pt-0 md:p-6 md:pt-0">
          {/* A carved basin holding the stage cards. */}
          <div className="space-y-4 rounded-card bg-neu-base p-4 shadow-neu-inset md:p-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {stages.map((stage) => (
                <div
                  key={stage.stepNumber}
                  className="flex flex-col justify-between rounded-well bg-neu-base p-4 shadow-neu-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-neu-extruded"
                >
                  <div>
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <span className="font-ui text-xs font-semibold text-neu-fg">
                        {stage.title}
                      </span>
                      <span className="shrink-0 rounded-full bg-neu-base px-2.5 py-0.5 font-numeric text-[10px] text-neu-muted shadow-neu-inset-sm">
                        ขั้นตอนที่ {stage.stepNumber}
                      </span>
                    </div>
                    <p className="mb-3 text-xs font-ui leading-relaxed text-neu-muted">
                      {stage.description}
                    </p>
                    {/* Formula sits in its own tight well. */}
                    <div className="mb-3 break-all rounded-xl bg-neu-base p-3 font-numeric text-[11px] leading-relaxed text-neu-fg shadow-neu-inset-sm">
                      {stage.formula}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-3">
                    <span className="text-[11px] font-ui text-neu-muted">ผลลัพธ์ขั้นตอนนี้:</span>
                    <span className="font-numeric text-xs font-bold text-neu-teal">
                      {typeof stage.value === "number"
                        ? stage.value.toLocaleString("th-TH")
                        : stage.value}{" "}
                      {stage.unit && (
                        <span className="font-normal text-neu-muted">{stage.unit}</span>
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 px-2 text-[11px] font-ui text-neu-muted">
            <Eye size={12} className="shrink-0 text-neu-accent" />
            <span>
              สูตรคำนวณทั้งหมดได้รับการปรับเทียบตามกลไกดาเมจของ Sword of Justice เวอร์ชันล่าสุด
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
