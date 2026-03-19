# โครงสร้างโปรเจกต์ Next.js (shadcn/ui Theme)

## เป้าหมาย
- รักษาความสอดคล้องของธีม Shadcn UI Kit พร้อมรองรับฟีเจอร์จาก Angular เดิม
- ลดแรงเสียดทานในการพอร์ตฟีเจอร์และดูแลระยะยาวด้วยโครงสร้างโค้ดที่สม่ำเสมอ
- สร้างมาตรฐานร่วมกันด้าน naming, state management, testing, และ code review

## ภาพรวม Directory Layout
โครงสร้างหลักของ Next.js โปรเจกต์ใหม่ (ไม่ใช้โฟลเดอร์ `src/`) จะเป็นดังนี้

```
.
├─ app/
│  ├─ (public)/
│  │  ├─ layout.tsx
│  │  └─ login/page.tsx
│  ├─ (app)/
│  │  ├─ layout.tsx
│  │  ├─ overview/page.tsx
│  │  └─ ...feature routes
│  ├─ api/
│  │  └─ auth/route.ts
│  ├─ layout.tsx
│  └─ globals.css
├─ components/
│  ├─ ui/
│  ├─ layout/
│  ├─ shared/
│  └─ features/
├─ hooks/
├─ lib/
├─ services/
├─ store/
├─ types/
├─ public/
├─ tests/
├─ middleware.ts
├─ next.config.ts
└─ package.json
```

- `app/` – ต้นทางของ App Router, Server Component, layout, และ global stylesheet (`globals.css` + `themes.css`)
  - `(public)` – กลุ่มหน้า guest (login, forgot-password, health)
  - `(app)` – กลุ่มหน้า authenticated พร้อม shell sidebar/header
  - `api/` – Route Handler (BFF) สำหรับ auth/token, proxy data ที่ต้องซ่อน secret
  - `layout.tsx` – RootLayout ใช้ `ThemeProvider`, `ActiveThemeProvider`, `NextTopLoader`, `Toaster`
- `components/ui` – คอมโพเนนต์พื้นฐานจาก shadcn/ui (ห้ามแก้ต้นฉบับ หากต้องขยายให้ห่อใน shared/feature)
- `components/layout` – Shell หลัก เช่น `AppSidebar`, `SiteHeader`, `ThemeCustomizerPanel`
- `components/shared` – คอมโพเนนต์ที่ใช้หลายโดเมน (breadcrumb, data table wrapper, form section)
- `components/features/<domain>` – คอมโพเนนต์ส่วนเล็ก/ฟอร์ม/ตารางของแต่ละโมดูล เช่น `auth`, `security`, `scheduling`
- `hooks/` – Custom hook ที่ไม่ผูกกับโดเมนเฉพาะ (เช่น `use-mobile`, `use-toast`, `useSignalR`)
- `lib/` – Utility, helper, schema, config (เช่น `lib/utils.ts`, `lib/fonts.ts`, `lib/validation/**`)
- `services/` – Client สำหรับเรียก API ภายนอกหรือฟังก์ชันที่แยก concerns (เช่น `services/auth.ts`, `services/tag.ts`)
- `store/` – Zustand store หรือ state container ระดับแอป (auth session, theme override)
- `types/` – Type definition/shared interface (เช่น API contract, DTO)
- `public/` – Asset สาธารณะ (ภาพ, icon, manifest)
- `tests/` – ไฟล์เทส unit/integration และ e2e setup

## Routing & Layout Rules
- ใช้ App Router พร้อม route group `(public)` และ `(app)` เพื่อควบคุม middleware/guard แยกกัน
- `app/(public)/layout.tsx` สำหรับหน้า guest (ไม่มี sidebar) และ `app/(app)/layout.tsx` สำหรับ authenticated shell
- ใช้ `middleware.ts` ตรวจโทเคน/สิทธิ์ก่อนเข้ากลุ่ม `(app)` และ redirect ไป `/login` เมื่อ session ไม่ถูกต้อง
- ตั้งไฟล์ `loading.tsx`/`error.tsx` ในแต่ละ route folder เพื่อแทน spinner/dialog ของ Angular เดิม
- ใช้ `generateMetadata` ในแต่ละ `page.tsx` เพื่อจัดการ title/SEO และ breadcrumb data
- Routing ที่ต้อง auth เลือกใช้ Server Component เพื่อ fetch data ฝั่ง server ก่อน render ลด flash states
- สำหรับ dynamic route ให้ใช้ `[id]`, `[...slug]` และสร้าง `generateStaticParams` เฉพาะที่ cache ได้

## Components & Reusability
- `components/ui/**` เป็น single source of truth สำหรับ primitive (button, card, table, dialog, sidebar); หากต้องเพิ่มพฤติกรรมให้ห่อด้วย component ใหม่ใน `shared` หรือ `features`
- `components/shared/**` เก็บคอมโพเนนต์ที่ reusable ในหลายโดเมน เช่น `DataTable`, `FormSection`, `FilterToolbar`
- `components/features/<domain>` แยกย่อยตาม module Angular เดิม เพื่อให้โค้ดแต่ละโดเมนมี boundary ชัดเจน
- `components/features/auth/permission-gate.tsx` ใช้ครอบ Server/Client page เพื่อบังคับตรวจสิทธิ์จาก store
- เฉพาะไฟล์ที่มี interactive state ฝั่ง client เท่านั้นที่ใส่ `"use client"` และให้วาง statement นี้บนสุด
- ใช้ `cn()` จาก `lib/utils` สำหรับรวม className และเคารพ naming class ของ Tailwind ให้สั้นกระชับ
- หลีกเลี่ยงการผูก API call ใน component โดยตรง ให้ใช้ hook (`useTagList`) หรือ service layer
- สร้าง Storybook ในอนาคต (optional) ให้สอดคล้องกับ `components/shared` เพื่อโชว์ state/variant ของ UI สำคัญ

## State, Data Fetching & API Layer
- ใช้ Server Component เป็นค่าเริ่มต้นสำหรับหน้าอ่านข้อมูล (overview, dashboard) เพื่อดึงข้อมูลก่อน render
- สำหรับ action (login, update form) ใช้ Server Action หรือ Route Handler (`app/api/**`) ที่ wrap API Angular backend
- Client component ที่ต้องโหลดข้อมูลหลัง mount ให้ใช้ hook + `fetch` ผ่าน service adapter หรือ TanStack Query หากต้อง caching/refresh
- สร้าง adapter ที่ `services/<domain>.ts` รวม endpoint, type, error handling และแยก concern จาก UI
- ค่า permission/user session เก็บใน `store/auth.ts` (Zustand) พร้อม hook `usePermission(resource, action)`
- SignalR/real-time ใช้ hook `useSignalR` ใน `hooks/` ที่จัดการ lifecycle, reconnect, และ broadcast state ผ่าน context/store
- ใช้ `lib/http.ts` หรือ wrapper บน top ของ `fetch` เพื่อแนบ header (STA token, factory) และจัดการ refresh token
- ทุก call ที่เขียนใน server action ต้องรองรับการจับ error และ map เป็น `AppError` ที่ UI สามารถอ่านได้

## Forms & Validation
- ใช้ `react-hook-form` + `@hookform/resolvers/zod` เป็นมาตรฐานสำหรับทุกฟอร์ม
- แยก schema ไว้ใน `lib/validation/<domain>.ts` และ export type (`z.infer`) ใช้ซ้ำทั้งฝั่ง server action และ client form
- แยก form เป็นคอมโพเนนต์ย่อย พร้อม component พื้นฐานจาก `components/ui` (Input, Select, Switch, Calendar)
- ใช้ `Form` wrapper ของ shadcn เพื่อเชื่อมกับ RHF และแสดง error/message แบบ統一
- Validation ฝั่ง server ต้อง re-use schema เดียวกันและโยน error กลับด้วย `setError` หรือ toast ที่มีรายละเอียด
- สำหรับฟอร์มหลายขั้นตอนให้สร้าง hook `useStepperForm` ใน `features` หรือ `shared` เพื่อจัดการ state/validation รายขั้นตอน

## Styling & Theme
- ใช้ Tailwind CSS 4 (syntax `@import "tailwindcss";`) ร่วมกับ CSS variable ใน `globals.css` และ preset ใน `themes.css`
- หลีกเลี่ยงการเพิ่มไฟล์ CSS แยก เว้นแต่ theme ต้องการ override เฉพาะจุด; ใช้ `@layer` ใน `globals.css` ถ้าต้องการกำหนด global rule
- รองรับ responsive ผ่าน utility class และ hook `useIsMobile`/`useIsTablet` สำหรับ logic เฉพาะหน้าจอ
- Theme customization ให้ใช้ `ActiveThemeProvider` และ `ThemeCustomizerPanel`; หากต้องเพิ่ม preset ใหม่ ให้แก้ไข `lib/themes.ts` และ `themes.css`
- คุม radius/scale/layout ผ่าน data attribute (`data-theme-*`) บน `<body>` ตามระบบ cookie เดิมของธีม
- Icon ใช้ `lucide-react` เท่านั้น; หากต้องใช้อื่นให้อยู่ใน `public/icons` และสร้าง wrapper component
- สำหรับ chart/table ให้แมปสีด้วย CSS variable (`--chart-*`) เพื่อรักษา contrast และทำงานกับ dark mode

## Testing & Quality
- Unit/Component test ใช้ `@testing-library/react` + `vitest` (หรือ `jest`) ครอบด้วย testing setup ใน `tests/setup.ts`
- Integration test สำหรับ service layer ใช้ Node test runner + mock fetch (MSW)
- E2E test ใช้ Playwright ครอบ flow สำคัญ (login, permission guard, navigation, form submission)
- เปิด ESLint พร้อม config จาก `eslint-config-next`, plugin `readable-tailwind`, rule ปรับให้ห้าม `any` และบังคับ import order
- ใช้ Prettier + `prettier-plugin-tailwindcss` เพื่อจัดรูปแบบ className โดยอัตโนมัติ
- CI ควรตรวจ `npm run lint`, `npm run test`, `npx playwright test` ก่อน merge
- Coverage เป้าหมาย 70%+ สำหรับโมดูลใหม่ โดยเฉพาะ logic permission และ critical form

## Environment & Configuration
- เก็บ secret ใน `.env.local` และอย่า commit; ค่าที่ client ต้องใช้ให้ prefix `NEXT_PUBLIC_`
- สร้างไฟล์ตัวอย่าง `.env.example` ระบุ key ที่ต้องการ (API_URL, STA_CLIENT_ID ฯลฯ)
- `next.config.ts` ปรับ `images.remotePatterns`, `assetPrefix` (ถ้าต้อง deploy CDN) และเปิด `experimental.serverActions` ตามต้องการ
- `middleware.ts` สำหรับ auth guard/redirect; ควรใช้ constant ของ path จาก `lib/routes.ts` เพื่อลด magic string
- Logging/analytics (GA4) อยู่ใน `lib/ga.ts` เรียกใน RootLayout เฉพาะ production
- ตั้งค่า `tsconfig.json` ให้ใช้ `moduleResolution: "bundler"`, path alias `@/*`, `strict: true`
- ใช้ `postcss.config.mjs` และ `tailwind.config` ที่มากับธีม Shadcn UI Kit โดยปรับ content ให้ครอบไฟล์ที่เราเพิ่ม
- ใช้ Node.js 20 ขึ้นไป (แนะนำ LTS) และเปิด `reactStrictMode` ใน `next.config.ts`
- สร้าง/อัปเดต client จาก Swagger ด้วย `bun run generate:api` (สคริปต์ `scripts/generate-api.sh`, override URL ผ่าน `API_SPEC_URL`)
- Route handler ที่ต้องคุยกับ backend ให้ใช้งาน BFF ใน `app/api/**` (อ้างอิง `docs/auth-flow.md` สำหรับ skeleton login/refresh/logout)
- กำหนด environment สำหรับ auth (`SERVICE_MAIN_ID`, `NEXT_PUBLIC_API_BASE`) เพื่อให้ BFF ส่งข้อมูลถูกต้อง

## Workflow & Coding Rules
- ใช้ Conventional Commits (`feat:`, `fix:`, `chore:`) เพื่อสื่อสารการเปลี่ยนแปลงชัดเจน
- ทุก PR ต้องอัปเดตเอกสารหรือ story ที่เกี่ยวข้อง (เช่น README module, migration plan)
- Code review focus: correctness (data/permission), UX consistency กับธีม, performance (server/client boundary), accessibility
- ห้าม push โค้ดที่มี warning จาก ESLint/TypeScript หรือ test fail
- Require pair review สำหรับส่วนที่แตะ auth/permission หรือ service สำคัญ
- จัดทำ ADR สั้น ๆ (`docs/adr/YYYY-MM-DD-*.md`) เมื่อมีการตัดสินใจใหญ่ (เปลี่ยน lib, เปลี่ยน state management)
- ใช้ feature flag ผ่าน env หรือ config เพื่อ rollout ฟีเจอร์ใหญ่ได้ทีละส่วน
