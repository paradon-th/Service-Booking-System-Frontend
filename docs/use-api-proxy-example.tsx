// ตัวอย่างการใช้งาน useApiProxy Hook

'use client'

import { useApiProxy } from '@/hooks/use-api-proxy';

export default function ExampleComponent() {
  // ✅ แบบที่ 1: ใช้ค่า default จาก env (starttime: "*-1y", endtime: "*")
  const { data, loading, error } = useApiProxy({
    apiUrl: `${process.env.NEXT_PUBLIC_API_OVERVIEW_CARD}/value`,
  });

  // ✅ แบบที่ 2: Override ค่า starttime/endtime
  const { data: customData } = useApiProxy({
    apiUrl: `${process.env.NEXT_PUBLIC_API_OVERVIEW_CARD}/value`,
    starttime: '*-2y',
    endtime: '*-1y',
  });

  // ✅ แบบที่ 3: ใช้กับ API อื่น
  const { data: otherData } = useApiProxy({
    apiUrl: 'https://api.example.com/other-endpoint',
  });

  // ✅ แบบที่ 4: เปิด/ปิดการ fetch ด้วย enabled
  const { data: conditionalData, refetch } = useApiProxy({
    apiUrl: `${process.env.NEXT_PUBLIC_API_OVERVIEW_CARD}/value`,
    enabled: false, // ไม่ fetch อัตโนมัติ
  });
  // เรียก refetch() เมื่อต้องการ

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
