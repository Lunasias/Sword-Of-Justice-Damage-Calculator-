"use client";

import React from "react";
import { CalculationResult } from "@/lib/calculator/types";
import { Zap, Flame, ShieldAlert, Target } from "lucide-react";

interface DamageResultProps {
  result: CalculationResult;
}

/**
 * The calculator's focal surface.
 *
 * Nested depth does the work here: the panel is extruded, the hero readout
 * is carved deeply into it, and the three metric wells are carved one step
 * less so the eye still lands on the headline number first.
 */
export function DamageResult({ result }: DamageResultProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("th-TH", {
      maximumFractionDigits: 0,
    }).format(Math.round(num));
  };

  const formatDecimals = (num: number, digits = 2) => {
    return new Intl.NumberFormat("th-TH", {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(num);
  };

  const metrics = [
    {
      label: "ดาเมจปกติ",
      value: formatNumber(result.normalDamage),
      note: "เมื่อไม่ติดคริติคอล",
      icon: <Target size={15} />,
      accent: "text-neu-fg",
    },
    {
      label: "ดาเมจคริติคอล",
      value: formatNumber(result.criticalDamage),
      note: "คูณดาเมจคริติคอล",
      icon: <Flame size={15} />,
      accent: "text-neu-accent",
    },
    {
      label: "โอกาสคริติคอล",
      value: `${formatDecimals(result.critChanceRate * 100, 2)}%`,
      note: "หักลบต้านทานแล้ว",
      icon: <Zap size={15} />,
      accent: "text-neu-teal",
    },
  ];

  const summaries = [
    { label: "พูลดาเมจรวม", value: formatNumber(result.combinedPool) },
    { label: "โล่ที่ดูดซับ", value: formatNumber(result.effectiveShieldReduction) },
    { label: "การลดจากป้องกัน", value: `${formatDecimals(result.defenseReductionRate * 100, 2)}%` },
    { label: "พูลธาตุ", value: formatNumber(result.elementalPool) },
  ];

  return (
    <div className="flex flex-col justify-between rounded-card bg-neu-base p-6 shadow-neu-extruded md:p-8">
      <div>
        <div className="mb-6 flex items-start justify-between gap-3 pb-5">
          <div>
            <span className="mb-1 block text-[11px] font-medium uppercase tracking-widest text-neu-accent">
              ผลลัพธ์การคำนวณ
            </span>
            <h3 className="font-display text-xl font-bold tracking-tight text-neu-fg">
              ประมาณการความเสียหาย
            </h3>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-neu-base px-3 py-1.5 text-[11px] font-medium text-neu-teal shadow-neu-inset-sm">
            <ShieldAlert size={12} />
            วิเคราะห์เชิงลึก
          </span>
        </div>

        {/* Hero readout — carved deepest so it reads as the primary datum */}
        <div className="mb-6 rounded-card bg-neu-base p-6 text-center shadow-neu-inset-deep">
          <span className="mb-1 block text-xs font-ui uppercase tracking-wider text-neu-muted">
            ดาเมจเฉลี่ย
          </span>
          <div className="font-numeric text-4xl font-bold tracking-tight text-neu-accent md:text-5xl">
            {formatNumber(result.averageDamage)}
          </div>
          <span className="mt-2 block text-[11px] font-ui text-neu-muted">
            คาดหวังตามโอกาสคริติคอล {formatDecimals(result.critChanceRate * 100, 2)}%
          </span>
        </div>

        {/* Primary metrics */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="flex flex-col justify-between rounded-well bg-neu-base p-4 shadow-neu-inset transition-all duration-300 ease-out hover:shadow-neu-inset-deep"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="text-xs font-ui text-neu-muted">{metric.label}</span>
                <span className={`flex h-7 w-7 items-center justify-center rounded-full bg-neu-base shadow-neu-inset-sm ${metric.accent}`}>
                  {metric.icon}
                </span>
              </div>
              <div className={`font-numeric text-xl font-bold ${metric.accent}`}>{metric.value}</div>
              <span className="mt-1 text-[10px] font-ui text-neu-muted">{metric.note}</span>
            </div>
          ))}
        </div>

        {/* Supporting summary — shallow wells, lower visual weight */}
        <div className="grid grid-cols-1 gap-3 pt-5 sm:grid-cols-2">
          {summaries.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between gap-3 rounded-xl bg-neu-base px-3.5 py-2.5 shadow-neu-inset-sm"
            >
              <span className="text-xs font-ui text-neu-muted">{item.label}</span>
              <span className="font-numeric text-sm font-semibold text-neu-fg">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
