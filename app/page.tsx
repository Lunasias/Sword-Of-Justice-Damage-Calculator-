import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { FeatureCard } from "@/components/ui/Card";
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
  return (
    <div className="space-y-24 py-12 md:py-20">
      {/* 1. Hero Section (Section 10) */}
      <section className="max-w-content mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-graphite/30 border border-ash/30 text-xs font-mono text-signal-violet mb-8">
          <Sparkles size={13} />
          <span>ระบบคำนวณดาเมจมาตรฐาน Sword of Justice</span>
        </div>

        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-light text-almost-white tracking-tight max-w-4xl mx-auto leading-[1.15] mb-6">
          คำนวณดาเมจของคุณ
          <br />
          <span className="text-soft-white">อย่างแม่นยำ</span>
        </h1>

        <p className="font-ui text-base sm:text-lg text-ash max-w-2xl mx-auto leading-relaxed mb-10">
          เครื่องคำนวณดาเมจสำหรับ Sword of Justice
          พร้อมระบบบันทึกตัวละครและเปรียบเทียบค่าพลัง
          แสดงผลทุกขั้นตอนอย่างโปร่งใสตามกลไกดาเมจจริง
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/calculator">
            <Button size="lg" variant="primary" className="w-full sm:w-auto px-8">
              เริ่มคำนวณ →
            </Button>
          </Link>
          <Link href="/characters/public">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto px-8">
              ดูตัวละครสาธารณะ
            </Button>
          </Link>
        </div>
      </section>

      {/* 2. Live Calculation Preview Teaser */}
      <section className="max-w-content mx-auto px-4 sm:px-6">
        <div className="rounded-feature bg-abyss border border-steel/60 p-8 md:p-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-lg">
              <span className="text-xs font-mono text-cyan-signal uppercase tracking-wider block mb-2">
                ความโปร่งใสในทุกตัวเลข
              </span>
              <h2 className="font-display text-2xl sm:text-3xl text-pure font-light mb-4">
                แจกแจงสูตรละเอียด 11 ขั้นตอน
              </h2>
              <p className="text-sm font-ui text-ash leading-relaxed mb-6">
                ตั้งแต่พลังโจมตีจากเลเวลสกิล ดาเมจรวม การหักลบโล่พลังชี่
                ป้องกันสำนัก เจาะเกราะ ไปจนถึงดาเมจธาตุและอัตราคริติคอล
                ช่วยให้คุณจัดไอเทมและสเตตัสได้อย่างมีประสิทธิภาพสูงสุด
              </p>
              <Link href="/guide" className="inline-flex items-center gap-2 text-xs font-ui text-iris hover:underline">
                อ่านคู่มือสูตรคำนวณฉบับเต็ม <ArrowRight size={13} />
              </Link>
            </div>

            <div className="w-full lg:w-96 rounded-card bg-graphite/40 border border-steel/50 p-6 font-mono">
              <div className="text-xs text-ash mb-1">ตัวอย่างผลลัพธ์ (สกิลค้นหาความพ่ายแพ้ Lv.25)</div>
              <div className="text-3xl font-display text-pure my-2">12,873</div>
              <div className="text-xs text-cyan-signal mb-4">ดาเมจปกติเฉลี่ยต่อการโจมตี</div>
              
              <div className="space-y-2 text-xs border-t border-steel/40 pt-4">
                <div className="flex justify-between">
                  <span className="text-fog">ดาเมจคริติคอล:</span>
                  <span className="text-cloud">23,506</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-fog">โอกาสคริติคอล:</span>
                  <span className="text-cloud">65.11%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-fog">การลดจากป้องกัน:</span>
                  <span className="text-cloud">39.56%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Feature Cards Section (Section 39) */}
      <section className="max-w-content mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-display text-3xl sm:text-4xl text-pure font-light mb-3">
            เครื่องมือเพื่อผู้เล่นสายสถิติ
          </h2>
          <p className="font-ui text-sm text-ash leading-relaxed">
            ออกแบบด้วยความประณีตตามแนวคิด Editorial Design
            ตัดส่วนเกินออกทั้งหมด เพื่อเน้นย้ำความชัดเจนของข้อมูล
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            category="เครื่องคำนวณ"
            accentColor="iris"
            title="ระบบคำนวณ 11 ขั้นตอน"
            description="แยกคำนวณอย่างแม่นยำตามสูตรจริงของเกม ทั้งดาเมจรวม โจมตีธาตุทั้งหมด ข่มสำนัก และเจาะเกราะ"
            icon={<Calculator size={20} />}
          />

          <FeatureCard
            category="ข้อมูลดาเมจ"
            accentColor="cyan"
            title="จำลองผลลัพธ์เชิงลึก"
            description="แสดงทั้งดาเมจปกติ ดาเมจคริติคอล โอกาสคริติคอล และดาเมจเฉลี่ยที่คาดหวังต่อรอบการโจมตี"
            icon={<Activity size={20} />}
          />

          <FeatureCard
            category="ตัวละคร"
            accentColor="orchid"
            title="บันทึกบิลด์ตัวละคร"
            description="บันทึกและจัดการบิลด์ตัวละครส่วนตัวของคุณ สามารถโหลดเข้ามาคำนวณและปรับเปลี่ยนได้ตลอดเวลา"
            icon={<UserCheck size={20} />}
          />

          <FeatureCard
            category="ตัวละครสาธารณะ"
            accentColor="periwinkle"
            title="แลกเปลี่ยนบิลด์ในชุมชน"
            description="ค้นหาบิลด์ยอดนิยมจากผู้เล่นคนอื่น คัดลอกหรือนำค่าสเตตัสมาทดสอบคำนวณได้ทันที"
            icon={<Globe size={20} />}
          />

          <FeatureCard
            category="การวิเคราะห์"
            accentColor="paleIris"
            title="เปรียบเทียบผลลัพธ์สเตตัส"
            description="ทดสอบผลกระทบของการเพิ่มเจาะเกราะ เทียบกับการเพิ่มดาเมจรวม หรือการทำลายโล่พลังชี่"
            icon={<BarChart3 size={20} />}
          />

          <FeatureCard
            category="เครื่องมือขั้นสูง"
            accentColor="deepIris"
            title="กำหนดคุณสมบัติศัตรู"
            description="ปรับแต่งค่าป้องกัน โล่พลังชี่ ป้องกันสำนัก และต้านทานธาตุของบอสหรือเป้าหมายได้อย่างอิสระ"
            icon={<Sliders size={20} />}
          />
        </div>
      </section>

      {/* 4. Bottom CTA Section */}
      <section className="max-w-content mx-auto px-4 sm:px-6">
        <div className="rounded-feature bg-graphite/30 border border-steel/50 p-8 md:p-12 text-center">
          <h2 className="font-display text-3xl sm:text-4xl text-pure font-light mb-4">
            พร้อมวิเคราะห์ตัวละครของคุณหรือยัง?
          </h2>
          <p className="font-ui text-sm text-ash max-w-xl mx-auto mb-8 leading-relaxed">
            เริ่มต้นใช้งานได้ทันทีโดยไม่ต้องติดตั้งโปรแกรม
            หรือสมัครสมาชิกเพื่อบันทึกบิลด์ตัวละครสำหรับใช้งานระยะยาว
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/calculator">
              <Button size="lg" variant="primary" className="px-8">
                เริ่มคำนวณดาเมจ →
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="secondary" className="px-8">
                สร้างบัญชีผู้ใช้
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
