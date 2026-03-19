# แผนสร้าง Skeleton Next.js จากธีม Shadcn UI Kit

วัตถุประสงค์: ใช้ซอร์สโค้ดจาก `/Users/vysina/spic_workspace/shadcn-ui-kit-dashboard` เป็นฐานตั้งต้น แล้วปรับให้เหลือโครงสร้างขั้นต่ำสำหรับ iCube Server Frontend (Next.js) ก่อนเริ่มย้ายฟีเจอร์จาก Angular

## ภาพรวมขั้นตอน
1. **ดึงธีมเข้ามาทั้งชุด** → คัดลอก repo ธีมมาไว้ในโปรเจกต์ใหม่ (ลบไฟล์ build/cache)
2. **ปรับโครง App Router** → ย้าย route group, layout, และ page สำคัญให้ตรงกับสถาปัตยกรรมใหม่ `(public)` / `(app)`
3. **ตัดหน้าตัวอย่างที่ไม่ใช้** → ลบ dashboard/apps/demo ทั้งหมด เหลือเฉพาะโครง login + layout
4. **จัดระเบียบคอมโพเนนต์** → เก็บเฉพาะคอมโพเนนต์ที่ shell ต้องใช้ ย้ายไปตำแหน่งตามคู่มือโครงสร้าง
5. **ทำความสะอาด asset/config** → เคลียร์รูปภาพ demo, ปรับ package.json, config ต่าง ๆ
6. **ตรวจสอบ dependency** → รวบรวมรายชื่อที่ต้องคงไว้และที่ควรลบออก
7. **ยืนยัน skeleton** → รัน `npm run lint` และ `npm run dev` เพื่อเช็กว่าพื้นฐานยังทำงานได้หลังล้างของส่วนเกิน

ด้านล่างเป็นรายละเอียดเชิงลึกพร้อมเช็กลิสต์สำหรับแต่ละขั้น

## 1. คัดลอกธีมเข้ามา
- สร้าง branch ใหม่สำหรับ skeleton เช่น `feature/nextjs-skeleton`
- คัดลอกไฟล์จาก `/Users/vysina/spic_workspace/shadcn-ui-kit-dashboard` ทั้งหมดมาที่ root โปรเจกต์ (ยกเว้น
  - `.git/`
  - `.next/`
  - `node_modules/`
  - `bun.lock`, `package-lock.json`, `pnpm-lock.yaml` (เลือกใช้ตัวเดียวกับโปรเจกต์หลัก)
  - `README.md` ของธีม (เก็บเป็นอ้างอิงใน docs ได้)
- ลบไฟล์ชั่วคราวหรือ config ที่ไม่ใช้ เช่น `.gitignore` เดิมของธีม, `.nvmrc` (ถ้าจะใช้ตัวเดิมของโปรเจกต์)

## 2. ปรับโครง App Router
โครงสร้างเดิมของธีมอยู่ภายใต้ `app/dashboard/**` และใช้ route group `(guest)`/`(auth)`

เช็กลิสต์:
- [ ] ย้าย `app/dashboard/(guest)` → `app/(public)`
  - `layout.tsx` → `app/(public)/layout.tsx`
  - เลือกแบบฟอร์ม login ที่ต้องการ (แนะนำ `login/v2/page.tsx`), ย้ายไป `app/(public)/login/page.tsx`
  - นำไฟล์ `forgot-password/page.tsx`, `register/page.tsx` ที่ต้องการมาไว้ในเส้นทางใหม่ (`app/(public)/forgot-password/page.tsx`, ฯลฯ)
- [ ] ย้าย `app/dashboard/(auth)/layout.tsx` → `app/(app)/layout.tsx`
  - แนบ `app/dashboard/(auth)/error.tsx` → `app/(app)/error.tsx`
  - เปลี่ยน import ให้ชี้ path ใหม่ (`@/app/(app)/layout` ฯลฯ)
- [ ] สร้างหน้าเปล่า `app/(app)/page.tsx` หรือ `overview/page.tsx` เป็น placeholder หลังล็อกอิน (ไม่ใช้ตัวอย่างเดิม)
- [ ] ลบโฟลเดอร์ `app/dashboard` หลังย้ายไฟล์เสร็จ เพื่อหลีกเลี่ยง route ซ้ำซ้อน
- [ ] ปรับ `middleware.ts` ให้ไม่ redirect ไป `/dashboard/default` อีกต่อไป (ตั้งค่าใหม่เมื่อมี auth guard)

## 3. ตัดหน้าตัวอย่างและ sample components
ลบทุก dashboard/app/example ของธีมออก เพื่อให้ skeleton เบาสุด โดยเก็บเฉพาะไฟล์ที่ใช้งานจริง

**รายการลบหลัก (ทั้งหมดภายใต้ `app/(app)` หลังย้าย)**
- `apps/` (ai-chat, calendar, mail, etc.)
- `pages/` (products, onboarding-flow, pricing, error states)
- `hospital-management/`, `crypto/`, `ecommerce/`, `sales/`, `finance/`, `academy/`, `website-analytics/`, `project-management/`, `file-manager/`, `logistics/`, `payment/`, `hotel/` และ dashboards อื่น ๆ
- component folder ที่อยู่ภายใต้ route stubs ข้างต้น (`components/` ภายใต้แต่ละ dashboard)

**หน้า guest ที่ซ้ำกัน**
- เลือกเก็บ variant เดียวจาก `login/v1`/`login/v2` และ `register/v1`/`register/v2`
- ลบ `app/(public)/pages/**` ทั้งหมด (collection หน้าตัวอย่าง)

## 4. จัดระเบียบคอมโพเนนต์
- เก็บไดเรกทอรีต่อไปนี้ไว้: `components/ui`, `components/layout`, `components/theme-customizer`, `components/active-theme.tsx`, `components/custom-date-range-picker.tsx`
- ตรวจสอบ `components/ui/custom/**`:
  - `minimal-tiptap`, `prompt/**`, `count-animation.tsx` ใช้เฉพาะหน้า demo → ลบทิ้งเมื่อไม่มีการใช้งาน
- ตรวจสอบ `components/CardActionMenus.tsx`, `date-time-picker.tsx` ว่ายังจำเป็นต่อ UX จริงหรือไม่ (ถ้าไม่ใช้ให้ลบ)
- ย้ายคอมโพเนนต์ที่เหลือเข้าตามหมวดคู่มือโครงสร้างใหม่:
  - `components/layout/**` → เหมือนเดิม (sidebar, header, logo)
  - `components/ui/**` → ไม่แก้ไข (ใช้เป็น primitive)
  - เตรียม `components/shared` และ `components/features` ว่าง ๆ สำหรับงาน migrate ต่อไป

## 5. ทำความสะอาด asset และ config
- `public/` ของธีมมีภาพตัวอย่างจำนวนมาก ให้ลบทั้งหมดแล้วใส่เฉพาะ asset ของเรา (ยกเว้นไฟล์ที่ layout ต้องใช้ เช่น `logo.png` → เปลี่ยนเป็นโลโก้บริษัท)
- อัปเดต `components/layout/logo.tsx` ให้ใช้ asset ใหม่หรือเพียง text placeholder
- ปรับ `lib/utils.ts` → เอา logic `generateMeta` ที่ผูก domain `shadcnuikit.com` ออก หรือแก้ให้เป็น generic
- ปิดการใช้งาน `lib/ga.ts` และการเรียก `GoogleAnalyticsInit` ใน `app/layout.tsx` (เก็บไว้แต่คอมเมนต์จนกว่าจะใส่ Tracking จริง)
- ตรวจ `lib/fonts.ts` → เลือกเก็บ font ที่จะใช้จริง ลดจำนวนการโหลด font ที่ไม่จำเป็นเพื่อ performance

## 6. ตรวจสอบและตัด dependency
เช็กลิสต์เริ่มต้น:

| สถานะ | รายการ | หมายเหตุ |
| --- | --- | --- |
| คงไว้ | `next`, `react`, `react-dom`, `next-themes`, `nextjs-toploader`, `lucide-react` | จำเป็นต่อ layout/theme |
| คงไว้ | `class-variance-authority`, `clsx`, `tailwind-merge`, `tailwindcss`, `tailwindcss-animate` | สำหรับ UI primitive |
| คงไว้ | `@radix-ui/*` ชุด component ที่ primitive ใช้ | ตรวจสอบก่อนลบรายตัว |
| คงไว้ | `@hookform/resolvers`, `react-hook-form`, `zod`, `date-fns`, `sonner` | ฟอร์ม, validation, toast |
| พิจารณา | `@dnd-kit/*`, `@hello-pangea/dnd` | เก็บถ้า roadmap มี drag & drop (เช่น tag mapping) |
| พิจารณา | `@fullcalendar/*` | Angular เดิมมี scheduling/monitoring → ตัดสินใจหลังวิเคราะห์ความต้องการ |
| พิจารณา | `cmdk`, `embla-carousel-react`, `swiper`, `recharts`, `lottie-react`, `vaul` | ใช้เฉพาะหน้าสาธิต |
| พิจารณา | `@tiptap/*`, `react-markdown`, `remark-gfm`, `shiki` | ใช้กับ rich text editor/markdown demo |
| พิจารณา | `@tanstack/react-table` | อาจจำเป็นสำหรับตาราง (ควรเก็บไว้) |
| พิจารณา | `zustand` | พิจารณาจากแผน state management |

หลักการ: ลบ dependency เมื่อยืนยันว่าไม่มีการ import หลังทำความสะอาดไฟล์ (ใช้ `rg` ตรวจ)

## 7. ตั้งค่า OpenAPI Codegen สำหรับ API client
- ใช้สคริปต์ `scripts/generate-api.sh` เพื่อดึง spec (`https://localhost:1151/swagger/v1/swagger.json` เป็นค่าเริ่มต้น ปรับได้ผ่าน env `API_SPEC_URL`)
- สคริปต์จะ `curl -k` ไปยัง Swagger dev server แล้วเรียก `openapi-typescript-codegen` (client แบบ fetch) ออกไปที่ `lib/api/generated`
- รันด้วย `bun run generate:api` หรือ override ชื่อแพ็กเกจด้วย `API_PACKAGE_NAME=myClient bun run generate:api`
- ตรวจสอบผลลัพธ์และ commit ถ้าต้องการล็อกเวอร์ชัน client

## 8. ยืนยัน skeleton
- รัน `npm install`
- รัน `npm run lint` เพื่อเช็ก import/path ที่ยังชี้ไป route เก่า
- รัน `npm run dev` ตรวจ layout login + shell ว่ายังขึ้นได้ ไม่มี asset 404
- อัปเดต `README.md` หรือ `docs/` เพื่อบันทึกขั้นตอนที่ทำ

## หมายเหตุสำหรับงานต่อไป
- หลัง skeleton พร้อม ให้สร้างโครง path ตาม sitemap Angular (`app/(app)/overview`, `tag/configuration`, `data/editor`, ...)
- ตั้งค่า store/context สำหรับ session + permission ใน `store/`
- ใช้ `docs/nextjs-project-structure.md` เป็น reference ควบคู่กัน
- Auth flow เบื้องต้นดูที่ `docs/auth-flow.md` (route handlers + คุกกี้ + ฟอร์ม)
- ใช้ `PermissionGate` ครอบหน้าใน `(app)` เพื่อแสดงเฉพาะผู้มีสิทธิ์ (mapping service function ดู `lib/auth/service-functions.ts`)
