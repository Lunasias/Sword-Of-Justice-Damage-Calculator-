import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { FeatureCard, CircleDecoration } from "@/components/ui/Card";
import {
  Calculator,
  Activity,
  UserCheck,
  Globe,
  BarChart3,
  Sliders,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  const resultRows = [
    { label: "ดาเมจคริติคอล", value: "23,506" },
    { label: "โอกาสคริติคอล", value: "65.11%" },
    { label: "การลดจากป้องกัน", value: "39.56%" },
  ];

  const features = [
    {
      category: "เครื่องคำนวณ",
      accentColor: "iris" as const,
      title: "ระบบคำนวณ 11 ขั้นตอน",
      description:
        "แยกคำนวณอย่างแม่นยำตามสูตรจริงของเกม ทั้งดาเมจรวม โจมตีธาตุทั้งหมด ข่มสำนัก และเจาะเกราะ",
      icon: <Calculator size={20} />,
    },
    {
      category: "ข้อมูลดาเมจ",
      accentColor: "cyan" as const,
      title: "จำลองผลลัพธ์เชิงลึก",
      description:
        "แสดงทั้งดาเมจปกติ ดาเมจคริติคอล โอกาสคริติคอล และดาเมจเฉลี่ยที่คาดหวังต่อรอบการโจมตี",
      icon: <Activity size={20} />,
    },
    {
      category: "ตัวละคร",
      accentColor: "orchid" as const,
      title: "บันทึกบิลด์ตัวละคร",
      description:
        "บันทึกและจัดการบิลด์ตัวละครส่วนตัวของคุณ สามารถโหลดเข้ามาคำนวณและปรับเปลี่ยนได้ตลอดเวลา",
      icon: <UserCheck size={20} />,
    },
    {
      category: "ตัวละครสาธารณะ",
      accentColor: "periwinkle" as const,
      title: "แลกเปลี่ยนบิลด์ในชุมชน",
      description:
        "ค้นหาบิลด์ยอดนิยมจากผู้เล่นคนอื่น คัดลอกหรือนำค่าสเตตัสมาทดสอบคำนวณได้ทันที",
      icon: <Globe size={20} />,
    },
    {
      category: "การวิเคราะห์",
      accentColor: "paleIris" as const,
      title: "เปรียบเทียบผลลัพธ์สเตตัส",
      description:
        "ทดสอบผลกระทบของการเพิ่มเจาะเกราะ เทียบกับการเพิ่มดาเมจรวม หรือการทำลายโล่พลังชี่",
      icon: <BarChart3 size={20} />,
    },
    {
      category: "เครื่องมือขั้นสูง",
      accentColor: "deepIris" as const,
      title: "กำหนดคุณสมบัติศัตรู",
      description:
        "ปรับแต่งค่าป้องกัน โล่พลังชี่ ป้องกันสำนัก และต้านทานธาตุของบอสหรือเป้าหมายได้อย่างอิสระ",
      icon: <Sliders size={20} />,
    },
  ];

  return (
    <div className="space-y-32 pb-24 pt-16 md:space-y-40 md:pt-24">
      {/* 1. Hero — the ambient depth circles live in the page margins, never
          behind the text, so contrast is untouched. */}
      <section className="relative overflow-hidden">
        <CircleDecoration
          size={320}
          float
          className="-right-40 -top-24 opacity-70 md:-right-24 md:-top-16"
        />
        <CircleDecoration
          size={200}
          className="-bottom-24 -left-28 opacity-60 md:-left-16"
        />

        <div className="relative mx-auto max-w-content px-4 text-center sm:px-6">
          <span className="mb-10 inline-flex items-center gap-2 rounded-full bg-neu-base px-4 py-2 text-xs font-ui shadow-neu-extruded">
            <Sparkles size={13} className="text-neu-accent" />
            <span className="text-neu-accent">ระบบคำนวณดาเมจมาตรฐาน Sword of Justice</span>
          </span>

          <h1 className="mx-auto mb-8 max-w-4xl font-display text-5xl font-extrabold leading-[1.1] tracking-tight text-neu-fg sm:text-6xl md:text-7xl">
            คำนวณดาเมจของคุณ
            <br />
            <span className="text-neu-accent">อย่างแม่นยำ</span>
          </h1>

          <p className="mx-auto mb-12 max-w-2xl text-base font-ui leading-relaxed text-neu-muted sm:text-lg">
            เครื่องคำนวณดาเมจสำหรับ Sword of Justice
            พร้อมระบบบันทึกตัวละครและเปรียบเทียบค่าพลัง
            แสดงผลทุกขั้นตอนอย่างโปร่งใสตามกลไกดาเมจจริง
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/calculator" className="w-full sm:w-auto">
              <Button size="lg" variant="primary" className="w-full px-8 sm:w-auto">
                เริ่มคำนวณ →
              </Button>
            </Link>
            <Link href="/characters/public" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full px-8 sm:w-auto">
                ดูตัวละครสาธารณะ
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Transparency teaser — nested depth: extruded panel → inset readout
          → extruded inner rows. */}
      <section className="mx-auto max-w-content px-4 sm:px-6">
        <div className="rounded-card bg-neu-base p-8 shadow-neu-extruded md:p-12">
          <div className="flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-center">
            <div className="max-w-lg">
              <span className="mb-3 block text-[11px] font-medium uppercase tracking-widest text-neu-teal">
                ความโปร่งใสในทุกตัวเลข
              </span>
              <h2 className="mb-5 font-display text-2xl font-bold tracking-tight text-neu-fg sm:text-3xl">
                แจกแจงสูตรละเอียด 11 ขั้นตอน
              </h2>
              <p className="mb-7 text-sm font-ui leading-relaxed text-neu-muted">
                ตั้งแต่พลังโจมตีจากเลเวลสกิล ดาเมจรวม การหักลบโล่พลังชี่
                ป้องกันสำนัก เจาะเกราะ ไปจนถึงดาเมจธาตุและอัตราคริติคอล
                ช่วยให้คุณจัดไอเทมและสเตตัสได้อย่างมีประสิทธิภาพสูงสุด
              </p>
              <Link
                href="/guide"
                className="inline-flex items-center gap-2 rounded-lg text-xs font-ui font-medium text-neu-accent transition-colors duration-300 hover:text-neu-accent-light focus-neu"
              >
                อ่านคู่มือสูตรคำนวณฉบับเต็ม <ArrowRight size={13} />
              </Link>
            </div>

            {/* Phone-sized readout, carved into the panel */}
            <div className="w-full rounded-card bg-neu-base p-6 shadow-neu-inset-deep lg:w-96">
              <div className="mb-1 text-xs font-ui text-neu-muted">
                ตัวอย่างผลลัพธ์ (สกิลค้นหาความพ่ายแพ้ Lv.25)
              </div>
              <div className="my-3 font-numeric text-4xl font-bold tracking-tight text-neu-accent">
                12,873
              </div>
              <div className="mb-5 text-xs font-ui text-neu-teal">
                ดาเมจปกติเฉลี่ยต่อการโจมตี
              </div>

              <div className="space-y-3 border-t border-neu-shadow-dark/30 pt-5">
                {resultRows.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between gap-3 rounded-xl bg-neu-base px-3.5 py-2.5 shadow-neu-extruded"
                  >
                    <span className="text-xs font-ui text-neu-muted">{row.label}</span>
                    <span className="font-numeric text-sm font-semibold text-neu-fg">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Feature grid */}
      <section className="mx-auto max-w-content px-4 sm:px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 font-display text-3xl font-extrabold tracking-tight text-neu-fg sm:text-4xl">
            เครื่องมือเพื่อผู้เล่นสายสถิติ
          </h2>
          <p className="text-sm font-ui leading-relaxed text-neu-muted">
            ทุกแผงถูกหล่อขึ้นจากพื้นผิวเดียวกัน ข้อมูลจึงเด่นออกมาแทนที่จะแข่งกับเส้นขอบ
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              category={feature.category}
              accentColor={feature.accentColor}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
      </section>

      {/* 4. Closing CTA — sinks into the surface to signal "end of page". */}
      <section className="mx-auto max-w-content px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-card bg-neu-base p-8 text-center shadow-neu-inset md:p-16">
          <CircleDecoration
            size={220}
            float
            className="-left-24 -top-16 opacity-40"
          />
          <div className="relative">
            <h2 className="mb-5 font-display text-3xl font-extrabold tracking-tight text-neu-fg sm:text-4xl">
              พร้อมวิเคราะห์ตัวละครของคุณหรือยัง?
            </h2>
            <p className="mx-auto mb-10 max-w-xl text-sm font-ui leading-relaxed text-neu-muted">
              เริ่มต้นใช้งานได้ทันทีโดยไม่ต้องติดตั้งโปรแกรม
              หรือสมัครสมาชิกเพื่อบันทึกบิลด์ตัวละครสำหรับใช้งานระยะยาว
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/calculator" className="w-full sm:w-auto">
                <Button size="lg" variant="primary" className="w-full px-8 sm:w-auto">
                  เริ่มคำนวณดาเมจ →
                </Button>
              </Link>
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" variant="secondary" className="w-full px-8 sm:w-auto">
                  สร้างบัญชีผู้ใช้
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
