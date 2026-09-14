"use client";

import React from "react";
import { CalculationResult } from "@/lib/calculator/types";
import { Zap, Flame, ShieldAlert, Target } from "lucide-react";

interface DamageResultProps {
  result: CalculationResult;
}

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

  return (
    <div className="rounded-card bg-graphite/40 border border-steel/60 p-6 md:p-8 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 mb-6 border-b border-steel/40">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-iris">
              ผลลัพธ์การคำนวณ
            </span>
            <h3 className="font-display text-xl text-pure font-light">
              ประมาณการความเสียหาย
            </h3>
          </div>
          <div className="px-2.5 py-1 rounded-full bg-cyan-signal/10 border border-cyan-signal/30 text-cyan-signal font-mono text-xs">
            วิเคราะห์เชิงลึก
          </div>
        </div>

        {/* Hero Damage Number: Average Damage */}
        <div className="p-6 rounded-card bg-abyss/90 border border-steel/70 mb-6 text-center">
          <span className="text-xs font-ui text-ash uppercase tracking-wider block mb-1">
            ดาเมจเฉลี่ย
          </span>
          <div className="font-display text-4xl md:text-5xl font-light text-pure tracking-tight my-1">
            {formatNumber(result.averageDamage)}
          </div>
          <span className="text-[11px] font-mono text-fog">
            คาดหวังตามโอกาสคริติคอล {formatDecimals(result.critChanceRate * 100, 2)}%
          </span>
        </div>

        {/* Primary 3 Grid Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6">
          {/* ดาเมจปกติ */}
          <div className="p-4 rounded-input bg-abyss/60 border border-steel/40 flex flex-col justify-between">
            <div className="flex items-center justify-between text-ash text-xs font-ui mb-2">
              <span>ดาเมจปกติ</span>
              <Target size={14} className="text-ash" />
            </div>
            <div className="font-mono text-xl font-medium text-pure">
              {formatNumber(result.normalDamage)}
            </div>
            <span className="text-[10px] font-mono text-fog mt-1">เมื่อไม่ติดคริติคอล</span>
          </div>

          {/* ดาเมจคริติคอล */}
          <div className="p-4 rounded-input bg-abyss/60 border border-iris/30 flex flex-col justify-between">
            <div className="flex items-center justify-between text-iris-pale text-xs font-ui mb-2">
              <span>ดาเมจคริติคอล</span>
              <Flame size={14} className="text-iris" />
            </div>
            <div className="font-mono text-xl font-medium text-iris-pale">
              {formatNumber(result.criticalDamage)}
            </div>
            <span className="text-[10px] font-mono text-fog mt-1">คูณดาเมจคริติคอล</span>
          </div>

          {/* โอกาสคริติคอล */}
          <div className="p-4 rounded-input bg-abyss/60 border border-cyan-signal/30 flex flex-col justify-between">
            <div className="flex items-center justify-between text-cyan-signal text-xs font-ui mb-2">
              <span>โอกาสคริติคอล</span>
              <Zap size={14} className="text-cyan-signal" />
            </div>
            <div className="font-mono text-xl font-medium text-pure">
              {formatDecimals(result.critChanceRate * 100, 2)}%
            </div>
            <span className="text-[10px] font-mono text-fog mt-1">หักลบต้านทานแล้ว</span>
          </div>
        </div>

        {/* Supporting Summary Cards */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-steel/30 text-xs font-ui">
          <div className="flex items-center justify-between p-3 rounded-input bg-abyss/40 border border-steel/30">
            <span className="text-ash">พูลดาเมจรวม</span>
            <span className="font-mono text-pure font-medium">
              {formatNumber(result.combinedPool)}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-input bg-abyss/40 border border-steel/30">
            <span className="text-ash">โล่ที่ดูดซับ</span>
            <span className="font-mono text-pure font-medium">
              {formatNumber(result.effectiveShieldReduction)}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-input bg-abyss/40 border border-steel/30">
            <span className="text-ash">การลดจากป้องกัน</span>
            <span className="font-mono text-pure font-medium">
              {formatDecimals(result.defenseReductionRate * 100, 2)}%
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-input bg-abyss/40 border border-steel/30">
            <span className="text-ash">พูลธาตุ</span>
            <span className="font-mono text-pure font-medium">
              {formatNumber(result.elementalPool)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
