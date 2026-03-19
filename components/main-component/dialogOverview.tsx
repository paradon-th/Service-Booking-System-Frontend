"use client";

import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import SelectCustom from "../custom-component/selectCustom";
import CalendarDateRangePicker from "../custom-date-range-picker";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import BarLineChart from "../chart/BarLineChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Check, ChevronLeft, ChevronRight, Clock4, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProductionMatrixTable from "../custom-component/ProductionMatrixTable";
import type { DateRange } from "react-day-picker";
import { format as formatDate } from "date-fns";
import { DialogClose } from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Spinner } from "@/components/ui/spinner";
import PartCheckingTable from "./partCheckingTable";
import PartCheckingDetailTable from "./partCheckingDetailTable";
import { ChartSkeleton } from "../custom-component/ChartSkeleton";
import { TableSkeleton } from "../custom-component/TableSkeleton";
import {
  groupByPartNo,
  groupByPartNoMonthly,
  createDynamicOptions
} from "@/lib/services/productionLineUtils";
import { AddPlanDialog } from "../custom-component/AddPlanDialog";
import CheckingButton from "../custom-component/CheckingButton";
import { ConfirmPartCheckingDialog } from "../custom-component/ConfirmPartCheckingDialog";

interface DialogOverviewProps {
  typeDialog?: string;
  primaryKeyName?: string;
  productOptions?: { label: string; value: string }[];
}

export default function DialogOverview({ typeDialog, primaryKeyName, productOptions }: DialogOverviewProps) {
  const router = useRouter();
  const chartScrollRef = useRef<HTMLDivElement>(null);
  const tableScrollRef = useRef<HTMLDivElement>(null);

  const chartRefsByPlan = useRef<Map<string, React.RefObject<HTMLDivElement | null>>>(new Map());
  const tableRefsByPlan = useRef<Map<string, React.RefObject<HTMLDivElement | null>>>(new Map());

  const getChartRefForPlan = (key: string) => {
    if (!chartRefsByPlan.current.has(key)) {
      chartRefsByPlan.current.set(key, React.createRef<HTMLDivElement>());
    }
    return chartRefsByPlan.current.get(key)!;
  };

  const getTableRefForPlan = (key: string) => {
    if (!tableRefsByPlan.current.has(key)) {
      tableRefsByPlan.current.set(key, React.createRef<HTMLDivElement>());
    }
    return tableRefsByPlan.current.get(key)!;
  };

  const isSyncing = useRef(false);
  const isInitialMount = useRef(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const primaryKeyNameFromSession = useRef<string | undefined>(undefined);

  // Filter states
  const [productionLines, setProductionLines] = useState<string[]>([]);
  const [productionLinesName, setProductionLinesName] = useState<string>("");
  const [partNos, setPartNos] = useState<string[]>([]);
  const [subAssys, setSubAssys] = useState<string[]>([]);
  const [productTypes, setProductTypes] = useState<string[]>([]);

  const [internalProductOptions, setInternalProductOptions] = useState<{ label: string; value: string }[]>([]);

  const [customerOrderData, setCustomerOrderData] = useState<any[]>([]);
  const [hoveredData, setHoveredData] = useState<any>(null);
  const previousHoveredName = useRef<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [clickedChartIndex, setClickedChartIndex] = useState<string | null>(null);
  // Auto-select today (or first item) for initial detail display
  const [hasAutoSelectedToday, setHasAutoSelectedToday] = useState(false);

  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [transformedDailyData, setTransformedDailyData] = useState<any[]>([]);
  const [transformedMonthlyData, setTransformedMonthlyData] = useState<any[]>([]);

  const [dailySections, setDailySections] = useState<any[]>([]);
  const [monthlySections, setMonthlySections] = useState<any[]>([]);

  const [isLoadingDaily, setIsLoadingDaily] = useState(false);
  const [isLoadingMonthly, setIsLoadingMonthly] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);

  const [partNoOptions, setPartNoOptions] = useState<{ label: string; value: string }[]>([]);
  const [subAssyOptions, setSubAssyOptions] = useState<{ label: string; value: string }[]>([]);
  const [hasInitializedFilters, setHasInitializedFilters] = useState(false); // Track if filters have been initialized

  const [filteredDailySections, setFilteredDailySections] = useState<any[]>([]);
  const [filteredMonthlySections, setFilteredMonthlySections] = useState<any[]>([]);
  const [dailyStatus, setDailyStatus] = useState<"Daily" | "Monthly">("Daily");
  const [simulationStep, setSimulationStep] = useState<string>("1");
  const [maxStepReached, setMaxStepReached] = useState("1");
  const [openByOverview, setOpenByOverview] = useState<boolean>(false);
  const [showProductionLineError, setShowProductionLineError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [PartCheckingDialogOpen, setPartCheckingDialogOpen] = useState(false);
  const [PartCheckingDetailDialogOpen, setPartCheckingDetailDialogOpen] = useState(false);
  const [hasScrolledToToday, setHasScrolledToToday] = useState(false); // Track if already scrolled
  const [selectedPlan, setSelectedPlan] = useState<{ key: string; ot: string; thb: string; manpower: string } | null>(null); // เก็บ plan ที่เลือก
  const [openPlanKey, setOpenPlanKey] = useState<string[]>([]); // แผนที่เปิดอยู่ใน Step 2
  const hasInitOpenPlan = useRef(false); // ใช้ตั้งค่าเปิดแผนครั้งแรกเท่านั้น
  // Per-plan Part Checking states
  const [partCheckingByPlan, setPartCheckingByPlan] = useState<Record<string, boolean>>({});
  const [partCheckingDetailByPlan, setPartCheckingDetailByPlan] = useState<Record<string, boolean>>({});
  const [partCheckingLoadingByPlan, setPartCheckingLoadingByPlan] = useState<Record<string, boolean>>({});
  const [partCheckingDetailLoadingByPlan, setPartCheckingDetailLoadingByPlan] = useState<Record<string, boolean>>({});
  // Track which plan/check type is pending confirmation dialog
  const [pendingPlanKey, setPendingPlanKey] = useState<string | null>(null);
  const [pendingCheckType, setPendingCheckType] = useState<"part" | "detail" | null>(null);
  const [postConfirm, setPostConfirm] = useState<null | { action: 'gotoStep3' }>(null);
  const [showPartCheckingError, setShowPartCheckingError] = useState(false); // แสดง error ถ้ายังไม่ check
  const partCheckingRef = useRef<HTMLDivElement>(null); // ref สำหรับ scroll ไปหา part checking section
  const [isExporting, setIsExporting] = useState(false); // สถานะการส่งออกข้อมูล
  const [StatusExport, setStatusExport] = useState<string>(''); // สถานะการส่งออกข้อมูล
  const [isScrolled, setIsScrolled] = useState(false);
  
  const [plans, setPlans] = useState([
    { key: 'A', ot: '0', thb: '0', manpower: '0' },
    { key: 'B', ot: '1', thb: '5000', manpower: '0' },
    { key: 'C', ot: '2', thb: '10000', manpower: '0' },
    { key: 'D', ot: '2.5', thb: '12000', manpower: '0' },
  ]);
  // Lock state: when step 2 plan is confirmed, returning to step 2 should be read-only until user cancels in step 3
  const [step2Confirmed, setStep2Confirmed] = useState(false);

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Ensure per-plan maps contain keys for all plans
  useEffect(() => {
    setPartCheckingByPlan(prev => {
      const next = { ...prev };
      plans.forEach(p => { if (next[p.key] === undefined) next[p.key] = false; });
      return next;
    });
    setPartCheckingDetailByPlan(prev => {
      const next = { ...prev };
      plans.forEach(p => { if (next[p.key] === undefined) next[p.key] = false; });
      return next;
    });
    setPartCheckingLoadingByPlan(prev => {
      const next = { ...prev };
      plans.forEach(p => { if (next[p.key] === undefined) next[p.key] = false; });
      return next;
    });
    setPartCheckingDetailLoadingByPlan(prev => {
      const next = { ...prev };
      plans.forEach(p => { if (next[p.key] === undefined) next[p.key] = false; });
      return next;
    });
  }, [plans]);

  const handleNextStep = (next: string) => {
    setIsTransitioning(true);
    setTimeout(() => {
      const nextStep = (+simulationStep + 1).toString();
      setSimulationStep(nextStep);
      setMaxStepReached(nextStep);
      setIsTransitioning(false);
    }, 300);
  };

  const handleStepChange = (newStep: string) => {
    const stepNum = +newStep;
    const maxStepNum = +maxStepReached;
    if (stepNum <= maxStepNum) {
      setSimulationStep(newStep);
    }
  };

  const handleSimulationClick = () => {
    if (productionLines.length === 0) {
      setShowProductionLineError(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    handleNextStep('2');
  };

// Handler สำหรับตรวจสอบก่อนไป step 4 (per selected plan)
const handleGoToStep4 = () => {
  const k = selectedPlan?.key;
  const isChecked = k ? !!partCheckingByPlan[k] : false;
  const isDetailChecked = k ? !!partCheckingDetailByPlan[k] : false;
  if (!k || !isChecked || !isDetailChecked) {
    setShowPartCheckingError(true);
    if (partCheckingRef.current) {
      const elementPosition = partCheckingRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - 200;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
    return;
  }
  setShowPartCheckingError(false);
  handleNextStep('4');
};

// Handler สำหรับ Part Checking checkbox (per-plan)
const handlePartCheckingToggle = (planKey?: string) => {
  const k = planKey ?? selectedPlan?.key ?? null;
  if (!k) return;
  if (partCheckingByPlan[k]) return;
  setPendingPlanKey(k);
  setPendingCheckType('part');
  setPartCheckingDialogOpen(true);
};

// Handler สำหรับ Part Checking Detail checkbox (per-plan)
const handlePartCheckingDetailToggle = (planKey?: string) => {
  const k = planKey ?? selectedPlan?.key ?? null;
  if (!k) return;
  if (partCheckingDetailByPlan[k]) return;
  setPendingPlanKey(k);
  setPendingCheckType('detail');
  setPartCheckingDetailDialogOpen(true);
};

  const ExportSimulation = async () => {
    setIsExporting(true);
    setStatusExport('Uploading')
    await new Promise(resolve => setTimeout(resolve, 2000));
    setStatusExport('Completed')
    // setIsExporting(false);
  };

  useEffect(() => {
    const openByOverview = sessionStorage.getItem('openByOverview');
    if (openByOverview === 'true') {
      setOpenByOverview(true);
    } else {
      setOpenByOverview(false);
    }
  }, []);

  useEffect(() => {
    if (simulationStep === '2' && !hasInitOpenPlan.current) {
      if (plans.length > 0) {
        setOpenPlanKey([plans[0].key]);
      }
      hasInitOpenPlan.current = true;
    }
  }, [simulationStep, plans]);

  useEffect(() => {
    const primaryKeyNames = sessionStorage.getItem('primaryKeyName');
    if (primaryKeyNames) {
      primaryKeyNameFromSession.current = primaryKeyNames;
    }
  }, []);

  useEffect(() => {
    if (typeDialog === 'simulation' && openByOverview) {
      const savedProductionLine = sessionStorage.getItem('selectedProductionLine');
      if (savedProductionLine) {
        setProductionLines([savedProductionLine]);
        const cachedOptions = sessionStorage.getItem('productOptions');
        if (cachedOptions) {
          try {
            const parsed = JSON.parse(cachedOptions);
            const matchedOption = parsed.find((opt: any) => opt.value === savedProductionLine);
            if (matchedOption) {
              setProductionLinesName(matchedOption.label);
            }
          } catch (e) {
            console.error("Failed to parse cached productOptions:", e);
          }
        }
      }
    } else {
      setProductionLines([]);
    }
  }, [typeDialog, openByOverview]);

  // Ensure "All" stays selected when options change (only if counts differ)
  useEffect(() => {
    if (partNoOptions.length > 0 && partNos.length !== partNoOptions.length) {
      setPartNos(partNoOptions.map(opt => opt.value));
    }
  }, [partNoOptions]);

  useEffect(() => {
    if (subAssyOptions.length > 0 && subAssys.length !== subAssyOptions.length) {
      setSubAssys(subAssyOptions.map(opt => opt.value));
    }
  }, [subAssyOptions]);

  


  // THB mock data สำหรับแต่ละค่า OT
  const thbMockData: Record<string, string> = {
    '0': '0',
    '1': '5000',
    '2': '10000',
    '2.5': '12000',
  };

  const handleAddPlan = (ot: string, manpower: string) => {
    const lastKey = plans[plans.length - 1]?.key || 'D';
    const nextKeyCode = lastKey.charCodeAt(0) + 1;
    const nextKey = String.fromCharCode(nextKeyCode);
    const thb = thbMockData[ot] || '0';
    const newPlan = { key: nextKey, ot, thb, manpower };
    setPlans([...plans, newPlan]);
    return newPlan;
  };

  const handleChartHover = (payload: any[] | undefined) => {
    if (payload && payload.length > 0) {
      const currentData = payload[0].payload;
      const currentName = currentData?.name;
      if (currentName) {
        setSelectedDate(currentName);
      }
      if (currentName && currentName !== previousHoveredName.current) {
        setHoveredData({
          ...currentData,
          chartItems: payload
        });
        previousHoveredName.current = currentName;
      }
    }
  };

  const handleChartLeave = () => {
    setHoveredData(null);
    previousHoveredName.current = null;
  };

  useEffect(() => {
    if (primaryKeyName) {
      if (typeDialog === 'simulation' && !openByOverview) {
        return;
      }
      fetchCustomerOrder();
    }
  }, [primaryKeyName, typeDialog, openByOverview]);

  useEffect(() => {
    const fetchProductOptions = async () => {
      const cachedOptions = sessionStorage.getItem('productOptions');
      if (cachedOptions) {
        try {
          const parsed = JSON.parse(cachedOptions);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setInternalProductOptions(parsed);
            return;
          }
        } catch (e) {
          console.error("Failed to parse cached productOptions:", e);
        }
      }
      if (!productOptions || productOptions.length === 0) {
        try {
          const response = await fetch('/api/production-lines');
          if (response.ok) {
            const result = await response.json();
            if (result.options && Array.isArray(result.options)) {
              setInternalProductOptions(result.options);
              sessionStorage.setItem('productOptions', JSON.stringify(result.options));
            }
          }
        } catch (error) {
          console.error("❌ Error fetching productOptions:", error);
        }
      }
    };
    fetchProductOptions();
  }, [productOptions]);

  useEffect(() => {
    if (productOptions && productOptions.length > 0) {
      sessionStorage.setItem('productOptions', JSON.stringify(productOptions));
    }
  }, [productOptions]);

  const effectiveProductOptions = productOptions && productOptions.length > 0
    ? productOptions
    : internalProductOptions;

  useEffect(() => {
    if (
      typeDialog === 'simulation' &&
      openByOverview &&
      productionLines.length === 0 &&
      effectiveProductOptions &&
      effectiveProductOptions.length > 0
    ) {
      const sessionKey = sessionStorage.getItem('primaryKeyName');
      if (sessionKey) {
        const matchedOption = effectiveProductOptions.find(opt => opt.label === sessionKey);
        if (matchedOption) {
          setProductionLinesName(matchedOption.label);
          setProductionLines([matchedOption.value]);
        }
      }
    }
  }, [typeDialog, effectiveProductOptions, openByOverview]);

  useEffect(() => {
    if (typeDialog === 'simulation' && !openByOverview) {
      return;
    }
    if ((primaryKeyName || primaryKeyNameFromSession.current) && effectiveProductOptions && effectiveProductOptions.length > 0) {
      const matchedOption = effectiveProductOptions.find(opt => opt.label === primaryKeyName);
      if (matchedOption) {
        setProductionLinesName(matchedOption.label);
        setProductionLines([matchedOption.value]);
      }
    }
  }, [primaryKeyName, effectiveProductOptions, typeDialog, openByOverview]);

        // แปลงข้อมูลเมื่อ customerOrderData หรือ dateRange หรือ productionLines เปลี่ยน
        useEffect(() => {
          if (customerOrderData.length > 0) {
            // แสดง skeleton เฉพาะเมื่อไม่ใช่ initial mount และไม่ใช่การโหลดข้อมูลครั้งแรก
            const shouldShowSkeleton = !isInitialMount.current && !isLoadingDaily;
      
            if (shouldShowSkeleton) {
              if (firstLoad === false) {
                setIsFiltering(true);
              }
            }
      
            // ใช้ setTimeout เพื่อให้ UI มีเวลา render loading state
            const timeout = shouldShowSkeleton ? 100 : 0;
      
            setTimeout(() => {
              try {
                // Filter ตาม production line ที่เลือก
                let filteredData = customerOrderData;
                
                if (productionLines.length > 0 && effectiveProductOptions) {
                  // แปลง value เป็น label
                  const selectedLabels = productionLines
                    .map(val => effectiveProductOptions.find(opt => opt.value === val)?.label)
                    .filter(Boolean);
        
        
                  if (selectedLabels.length > 0) {
                    filteredData = customerOrderData.filter((item: any) => 
                      selectedLabels.includes(item.fields?.production_line)
                    );
                  }
                }
                
                // แยกข้อมูลตาม customer_order fields สำหรับ Daily
                const filteredDay241 = filteredData.filter((item: any) => item.fields?.customer_order_2_41 !== null);
                const filteredDay31 = filteredData.filter((item: any) => item.fields?.customer_order_3_1 !== null);
                
                console.log("🔍 Daily Data - Filtered Day241:", filteredDay241.length, "items");
                console.log("🔍 Daily Data - Filtered Day31:", filteredDay31.length, "items");
                
                // สร้าง sections grouped by part_no ก่อน
                const sections = groupByPartNo(filteredDay241, filteredDay31, dateRange);
                console.log("📊 Daily Sections:", sections.length, "sections");
                
                // ใช้ข้อมูลจาก section แรกสำหรับ Chart (แทนการรวมทุก part)
                const transformed = sections.length > 0 ? sections[0].data : [];
                console.log("✅ Daily Data - Transformed (from first section):", transformed.length, "items");
                console.log("📅 Daily Chart - First 3 dates:", transformed.slice(0, 3).map(d => d.name));
                setTransformedDailyData(transformed);
        
                if (sections.length > 0 && sections[0].data.length > 0) {
                  console.log("📅 Daily Table - First 3 dates from section 0:", sections[0].data.slice(0, 3).map(d => d.name));
                }
                setDailySections(sections);
        
                // สร้าง dynamic options จาก sections
                const { partNoOptions: newPartNoOptions, subAssyOptions: newSubAssyOptions } = createDynamicOptions(sections);
                setPartNoOptions(newPartNoOptions);
                setSubAssyOptions(newSubAssyOptions);
                
                // ตั้งค่าเริ่มต้น "All" สำหรับ filters (ครั้งแรกเท่านั้น)
                // ต้องรอให้ options โหลดเสร็จทั้งหมดก่อน
                if (!hasInitializedFilters && newPartNoOptions.length > 0 && newSubAssyOptions.length > 0 && fruitOptions.length > 0) {
                  // ใช้ setTimeout เพื่อให้ options render ก่อน แล้วค่อยตั้งค่า selected values
                  setTimeout(() => {
                    setPartNos(newPartNoOptions.map(opt => opt.value));
                    setSubAssys(newSubAssyOptions.map(opt => opt.value));
                    setProductTypes(fruitOptions.map(opt => opt.value));
                  }, 0);
                  setHasInitializedFilters(true);
                }
              } catch (error) {
                console.error("Error processing daily data:", error);
              } finally {
                if (shouldShowSkeleton) {
                  setIsFiltering(false);
                }
              }
      
              // Mark initial mount as complete
              if (isInitialMount.current && !isLoadingDaily) {
                isInitialMount.current = false;
              }
            }, timeout);
          }
        }, [customerOrderData, dateRange, productionLines, effectiveProductOptions]);
  // แปลงข้อมูลเมื่อ customerOrderData (Monthly) เปลี่ยน
  useEffect(() => {
    if (customerOrderData.length > 0) {
      const shouldShowSkeleton = !isInitialMount.current && !isLoadingMonthly;
      if (shouldShowSkeleton) {
        if (firstLoad === false) {
          setIsFiltering(true);
        }
      }
      const timeout = shouldShowSkeleton ? 100 : 0;
      setTimeout(() => {
        try {
          let filteredData = customerOrderData;
          if (productionLines.length > 0 && effectiveProductOptions) {
            const selectedLabels = productionLines
              .map(val => effectiveProductOptions.find(opt => opt.value === val)?.label)
              .filter(Boolean);
            if (selectedLabels.length > 0) {
              filteredData = customerOrderData.filter((item: any) =>
                selectedLabels.includes(item.fields?.production_line)
              );
            }
          }
          const filteredYear241 = filteredData.filter((item: any) => item.fields?.customer_order_2_41 !== null);
          const filteredYear31 = filteredData.filter((item: any) => item.fields?.customer_order_3_1 !== null);
          const sections = groupByPartNoMonthly(filteredYear241, filteredYear31, dateRange);
          const transformed = sections.length > 0 ? sections[0].data : [];
          setTransformedMonthlyData(transformed);
          setMonthlySections(sections);
          if (partNoOptions.length === 0) {
            const { partNoOptions: newPartNoOptions, subAssyOptions: newSubAssyOptions } = createDynamicOptions(sections);
            setPartNoOptions(newPartNoOptions);
            setSubAssyOptions(newSubAssyOptions);
          }
        } catch (error) {
          console.error("Error processing monthly data:", error);
        } finally {
          if (shouldShowSkeleton) {
            setIsFiltering(false);
          }
        }
      }, timeout);
    }
  }, [customerOrderData, dateRange, productionLines, effectiveProductOptions]);

  const fetchCustomerOrder = async () => {
    try {
      setIsLoadingDaily(true);
      setIsLoadingMonthly(true);
      if (typeDialog === 'simulation' && openByOverview) {
        const cachedData = sessionStorage.getItem('CustomerOrderData');
        if (cachedData) {
          try {
            const parsed = JSON.parse(cachedData);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setCustomerOrderData(parsed);
              setIsLoadingDaily(false);
              setIsLoadingMonthly(false);
              return;
            }
          } catch (e) {
            console.error("Failed to parse cached CustomerOrderData:", e);
          }
        }
      }
      const baseApiUrl = process.env.NEXT_PUBLIC_API_CUSTOMER_ORDER;
      if (!baseApiUrl) {
        setIsLoadingDaily(false);
        setIsLoadingMonthly(false);
        return;
      }
      const endpoint = `${baseApiUrl}/value`;
      const params = new URLSearchParams({ apiUrl: endpoint });
      const api = `/api/proxy?${params.toString()}`;
      const response = await fetch(api, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.data && Array.isArray(result.data)) {
        setCustomerOrderData(result.data);
        if (typeDialog === 'overview') {
          sessionStorage.setItem('CustomerOrderData', JSON.stringify(result.data));
        }
      }
    } catch (error) {
      console.error("[Dashboard] Error fetching customer order data:", error);
    } finally {
      setIsLoadingDaily(false);
      setIsLoadingMonthly(false);
    }
  };

  const fruitOptions = [
    { label: "1", value: "1" },
    // { label: "Banana", value: "banana" },
    // { label: "Blueberry", value: "blueberry" },
    // { label: "Grapes", value: "grapes" },
    // { label: "Pineapple", value: "pineapple" },
  ];

  // Dynamic options state
  // Ensure product type "All" stays selected when options change (only if counts differ)
  useEffect(() => {
    if (fruitOptions.length > 0 && productTypes.length !== fruitOptions.length) {
      setProductTypes(fruitOptions.map(opt => opt.value));
    }
  }, [fruitOptions]);


  const ChangeToggle = (value: "Daily" | "Monthly") => {
    setDailyStatus(value);
    setHoveredData(null);
    setClickedChartIndex(null);
    setSelectedDate(null);
  };

  const handleDateRangeChange = (newDateRange: DateRange | undefined) => {
    setDateRange(newDateRange);
  };

  const handleProductionLineChange = (value: string | string[]) => {
    // แปลง value เป็น array
    setHoveredData(null);
    setClickedChartIndex(null);
    setSelectedDate(null);
    const selectedValues = Array.isArray(value) ? value : value ? [value] : [];
    setProductionLines(selectedValues);
    setFirstLoad(false);

    // หากอยู่ใน Simulation และผู้ใช้เปลี่ยน Production Line ระหว่าง Step 1
    // ให้รีเซ็ตกระบวนการ Simulation กลับไปเริ่มต้นใหม่ (Step 1)
    if (typeDialog === 'simulation') {
      setSimulationStep('1');
      setMaxStepReached('1');
      setSelectedPlan(null);
      setOpenPlanKey([]);
      hasInitOpenPlan.current = false;
      setPendingPlanKey(null);
      setPendingCheckType(null);
      setPostConfirm(null);
      setPartCheckingByPlan({});
      setPartCheckingDetailByPlan({});
      setPartCheckingLoadingByPlan({});
      setPartCheckingDetailLoadingByPlan({});
      setShowPartCheckingError(false);
      setStep2Confirmed(false);
      // Reset export status so Step 4 tick (exportCompleted) is cleared when production line changes
      setStatusExport('');
      setIsExporting(false);
    }

    // อัพเดท productionLinesName เมื่อมีการเลือก production line
    if (selectedValues.length > 0 && effectiveProductOptions && effectiveProductOptions.length > 0) {
      const selectedOption = effectiveProductOptions.find(opt => opt.value === selectedValues[0]);
      if (selectedOption) {
        setProductionLinesName(selectedOption.label);
      }
    } else {
      setProductionLinesName("");
    }
    if (typeDialog === 'simulation' && !openByOverview && selectedValues.length > 0) {
      if (effectiveProductOptions && effectiveProductOptions.length > 0) {
        const selectedOption = effectiveProductOptions.find(opt => opt.value === selectedValues[0]);
        if (selectedOption) {
          fetchCustomerOrder();
        }
      }
    }
  };

  const dailyData = transformedDailyData;
  const monthlyData = transformedMonthlyData;
  const selectedData = dailyStatus === "Daily" ? dailyData : monthlyData;
  const sectionsDaily = dailySections;
  const sectionsMonthly = monthlySections;

  useEffect(() => {
    let filteredDaily = [...dailySections];
    if (partNos.length > 0) {
      filteredDaily = filteredDaily.filter(section => {
        const sectionValue = section.info.partNo.toLowerCase().replace(/\s+/g, '_');
        return partNos.includes(sectionValue);
      });
    }
    if (subAssys.length > 0) {
      filteredDaily = filteredDaily.filter(section => {
        const sectionValue = section.info.subAssyNo.toLowerCase().replace(/\s+/g, '_');
        return subAssys.includes(sectionValue);
      });
    }
    setFilteredDailySections(filteredDaily);
    let filteredMonthly = [...monthlySections];
    if (partNos.length > 0) {
      filteredMonthly = filteredMonthly.filter(section => {
        const sectionValue = section.info.partNo.toLowerCase().replace(/\s+/g, '_');
        return partNos.includes(sectionValue);
      });
    }
    if (subAssys.length > 0) {
      filteredMonthly = filteredMonthly.filter(section => {
        const sectionValue = section.info.subAssyNo.toLowerCase().replace(/\s+/g, '_');
        return subAssys.includes(sectionValue);
      });
    }
    setFilteredMonthlySections(filteredMonthly);
  }, [dailySections, monthlySections, partNos, subAssys]);

  useEffect(() => {
    const shouldScroll = typeDialog === 'overview' || typeDialog === 'simulation';
    if (typeDialog === 'simulation' && simulationStep === '2' && openPlanKey.length === 0) {
      return;
    }
    if (shouldScroll && !hasScrolledToToday && !isLoadingDaily && !isLoadingMonthly && !isFiltering) {
      const currentData = dailyStatus === "Daily" ? transformedDailyData : transformedMonthlyData;
      if (currentData && currentData.length > 0) {
        const today = new Date();
        const todayFormatted = dailyStatus === "Daily"
          ? formatDate(today, "dd MMM yyyy")
          : formatDate(today, "MMM yyyy");
        let targetIndex = currentData.findIndex((item: any) => item.name === todayFormatted);
        if (targetIndex === -1) {
          targetIndex = 0;
        }
        
  // คำนวณ base scroll position (ประมาณ 110px ต่อ item สำหรับ daily, 120px สำหรับ monthly)
  const itemWidth = dailyStatus === "Daily" ? 110 : 120;
  const basePosition = targetIndex * itemWidth;

        // เลือก ref เป้าหมายตามสเตป: step 2 ใช้ per-plan ref, อื่นๆ ใช้ global ref
        const getActiveElements = () => {
          if (typeDialog === 'simulation' && simulationStep === '2' && openPlanKey.length > 0) {
            const keyToScroll = openPlanKey[0];
            const cRef = chartRefsByPlan.current.get(keyToScroll)?.current || null;
            const tRef = tableRefsByPlan.current.get(keyToScroll)?.current || null;
            return { elChart: cRef, elTable: tRef };
          }
          return { elChart: chartScrollRef.current, elTable: tableScrollRef.current };
        };
        const tryScroll = (attempt = 0) => {
          const maxAttempts = 30;
          const { elChart, elTable } = getActiveElements();
          const chartReady = !!(elChart && elChart.clientWidth > 0);
          const tableReady = !!(elTable && elTable.clientWidth > 0);
          if ((elChart && chartReady) || (elTable && tableReady)) {
            // คำนวณตำแหน่งเลื่อนเพื่อให้ column ของ "วันนี้" อยู่กลาง viewport
            if (elChart && chartReady) {
              const viewportW = elChart.clientWidth;
              const contentW = elChart.scrollWidth;
              let centerPos = basePosition - (viewportW - itemWidth) / 2;
              centerPos = Math.max(0, Math.min(centerPos, contentW - viewportW));
              elChart.scrollLeft = centerPos;
            }
            if (elTable && tableReady) {
              const viewportW = elTable.clientWidth;
              const contentW = elTable.scrollWidth;
              let centerPos = basePosition - (viewportW - itemWidth) / 2;
              centerPos = Math.max(0, Math.min(centerPos, contentW - viewportW));
              elTable.scrollLeft = centerPos;
            }
            setHasScrolledToToday(true);
          } else if (attempt < maxAttempts) {
            setTimeout(() => tryScroll(attempt + 1), 150);
          }
        };
        setTimeout(() => tryScroll(0), 150);
      }
    }
  }, [transformedDailyData, transformedMonthlyData, isLoadingDaily, isLoadingMonthly, isFiltering, dailyStatus, hasScrolledToToday, typeDialog, simulationStep, openPlanKey]);

  // Initial auto-select of today's chart data (overview + simulation) for detail card
  useEffect(() => {
    if (hasAutoSelectedToday) return; // already done
    // Wait until data loaded and not filtering
    if (!isLoadingDaily && !isLoadingMonthly && !isFiltering) {
      const data = dailyStatus === 'Daily' ? transformedDailyData : transformedMonthlyData;
      if (data && data.length > 0) {
        const today = new Date();
        const todayFormatted = dailyStatus === 'Daily'
          ? formatDate(today, 'dd MMM yyyy')
          : formatDate(today, 'MMM yyyy');
        let idx = data.findIndex((item: any) => item.name === todayFormatted);
        if (idx === -1) idx = 0; // fallback to first item
        const item = data[idx];
        if (item) {
          setSelectedDate(item.name); // highlight table column
          setClickedChartIndex(item.name); // show vertical reference line
          // Provide hoveredData so detail panel shows immediately
          setHoveredData({ ...item });
          setHasAutoSelectedToday(true);
        }
      }
    }
  }, [dailyStatus, transformedDailyData, transformedMonthlyData, isLoadingDaily, isLoadingMonthly, isFiltering, hasAutoSelectedToday]);

  // Initial auto-select of today's chart data (overview + simulation) for detail card
  useEffect(() => {
    if (hasAutoSelectedToday) return; // already done
    // Wait until data loaded and not filtering
    if (!isLoadingDaily && !isLoadingMonthly && !isFiltering) {
      const data = dailyStatus === 'Daily' ? transformedDailyData : transformedMonthlyData;
      if (data && data.length > 0) {
        const today = new Date();
        const todayFormatted = dailyStatus === 'Daily'
          ? formatDate(today, 'dd MMM yyyy')
          : formatDate(today, 'MMM yyyy');
        let idx = data.findIndex((item: any) => item.name === todayFormatted);
        if (idx === -1) idx = 0; // fallback to first item
        const item = data[idx];
        if (item) {
          setSelectedDate(item.name); // highlight table column
          setClickedChartIndex(item.name); // show vertical reference line
          // Provide hoveredData so detail panel shows immediately
          setHoveredData({ ...item });
          setHasAutoSelectedToday(true);
        }
      }
    }
  }, [dailyStatus, transformedDailyData, transformedMonthlyData, isLoadingDaily, isLoadingMonthly, isFiltering, hasAutoSelectedToday]);

  useEffect(() => {
    setHasScrolledToToday(false);
  }, [dailyStatus, simulationStep]);

  useEffect(() => {
    if (simulationStep === '2') {
      setHasScrolledToToday(false);
    }
  }, [openPlanKey, simulationStep]);

  // Auto hide error message when both checkboxes are checked for selected plan
  useEffect(() => {
    const k = selectedPlan?.key;
    if (k && partCheckingByPlan[k] && partCheckingDetailByPlan[k]) {
      setShowPartCheckingError(false);
    }
  }, [selectedPlan, partCheckingByPlan, partCheckingDetailByPlan]);

  const handleScroll = (source: 'chart' | 'table', scrollLeft: number, planKey?: string) => {
    if (isSyncing.current) {
      return;
    }
    isSyncing.current = true;
    if (typeDialog === 'simulation' && simulationStep === '2' && planKey) {
      const planChart = chartRefsByPlan.current.get(planKey)?.current || null;
      const planTable = tableRefsByPlan.current.get(planKey)?.current || null;
      if (source === 'chart' && planTable) {
        planTable.scrollLeft = scrollLeft;
      } else if (source === 'table' && planChart) {
        planChart.scrollLeft = scrollLeft;
      }
    } else {
      if (source === 'chart' && tableScrollRef.current) {
        tableScrollRef.current.scrollLeft = scrollLeft;
      } else if (source === 'table' && chartScrollRef.current) {
        chartScrollRef.current.scrollLeft = scrollLeft;
      }
    }
    requestAnimationFrame(() => {
      isSyncing.current = false;
    });
  };

  const displayLabels: Record<string, string> = {
    target: "Target",
    actual: "Actual",
    backOrder: "Back Order",
    accumulate: "Accumulate Back Order",
    plan: "Capacity Daily (Plan)",
    cap8: "Cap (8 Hrs.)",
    cap10: "Cap (10 Hrs.)",
    cap10b: "Cap (10.5 Hrs.)",
  };

  const keysInOrder: string[] = [
    'cap8',
    'cap10',
    'cap10b',
    'plan',
    'backOrder',
    'accumulate',
  ];

  const keyValuesToShow: string[] = [
    'target',
    'actual',
  ];

  // Derived selected plan Part Checking states
  const selectedPlanKey = selectedPlan?.key ?? null;
  const selectedPartChecked = selectedPlanKey ? !!partCheckingByPlan[selectedPlanKey] : false;
  const selectedPartLoading = selectedPlanKey ? !!partCheckingLoadingByPlan[selectedPlanKey] : false;
  const selectedDetailChecked = selectedPlanKey ? !!partCheckingDetailByPlan[selectedPlanKey] : false;
  const selectedDetailLoading = selectedPlanKey ? !!partCheckingDetailLoadingByPlan[selectedPlanKey] : false;
  // Export completion derived state
  const exportCompleted = StatusExport === 'Completed';

  return (
    <div>
      {typeDialog == 'overview' ? (
        <div className="relative px-4">
          {/* Overview Content Unchanged */}
          <div className="lg:sticky lg:top-0 bg-white z-50 pt-4 pb-2 rounded-xl -mx-[5px]">
            <div className="font-bold text-xl">Production Dashboard</div>
            <div className="text-sm text-gray-600">
              Displays detailed production performance for the selected line, including daily and monthly capacity, plan vs actual, and back order trends.
            </div>

            <div className="mt-6 flex flex-col gap-4  2xl:flex-row 2xl:items-end 2xl:justify-between">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:flex lg:flex-row lg:flex-1 lg:justify-between lg:items-end lg:gap-4">
                <div  className="w-full 2xl:w-56 relative">
                  <SelectCustom
                    label="Production Line"
                    groupLabel="Production Line"
                    options={effectiveProductOptions ?? []}
                    value={productionLines.length > 0 ? productionLines[0] : ""}
                    onChange={(value) => {
                      handleProductionLineChange(value);
                      setShowProductionLineError(false);
                    }}
                     className="w-full 2xl:w-56"
                    selectType="overviewDialog"
                    hasError={showProductionLineError}
                  />
                  {showProductionLineError && (
                    <p className="absolute text-red-500 text-xs mt-1">Please select a production line</p>
                  )}
                </div>
                <SelectCustom
                  label="Part No."
                  groupLabel="Part No."
                  options={partNoOptions}
                  value={partNos}
                  onChange={(v) => setPartNos(Array.isArray(v) ? v : v ? [v] : [])}
                   className="w-full 2xl:w-56"
                  multi
                  includeSelectAll
                  selectAllLabel="All"
                />
                <SelectCustom
                  label="Sub Assy"
                  groupLabel="Sub Assy"
                  options={subAssyOptions}
                  value={subAssys}
                  onChange={(v) => setSubAssys(Array.isArray(v) ? v : v ? [v] : [])}
                   className="w-full 2xl:w-56"
                  multi
                  includeSelectAll
                  selectAllLabel="All"
                />
                <SelectCustom
                  label="ประเภท (OEM / Spare Part)"
                  groupLabel="Type"
                  options={fruitOptions}
                  value={productTypes}
                  onChange={(v) => setProductTypes(Array.isArray(v) ? v : v ? [v] : [])}
                   className="w-full 2xl:w-56"
                  multi
                  includeSelectAll
                  selectAllLabel="All"
                />
              </div>
              <div className="flex flex-col gap-4 w-full sm:flex-row sm:items-end sm:gap-4 lg:flex-row lg:items-end lg:justify-end">
                <div className="flex flex-col gap-2 w-full sm:w-auto">
                  <CalendarDateRangePicker
                    mode={dailyStatus}
                    onDateChange={handleDateRangeChange}
                  />
                </div>
                <div className="flex w-full justify-end">
                  <Tabs value={dailyStatus} onValueChange={(v) => ChangeToggle(v as "Daily" | "Monthly")}>
                    <TabsList className="flex flex-wrap gap-2">
                      <TabsTrigger value="Daily">Daily</TabsTrigger>
                      <TabsTrigger value="Monthly">Monthly</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-4 lg:flex-row">
            <div className="w-full lg:w-[400px]">
              <Card className="h-full">
                <CardHeader>
                  {hoveredData ? (
                    <div>
                      <CardTitle></CardTitle>
                      <CardDescription></CardDescription>
                      <CardContent>
                        <div className="flex flex-col justify-between h-full">
                          <div className="space-y-4">
                            <div className="font-bold text-md mb-2">{hoveredData.name}</div>
                            <div className="h-[1px] w-full bg-black opacity-10"></div>
                            <ul className="space-y-4 text-sm">
                              {keysInOrder.map((key) => {
                                const value = hoveredData[key];
                                const label = displayLabels[key] || key;
                                const chartItem = hoveredData.chartItems?.find((item: any) => item.dataKey === key);
                                const color = chartItem?.color || chartItem?.stroke;
                                return (
                                  <li key={key}>
                                    <div className="flex justify-between items-center">
                                      <div>{label}:</div>
                                      <span style={{ color: color || 'inherit' }} className="font-semibold">
                                        {String(value ?? 'N/A')}
                                      </span>
                                    </div>
                                    <div className="w-full border-t border-dotted border-black opacity-10 my-1"></div>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                          <div className="mt-6 space-y-4">
                            {keyValuesToShow.map((key) => {
                              const value = hoveredData[key];
                              const label = displayLabels[key] || key;
                              const chartItem = hoveredData.chartItems?.find((item: any) => item.dataKey === key);
                              const color = chartItem?.color || chartItem?.stroke;
                              return (
                                <div key={key} className="flex justify-between items-center text-sm">
                                  <div>{label}:</div>
                                  <span style={{ color: color || 'inherit' }} className="font-semibold">
                                    {String(value ?? 'N/A')}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                          <div className="bg-[#F1F3F7] text-center p-3 rounded-md text-xs mt-4">
                            Updated automatically based on <br /> production data
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  ) : (
                    <div>
                      {(dailyStatus === "Daily" ? (isLoadingDaily || isFiltering) : (isLoadingMonthly || isFiltering)) ? (
                        <>
                          <CardTitle>
                            <Skeleton className="h-4 w-20" />
                          </CardTitle>
                          <CardDescription className="mt-2 space-y-2">
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-full" />
                          </CardDescription>
                        </>
                      ) : (
                        <>
                          <CardTitle>
                            <div className="text-md font-bold">Detail</div>
                          </CardTitle>
                          <CardDescription className="mt-2">
                            Daily and monthly production performance with delay, recovery, and safety indicators.
                          </CardDescription>
                        </>
                      )}
                      <CardContent></CardContent>
                    </div>
                  )}
                </CardHeader>
              </Card>
            </div>
            <div className="flex-1 min-w-0">
              {(dailyStatus === "Daily" ? (isLoadingDaily || isFiltering) : (isLoadingMonthly || isFiltering)) ? (
                <div className="w-full min-[2000px]:min-w-[1400px]">
                  <ChartSkeleton />
                </div>
              ) : (
                <BarLineChart
                  dailyStatus={dailyStatus}
                  dailyData={dailyData}
                  monthlyData={monthlyData}
                  chartType="overview"
                  scrollRef={chartScrollRef}
                  onScrollSync={handleScroll}
                  onChartMouseMove={handleChartHover}
                  onChartMouseLeave={handleChartLeave}
                  clickedIndex={clickedChartIndex}
                  onClickedIndexChange={setClickedChartIndex}
                />
              )}
            </div>
          </div>

          <div className="mt-10">
            {(dailyStatus === "Daily" ? (isLoadingDaily || isFiltering) : (isLoadingMonthly || isFiltering)) ? (
              <TableSkeleton />
            ) : (
              <ProductionMatrixTable
                mode={dailyStatus}
                maxVisibleColumns={14}
                sections={dailyStatus === "Daily" ? filteredDailySections : filteredMonthlySections}
                scrollRef={tableScrollRef}
                onScrollSync={handleScroll}
                selectedDate={selectedDate}
              />
            )}
          </div>

          <div className="lg:sticky lg:bottom-0 bg-white py-4 flex justify-between z-50 border-t border-gray-200">
            <DialogClose asChild>
              <Button variant="outline" className="text-sm font-bold shadow-md cursor-pointer">
                {isTransitioning ? <Spinner /> : <ChevronLeft />}
                Back
              </Button>
            </DialogClose>
            <Link href={`/simulation`} onClick={() => {
              sessionStorage.setItem('openByOverview', 'true');
              if (productionLines.length > 0) {
                sessionStorage.setItem('selectedProductionLine', productionLines[0]);
              }
            }}>
              <Button variant="outline" className="text-sm font-bold shadow-md">
                {isTransitioning ? <Spinner /> : <ChevronRight />}
                Production Simulation
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        // ################### SIMULATION MODE ###################
        <div>
          <div 
            className={`px-4 -mx-4 rounded-b-lg ${
              isScrolled 
                ? "bg-white lg:sticky lg:top-14 z-50 lg:pt-4 pb-2" 
                : "bg-transparent"
            }`}
          >
            <div className="flex justify-between items-center">
                <div className="flex gap-6 items-center">
                  <div className="font-bold text-2xl">
                    {simulationStep === '1' ? 'Production Simulation' :
                      simulationStep === '2' ? 'Review & Select' :
                        simulationStep === '3' ? 'Finalize & Review Part Checking' :
                          'Complete Simulation'}
                  </div>
                  {simulationStep !== '1' && (
                    <div className="flex items-center gap-3 mt-1">
                      <div className="text-nowrap text-sm">Production Line</div>
                      <div className="bg-[#EFEFEF] py-1 w-32 px-2 text-sm rounded-lg shadow-sm">{productionLinesName}</div>
                    </div>
                  )}
                </div>

                {simulationStep === '1' && (
                  <Button
                    onClick={handleSimulationClick}
                    variant="outline"
                    className="text-sm font-bold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={+maxStepReached > 1}
                  >
                    {isTransitioning ? <Spinner /> : <ChevronRight />}
                    Simulation
                  </Button>
                )}

                {(simulationStep === '3') && !exportCompleted && (
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      className="text-sm w-24 shadow-md"
                      onClick={() => {
                        // Cancel confirmation: unlock Step 2 edits and remove its completion tick
                        setStep2Confirmed(false);
                        setSelectedPlan(null);
                        setSimulationStep('2');
                        setMaxStepReached('2');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleGoToStep4}
                      className="bg-black w-24 text-white hover:bg-black/60"
                    >
                      Next
                      {isTransitioning ? <Spinner className="text-white" /> : null}
                      {!isTransitioning && <ChevronRight />}
                    </Button>
                  </div>
                )}
              {(simulationStep === '4') && 

                <div className="flex gap-4">
                      {isExporting &&     <div className="flex items-center gap-2 text-sm"> {StatusExport === 'Uploading' ?  <Clock4 className="text-[#E49B45]" /> :  <div className="rounded-full bg-emerald-500 w-5 h-5 flex items-center justify-center">
            <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
          </div>}  AS400 - {StatusExport}</div> }
                  <Button
                    onClick={ExportSimulation}
                    variant="outline"
                    className="text-sm font-bold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={StatusExport === 'Completed' || StatusExport === 'Uploading'}
                  >
                    {StatusExport === 'Uploading'
                      ? <Spinner className="text-black" />
                      : StatusExport === 'Completed'
                        ? <Check className="text-emerald-600" strokeWidth={3} />
                        : <ChevronRight />}
                    {StatusExport === 'Completed' ? 'Exported' : 'Export'}
                  </Button>
                </div>
              }
                {simulationStep === '2' && (
                  <Button
                    onClick={() => setDialogOpen(true)}
                    variant="outline"
                    className="text-sm font-bold shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={step2Confirmed}
                  >
                    <Plus />
                    Add Plan
                  </Button>
                )}
            </div>
          </div>

          {/* Main Card Container */}
          <div className="border rounded-md shadow-xl pb-8 p-4 mt-4 relative">
            
            <div className={`lg:sticky lg:top-29 z-50 bg-white -mx-4 px-4 py-3 mb-6
              ${isScrolled ? "lg:-mx-10 lg:px-10 lg:border-b lg:border-gray-200":""}
              `}>
              <div className="flex flex-col gap-4 items-center lg:flex-row lg:justify-between lg:items-center">
                  <Tabs value={simulationStep} onValueChange={handleStepChange} className="w-full lg:w-fit mx-auto lg:mx-0">
                    <TabsList className="grid grid-cols-1 lg:grid-cols-4 bg-[#F5F5F5] h-auto p-2 w-full gap-2">
                      {["1", "2", "3", "4"].map((step) => {
                        const stepNum = +step;
                        const currentNum = +simulationStep;
                        const maxNum = +maxStepReached;
                        // Enable tab only if the step has been reached
                        const isEnabled = stepNum <= maxNum;
                        // Completed rules (updated):
                        // A step is considered "completed" once the user has progressed beyond it at least once.
                        // So any step with stepNum < maxStepReached gets a persistent green check, even when navigating back before it.
                        // The current step shows its number unless it's a revisited step (which means stepNum < maxStepReached, handled above).
                        // Future unreached steps (stepNum > maxStepReached) show number and are disabled.
                        // Additionally: when export completes (StatusExport === 'Completed'), force step 4 to show as completed.
                        const isCompleted = stepNum < maxNum || (step === '4' && exportCompleted);
                        return (
                          <TabsTrigger
                            key={step}
                            value={step}
                            disabled={!isEnabled}
                            className={`data-[state=active]:bg-white rounded-xl py-1 px-3 gap-2 flex items-center justify-start ${isEnabled ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
                          >
                            <div className={`w-6 h-6 rounded-full flex justify-center items-center text-sm border border-foreground/20 ${isCompleted ? 'bg-emerald-500  text-white' : ''}`}>
                              {isCompleted ? <Check className="w-4 h-4" strokeWidth={3} /> : step}
                            </div>
                            <span className="">
                              {step === "1" ? "Production Line" :
                                step === "2" ? "Simulation & Select" :
                                  step === "3" ? "Part Checking" :
                                    "Complete"}
                            </span>
                          </TabsTrigger>
                        );
                      })}
                    </TabsList>
                  </Tabs>
                  <div className="w-full lg:w-40 flex justify-center lg:justify-end">
                    <Tabs value={dailyStatus} onValueChange={(v) => ChangeToggle(v as "Daily" | "Monthly")} className="w-full">
                      <TabsList className="flex w-full justify-between">
                        <TabsTrigger value="Daily">Daily</TabsTrigger>
                        <TabsTrigger value="Monthly">Monthly</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
              </div>
            </div>

            {/* Content based on steps */}
            {simulationStep === '1' && (
              <div className="pt-2 flex flex-col gap-4 2xl:flex-row 2xl:items-end 2xl:justify-between">
                {(isLoadingDaily || isFiltering) ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:flex lg:flex-row lg:flex-1 lg:items-end lg:gap-4">
                    <div className="space-y-1"><Skeleton className="h-4 w-20" /><Skeleton className="h-9 w-56" /></div>
                    <div className="space-y-1"><Skeleton className="h-4 w-20" /><Skeleton className="h-9 w-56" /></div>
                    <div className="space-y-1"><Skeleton className="h-4 w-20" /><Skeleton className="h-9 w-56" /></div>
                    <div className="space-y-1"><Skeleton className="h-4 w-40" /><Skeleton className="h-9 w-56" /></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:flex lg:flex-row lg:flex-1 lg:items-end lg:gap-4">
                    <div className="w-full 2xl:w-56 relative">
                      <SelectCustom
                        label="Production Line"
                        groupLabel="Production Line"
                        options={effectiveProductOptions ?? []}
                        value={productionLines.length > 0 ? productionLines[0] : ""}
                        onChange={(value) => {
                          handleProductionLineChange(value);
                          setShowProductionLineError(false);
                        }}
                        className="w-full"
                        selectType="overviewDialog"
                        hasError={showProductionLineError}
                        hasRequired={true}
                      />
                      {showProductionLineError && (
                        <p className="absolute text-red-500 text-xs mt-1">Please select a production line</p>
                      )}
                    </div>
                    <SelectCustom
                            label="Part No."
                      groupLabel="Part No."
                      options={partNoOptions}
                      value={partNos}
                      onChange={(v) => setPartNos(Array.isArray(v) ? v : v ? [v] : [])}
                      className="w-full 2xl:w-56"
                      multi
                      includeSelectAll
                      selectAllLabel="All"
                    />
                    <SelectCustom
                            label="Sub Assy"
                      groupLabel="Sub Assy"
                      options={subAssyOptions}
                      value={subAssys}
                      onChange={(v) => setSubAssys(Array.isArray(v) ? v : v ? [v] : [])}
                      className="w-full 2xl:w-56"
                      multi
                      includeSelectAll
                      selectAllLabel="All"
                    />
                    <SelectCustom
                      label="ประเภท (OEM / Spare Part)"
                      groupLabel="Type"
                      options={fruitOptions}
                      value={productTypes}
                      onChange={(v) => setProductTypes(Array.isArray(v) ? v : v ? [v] : [])}
                      className="w-full 2xl:w-56"
                      multi
                      includeSelectAll
                      selectAllLabel="All"
                    />
                  </div>
                )}
                <div className="flex flex-col gap-2 w-full sm:w-auto">
                  <CalendarDateRangePicker
                    mode={dailyStatus}
                    onDateChange={handleDateRangeChange}
                  />
                </div>
              </div>
            )}

            {(simulationStep === '1' || simulationStep === '4') && (
              <div className="mt-12 flex flex-col gap-4 lg:flex-row">
                <div className="w-full lg:w-[400px]">
                  <Card className="h-full">
                    <CardHeader>
                      {hoveredData ? (
                        <div>
                          <CardTitle></CardTitle>
                          <CardDescription></CardDescription>
                          <CardContent>
                            <div className="flex flex-col justify-between h-full">
                              <div className="space-y-4">
                                <div className="font-bold text-md mb-2">{hoveredData.name}</div>
                                <div className="h-[1px] w-full bg-black opacity-10"></div>
                                <ul className="space-y-4 text-sm">
                                  {keysInOrder.map((key) => {
                                    const value = hoveredData[key];
                                    const label = displayLabels[key] || key;
                                    const chartItem = hoveredData.chartItems?.find((item: any) => item.dataKey === key);
                                    const color = chartItem?.color || chartItem?.stroke;
                                    return (
                                      <li key={key}>
                                        <div className="flex justify-between items-center">
                                          <div>{label}:</div>
                                          <span style={{ color: color || 'inherit' }} className="font-semibold">
                                            {String(value ?? 'N/A')}
                                          </span>
                                        </div>
                                        <div className="w-full border-t border-dotted border-black opacity-10 my-1"></div>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                              <div className="mt-6 space-y-4">
                                {keyValuesToShow.map((key) => {
                                  const value = hoveredData[key];
                                  const label = displayLabels[key] || key;
                                  const chartItem = hoveredData.chartItems?.find((item: any) => item.dataKey === key);
                                  const color = chartItem?.color || chartItem?.stroke;
                                  return (
                                    <div key={key} className="flex justify-between items-center text-sm">
                                      <div>{label}:</div>
                                      <span style={{ color: color || 'inherit' }} className="font-semibold">
                                        {String(value ?? 'N/A')}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                              <div className="bg-[#F1F3F7] text-center p-3 rounded-md text-xs mt-4">
                                Updated automatically based on <br /> production data
                              </div>
                            </div>
                          </CardContent>
                        </div>
                      ) : (
                        <div>
                          {(isLoadingDaily || isFiltering) ? (
                            <>
                              <CardTitle><Skeleton className="h-4 w-20" /></CardTitle>
                              <CardDescription className="mt-2 space-y-2">
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-full" />
                              </CardDescription>
                            </>
                          ) : (
                            <>
                              <CardTitle><div className="text-md font-bold">Detail</div></CardTitle>
                              <CardDescription className="mt-2">
                                Daily and monthly production performance with delay, recovery, and safety indicators.
                              </CardDescription>
                            </>
                          )}
                          <CardContent></CardContent>
                        </div>
                      )}
                    </CardHeader>
                  </Card>
                </div>
                <div className="flex-1 min-w-0">
                  {(dailyStatus === "Daily" ? (isLoadingDaily || isFiltering) : (isLoadingMonthly || isFiltering)) ? (
                    <ChartSkeleton />
                  ) : (
                    <BarLineChart
                      dailyStatus={dailyStatus}
                      dailyData={dailyData}
                      monthlyData={monthlyData}
                      chartType="simulation"
                      scrollRef={chartScrollRef}
                      onScrollSync={handleScroll}
                      onChartMouseMove={handleChartHover}
                      onChartMouseLeave={handleChartLeave}
                      clickedIndex={clickedChartIndex}
                      onClickedIndexChange={setClickedChartIndex}
                    />
                  )}
                </div>
              </div>
            )}

            {(simulationStep === '1' || simulationStep === '4') && (
              <div className="mt-10">
                {(dailyStatus === "Daily" ? (isLoadingDaily || isFiltering) : (isLoadingMonthly || isFiltering)) ? (
                  <TableSkeleton />
                ) : (
                  <ProductionMatrixTable
                    simulationStep={simulationStep}
                    chartType="simulation"
                    mode={dailyStatus}
                    maxVisibleColumns={14}
                    sections={dailyStatus === "Daily" ? filteredDailySections : filteredMonthlySections}
                    scrollRef={tableScrollRef}
                    onScrollSync={handleScroll}
                    selectedDate={selectedDate}
                  />
                )}
              </div>
            )}

            {(simulationStep === '3') && (
              <div>
                {selectedPlan && (
                  <div className="mt-6 mb-8">
                    <Accordion type="single" collapsible className="w-full" defaultValue={`item-${selectedPlan.key}`}>
                      <AccordionItem value={`item-${selectedPlan.key}`}>
                        <AccordionTrigger>
                          <div className="text-sm/10">
                            {`Plan ${selectedPlan.key}: OT`}
                            <span className="bg-[#F4F4F4] p-2 rounded-md group-data-[state=open]:bg-[#898989] mx-2">
                              {`${selectedPlan.ot} hrs.`}
                            </span> <br className="block lg:hidden" />
                               Manpower
                            <span className="bg-[#F4F4F4] p-2 rounded-md group-data-[state=open]:bg-[#898989] mx-2">
                              {`${selectedPlan.manpower} people`}
                            </span>
                            Cost Energy
                            <span className="bg-[#F4F4F4] p-2 rounded-md group-data-[state=open]:bg-[#898989] mx-2">
                              {`${selectedPlan.thb} THB`}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="flex flex-col gap-4 text-balance">
                          <div className="mt-4 flex flex-col gap-4 lg:flex-row">
                            <div className="w-full lg:w-[400px]">
                              <Card className="h-full">
                                <CardHeader>
                                  {hoveredData ? (
                                    <div>
                                      <CardTitle></CardTitle>
                                      <CardDescription></CardDescription>
                                      <CardContent>
                                        <div className="flex flex-col justify-between h-full">
                                          <div className="space-y-4">
                                            <div className="font-bold text-md mb-2">{hoveredData.name}</div>
                                            <div className="h-[1px] w-full bg-black opacity-10"></div>
                                            <ul className="space-y-4 text-sm">
                                              {keysInOrder.map((key) => {
                                                const value = hoveredData[key];
                                                const label = displayLabels[key] || key;
                                                const chartItem = hoveredData.chartItems?.find((item: any) => item.dataKey === key);
                                                const color = chartItem?.color || chartItem?.stroke;
                                                return (
                                                  <li key={key}>
                                                    <div className="flex justify-between items-center">
                                                      <div>{label}:</div>
                                                      <span style={{ color: color || 'inherit' }} className="font-semibold">{String(value ?? 'N/A')}</span>
                                                    </div>
                                                    <div className="w-full border-t border-dotted border-black opacity-10 my-1"></div>
                                                  </li>
                                                );
                                              })}
                                            </ul>
                                          </div>
                                          <div className="mt-10 space-y-4">
                                            {keyValuesToShow.map((key) => {
                                              const value = hoveredData[key];
                                              const label = displayLabels[key] || key;
                                              const chartItem = hoveredData.chartItems?.find((item: any) => item.dataKey === key);
                                              const color = chartItem?.color || chartItem?.stroke;
                                              return (
                                                <div key={key} className="flex justify-between items-center text-sm">
                                                  <div>{label}:</div>
                                                  <span style={{ color: color || 'inherit' }} className="font-semibold">{String(value ?? 'N/A')}</span>
                                                </div>
                                              );
                                            })}
                                          </div>
                                          <div className="bg-[#F1F3F7] text-center p-3 rounded-md text-xs mt-4">
                                            Updated automatically based on <br /> production data
                                          </div>
                                        </div>
                                      </CardContent>
                                    </div>
                                  ) : (
                                    <div>
                                      <CardTitle><div className="text-md font-bold">Detail</div></CardTitle>
                                      <CardDescription className="mt-2">Daily and monthly production performance...</CardDescription>
                                      <CardContent></CardContent>
                                    </div>
                                  )}
                                </CardHeader>
                              </Card>
                            </div>
                            <div className="flex-1 min-w-0">
                              {(dailyStatus === "Daily" ? (isLoadingDaily || isFiltering) : (isLoadingMonthly || isFiltering)) ? (
                                <ChartSkeleton />
                              ) : (
                                <BarLineChart
                                  dailyStatus={dailyStatus}
                                  dailyData={dailyData}
                                  monthlyData={monthlyData}
                                  chartType="simulation"
                                  scrollRef={chartScrollRef}
                                  onScrollSync={handleScroll}
                                  onChartMouseMove={handleChartHover}
                                  onChartMouseLeave={handleChartLeave}
                                  clickedIndex={clickedChartIndex}
                                  onClickedIndexChange={setClickedChartIndex}
                                />
                              )}
                            </div>
                          </div>
                          <div className="mt-10">
                            {(dailyStatus === "Daily" ? (isLoadingDaily || isFiltering) : (isLoadingMonthly || isFiltering)) ? (
                              <TableSkeleton />
                            ) : (
                              <ProductionMatrixTable
                                simulationStep={simulationStep}
                                chartType="simulation"
                                mode={dailyStatus}
                                maxVisibleColumns={14}
                                sections={dailyStatus === "Daily" ? filteredDailySections : filteredMonthlySections}
                                scrollRef={tableScrollRef}
                                onScrollSync={handleScroll}
                                selectedDate={selectedDate}
                              />
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}
              </div>
            )}
             {(simulationStep === '3' || simulationStep === '4') && (    
                <div className="mt-6" ref={partCheckingRef}>
                  {showPartCheckingError && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 text-sm font-medium">
                        ⚠️ Please confirm both Part Checking and Part Checking Detail before proceeding to the next step.
                      </p>
                    </div>
                  )}
               <div className="flex items-center justify-between  mb-3">
                    <h2 className="font-bold text-2xl ">Part Checking</h2>
                    <div 
                      onClick={() => handlePartCheckingToggle()}
                      className={`cursor-pointer ${ (selectedPartLoading || selectedPartChecked) ? 'pointer-events-none cursor-default opacity-60' : ''}`}
                    >
                    { simulationStep === '3' &&  <CheckingButton 
                        isChecked={selectedPartChecked} 
                        isLoading={selectedPartLoading}
                      />
                    }
                    </div>
               </div>
                  <PartCheckingTable />

               <div className="flex items-center justify-between mt-14  mb-3" >
                    <h2 className="font-bold text-2xl ">Part Checking Detail</h2>
                    <div 
                      onClick={() => handlePartCheckingDetailToggle()}
                      className={`cursor-pointer ${(selectedDetailLoading || selectedDetailChecked) ? 'pointer-events-none cursor-default opacity-60' : ''}`}
                    >
                      {simulationStep === '3' &&  
                      <CheckingButton 
                        isChecked={selectedDetailChecked}
                        isLoading={selectedDetailLoading}
                      />
                      }
                  </div>
                </div>
                <PartCheckingDetailTable TypePage="simulation" />
              </div>
            )}

            {simulationStep === '2' && (
              <Accordion
                type="multiple"
                className="w-full mt-6 mb-8"
                value={openPlanKey.map(key => `item-${key}`)}
                onValueChange={(values) => {
                  setOpenPlanKey(values.map(val => val.replace('item-', '')));
                }}
              >
                {plans.map((plan) => (
                  <AccordionItem key={plan.key} value={`item-${plan.key}`}>
                    <AccordionTrigger>
                      <div className="text-sm/10">
                        <span className="text-white bg-denso-dark p-2 rounded-md group-data-[state=open]:bg-[#252525] mx-2">{`Plan ${plan.key} `}</span> OT
                          <span className="bg-[#F4F4F4] p-2 rounded-md group-data-[state=open]:bg-[#898989] mx-2">
                            {` ${plan.ot} hrs.`}
                          </span> <br className="block lg:hidden" />
                           Manpower
                          <span className="bg-[#F4F4F4] p-2 rounded-md group-data-[state=open]:bg-[#898989] mx-2">
                            {`${plan.manpower} people`}
                          </span>
                          Cost Energy
                          <span className="bg-[#F4F4F4] p-2 rounded-md group-data-[state=open]:bg-[#898989] mx-2">
                            {`${plan.thb} THB`}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="flex flex-col gap-4 text-balance">
                        <div className="flex justify-end mt-3">
                          <Button
                            onClick={() => {
                              // เลือกแผน และรีเซ็ตสถานะ Part Checking ของแผนนั้นให้ต้องยืนยันใหม่
                              setSelectedPlan(plan);
                              setPartCheckingByPlan(prev => ({ ...prev, [plan.key]: false }));
                              setPartCheckingDetailByPlan(prev => ({ ...prev, [plan.key]: false }));
                              setPartCheckingLoadingByPlan(prev => ({ ...prev, [plan.key]: false }));
                              setPartCheckingDetailLoadingByPlan(prev => ({ ...prev, [plan.key]: false }));
                              setShowPartCheckingError(false);
                              setStep2Confirmed(true); // lock Step 2 upon confirmation
                              handleNextStep('3');
                            }}
                            className="bg-black w-32 text-white hover:bg-black/90 disabled:opacity-60 disabled:cursor-not-allowed"
                            disabled={step2Confirmed}
                          >
                            {isTransitioning && <Spinner className="text-white" />}
                            Confirm
                          </Button>
                        </div>
                        <div className="mt-4 flex flex-col gap-4 lg:flex-row">
                          <div className="w-full lg:w-[400px]">
                            <Card className="h-full">
                              <CardHeader>
                                {hoveredData ? (
                                  <div>
                                    <CardTitle></CardTitle>
                                    <CardDescription></CardDescription>
                                    <CardContent>
                                      <div className="flex flex-col justify-between h-full">
                                        <div className="space-y-4">
                                          <div className="font-bold text-md mb-2">{hoveredData.name}</div>
                                          <div className="h-[1px] w-full bg-black opacity-10"></div>
                                          <ul className="space-y-4 text-sm">
                                            {keysInOrder.map((key) => {
                                              const value = hoveredData[key];
                                              const label = displayLabels[key] || key;
                                              // หาสีจาก chartItems
                                              const chartItem = hoveredData.chartItems?.find((item: any) => item.dataKey === key);
                                              const color = chartItem?.color || chartItem?.stroke;

                                              return (
                                                <li key={key}>
                                                  <div className="flex justify-between items-center">
                                                    <div>{label}:</div>
                                                    <span style={{ color: color || 'inherit' }} className="font-semibold">
                                                      {String(value ?? 'N/A')}
                                                    </span>
                                                  </div>
                                                  <div className="w-full border-t border-dotted border-black opacity-10 my-1"></div>
                                                </li>

                                              );
                                            })}
                                          </ul>
                                        </div>
                                        <div className="mt-6 space-y-4">
                                          {keyValuesToShow.map((key) => {
                                            const value = hoveredData[key];
                                            const label = displayLabels[key] || key;
                                            // หาสีจาก chartItems
                                            const chartItem = hoveredData.chartItems?.find((item: any) => item.dataKey === key);
                                            const color = chartItem?.color || chartItem?.stroke;

                                            return (
                                              <div key={key} className="flex justify-between items-center text-sm">
                                                <div>{label}:</div>
                                                <span style={{ color: color || 'inherit' }} className="font-semibold">
                                                  {String(value ?? 'N/A')}
                                                </span>
                                              </div>
                                            );
                                          })}
                                        </div>
                                        <div className="bg-[#F1F3F7] text-center p-3 rounded-md text-xs mt-4">
                                          Updated automatically based on <br /> production data
                                        </div>
                                      </div>
                                    </CardContent>
                                  </div>
                                ) : (
                                  <div>
                                    {(dailyStatus === "Daily" ? (isLoadingDaily || isFiltering) : (isLoadingMonthly || isFiltering)) ?
                                      (
                                        <>
                                          <CardTitle >
                                            <Skeleton className="h-4 w-20" />
                                          </CardTitle>
                                          <CardDescription className="mt-2 space-y-2">
                                            <Skeleton className="h-3 w-full" />
                                            <Skeleton className="h-3 w-full" />
                                          </CardDescription>
                                        </>
                                      ) : (
                                        <>
                                          <CardTitle >
                                            <div className="text-md font-bold">Detail</div>
                                          </CardTitle>
                                          <CardDescription className="mt-2">
                                            Daily and monthly production performance with delay, recovery, and safety indicators.
                                          </CardDescription>
                                        </>
                                      )}
                                    <CardContent>
                                    </CardContent>
                                  </div>
                                )}
                              </CardHeader>
                            </Card>
                          </div>
                          <div className="flex-1 min-w-0">
                            {(dailyStatus === "Daily" ? (isLoadingDaily || isFiltering) : (isLoadingMonthly || isFiltering)) ? (
                              <ChartSkeleton />
                            ) : (
                              <BarLineChart
                                dailyStatus={dailyStatus}
                                dailyData={dailyData}
                                monthlyData={monthlyData}
                                chartType="simulation"
                                scrollRef={getChartRefForPlan(plan.key)}
                                onScrollSync={(source, left) => handleScroll(source, left, plan.key)}
                                onChartMouseMove={handleChartHover}
                                onChartMouseLeave={handleChartLeave}
                                clickedIndex={clickedChartIndex}
                            onClickedIndexChange={setClickedChartIndex}
                          />
                            )}
                          </div>
                        </div>
                        <div className="mt-10">
                          {(dailyStatus === "Daily" ? (isLoadingDaily || isFiltering) : (isLoadingMonthly || isFiltering)) ? (
                            <TableSkeleton />
                          ) : (
                            <ProductionMatrixTable
                              simulationStep={simulationStep}
                              chartType="simulation"
                              mode={dailyStatus}
                              maxVisibleColumns={14}
                              sections={dailyStatus === "Daily" ? filteredDailySections : filteredMonthlySections}
                              scrollRef={getTableRefForPlan(plan.key)}
                              onScrollSync={(source, left) => handleScroll(source, left, plan.key)}
                              canEditCells={!step2Confirmed}
                              selectedDate={selectedDate}
                            />
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </div>
          </div>
      )
      }

      <ConfirmPartCheckingDialog
        open={PartCheckingDialogOpen}
        onOpenChange={setPartCheckingDialogOpen}
        title="Confirm Part Checking"
        description={"Confirming will set this Part Checking to \"Checked\".\nThe data will be used in the Ordering step. Continue?"}
        confirmLabel="Confirm"
        iconColorClass="bg-emerald-500"
        onConfirmCheck={async () => {
          if (!pendingPlanKey) return;
          setPartCheckingLoadingByPlan(prev => ({ ...prev, [pendingPlanKey]: true }));
          await new Promise(r => setTimeout(r, 400));
          setPartCheckingByPlan(prev => ({ ...prev, [pendingPlanKey]: true }));
          setShowPartCheckingError(false);
          setPartCheckingLoadingByPlan(prev => ({ ...prev, [pendingPlanKey]: false }));
          if (postConfirm?.action === 'gotoStep3') {
            handleNextStep('3');
            setPostConfirm(null);
          }
        }}
      />
      <ConfirmPartCheckingDialog
        open={PartCheckingDetailDialogOpen}
        onOpenChange={setPartCheckingDetailDialogOpen}
        title="Confirm Part Checking Detail"
        description={"Confirming will set this Part Checking Detail to \"Checked\".\nThe data will be used in the Ordering step. Continue?"}
        confirmLabel="Confirm"
        iconColorClass="bg-emerald-500"
        onConfirmCheck={async () => {
          if (!pendingPlanKey) return;
          setPartCheckingDetailLoadingByPlan(prev => ({ ...prev, [pendingPlanKey]: true }));
          await new Promise(r => setTimeout(r, 400));
          setPartCheckingDetailByPlan(prev => ({ ...prev, [pendingPlanKey]: true }));
          setShowPartCheckingError(false);
          setPartCheckingDetailLoadingByPlan(prev => ({ ...prev, [pendingPlanKey]: false }));
        }}
      />
      <AddPlanDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        productionLine={productionLinesName}
        plans={plans}
        onAddPlan={handleAddPlan}
      />
    </div>
  );
}