# ขั้นตอนการสร้าง API Client จาก Swagger

ใช้สคริปต์ `scripts/generate-api.sh` เพื่อดึง OpenAPI spec จาก `https://localhost:1151/swagger/v1/swagger.json` แล้วสร้าง TypeScript client ด้วย `openapi-typescript-codegen`.

## วิธีรัน
```bash
API_SPEC_URL=https://localhost:1151/swagger/v1/swagger.json \
API_PACKAGE_NAME=icubeApi \
bun run generate:api
```

- จะสร้างโค้ดที่ `lib/api/generated` (core, services, models ตามสเปก)
- ค่าเริ่มต้นใช้ `-k` ใน `curl` เพื่อข้าม self-signed certificate; ปรับสคริปต์ได้ถ้าพัฒนาในสภาพแวดล้อมอื่น
- สามารถเปลี่ยนชื่อ package ด้วย `API_PACKAGE_NAME`

## การนำไปใช้
ตัวอย่างการสร้าง client พร้อม base URL และ header token:
```ts
import { icubeApi } from '@/lib/api/generated';

export const apiClient = new icubeApi({
  BASE: process.env.NEXT_PUBLIC_API_BASE ?? 'https://localhost:1151',
  WITH_CREDENTIALS: true,
  HEADERS: async () => ({
    Authorization: `Bearer ${await getAccessToken()}`
  })
});
```

จากนั้นเรียกบริการ เช่น
```ts
const result = await apiClient.auth.apiAuthLoginPost({
  username: 'admin',
  password: '***'
});
```

> หมายเหตุ: ชื่อเมธอดขึ้นกับสเปกที่ได้มาและแบบแผน naming ของ generator
