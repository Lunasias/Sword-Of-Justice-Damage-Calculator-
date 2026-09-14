import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { Calculator, ShieldCheck, Zap } from "lucide-react";

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
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-8 sm:px-6 md:py-12">
      <PageHeader
        eyebrow="เอกสารอ้างอิงและคู่มือ"
        title="คู่มือสูตรคำนวณดาเมจ Sword of Justice"
        description="รวบรวมคำศัพท์เกมมาตรฐานภาษาไทย และโครงสร้างสูตรการคำนวณความเสียหายอย่างเป็นระบบ"
      />

      {/* 1. Mandatory Terminology Reference Table */}
      <section className="space-y-5">
        <h2 className="flex items-center gap-3 font-display text-xl font-bold tracking-tight text-neu-fg">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neu-base text-neu-teal shadow-neu-inset-deep">
            <ShieldCheck size={18} />
          </span>
          1. ตารางเทียบคำศัพท์เกมมาตรฐาน
        </h2>
        <div className="h-px bg-neu-shadow-dark/40 shadow-[0_1px_0_rgb(255_255_255/0.6)]" />
        <p className="text-xs font-ui leading-relaxed text-neu-muted">
          เพื่อความเข้าใจที่ตรงกันและเป็นมาตรฐานเดียวกันทั้งระบบ แพลตฟอร์มกำหนดให้ใช้คำศัพท์ภาษาไทยเหล่านี้อย่างเคร่งครัด
        </p>

        {/* The table sits in a carved basin; its header is pressed in and each
            row floats as three joined tiles that lift on hover. */}
        <div className="overflow-x-auto rounded-card bg-neu-base p-3 shadow-neu-inset">
          <table className="w-full border-separate border-spacing-x-0 border-spacing-y-3 text-left text-xs font-ui">
            <thead>
              <tr className="text-neu-muted">
                <th className="rounded-l-xl bg-neu-base px-4 py-3 font-medium shadow-neu-inset-deep">
                  คำศัพท์เดิม / ต้นฉบับ
                </th>
                <th className="bg-neu-base px-4 py-3 font-semibold text-neu-fg shadow-neu-inset-deep">
                  คำศัพท์มาตรฐาน (ใช้ในระบบ)
                </th>
                <th className="rounded-r-xl bg-neu-base px-4 py-3 font-medium shadow-neu-inset-deep">
                  คำอธิบาย
                </th>
              </tr>
            </thead>
            <tbody>
              {terminologyMap.map((item, idx) => (
                <tr key={idx} className="group">
                  <td className="bg-neu-base px-4 py-3 font-numeric text-neu-muted shadow-neu-sm transition-shadow duration-300 group-hover:shadow-neu-extruded rounded-l-xl">
                    {item.source}
                  </td>
                  <td className="bg-neu-base px-4 py-3 font-semibold text-neu-teal shadow-neu-sm transition-shadow duration-300 group-hover:shadow-neu-extruded">
                    {item.thai}
                  </td>
                  <td className="bg-neu-base px-4 py-3 text-neu-muted shadow-neu-sm transition-shadow duration-300 group-hover:shadow-neu-extruded rounded-r-xl">
                    {item.desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 2. Core Damage Formula */}
      <section className="space-y-5">
        <h2 className="flex items-center gap-3 font-display text-xl font-bold tracking-tight text-neu-fg">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neu-base text-neu-accent shadow-neu-inset-deep">
            <Calculator size={18} />
          </span>
          2. โครงสร้างสูตรคำนวณดาเมจ
        </h2>
        <div className="h-px bg-neu-shadow-dark/40 shadow-[0_1px_0_rgb(255_255_255/0.6)]" />

        <div className="space-y-5 rounded-card bg-neu-base p-6 shadow-neu-inset md:p-8">
          <div>
            <span className="mb-2 block text-xs font-ui font-semibold text-neu-accent">
              สูตรดาเมจพื้นฐาน (Skill Damage):
            </span>
            <div className="rounded-well bg-neu-base p-4 font-numeric text-xs leading-relaxed text-neu-fg shadow-neu-extruded">
              ดาเมจปกติ = ตัวคูณสกิล × (พูลดาเมจปกติที่เหลือ + พูลดาเมจธาตุ)
            </div>
          </div>

          <div>
            <span className="mb-2 block text-xs font-ui font-semibold text-neu-accent">
              พลังโจมตีจากสกิล (Skill Attack):
            </span>
            <div className="rounded-well bg-neu-base p-4 font-numeric text-xs leading-relaxed text-neu-fg shadow-neu-extruded">
              Skill Attack = 923 + 81 × (ระดับสกิล - 15)
            </div>
          </div>

          <div>
            <span className="mb-2 block text-xs font-ui font-semibold text-neu-accent">
              พูลดาเมจเริ่มต้น (Initial Damage Pool):
            </span>
            <div className="rounded-well bg-neu-base p-4 font-numeric text-xs leading-relaxed text-neu-fg shadow-neu-extruded">
              พูลเริ่มต้น = พลังโจมตีจากสกิล + ดาเมจรวม + ข่มสำนัก - โล่พลังชี่ที่มีผล - ป้องกันสำนัก
            </div>
          </div>
        </div>
      </section>

      {/* 3. Detailed Mechanism Breakdowns */}
      <section className="space-y-6">
        <h2 className="flex items-center gap-3 font-display text-xl font-bold tracking-tight text-neu-fg">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neu-base text-neu-accent-light shadow-neu-inset-deep">
            <Zap size={18} />
          </span>
          3. รายละเอียดกลไกการลดทอนดาเมจ
        </h2>
        <div className="h-px bg-neu-shadow-dark/40 shadow-[0_1px_0_rgb(255_255_255/0.6)]" />

        {/* Each mechanism is a raised card; its formula is carved into it. */}
        {[
          {
            title: "การทำงานของโล่พลังชี่ และทำลายโล่",
            body: "โล่พลังชี่จะช่วยดูดซับความเสียหายก่อนลดเลือด ค่าทำลายโล่จะช่วยลดทอนประสิทธิภาพของโล่ลง เมื่อค่าทำลายโล่สูงกว่าหรือเท่ากับโล่พลังชี่ของศัตรู ผลของโล่จะกลายเป็นศูนย์โดยสิ้นเชิง",
            formula: null,
            note: null,
          },
          {
            title: "การเจาะเกราะและการลดทอนจากพลังป้องกัน",
            body: "พลังป้องกันคงเหลือ = max(ป้องกัน - เจาะเกราะ, 0)",
            formula: "อัตราลดทอนป้องกัน = พลังป้องกันคงเหลือ / (พลังป้องกันคงเหลือ + 2860)",
            note: "*เมื่อเจาะเกราะมากกว่าพลังป้องกัน อัตราการลดทอนจะเป็น 0% แต่จะไม่ให้ผลประโยชน์เพิ่มเกินค่า 0",
          },
          {
            title: "การคำนวณโจมตีธาตุทั้งหมด",
            body: null,
            formula: "พูลดาเมจธาตุ = โจมตีธาตุทั้งหมด × (1 - ต้านทานธาตุ / (ต้านทานธาตุ + 530))",
            note: "พูลดาเมจธาตุจะไม่ถูกลดทอนโดยพลังป้องกันกายภาพ แต่จะขึ้นตรงกับต้านทานธาตุของศัตรูเท่านั้น",
          },
          {
            title: "อัตราคริติคอลและดาเมจคริติคอล",
            body: null,
            formula:
              "โอกาสคริติคอล = 1.15 × (คริติคอล - ต้านทานคริติคอล) / ((คริติคอล - ต้านทานคริติคอล) + 938)",
            note: "ดาเมจคริติคอล = ดาเมจปกติ × (ดาเมจคริติคอล % / 100)",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="space-y-3 rounded-card bg-neu-base p-6 text-xs font-ui shadow-neu-extruded transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-neu-lifted"
          >
            <h3 className="font-display text-base font-bold tracking-tight text-neu-fg">
              {item.title}
            </h3>
            {item.body && <p className="leading-relaxed text-neu-muted">{item.body}</p>}
            {item.formula && (
              <div className="rounded-well bg-neu-base p-3.5 font-numeric text-[11px] leading-relaxed text-neu-fg shadow-neu-inset-sm">
                {item.formula}
              </div>
            )}
            {item.note && <p className="text-[11px] leading-relaxed text-neu-muted">{item.note}</p>}
          </div>
        ))}
      </section>

      {/* CTA to Calculator */}
      <div className="pt-4 text-center">
        <Link href="/calculator">
          <Button size="lg" variant="primary">
            ทดลองคำนวณด้วยตนเอง →
          </Button>
        </Link>
      </div>    </div>
  );
}
