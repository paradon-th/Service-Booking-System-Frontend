# Production Line Code Refactoring Summary

## Overview
ทำการย่อยโค้ดจาก `dialogOverview.tsx` ออกมาเป็นส่วนย่อยๆ เพื่อให้โค้ดอ่านง่ายและบำรุงรักษาได้สะดวกขึ้น

## Files Created

### 1. API Route Handler
**File**: `/app/api/production-lines/data/route.ts`
- จัดการการดึงข้อมูลจาก 4 endpoints (day241, day31, year241, year31)
- รับ parameter `type` เพื่อระบุว่าต้องการข้อมูลชนิดไหน
- คืนค่าเป็น JSON พร้อม success status และ timestamp

**การใช้งาน**:
```typescript
const response = await fetch('/api/production-lines/data?type=day241');
const result = await response.json();
// result.data จะเป็น array ของข้อมูล
```

### 2. Utility Functions
**File**: `/lib/services/productionLineUtils.ts`
- รวม helper functions ทั้งหมดที่เกี่ยวกับการแปลงและจัดการข้อมูล
- ประกอบด้วย:
  - `decorateDatumWithMockSignals()` - เพิ่ม mock data (holidays, capacity, edit logs)
  - `transformApiData()` - แปลงข้อมูล API เป็นรูปแบบ daily
  - `transformMonthlyApiData()` - แปลงข้อมูล API เป็นรูปแบบ monthly
  - `groupByPartNo()` - จัดกลุ่มข้อมูลตาม part_no สำหรับ daily view
  - `groupByPartNoMonthly()` - จัดกลุ่มข้อมูลตาม part_no สำหรับ monthly view
  - `createDynamicOptions()` - สร้าง options สำหรับ filters
  - Helper functions อื่นๆ เช่น `getMonthName()`, `isDateInRange()`

**การใช้งาน**:
```typescript
import { transformApiData, groupByPartNo } from '@/lib/services/productionLineUtils';

const dailyData = transformApiData(data241, data31, dateRange);
const sections = groupByPartNo(data241, data31, dateRange);
```

### 3. Custom Hook for Data Fetching
**File**: `/hooks/use-production-line-data.ts`
- Hook สำหรับดึงข้อมูลจาก API
- จัดการ loading state และ error handling
- รองรับการโหลดจาก sessionStorage cache
- ป้องกันการ fetch ซ้ำๆ

**การใช้งาน**:
```typescript
const { data, isLoading, error } = useProductionLineData({
  type: 'day241',
  typeDialog: 'overview',
  openByOverview: true,
  enabled: true,
});
```

### 4. Skeleton Components
**Files**: 
- `/components/custom-component/ChartSkeleton.tsx`
- `/components/custom-component/TableSkeleton.tsx`

- Component สำหรับแสดง loading state
- สามารถนำกลับมาใช้ได้ในหลายๆ ที่

**การใช้งาน**:
```tsx
import { ChartSkeleton } from '@/components/custom-component/ChartSkeleton';
import { TableSkeleton } from '@/components/custom-component/TableSkeleton';

{isLoading ? <ChartSkeleton /> : <YourChart />}
{isLoading ? <TableSkeleton /> : <YourTable />}
```

## การ Refactor dialogOverview.tsx

### Before:
- มี fetch functions 4 ตัว (fetchDay241, fetchDay31, fetchYear241, fetchYear31) อยู่ในตัว component
- มี helper functions จำนวนมาก (transformApiData, groupByPartNo, etc.)
- มี skeleton components แบบ inline
- ไฟล์ยาวมากกว่า 1900 บรรทัด

### After (แนะนำ):
```tsx
import { useProductionLineData } from '@/hooks/use-production-line-data';
import { 
  transformApiData, 
  groupByPartNo, 
  groupByPartNoMonthly,
  createDynamicOptions 
} from '@/lib/services/productionLineUtils';
import { ChartSkeleton } from '@/components/custom-component/ChartSkeleton';
import { TableSkeleton } from '@/components/custom-component/TableSkeleton';

// ใน component
const shouldFetch = typeDialog === 'overview' || (typeDialog === 'simulation' && openByOverview);

const { data: DataDay241, isLoading: isLoadingDay241 } = useProductionLineData({
  type: 'day241',
  typeDialog,
  openByOverview,
  enabled: shouldFetch,
});

const { data: DataDay31, isLoading: isLoadingDay31 } = useProductionLineData({
  type: 'day31',
  typeDialog,
  openByOverview,
  enabled: shouldFetch,
});

const { data: DataYear241, isLoading: isLoadingYear241 } = useProductionLineData({
  type: 'year241',
  typeDialog,
  openByOverview,
  enabled: shouldFetch,
});

const { data: DataYear31, isLoading: isLoadingYear31 } = useProductionLineData({
  type: 'year31',
  typeDialog,
  openByOverview,
  enabled: shouldFetch,
});

// ใช้ utility functions แทน inline logic
useEffect(() => {
  if (DataDay241.length > 0 || DataDay31.length > 0) {
    const sections = groupByPartNo(filteredDay241, filteredDay31, dateRange);
    setDailySections(sections);
    
    const { partNoOptions, subAssyOptions } = createDynamicOptions(sections);
    setPartNoOptions(partNoOptions);
    setSubAssyOptions(subAssyOptions);
  }
}, [DataDay241, DataDay31, dateRange]);

// ใช้ skeleton components
{isLoadingDay241 || isLoadingDay31 ? <ChartSkeleton /> : <BarLineChart {...chartProps} />}
{isLoadingDay241 || isLoadingDay31 ? <TableSkeleton /> : <ProductionMatrixTable {...tableProps} />}
```

## Benefits

1. **ลดความซับซ้อน**: ไฟล์ dialogOverview.tsx จะสั้นลงมากและอ่านง่ายขึ้น
2. **นำกลับมาใช้ได้**: Utility functions และ components สามารถใช้ในที่อื่นได้
3. **ง่ายต่อการทดสอบ**: แยก logic ออกมาทำให้ทดสอบง่ายขึ้น
4. **บำรุงรักษาง่าย**: แก้ไข logic ในที่เดียว ส่งผลกับทุกที่ที่ใช้
5. **Performance**: มี caching mechanism ใน hook และ API route

## Next Steps

1. ลบ fetch functions เดิมออกจาก dialogOverview.tsx
2. ลบ helper functions เดิมออก (เพราะย้ายไป utils แล้ว)
3. ลบ skeleton components แบบ inline
4. Import และใช้ hooks, utilities, และ components ใหม่
5. Run `npm run lint` เพื่อตรวจสอบ

## Migration Guide

### Step 1: Remove old code
ลบ functions เหล่านี้ออก:
- `fetchDay241()`
- `fetchDay31()`
- `fetchYear241()`
- `fetchYear31()`
- `transformApiData()`
- `transformMonthlyApiData()`
- `groupByPartNo()`
- `groupByPartNoMonthly()`
- `decorateDatumWithMockSignals()`
- `getMonthName()`
- `isDateInRange()`
- `ChartSkeleton` (inline component)
- `TableSkeleton` (inline component)

### Step 2: Add imports
```typescript
import { useProductionLineData } from '@/hooks/use-production-line-data';
import { 
  transformApiData, 
  groupByPartNo, 
  groupByPartNoMonthly,
  createDynamicOptions,
  Section 
} from '@/lib/services/productionLineUtils';
import { ChartSkeleton } from '@/components/custom-component/ChartSkeleton';
import { TableSkeleton } from '@/components/custom-component/TableSkeleton';
```

### Step 3: Replace data fetching
แทนที่ useEffect ที่เรียก fetch functions ด้วย hooks

### Step 4: Update rendering
แทนที่ skeleton components แบบ inline ด้วย imported components

## File Size Comparison

| File | Before | After | Reduction |
|------|--------|-------|-----------|
| dialogOverview.tsx | ~1900 lines | ~1200 lines | -700 lines |
| Total codebase | ~1900 lines | ~2300 lines | +400 lines* |

*เพิ่มขึ้นเพราะแยกเป็นหลายไฟล์ แต่แต่ละไฟล์มีขนาดเล็กและจัดการได้ง่าย

## Testing

ทดสอบ API route:
```bash
curl http://localhost:3000/api/production-lines/data?type=day241
```

Expected response:
```json
{
  "success": true,
  "data": [...],
  "dataType": "day241",
  "timestamp": "2025-11-14T..."
}
```
