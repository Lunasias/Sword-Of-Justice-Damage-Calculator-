import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { BookOpen, Calculator, ShieldCheck, Zap, ArrowRight } from "lucide-react";

export default function GuidePage() {
  const terminologyMap = [
    { source: "กองโจมตี", thai: "ดาเมจรวม", desc: "พลังโจมตีรวมจากหน้าสเตตัสหลัก" },
    { source: "กองโจมตีธาตุ", thai: "โจมตีธาตุทั้งหมด", desc: "พลังโจมตีรวมของทุกธาตุ" },
    { source: "ข่ม", thai: "ข่มสำนัก", desc: "เพิ่มดาเมจต่อสำนักคู่ต่อสู้โดยตรง" },
    { source: "ต้าน", thai: "ป้องกันสำนัก", desc: "ลดทอนดาเมจจากสำนักฝ่ายตรงข้าม (ห้ามใช้ ต้านทานสำนัก)" },
    { source: "破防", thai: "เจาะเกราะ", desc: "ลดพลังป้องกันของเป้าหมายก่อนคิดเปอร์เซ็นต์ลดดาเมจ" },
    { source: "气盾", thai: "โล่พลังชี่", desc: "เกราะพลังชี่ที่ดูดซับดาเมจก่อนเข้าเลือดจริง" },
    { source: "破盾", thai: "ทำลายโล่", desc: "ลดทอนโล่พลังชี่ของเป้าหมาย" },
    { source: "会心", thai: "คริติคอล", desc: "ค่าเพิ่มโอกาสโจมตีติดคริติคอล" },
    { source: "命中", thai: "ความแม่นยำ", desc: "ลดโอกาสที่ศัตรูจะบล็อกการโจมตี" },
    { source: "格挡", thai: "บล็อก", desc: "โอกาสลดทอนหรือปัดป้องความเสียหาย" },
    { source: "会心防御", thai: "ต้านทานคริติคอล", desc: "ลดโอกาสติดคริติคอลของฝ่ายตรงข้าม" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-10">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <BookOpen size={20} className="text-iris" />
          <span className="text-xs font-mono text-iris uppercase tracking-wider">
            เอกสารอ้างอิงและคู่มือ
          </span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl text-almost-white font-light">
          คู่มือสูตรคำนวณดาเมจ Sword of Justice
        </h1>
        <p className="text-xs sm:text-sm font-ui text-ash mt-1 leading-relaxed">
          รวบรวมคำศัพท์เกมมาตรฐานภาษาไทย และโครงสร้างสูตรการคำนวณความเสียหายอย่างเป็นระบบ
        </p>
      </div>

      {/* 1. Mandatory Terminology Reference Table */}
      <section className="space-y-4">
        <h2 className="font-display text-xl text-pure font-light pb-2 border-b border-steel/30 flex items-center gap-2">
          <ShieldCheck size={18} className="text-cyan-signal" />
          1. ตารางเทียบคำศัพท์เกมมาตรฐาน
        </h2>
        <p className="text-xs font-ui text-ash leading-relaxed">
          เพื่อความเข้าใจที่ตรงกันและเป็นมาตรฐานเดียวกันทั้งระบบ แพลตฟอร์มกำหนดให้ใช้คำศัพท์ภาษาไทยเหล่านี้อย่างเคร่งครัด
        </p>

        <div className="overflow-x-auto rounded-card border border-steel/40 bg-graphite/20">
          <table className="w-full text-left text-xs font-ui">
            <thead className="bg-abyss/80 text-ash border-b border-steel/40">
              <tr>
                <th className="p-3.5 font-mono">คำศัพท์เดิม / ต้นฉบับ</th>
                <th className="p-3.5 font-medium text-pure">คำศัพท์มาตรฐาน (ใช้ในระบบ)</th>
                <th className="p-3.5">คำอธิบาย</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-steel/30">
              {terminologyMap.map((item, idx) => (
                <tr key={idx} className="hover:bg-steel/20 transition-colors">
                  <td className="p-3.5 font-mono text-fog">{item.source}</td>
                  <td className="p-3.5 font-medium text-cyan-signal">{item.thai}</td>
                  <td className="p-3.5 text-ash">{item.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 2. Core Damage Formula */}
      <section className="space-y-4">
        <h2 className="font-display text-xl text-pure font-light pb-2 border-b border-steel/30 flex items-center gap-2">
          <Calculator size={18} className="text-iris" />
          2. โครงสร้างสูตรคำนวณดาเมจ
        </h2>

        <div className="p-6 rounded-card bg-abyss border border-steel/50 font-mono text-xs space-y-4">
          <div>
            <span className="text-iris font-semibold block mb-1">สูตรดาเมจพื้นฐาน (Skill Damage):</span>
            <div className="p-3 rounded bg-obsidian border border-steel/40 text-pure">
              ดาเมจปกติ = ตัวคูณสกิล × (พูลดาเมจปกติที่เหลือ + พูลดาเมจธาตุ)
            </div>
          </div>

          <div>
            <span className="text-iris font-semibold block mb-1">พลังโจมตีจากสกิล (Skill Attack):</span>
            <div className="p-3 rounded bg-obsidian border border-steel/40 text-pure">
              Skill Attack = 923 + 81 × (ระดับสกิล - 15)
            </div>
          </div>

          <div>
            <span className="text-iris font-semibold block mb-1">พูลดาเมจเริ่มต้น (Initial Damage Pool):</span>
            <div className="p-3 rounded bg-obsidian border border-steel/40 text-pure">
              พูลเริ่มต้น = พลังโจมตีจากสกิล + ดาเมจรวม + ข่มสำนัก - โล่พลังชี่ที่มีผล - ป้องกันสำนัก
            </div>
          </div>
        </div>
      </section>

      {/* 3. Detailed Mechanism Breakdowns */}
      <section className="space-y-6">
        <h2 className="font-display text-xl text-pure font-light pb-2 border-b border-steel/30 flex items-center gap-2">
          <Zap size={18} className="text-orchid-bloom" />
          3. รายละเอียดกลไกการลดทอนดาเมจ
        </h2>

        {/* Qi Shield */}
        <div className="p-5 rounded-card bg-graphite/20 border border-steel/40 space-y-2 text-xs font-ui">
          <h3 className="font-display text-base text-pure font-light">
            การทำงานของโล่พลังชี่ และทำลายโล่
          </h3>
          <p className="text-ash leading-relaxed">
            โล่พลังชี่จะช่วยดูดซับความเสียหายก่อนลดเลือด ค่าทำลายโล่จะช่วยลดทอนประสิทธิภาพของโล่ลง
            เมื่อค่าทำลายโล่สูงกว่าหรือเท่ากับโล่พลังชี่ของศัตรู ผลของโล่จะกลายเป็นศูนย์โดยสิ้นเชิง
          </p>
        </div>

        {/* Armor Penetration & Defense */}
        <div className="p-5 rounded-card bg-graphite/20 border border-steel/40 space-y-2 text-xs font-ui">
          <h3 className="font-display text-base text-pure font-light">
            การเจาะเกราะและการลดทอนจากพลังป้องกัน
          </h3>
          <p className="text-ash leading-relaxed mb-2">
            พลังป้องกันคงเหลือ = max(ป้องกัน - เจาะเกราะ, 0)
          </p>
          <div className="p-2.5 rounded bg-abyss font-mono text-[11px] text-cloud">
            อัตราลดทอนป้องกัน = พลังป้องกันคงเหลือ / (พลังป้องกันคงเหลือ + 2860)
          </div>
          <p className="text-fog text-[11px] mt-1">
            *เมื่อเจาะเกราะมากกว่าพลังป้องกัน อัตราการลดทอนจะเป็น 0% แต่จะไม่ให้ผลประโยชน์เพิ่มเกินค่า 0
          </p>
        </div>

        {/* Elemental Damage */}
        <div className="p-5 rounded-card bg-graphite/20 border border-steel/40 space-y-2 text-xs font-ui">
          <h3 className="font-display text-base text-pure font-light">
            การคำนวณโจมตีธาตุทั้งหมด
          </h3>
          <div className="p-2.5 rounded bg-abyss font-mono text-[11px] text-cloud">
            พูลดาเมจธาตุ = โจมตีธาตุทั้งหมด × (1 - ต้านทานธาตุ / (ต้านทานธาตุ + 530))
          </div>
          <p className="text-ash leading-relaxed mt-1">
            พูลดาเมจธาตุจะไม่ถูกลดทอนโดยพลังป้องกันกายภาพ แต่จะขึ้นตรงกับต้านทานธาตุของศัตรูเท่านั้น
          </p>
        </div>

        {/* Critical Formula */}
        <div className="p-5 rounded-card bg-graphite/20 border border-steel/40 space-y-2 text-xs font-ui">
          <h3 className="font-display text-base text-pure font-light">
            อัตราคริติคอลและดาเมจคริติคอล
          </h3>
          <div className="p-2.5 rounded bg-abyss font-mono text-[11px] text-cloud">
            โอกาสคริติคอล = 1.15 × (คริติคอล - ต้านทานคริติคอล) / ((คริติคอล - ต้านทานคริติคอล) + 938)
          </div>
          <p className="text-ash leading-relaxed mt-1">
            ดาเมจคริติคอล = ดาเมจปกติ × (ดาเมจคริติคอล % / 100)
          </p>
        </div>
      </section>

      {/* CTA to Calculator */}
      <div className="pt-4 text-center">
        <Link href="/calculator">
          <Button size="lg" variant="primary">
            ทดลองคำนวณด้วยตนเอง →
          </Button>
        </Link>
      </div>
    </div>
  );
}
