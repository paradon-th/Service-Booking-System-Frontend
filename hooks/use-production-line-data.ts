import { useState, useEffect, useCallback } from "react";

interface UseProductionLineDataProps {
  type: "day241" | "day31" | "year241" | "year31";
  typeDialog?: string;
  openByOverview?: boolean;
  enabled?: boolean;
}

interface FetchResult {
  data: any[];
  isLoading: boolean;
  error: string | null;
}

export const useProductionLineData = ({
  type,
  typeDialog,
  openByOverview,
  enabled = true,
}: UseProductionLineDataProps): FetchResult => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cacheKey = `Data${type.charAt(0).toUpperCase()}${type.slice(1)}`;

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    try {
      setIsLoading(true);
      setError(null);

      // Try to load from sessionStorage first (for simulation with openByOverview)
      if (typeDialog === 'simulation' && openByOverview) {
        const cachedData = sessionStorage.getItem(cacheKey);
        if (cachedData) {
          try {
            const parsed = JSON.parse(cachedData);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setData(parsed);
              setIsLoading(false);
              return;
            }
          } catch (e) {
            console.error(`Failed to parse cached ${cacheKey}:`, e);
          }
        }
      }

      // Fetch from API
      const response = await fetch(`/api/production-lines/data?type=${type}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data && Array.isArray(result.data)) {
        setData(result.data);

        // Save to sessionStorage if in overview mode
        if (typeDialog === 'overview') {
          sessionStorage.setItem(cacheKey, JSON.stringify(result.data));
        }
      } else {
        throw new Error("No data array found in response");
      }
    } catch (err) {
      console.error(`[useProductionLineData] Error fetching ${type}:`, err);
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  }, [type, typeDialog, openByOverview, cacheKey, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error };
};
