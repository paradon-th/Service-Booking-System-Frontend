"use client";

import * as React from "react";
import {
  format,
  subDays,
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfDay,
  endOfDay,
  startOfYear,
  endOfYear,
  startOfWeek,
  addMonths
} from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronLeft, ChevronRight } from "lucide-react";

const dateFilterPresets = [
  { name: "Today", value: "today" },
  { name: "Yesterday", value: "yesterday" },
  { name: "This Week", value: "thisWeek" },
  { name: "Last 7 Days", value: "last7Days" },
  { name: "Last 28 Days", value: "last28Days" },
  { name: "This Month", value: "thisMonth" },
  { name: "Last Month", value: "lastMonth" },
  { name: "Next 3 Months", value: "next3Months" },
  { name: "This Year", value: "thisYear" }
];

// Month/Year Picker สำหรับ Monthly mode
function MonthYearPicker({
  fromDate,
  toDate,
  onSelect,
}: {
  fromDate: Date | undefined;
  toDate: Date | undefined;
  onSelect: (from: Date | undefined, to: Date | undefined) => void;
}) {
  const [selectingFrom, setSelectingFrom] = React.useState(true);
  const [tempFrom, setTempFrom] = React.useState(fromDate);
  const [tempTo, setTempTo] = React.useState(toDate);
  const [viewYear, setViewYear] = React.useState(new Date().getFullYear());

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const handleMonthClick = (monthIndex: number) => {
    const selectedDate = new Date(viewYear, monthIndex, 1);
    
    if (selectingFrom) {
      const from = startOfMonth(selectedDate);
      setTempFrom(from);
      setSelectingFrom(false);
      
      // ถ้ายังไม่มี to หรือ from ใหม่มากกว่า to เดิม ให้ set to = from
      if (!tempTo || from > tempTo) {
        const to = endOfMonth(selectedDate);
        setTempTo(to);
        onSelect(from, to);
      } else {
        onSelect(from, tempTo);
      }
    } else {
      const to = endOfMonth(selectedDate);
      setTempTo(to);
      
      // ถ้า to น้อยกว่า from ให้สลับ
      if (tempFrom && to < tempFrom) {
        onSelect(to, endOfMonth(tempFrom));
        setTempFrom(to);
        setTempTo(endOfMonth(tempFrom));
      } else {
        onSelect(tempFrom, to);
      }
      setSelectingFrom(true);
    }
  };

  const isInRange = (monthIndex: number) => {
    if (!tempFrom || !tempTo) return false;
    const monthDate = new Date(viewYear, monthIndex, 15);
    return monthDate >= tempFrom && monthDate <= tempTo;
  };

  const isStart = (monthIndex: number) => {
    if (!tempFrom) return false;
    return tempFrom.getFullYear() === viewYear && tempFrom.getMonth() === monthIndex;
  };

  const isEnd = (monthIndex: number) => {
    if (!tempTo) return false;
    return tempTo.getFullYear() === viewYear && tempTo.getMonth() === monthIndex;
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setViewYear(viewYear - 1)}
          className="h-7 w-7 p-0">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="font-semibold">{viewYear}</div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setViewYear(viewYear + 1)}
          className="h-7 w-7 p-0">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="text-xs text-muted-foreground mb-2 text-center">
        {selectingFrom ? "Select start month" : "Select end month"}
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {months.map((month, index) => (
          <Button
            key={month}
            variant="outline"
            size="sm"
            onClick={() => handleMonthClick(index)}
            className={cn(
              "h-9",
              isInRange(index) && "bg-accent",
              (isStart(index) || isEnd(index)) && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
            )}>
            {month}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default function CalendarDateRangePicker({
  className,
  selectType,
  onDateChange,
  mode = "Daily"
}: React.HTMLAttributes<HTMLDivElement> & {
  onDateChange?: (dateRange: DateRange | undefined) => void;
  mode?: "Daily" | "Monthly";
  selectType?: string;
}) {
  const isMobile = useIsMobile();
  const today = new Date();
  
  // เริ่มต้นด้วยย้อนหลัง 2 เดือน (วันที่ 1) และไปข้างหน้า 3 เดือน (วันสุดท้าย)
  // สำหรับ Monthly mode ให้เริ่มที่วันแรกของเดือน -2 และสิ้นเดือนที่ +3
  const twoMonthsAgo = subMonths(today, 2);
  const threeMonthsLater = addMonths(today, 3);

  // Initialize with "Start of -2 Months to End of +3 Months" as default
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: startOfMonth(twoMonthsAgo), // เริ่มวันที่ 1 ของเดือน -2
    to: endOfMonth(threeMonthsLater)   // สิ้นเดือนของเดือน +3
  });
  const [open, setOpen] = React.useState(false);
  const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date());

  // Filter presets based on mode
  const availablePresets = React.useMemo(() => {
    if (mode === "Monthly") {
      // สำหรับ Monthly mode แสดงเฉพาะ preset ที่เกี่ยวกับเดือน
      return dateFilterPresets.filter(preset => 
        ["thisMonth", "lastMonth", "next3Months", "thisYear"].includes(preset.value)
      );
    }
    return dateFilterPresets;
  }, [mode]);

  // เรียก callback ครั้งแรกเมื่อ component mount
  React.useEffect(() => {
    if (onDateChange && date) {
      onDateChange(date);
    }
  }, []); // Empty dependency เพื่อเรียกแค่ครั้งเดียว

  // อัปเดต date range เมื่อ mode เปลี่ยน
  React.useEffect(() => {
    const today = new Date();
    const twoMonthsAgo = subMonths(today, 2);
    const threeMonthsLater = addMonths(today, 3);
    
    const newDateRange = {
      from: startOfMonth(twoMonthsAgo), // เริ่มวันที่ 1 ของเดือน -2
      to: endOfMonth(threeMonthsLater)   // สิ้นเดือนของเดือน +3
    };
    
    setDate(newDateRange);
    if (onDateChange) {
      onDateChange(newDateRange);
    }
  }, [mode]); // เมื่อ mode เปลี่ยนให้ reset date range

  const handleQuickSelect = (from: Date, to: Date) => {
    const newDateRange = { from, to };
    setDate(newDateRange);
    setCurrentMonth(from);
    // เรียก callback เมื่อมีการเปลี่ยนแปลงวันที่
    if (onDateChange) {
      onDateChange(newDateRange);
    }
  };

  // Format date range text based on mode
  const formatDateRange = () => {
    if (!date?.from) {
      return <span>Select date range</span>;
    }

    if (mode === "Monthly") {
      // แสดงแบบ "Nov 2025 - Feb 2026"
      if (date.to) {
        return (
          <>
            {format(date.from, "MMM yyyy")} - {format(date.to, "MMM yyyy")}
          </>
        );
      }
      return format(date.from, "MMM yyyy");
    } else {
      // แสดงแบบ "6 Nov 2025 - 6 Feb 2026"
      if (date.to) {
        return (
          <>
            {format(date.from, "dd MMM yyyy")} - {format(date.to, "dd MMM yyyy")}
          </>
        );
      }
      return format(date.from, "dd MMM yyyy");
    }
  };

  const changeHandle = (type: string) => {
    const today = new Date();
    const todayStart = startOfDay(today);
    const todayEnd = endOfDay(today);

    // สำหรับ Monthly mode ให้ปรับเป็นวันแรกและวันสุดท้ายของเดือน
    const monthlyStart = mode === "Monthly" ? startOfMonth(today) : todayStart;
    const monthlyEnd = mode === "Monthly" ? endOfMonth(today) : todayEnd;

    switch (type) {
      case "today":
        handleQuickSelect(todayStart, todayEnd);
        break;
      case "yesterday":
        const yesterday = subDays(today, 1);
        handleQuickSelect(startOfDay(yesterday), endOfDay(yesterday));
        break;
      case "thisWeek":
        const startOfCurrentWeek = startOfWeek(today);
        handleQuickSelect(startOfDay(startOfCurrentWeek), todayEnd);
        break;
      case "last7Days":
        const sevenDaysAgo = subDays(today, 6);
        handleQuickSelect(startOfDay(sevenDaysAgo), todayEnd);
        break;
      case "last28Days":
        const twentyEightDaysAgo = subDays(today, 27); // 27 days ago + today = 28 days
        handleQuickSelect(startOfDay(twentyEightDaysAgo), todayEnd);
        break;
      case "thisMonth":
        // สำหรับ Monthly mode: เดือนนี้ทั้งเดือน, Daily mode: วันนี้ถึงสิ้นเดือน
        if (mode === "Monthly") {
          handleQuickSelect(startOfMonth(today), endOfMonth(today));
        } else {
          handleQuickSelect(todayStart, endOfMonth(today));
        }
        break;
      case "lastMonth":
        const lastMonth = subMonths(today, 1);
        handleQuickSelect(startOfMonth(lastMonth), endOfMonth(lastMonth));
        break;
      case "thisYear":
        // สำหรับ Monthly mode: ปีนี้ทั้งปี, Daily mode: วันนี้ถึงสิ้นปี
        if (mode === "Monthly") {
          handleQuickSelect(startOfYear(today), endOfYear(today));
        } else {
          handleQuickSelect(todayStart, endOfYear(today));
        }
        break;
      case "next3Months":
        const threeMonthsFromNow = addMonths(today, 3);
        // สำหรับ Monthly mode: เริ่มต้นเดือนนี้ถึงสิ้นเดือนที่ +3, Daily mode: วันนี้ถึง +3 เดือน
        if (mode === "Monthly") {
          handleQuickSelect(startOfMonth(today), endOfMonth(threeMonthsFromNow));
        } else {
          handleQuickSelect(todayStart, endOfDay(threeMonthsFromNow));
        }
        break;
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {isMobile ? (
            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      id="date"
                      variant={"outline"}
                      className={cn(
                        selectType === 'actualProduction' ? "h-[24px] justify-start text-left font-normal w-full" :
                        "justify-start text-left font-normal w-full",
                        !date && "text-muted-foreground"
                      )}>
                      <CalendarIcon />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {formatDateRange()}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ) : (
            <Button
              id="date"
              variant={"outline"}
              className={cn(
               selectType === 'actualProduction' ? "h-[24px] justify-start text-left font-normal" : "justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}>
              <CalendarIcon />
              {formatDateRange()}
            </Button>
          )}
        </PopoverTrigger>
        <PopoverContent className="w-auto" align="end">
          <div className="flex flex-col lg:flex-row">
            <div className="me-0 lg:me-4">
              <ToggleGroup
                type="single"
                defaultValue="next3Months"
                className="hidden w-28 flex-col lg:block">
                {availablePresets.map((item, key) => (
                  <ToggleGroupItem
                    key={key}
                    className="text-muted-foreground w-full"
                    value={item.value}
                    onClick={() => changeHandle(item.value)}
                    asChild>
                    <Button className="justify-start rounded-md">{item.name}</Button>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              <Select defaultValue="next3Months" onValueChange={(value) => changeHandle(value)}>
                <SelectTrigger
                  className="mb-4 flex w-full lg:hidden"
                  size="sm"
                  aria-label="Select a value">
                  <SelectValue placeholder="Next 3 Months" />
                </SelectTrigger>
                <SelectContent>
                  {availablePresets.map((item, key) => (
                    <SelectItem key={key} value={item.value}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {mode === "Monthly" ? (
              <MonthYearPicker
                fromDate={date?.from}
                toDate={date?.to}
                onSelect={(from, to) => {
                  if (from && to) {
                    const newDateRange = { from, to };
                    setDate(newDateRange);
                    if (from) {
                      setCurrentMonth(from);
                    }
                    if (onDateChange) {
                      onDateChange(newDateRange);
                    }
                  }
                }}
              />
            ) : (
              <Calendar
                className="border-s-0 py-0! ps-0! pe-0! lg:border-s lg:ps-4!"
                mode="range"
                month={currentMonth}
                selected={date}
                onSelect={(newDate) => {
                  setDate(newDate);
                  if (newDate?.from) {
                    setCurrentMonth(newDate.from);
                  }
                  if (onDateChange) {
                    onDateChange(newDate);
                  }
                }}
                onMonthChange={setCurrentMonth}
              />
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
