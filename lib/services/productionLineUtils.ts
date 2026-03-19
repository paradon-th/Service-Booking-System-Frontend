import { DateRange } from "react-day-picker";

// Types
export type EditLogEntry = {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  fieldsAffected: string[];
  note: string;
};

export type Datum = {
  name: string;
  customer241?: number;
  customer31?: number;
  planTable?: number;
  actualTable?: number;
  back?: number;
  logical?: number;
  doh?: number;
  isHoliday?: boolean;
  holidayLabel?: string;
  isCapacityFull?: boolean;
  capacityReason?: string;
  hasEditLog?: boolean;
  editLog?: EditLogEntry | null;
};

export interface PartInfo {
  partNo?: string;
  partName?: string;
  model?: string;
  subAssyNo?: string;
  subAssyName?: string;
}

export interface Section {
  info: PartInfo;
  data: Datum[];
}

// Mock data for decorating
const mockLogUsers = [
  "Somchai P.",
  "Waraporn T.",
  "Nattapong L.",
  "Patchara K.",
];

const mockLogActions = [
  "Adjusted OT window",
  "Balanced plan vs. actual",
  "Applied recovery lot",
  "Manual override",
];

const mockLogFieldSets: string[][] = [
  ["planTable", "logical"],
  ["actualTable", "back"],
  ["manpower", "ot"],
  ["capacityTarget", "capacityActual"],
];

// Helper: Get holiday label based on day of week
export const getHolidayLabel = (dayOfWeek: number): string => {
  if (dayOfWeek === 0) return "Sunday shutdown";
  if (dayOfWeek === 6) return "Preventive maintenance";
  return "";
};

// Helper: Decorate datum with signals from API data
export const decorateDatumWithMockSignals = (
  datum: any,
  year: string,
  month: string,
  day: number = 1,
  seed: number,
  workingDay?: number // เพิ่ม parameter สำหรับ working_day จาก API
): any => {
  const dateObj = new Date(parseInt(year), parseInt(month) - 1, day);
  const dayOfWeek = dateObj.getDay();
  
  // ใช้ working_day จาก API ถ้ามี, ถ้าไม่มีใช้ dayOfWeek
  const isHoliday = workingDay !== undefined ? workingDay === 0 : (dayOfWeek === 0 || dayOfWeek === 6);

  const isCapacityFull = !isHoliday && (seed + day) % 9 === 0;

  let editLog: EditLogEntry | null = null;

  if (!isHoliday && (seed + day) % 7 === 0) {
    const mockIndex = (seed + day) % mockLogUsers.length;
    const fieldsAffected = mockLogFieldSets[(seed + day) % mockLogFieldSets.length];
    editLog = {
      id: `${datum.name || ""}-log-${seed}`,
      timestamp: dateObj.toISOString(),
      user: mockLogUsers[mockIndex],
      action: mockLogActions[(seed + day) % mockLogActions.length],
      fieldsAffected,
      note: `${fieldsAffected.length} field(s) manually tuned to match downstream demand`,
    };
  }

  return {
    ...datum,
    isHoliday,
    holidayLabel: isHoliday ? getHolidayLabel(dayOfWeek) : undefined,
    isCapacityFull,
    capacityReason: isCapacityFull
      ? "Capacity fully utilized after levelling"
      : undefined,
    hasEditLog: Boolean(editLog),
    editLog,
  };
};

// Helper: Convert month number to month name
export const getMonthName = (monthNum: string): string => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const index = parseInt(monthNum) - 1;
  return months[index] || monthNum;
};

// Helper: Check if date is in range
export const isDateInRange = (
  year: string,
  month: string,
  day: number | undefined,
  dateRange: DateRange | undefined
): boolean => {
  if (!dateRange?.from || !dateRange?.to) return true;

  const dataDate = new Date(parseInt(year), parseInt(month) - 1, day || 1);

  if (!day) {
    const monthStart = new Date(parseInt(year), parseInt(month) - 1, 1);
    const monthEnd = new Date(parseInt(year), parseInt(month), 0);
    return monthStart <= dateRange.to && monthEnd >= dateRange.from;
  }

  const dataDateStart = new Date(dataDate.getFullYear(), dataDate.getMonth(), dataDate.getDate());
  const rangeFrom = new Date(dateRange.from.getFullYear(), dateRange.from.getMonth(), dateRange.from.getDate());
  const rangeTo = new Date(dateRange.to.getFullYear(), dateRange.to.getMonth(), dateRange.to.getDate());

  return dataDateStart >= rangeFrom && dataDateStart <= rangeTo;
};

// Transform API data to daily data format
// masterDateMap: วันที่ที่มีข้อมูลจากอย่างน้อย 1 part (ใช้กำหนดว่าวันไหนไม่ใช่วันหยุด)
export const transformApiData = (
  data241: any[],
  data31: any[],
  dateRange?: DateRange,
  masterDateMap?: Map<string, { date: Date; workingDay: number; hasHoliday: boolean }> // เพิ่ม hasHoliday
): any[] => {
  if (!data241.length && !data31.length) return [];

  // สร้าง map เก็บข้อมูลแต่ละวัน (ของ part นี้)
  const dateMap = new Map<string, { 
    date: Date; 
    customer241?: number; 
    customer31?: number; 
    workingDay?: number;
    originalItem?: any;
  }>();

  // ประมวลผล data241 - ใช้ค่าจาก record ของ part นี้
  data241.forEach(item => {
    if (!item.fields?.date || item.fields.customer_order_2_41 === null) return;
    
    const [month, day, year] = item.fields.date.split('/');
    const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const dateKey = item.fields.date;

    // ถ้ายังไม่มีวันนี้ใน map ให้เพิ่มเข้าไป
    if (!dateMap.has(dateKey)) {
      dateMap.set(dateKey, { 
        date: dateObj,
        customer241: item.fields.customer_order_2_41,
        customer31: undefined,
        workingDay: item.fields.working_day,
        originalItem: item
      });
    } else {
      const entry = dateMap.get(dateKey)!;
      if (entry.customer241 === undefined) {
        entry.customer241 = item.fields.customer_order_2_41;
      }
    }
  });

  // ประมวลผล data31 - ใช้ค่าจาก record ของ part นี้
  data31.forEach(item => {
    if (!item.fields?.date || item.fields.customer_order_3_1 === null) return;
    
    const [month, day, year] = item.fields.date.split('/');
    const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const dateKey = item.fields.date;

    if (!dateMap.has(dateKey)) {
      dateMap.set(dateKey, { 
        date: dateObj,
        customer241: undefined,
        customer31: item.fields.customer_order_3_1,
        workingDay: item.fields.working_day,
        originalItem: item
      });
    } else {
      const entry = dateMap.get(dateKey)!;
      if (entry.customer31 === undefined) {
        entry.customer31 = item.fields.customer_order_3_1;
      }
    }
  });

  // ใช้ masterDateMap ถ้ามี (มาจากข้อมูลรวมทุก part)
  // ถ้าไม่มีก็ใช้ dateMap ของตัวเอง
  const baseDateMapForRange = masterDateMap && masterDateMap.size > 0 ? masterDateMap : dateMap;
  
  if (baseDateMapForRange.size === 0) return [];
  
  // แปลงเป็น array และดึง date ออกมา
  const allBaseDates = Array.from(baseDateMapForRange.values()).map(entry => entry.date);
  const minDate = new Date(Math.min(...allBaseDates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(...allBaseDates.map(d => d.getTime())));

  // สร้างวันที่ครบทุกวันตั้งแต่ minDate ถึง maxDate
  const allDates: any[] = [];
  const currentDate = new Date(minDate);
  
  while (currentDate <= maxDate) {
    const dateKey = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
    const existingEntry = dateMap.get(dateKey); // ข้อมูลของ part นี้
    const masterEntry = masterDateMap?.get(dateKey); // ข้อมูลรวมทุก part
    
    // ตรวจสอบว่าเป็นวันหยุดจริงหรือไม่
    // ถ้ามี masterEntry และ hasHoliday = true → วันหยุดทั้ง column
    const isRealHoliday = masterEntry 
      ? masterEntry.hasHoliday // ใช้ hasHoliday จาก masterEntry
      : !existingEntry; // ถ้าไม่มี masterEntry ดูว่า part นี้มีข้อมูลไหม
    
    // ถ้า part นี้มีข้อมูลในวันนี้
    if (existingEntry) {
      allDates.push({
        date: new Date(currentDate),
        customer241: existingEntry.customer241,
        customer31: existingEntry.customer31,
        workingDay: isRealHoliday ? 0 : (existingEntry.workingDay ?? 1), // ใช้ isRealHoliday
        hasData: true,
      });
    } else {
      // part นี้ไม่มีข้อมูล
      
      // Debug log
      if (masterEntry && !isRealHoliday) {
        console.log(`📝 ${dateKey}: Part has no data, but other parts have data → Show 0 (not holiday)`);
      } else if (masterEntry && isRealHoliday) {
        console.log(`� ${dateKey}: Some part has working_day=0 → All parts are holiday`);
      }
      
      allDates.push({
        date: new Date(currentDate),
        customer241: 0,
        customer31: 0,
        workingDay: isRealHoliday ? 0 : 1,
        hasData: false,
      });
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Filter ตาม dateRange ถ้ามี
  const filteredDates = allDates.filter(entry => {
    if (!dateRange?.from || !dateRange?.to) return true;
    
    const dataDateStart = new Date(entry.date.getFullYear(), entry.date.getMonth(), entry.date.getDate());
    const rangeFrom = new Date(dateRange.from.getFullYear(), dateRange.from.getMonth(), dateRange.from.getDate());
    const rangeTo = new Date(dateRange.to.getFullYear(), dateRange.to.getMonth(), dateRange.to.getDate());
    
    return dataDateStart >= rangeFrom && dataDateStart <= rangeTo;
  });

  // สร้าง result - ใช้ค่าจาก API โดยตรง ไม่คำนวณ mock
  const result: any[] = filteredDates.map(entry => {
    const date = entry.date;
    const day = date.getDate();
    const monthName = getMonthName((date.getMonth() + 1).toString());
    const year = date.getFullYear();

    const datumBase = {
      name: `${day} ${monthName} ${year}`,
      // ใช้ค่าจาก API โดยตรง - ไม่มีการคำนวณ
      customer241: entry.customer241 || 0,
      customer31: entry.customer31 || 0,
      // Fields อื่นๆ ที่ยังไม่มีใน API ให้เป็น 0 ก่อน
      target: 500,
      actual: 800,
      cap8: 1800,
      cap10: 2300,
      cap10b: 2500,
      plan: 0,
      backOrder: 900,
      accumulate: 1900,
      planTable: 0,
      actualTable: 0,
      back: 0,
      logical: 0,
      doh: 0,
    };

    const seed = year + (date.getMonth() + 1) * 100;
    // ส่ง workingDay ไปด้วย (0 = วันหยุด)
    const datum = decorateDatumWithMockSignals(
      datumBase, 
      year.toString(), 
      (date.getMonth() + 1).toString(), 
      day, 
      seed,
      entry.workingDay
    );
    return datum;
  });

  return result;
};

// Transform API data to monthly data format
export const transformMonthlyApiData = (
  data241: any[],
  data31: any[],
  dateRange?: DateRange
): any[] => {
  if (!data241.length && !data31.length) return [];

  // สร้าง map เก็บข้อมูลแต่ละเดือน
  const monthMap = new Map<string, { year: number; month: number; customer241Total: number; customer31Total: number; count241: number; count31: number }>();

  // ประมวลผล data241 - รวมข้อมูลตามเดือน
  data241.forEach(item => {
    if (!item.fields?.date || item.fields.customer_order_2_41 === null) return;
    
    // แปลง date จาก "MM/DD/YYYY"
    const [month, day, year] = item.fields.date.split('/');
    const monthKey = `${year}-${month}`;

    if (!monthMap.has(monthKey)) {
      monthMap.set(monthKey, {
        year: parseInt(year),
        month: parseInt(month),
        customer241Total: 0,
        customer31Total: 0,
        count241: 0,
        count31: 0,
      });
    }
    const entry = monthMap.get(monthKey)!;
    entry.customer241Total += item.fields.customer_order_2_41;
    entry.count241++;
  });

  // ประมวลผล data31
  data31.forEach(item => {
    if (!item.fields?.date || item.fields.customer_order_3_1 === null) return;
    
    const [month, day, year] = item.fields.date.split('/');
    const monthKey = `${year}-${month}`;

    if (!monthMap.has(monthKey)) {
      monthMap.set(monthKey, {
        year: parseInt(year),
        month: parseInt(month),
        customer241Total: 0,
        customer31Total: 0,
        count241: 0,
        count31: 0,
      });
    }
    const entry = monthMap.get(monthKey)!;
    entry.customer31Total += item.fields.customer_order_3_1;
    entry.count31++;
  });

  // แปลงเป็น array และ sort ตามเดือน
  const sortedMonths = Array.from(monthMap.entries()).sort((a, b) => {
    const [, dataA] = a;
    const [, dataB] = b;
    
    if (dataA.year !== dataB.year) {
      return dataA.year - dataB.year;
    }
    return dataA.month - dataB.month;
  });

  // Filter ตาม dateRange ถ้ามี
  const filteredMonths = sortedMonths.filter(([, entry]) => {
    if (!dateRange?.from || !dateRange?.to) return true;
    
    const monthStart = new Date(entry.year, entry.month - 1, 1);
    const monthEnd = new Date(entry.year, entry.month, 0);
    
    return monthStart <= dateRange.to && monthEnd >= dateRange.from;
  });

  // สร้าง result
  const result: any[] = filteredMonths.map(([, entry]) => {
    const monthName = getMonthName(entry.month.toString());
    const year = entry.year;

    const datumBase = {
      name: `${monthName} ${year}`,
      customer241: entry.customer241Total,
      customer31: entry.customer31Total,
      // Mock data ส่วนอื่นๆ (รอข้อมูลจาก API)
      target: 500,
      actual: 800,
      cap8: 1800,
      cap10: 2300,
      cap10b: 2500,
      plan: 0,
      backOrder: 900,
      accumulate: 1900,
      planTable: 0,
      actualTable: 0,
      back: 0,
      logical: 0,
      doh: 0,
    };

    const seed = year * 100 + entry.month;
    // สำหรับ monthly view ไม่ส่ง workingDay (ใช้ logic เดิม)
    const datum = decorateDatumWithMockSignals(
      datumBase, 
      year.toString(), 
      entry.month.toString(), 
      1, 
      seed,
      undefined // monthly view ไม่ต้องใช้ working_day
    );
    return datum;
  });

  return result;
};

// Group data by part_no for daily view
export const groupByPartNo = (
  data241: any[],
  data31: any[],
  dateRange?: DateRange
): Section[] => {
  const partNoMap = new Map<string, any>();

  // 1. สร้าง masterDateMap จากข้อมูลทุก part รวมกัน
  // เพื่อหาว่าวันไหนบ้างที่มีข้อมูลจากอย่างน้อย 1 part
  const masterDateMap = new Map<string, { date: Date; workingDay: number; hasHoliday: boolean }>();
  
  [...data241, ...data31].forEach(item => {
    if (!item.fields?.date) return;
    
    const [month, day, year] = item.fields.date.split('/');
    const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const dateKey = item.fields.date;
    const workingDay = item.fields.working_day;
    
    if (!masterDateMap.has(dateKey)) {
      masterDateMap.set(dateKey, {
        date: dateObj,
        workingDay: workingDay,
        hasHoliday: workingDay === 0 // ถ้ามี part ใดที่ working_day = 0
      });
    } else {
      // ถ้ามี part ใดที่ working_day = 0 ให้ทั้งวันเป็นวันหยุด
      const entry = masterDateMap.get(dateKey)!;
      if (workingDay === 0) {
        entry.hasHoliday = true;
        entry.workingDay = 0;
        console.log(`🚫 Master: ${dateKey} has working_day=0 → Mark as holiday for all parts`);
      }
    }
  });
  
  console.log("📅 Master Date Map (dates with data from any part):", masterDateMap.size, "dates");

  // 2. สร้าง map สำหรับข้อมูล part info และเก็บ data แยกตาม part_no
  [...data241, ...data31].forEach(item => {
    const fields = item.fields;
    if (!fields) return;

    const partNo = fields.part_no;
    if (!partNoMap.has(partNo)) {
      partNoMap.set(partNo, {
        info: {
          partNo: fields.part_no,
          partName: fields.part_name,
          model: fields.model,
          subAssyNo: fields.sub_assy_no || "N/A",
          subAssyName: fields.sub_assy_name || "N/A",
        },
        data241: [],
        data31: [],
      });
    }
  });

  // 3. แยก data ตาม part_no
  data241.forEach(item => {
    const partNo = item.fields?.part_no;
    if (partNo && partNoMap.has(partNo)) {
      partNoMap.get(partNo).data241.push(item);
    }
  });

  data31.forEach(item => {
    const partNo = item.fields?.part_no;
    if (partNo && partNoMap.has(partNo)) {
      partNoMap.get(partNo).data31.push(item);
    }
  });

  // 4. สร้าง sections โดยแต่ละ part_no ใช้ masterDateMap ร่วมกัน
  const sections: Section[] = [];
  partNoMap.forEach((group) => {
    // Transform data เฉพาะของ part_no นี้ แต่ใช้ masterDateMap
    const transformedData = transformApiData(
      group.data241, 
      group.data31, 
      dateRange,
      masterDateMap // ส่ง masterDateMap เข้าไป
    );
    sections.push({
      info: group.info,
      data: transformedData, // ข้อมูลเฉพาะของ part_no นี้
    });
  });

  return sections;
};

// Group data by part_no for monthly view
export const groupByPartNoMonthly = (
  data241: any[],
  data31: any[],
  dateRange?: DateRange
): Section[] => {
  const partNoMap = new Map<string, any>();

  // สร้าง map สำหรับข้อมูล part info และเก็บ data แยกตาม part_no
  [...data241, ...data31].forEach(item => {
    const fields = item.fields;
    if (!fields) return;

    const partNo = fields.part_no;
    if (!partNoMap.has(partNo)) {
      partNoMap.set(partNo, {
        info: {
          partNo: fields.part_no,
          partName: fields.part_name,
          model: fields.model,
          subAssyNo: fields.sub_assy_no || "N/A",
          subAssyName: fields.sub_assy_name || "N/A",
        },
        data241: [],
        data31: [],
      });
    }
  });

  // แยก data ตาม part_no
  data241.forEach(item => {
    const partNo = item.fields?.part_no;
    if (partNo && partNoMap.has(partNo)) {
      partNoMap.get(partNo).data241.push(item);
    }
  });

  data31.forEach(item => {
    const partNo = item.fields?.part_no;
    if (partNo && partNoMap.has(partNo)) {
      partNoMap.get(partNo).data31.push(item);
    }
  });

  // สร้าง sections โดยแต่ละ part_no มีข้อมูลของตัวเอง
  const sections: Section[] = [];
  partNoMap.forEach((group) => {
    // Transform data เฉพาะของ part_no นี้
    const transformedData = transformMonthlyApiData(group.data241, group.data31, dateRange);
    sections.push({
      info: group.info,
      data: transformedData, // ข้อมูลเฉพาะของ part_no นี้
    });
  });

  return sections;
};

// Create dynamic options from sections
export const createDynamicOptions = (sections: Section[]) => {
  const uniquePartNos = Array.from(new Set(sections.map(s => s.info.partNo).filter(Boolean)));
  const uniqueSubAssys = Array.from(new Set(sections.map(s => s.info.subAssyNo).filter(p => p !== "N/A")));

  const partNoOptions = uniquePartNos.map(partNo => ({
    label: partNo!,
    value: partNo!.toLowerCase().replace(/\s+/g, '_')
  }));

  const subAssyOptions = uniqueSubAssys.map(subAssy => ({
    label: subAssy!,
    value: subAssy!.toLowerCase().replace(/\s+/g, '_')
  }));

  return { partNoOptions, subAssyOptions };
};
