import { useState, useEffect } from 'react';

interface UseApiProxyOptions {
  apiUrl: string;
  starttime?: string;
  endtime?: string;
  enabled?: boolean; // เปิด/ปิดการ fetch
}

interface UseApiProxyResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Custom Hook สำหรับเรียก API ผ่าน Proxy
 * 
 * @example
 * const { data, loading, error } = useApiProxy({
 *   apiUrl: 'https://api.example.com/data/value',
 *   starttime: '*-1y', // optional, ใช้ default จาก env ถ้าไม่ระบุ
 *   endtime: '*',      // optional, ใช้ default จาก env ถ้าไม่ระบุ
 * });
 */
export function useApiProxy<T = any>(options: UseApiProxyOptions): UseApiProxyResult<T> {
  const { apiUrl, starttime, endtime, enabled = true } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    if (!enabled) return;
    
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ apiUrl });
      
      if (starttime) params.set('starttime', starttime);
      if (endtime) params.set('endtime', endtime);

      const response = await fetch(`/api/proxy?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      console.error('[useApiProxy] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [apiUrl, starttime, endtime, enabled]);

  return { data, loading, error, refetch: fetchData };
}
