# 逆水寒手游 Damage Calculator Web App (เครื่องคำนวณดาเมจ 逆水寒手游)

แพลตฟอร์มคำนวณดาเมจและวิเคราะห์ค่าพลังเชิงลึกสำหรับ **逆水寒手游 (Justice Online Mobile)** สร้างด้วย Next.js 15 (App Router), TypeScript, Tailwind CSS (Origin Financial Design System), และ Prisma ORM สำหรับ Neon PostgreSQL

---

## จุดเด่นของระบบ (Features)

1. **เครื่องคำนวณดาเมจแบบโปร่งใส 11 ขั้นตอน**:
   - พลังโจมตีจากสกิล
   - ดาเมจรวมเริ่มต้น
   - การลดจากโล่พลังชี่
   - การลดจากป้องกันสำนัก
   - การคำนวณเจาะเกราะ
   - การลดจากป้องกัน
   - การคำนวณโจมตีธาตุทั้งหมด
   - ดาเมจสุดท้าย (ดาเมจปกติ)
   - โอกาสคริติคอล
   - ดาเมจคริติคอล
   - ดาเมจเฉลี่ยที่คาดหวัง
2. **ระบบจัดการบิลด์ตัวละคร (Character Builds)**:
   - บันทึกบิลด์ตัวละครส่วนตัวได้ไม่จำกัด
   - โหลดตัวละครเข้าสู่เครื่องคำนวณได้อย่างอิสระ
   - **ความปลอดภัยของข้อมูล**: การแก้ไขค่าในเครื่องคำนวณจะไม่บันทึกทับตัวละครโดยอัตโนมัติ ต้องกด "บันทึกการเปลี่ยนแปลง" อย่างชัดเจนเท่านั้น
   - ตั้งค่าสถานะการเผยแพร่: ส่วนตัว (Private) หรือ สาธารณะ (Public)
3. **คลังตัวละครสาธารณะ (Public Characters Directory)**:
   - ค้นหาและดูรายละเอียดบิลด์ของผู้เล่นอื่น
   - ปุ่ม "ใช้คำนวณ" และ "คัดลอกตัวละคร" ไปยังบัญชีของตนเอง
4. **ระบบความปลอดภัยและการยืนยันตัวตน (Authentication & Authorization)**:
   - ระบบเซสชัน JWT บน HTTP-only Cookie ผ่านไลบรารี `jose`
   - แฮชรหัสผ่านด้วย `bcryptjs`
   - การตรวจสอบสิทธิ์ความเป็นเจ้าของและการอนุญาตทั้งหมดทำงานบนฝั่งเซิร์ฟเวอร์ (Server-side Authorization)
5. **แผงควบคุมผู้ดูแลระบบ (/admin)**:
   - ตรวจสอบสถิติระบบ: จำนวนผู้ใช้, จำนวนตัวละครทั้งหมด, บิลด์สาธารณะ และบิลด์ส่วนตัว
   - ระงับ / ปลดระงับบัญชีผู้ใช้
   - ลบบัญชีผู้ใช้และจัดการเนื้อหาตัวละครที่ไม่เหมาะสม
6. **การออกแบบและคำศัพท์ภาษาไทยมาตรฐาน (Neumorphism / Soft UI & Terminology)**:
   - ยึดตามระบบ Neumorphism (Soft UI) บนพื้นผิวสีเทาเย็น `#E0E5EC` เพียงสีเดียว
   - ความลึกทั้งหมดเกิดจากเงาคู่ที่ตรงข้ามกัน (แสงจากซ้ายบน / เงาตกขวาล่าง) แทนการใช้เส้นขอบ
   - ตัวอักษรหลัก `#3D4852` (คอนทราสต์ 7.5:1) และตัวอักษรรอง `#6B7280` (4.6:1) ผ่านมาตรฐาน WCAG AA
   - ใช้สีม่วง `#6C63FF` เฉพาะจุดที่ต้องเน้น (CTA, focus ring) อย่างจำกัด
   - การใช้คำศัพท์ภาษาไทยที่ถูกต้องและเคร่งครัดตามข้อกำหนด

---

## ระบบดีไซน์ (Neumorphism Design System)

ดีไซน์ทั้งหมดรวมศูนย์อยู่ที่ 3 จุด ไม่กระจายอยู่ในคอมโพเนนต์

| ไฟล์ | หน้าที่ |
|---|---|
| `tailwind.config.ts` | นิยามโทเคนสี รัศมีมุม และฟอนต์ (แหล่งความจริงเพียงหนึ่งเดียว) |
| `app/globals.css` | สูตรเงาทั้ง 6 ระดับ, สีพื้นผิว, focus ring, scrollbar |
| `components/ui/*` | คอมโพเนนต์พื้นฐาน (Button, Card, InputField, Modal, Toast, States, PageHeader) |

**สูตรเงา (Shadow Physics)** — อ้างอิงผ่านคลาสเชิงความหมาย ไม่เขียนค่าซ้ำในคอมโพเนนต์

| คลาส | ใช้กับ |
|---|---|
| `shadow-neu-extruded` | สถานะพักของทุกการ์ด/ปุ่ม |
| `shadow-neu-lifted` | สถานะ hover (ยกขึ้น) |
| `shadow-neu-sm` | องค์ประกอบขนาดเล็ก (chip, ไอคอน, แถวตาราง) |
| `shadow-neu-inset` | แผงที่ถูกกดลง (empty state, แถบสรุป) |
| `shadow-neu-inset-deep` | บ่อน้ำลึก (input, icon well, ตัวเลขหลัก) |
| `shadow-neu-inset-sm` | ร่องตื้น (divider, pill, ป้ายสถานะ) |

**หมายเหตุเรื่องฟอนต์**: ระบบดีไซน์กำหนด Plus Jakarta Sans (หัวเรื่อง) และ DM Sans (เนื้อหา)
แต่ทั้งสองฟอนต์ **ไม่มีชุดตัวอักษรไทย** โปรเจกต์นี้จึงโหลด `Noto Sans Thai` ต่อท้ายในทุก font stack
เพื่อให้ตัวอักษรไทยแสดงผลได้ครบถ้วน (ฟอนต์ละตินยังคงใช้ตามที่ระบบดีไซน์กำหนด)
และคง `JetBrains Mono` ไว้สำหรับตัวเลขในตารางคำนวณ 11 ขั้นตอนเพื่อให้หลักตรงกัน

---

## ตารางคำศัพท์เกมมาตรฐาน (Mandatory Thai Terminology)

| คำศัพท์เดิม / ภาษาจีน | คำศัพท์มาตรฐานภาษาไทย |
|---|---|
| กองโจมตี | **ดาเมจรวม** |
| กองโจมตีธาตุ | **โจมตีธาตุทั้งหมด** |
| ข่ม | **ข่มสำนัก** |
| ต้าน | **ป้องกันสำนัก** *(ห้ามใช้ ต้านทานสำนัก)* |
| 破防 | **เจาะเกราะ** |
| 气盾 | **โล่พลังชี่** |
| 破盾 | **ทำลายโล่** |
| 会心 | **คริติคอล** |
| 命中 | **ความแม่นยำ** |
| 格挡 | **บล็อก** |
| 会心防御 | **ต้านทานคริติคอล** |
| - | **ต้านทานธาตุ** |
| - | **ดาเมจคริติคอล / โอกาสคริติคอล / ดาเมจปกติ / ดาเมจเฉลี่ย** |

---

## การทดสอบชุดข้อมูลมาตรฐาน (Regression Baseline - Section 43)

ชุดข้อมูลตัวอย่างที่ใช้ทดสอบและยืนยันความถูกต้องของสูตรคำนวณ:
- **ตัวละคร**: ดาเมจรวม 8,185 / โจมตีธาตุทั้งหมด 2,073 / ข่มสำนัก 721 / เจาะเกราะ 3,150 / ทำลายโล่ 1,425 / ความแม่นยำ 1,232 / คริติคอล 1,686 / ดาเมจคริติคอล 182.6%
- **สกิล**: ค้นหาความพ่ายแพ้ (เลเวล 25, ตัวคูณ 276%, ธาตุสายฟ้า)
- **ศัตรู**: ป้องกัน 5,022 / โล่พลังชี่ 1,462 / ป้องกันสำนัก 3,476 / ต้านทานธาตุ 380 / บล็อก 782 / ต้านทานคริติคอล 462
- **ผลลัพธ์ที่ได้**:
  - Skill Attack: `1,733`
  - Initial damage pool: `10,639`
  - Effective shield reduction: `1,443.50` (โล่คงเหลือ `18.50`)
  - After school defense: `5,719.50`
  - Remaining defense: `1,872` (ลดทอนป้องกัน `39.56%`)
  - Remaining normal pool: `3,456.84`
  - Elemental pool: `1,207.35`
  - Combined pool: `4,664.19`
  - **ดาเมจปกติ**: `12,873`
  - **โอกาสคริติคอล**: `65.11%`
  - **ดาเมจคริติคอล**: `23,506`

---

## โครงสร้างโปรเจกต์ (Project Structure)

```
├── app/
│   ├── api/
│   │   ├── admin/           # Admin stats, user suspend/delete, character moderation
│   │   ├── auth/            # Register, login, logout, me
│   │   ├── characters/      # My characters, [id] CRUD, public directory
│   │   └── users/           # Profile update, public user profiles
│   ├── calculator/          # Interactive Damage Calculator with 3-column layout
│   ├── characters/          # My characters build management
│   │   └── public/          # Public community builds directory
│   ├── dashboard/           # User dashboard with stats & recent builds
│   ├── guide/               # Game formulas & Thai terminology guide
│   ├── profile/             # Profile management & password update
│   ├── admin/               # Administrative control center
│   ├── login/ & register/   # Secure authentication pages
│   ├── layout.tsx           # Root layout with font imports & providers
│   └── page.tsx             # Editorial Homepage with hero & feature cards
├── components/
│   ├── calculator/          # CharacterInputs, SkillInputs, EnemyInputs, DamageResult, Breakdown, SectionHeading
│   ├── character/           # CharacterCard
│   ├── layout/              # Navbar, Footer
│   └── ui/                  # Button, InputField, Card (+IconWell, CircleDecoration), Modal, Toast, States, PageHeader
├── lib/
│   ├── auth/                # JWT session, cookie handling, bcryptjs, server guards
│   ├── calculator/          # Isolated calculation engine, config, types, & regression tests
│   ├── db/                  # Prisma singleton client
│   └── validation/          # Zod validation schemas with Thai error messages
└── prisma/
    ├── schema.prisma        # PostgreSQL Neon schema (User, Character, Role, Visibility)
    └── seed.mjs             # Initial database seed script
```

---

## คำสั่งสำหรับพัฒนาและทดสอบ (Commands)

```bash
# ติดตั้ง dependencies
npm install

# รัน Unit Tests (สูตรคำนวณ, การตรวจสอบข้อมูล, รหัสผ่าน)
npm run test

# ตรวจสอบ TypeScript Types
npx tsc --noEmit

# รัน Linter
npm run lint

# บิลด์สำหรับ Production
npm run build

# รัน Server สำหรับพัฒนา
npm run dev
```

---

## การเชื่อมต่อฐานข้อมูล Neon PostgreSQL & การ Deploy สู่ Vercel

1. สร้างโปรเจกต์ฐานข้อมูลบน [Neon Console](https://neon.tech)
2. นำ Connection String มาใส่ใน Environment Variable:
   ```env
   DATABASE_URL="postgresql://user:password@ep-sample.us-east-2.aws.neon.tech/neondb?sslmode=require"
   AUTH_SECRET="your-32-character-random-secret"
   ```
3. รัน Migration ไปยัง Neon DB:
   ```bash
   npx prisma db push
   node prisma/seed.mjs
   ```
4. Deploy ขึ้น Vercel โดยตั้งค่า Environment Variables ข้างต้นในหน้า Vercel Project Settings
