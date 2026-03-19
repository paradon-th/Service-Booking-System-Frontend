# Auth Flow Skeleton

## Cookies
- `icube_access_token` – HttpOnly, sameSite=lax, secure in production
- `icube_refresh_token` – HttpOnly, sameSite=lax, secure in production

Set/clear functions in `lib/auth/session.ts` and used by API route handlers.

## API Route Handlers
- `POST /api/auth/login` → calls backend `/api/auth/login`, sets cookies
- `POST /api/auth/refresh` → uses refresh token cookie, issues new tokens
- `POST /api/auth/logout` → clears cookies
- `POST /api/auth/password/request` → triggers reset email
- `POST /api/auth/password/verify` → validates secret key
- `POST /api/auth/password/reset` → updates password with secret key
- `POST /api/auth/register` → placeholder returns 501 (self-service registration deferred)
- ทั้ง `/api/auth/login` และ `/api/auth/refresh` จะส่ง `serviceMainId` (ตั้งค่าได้ผ่าน env `SERVICE_MAIN_ID` หรือ `NEXT_PUBLIC_SERVICE_MAIN_ID`, ดีฟอลต์ 1)

## Middleware Guard
- `middleware.ts` redirects unauthenticated users away from protected pages and secure BFF endpoints
- Public routes: `/login`, `/register`, `/forgot-password`, `/verifycode`, `/newpassword` and password reset APIs
- Authenticated users visiting public pages redirect to `/overview`

## Client Forms
- `app/(public)/login` uses `LoginForm` to POST to `/api/auth/login`
- `app/(public)/forgot-password` posts to `/api/auth/password/request`
- `app/(public)/verifycode` verifies secret key and redirects to `/newpassword`
- `app/(public)/newpassword` completes password reset via `/api/auth/password/reset`
- `app/(public)/register` validates input and surfaces registration notice
- `store/permission-store.ts` + `use-permission.ts` โหลดสิทธิ์หลังล็อกอิน เพื่อควบคุมเมนูใน `nav-main`
- `hooks/use-logout.ts` เรียก `/api/auth/logout`, เคลียร์ permission store และ redirect กลับ `/login`
- Mapping `serviceFuncId` สำหรับเมนูดูที่ `lib/auth/service-functions.ts`/`lib/auth/navigation.ts`
- `lib/auth/server-permissions.ts` มี helper `ensurePermission` ให้ server component เรียกก่อน render เพื่อ block ผู้ไม่มีสิทธิ์ (ดูตัวอย่างใน `app/(app)/**/page.tsx`)

## Next Steps
- Implement access token usage in middleware for protected routes
- Wire refresh handler into fetch utilities / React Query
- Replace placeholder register route when backend endpoint is available
