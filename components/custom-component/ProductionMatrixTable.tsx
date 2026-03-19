"use client";

import React, { useState, useRef, useLayoutEffect, useMemo } from "react";
import { AddConditionDialog } from "./AddConditionDialog";
import { AddPlanDialog } from "./AddPlanDialog";

type Mode = "Daily" | "Monthly";

type EditLogEntry = {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  fieldsAffected: string[];
  note: string;
};

type Datum = {
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

interface PartInfo {
  partNo?: string;
  partName?: string;
  model?: string;
  subAssyNo?: string;
  subAssyName?: string;
}

interface Section {
  info: PartInfo;
  data: Datum[];
}

interface ProductionMatrixTableProps {
  mode: Mode;
  data?: Datum[];
  sections?: Section[];
  chartType?: string;
  maxVisibleColumns?: number;
  columnWidthPx?: number;
  leftStickyWidthPx?: number;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
  simulationStep?: string;
  onScrollSync?: (source: "table", scrollLeft: number) => void;
  selectedDate?: string | null;
  // Controls whether table cells are editable/clickable in simulation step 2
  canEditCells?: boolean;
}

const numberFmt = (v: number | undefined) =>
  typeof v === "number" ? v.toLocaleString() : "-";

export default function ProductionMatrixTable({
  mode,
  data = [],
  sections = [],
  chartType,
  maxVisibleColumns = mode === "Daily" ? 13 : 3,
  columnWidthPx = mode === "Daily" ? 109.1 : 200,
  leftStickyWidthPx = mode === "Daily" ? 480 : 480,
  scrollRef,
  onScrollSync,
  simulationStep,
  selectedDate,
  canEditCells = true,
}: ProductionMatrixTableProps) {
  console.log("🚀 ~ ProductionMatrixTable ~ sections:", sections)
  console.log("🚀 ~ ProductionMatrixTable ~ data:", data)
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ date: string }>({ date: "" });
  const headerRef = useRef<HTMLTableSectionElement | null>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  const capacityHighlightRows = useMemo(
    () =>
      new Set([
        "planTable",
        "actualTable",
        "back",
        "logical",
        "capacityTarget",
        "capacityActual",
        "manpower",
        "ot",
        "costEnergy",
      ]),
    []
  );

  const getCellState = (datum: Datum | undefined, rowKey: string) => {
    if (!datum) {
      return {
        className: "bg-white text-gray-900",
        title: undefined,
        logInfo: null as EditLogEntry | null,
        isLoggedCell: false,
        buttonHighlightClass: undefined as string | undefined,
      };
    }

    if (datum.isHoliday) {
      return {
        className: "bg-[#727272] text-white",
        title: datum.holidayLabel || "Factory holiday",
        logInfo: null,
        isLoggedCell: false,
        buttonHighlightClass: undefined,
      };
    }

    const isCapacityCell =
      datum.isCapacityFull && capacityHighlightRows.has(rowKey);

    if (isCapacityCell) {
      return {
        className: "bg-[#FEE2E2] text-[#7F1D1D]",
        title: datum.capacityReason || "Capacity fully utilized",
        logInfo: null,
        isLoggedCell: false,
        buttonHighlightClass: undefined,
      };
    }

    const isLoggedCell = datum.editLog?.fieldsAffected?.includes(rowKey);

    if (isLoggedCell) {
      return {
        className: "bg-white text-gray-900",
        title: `${datum.editLog?.action} • ${datum.editLog?.user}`,
        logInfo: datum.editLog || null,
        isLoggedCell: true,
        buttonHighlightClass: "bg-[#F8F0E0] ",
      };
    }

    return {
      className: "bg-white text-gray-900",
      title: datum.capacityReason,
      logInfo: datum.editLog || null,
      isLoggedCell: false,
      buttonHighlightClass: undefined,
    };
  };

  const handleCellClick = (date: string) => {
    if (chartType === "simulation") {
      setSelectedCell({ date });
      setDialogOpen(true);
        console.log("🚀 ~ simulationStep:", simulationStep)
    }
  };

  // ✅ วัดความสูง header เพื่อจัดตำแหน่ง Part Info ใต้ header
  useLayoutEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, [sections]);

  const baseColumns = sections.length > 0 ? sections[0].data : data;
  console.log("🚀 ~ ProductionMatrixTable ~ baseColumns:", baseColumns)
  const colCount = baseColumns.length;

  const minTableWidth = leftStickyWidthPx + columnWidthPx * maxVisibleColumns;
  const actualTableWidth = leftStickyWidthPx + columnWidthPx * (colCount || 1);

  const rows = [
    { key: "customer241", label: "Customer Order [2-41]" },
    { key: "customer31", label: "Customer Order (SFT) [3-1]" },
    { key: "planTable", label: "Production Plan (PROD)" },
    { key: "actualTable", label: "Actual Production" },
    { key: "back", label: "Back Production (Actual not produce)" },
    { key: "logical", label: "Logical Stock" },
    { key: "doh", label: "DOH" },
    { key: "capacityTarget", label: "Capacity (Target)" },
    { key: "capacityActual", label: "Capacity (Actual)" },
    { key: "manpower", label: "Manpower (people)" },
    { key: "ot", label: "OT (hrs.)" },
    { key: "costEnergy", label: "Cost Energy  (THB)" },

  ] as const;

  const bottomKeys = [
  "capacityTarget",
  "capacityActual",
  "manpower",
  "ot",
  "costEnergy",
];

const sortedRows = [
  ...rows.filter((r) => !bottomKeys.includes(r.key)),
  ...rows.filter((r) => bottomKeys.includes(r.key)),
];

const stickyColumnStyle: React.CSSProperties = {
    minWidth: `${leftStickyWidthPx}px`,
    width: `${leftStickyWidthPx}px`,
    maxWidth: `${leftStickyWidthPx}px`,
  };


  return (
    <div className="w-full rounded-md border overflow-hidden">
      {/* Scrollable container */}
      <div
        className="overflow-x-auto overflow-y-auto max-h-[740px]"
        ref={scrollRef}
        onScroll={(e) => onScrollSync?.("table", e.currentTarget.scrollLeft)}
        style={{ width: "100%", maxWidth: "100%" }}
      >
        <div style={{ minWidth: Math.max(actualTableWidth, minTableWidth) }}>
          <table className="w-full text-xs sm:text-sm border-collapse border border-[#E5E5E5]">
            {/* ✅ Sticky Header อยู่บนสุด */}
            <thead
              ref={headerRef}
              className="bg-[#464646] text-white lg:sticky lg:top-0 z-30"
            >
              <tr>
                <th
                  className="lg:sticky lg:left-0 z-40 bg-[#464646] px-4 py-2 text-left border border-[#E5E5E5]"
                  style={stickyColumnStyle}
                >
                  {mode === "Daily" ? "Date" : "Month"}
                </th>
                {baseColumns.map((c) => {
                  const isHolidayColumn = c?.isHoliday;
                  const isCapacityColumn = c?.isCapacityFull;
                  const isSelectedDate = selectedDate === c.name;
                  
                  const headerClass = isSelectedDate
                    ? "bg-[#ef4444] text-white"
                    : isHolidayColumn
                    ? "bg-[#727272] text-white"
                    : "bg-[#464646] text-white";
                  
                  const headerTitle = isHolidayColumn
                    ? c?.holidayLabel
                    : isCapacityColumn
                      ? c?.capacityReason || "Capacity fully utilized"
                      : undefined;

                  return (
                    <th
                      key={c.name}
                      className={`text-center py-2 border border-[#E5E5E5] ${headerClass}`}
                      style={{ minWidth: `${columnWidthPx}px` }}
                      title={headerTitle}
                    >
                      {c.name}
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {sections.length > 0
                ? sections.map((section, sIdx) => (
                  <React.Fragment key={sIdx}>
                    {/* ✅ Part Info อยู่ใต้ header และ sticky */}
                    <tr
                      className="bg-[#E0E0E0] font-medium"
                      style={{
                        top: `${headerHeight}px`,
                      }}
                    >
                      <td
                        colSpan={1 + baseColumns.length}
                        className="px-4 py-3 border border-[#E5E5E5]"
                      >
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="py-1 lg:sticky lg:left-4 z-10">
                            <div>Part No: {section.info.partNo || "-"}</div>
                            <div>Part Name: {section.info.partName || "-"}</div>
                            <div>Model: {section.info.model || "-"}</div>
                             <div>Type 1 : Exact Volumne / Lot Size / Stock</div>
                          </div>
                          <div className="px-4 lg:sticky lg:left-107 z-10">
                            <div>Sub Assy No: {section.info.subAssyNo || "-"}</div>
                            <div>Sub Assy Name: {section.info.subAssyName || "-"}</div>
                           
                          </div>
                        </div>
                      </td>
                    </tr>

                    {/* ✅ ข้อมูลของแต่ละ part */}
                    {sortedRows.map((r, idx) => {
                      // เฉพาะ bottomKeys ให้แสดงเฉพาะ section สุดท้าย
                      const isBottomRow = bottomKeys.includes(r.key);
                      const isLastSection = sIdx === sections.length - 1;
                      if (isBottomRow && !isLastSection) return null;
                      // ถ้าเป็น bottomKeys ใน section สุดท้าย ให้ sticky bottom ตามลำดับ
                      let stickyStyle: React.CSSProperties = {};
                      let rowBackground = "white";
                      if (isBottomRow && isLastSection) {
                        const bottomIdx = bottomKeys.indexOf(r.key);
                        const rowHeight = 40; // px, ปรับตามจริง
                        const offsetAdjustments = [1.3, 1.22, 1.15, 1.08, 1];
                        const numberOfDecimals =
                          offsetAdjustments[bottomIdx] ?? 1;
                        stickyStyle = {
                          bottom: `${rowHeight * (bottomKeys.length - numberOfDecimals - bottomIdx)}px`,
                          zIndex: 20 + bottomIdx,
                          background: "#404040",
                          borderTop: "1px solid #E5E5E5",
                          borderBottom: "1px solid #E5E5E5",
                        };
                        rowBackground = "#404040";
                      }
                      return (
                        <tr
                          key={`${sIdx}-${r.key}`}
                          className={`hover:bg-gray-50 ${isBottomRow && isLastSection ? "lg:sticky" : ""}`}
                          style={{ ...stickyStyle, background: rowBackground }}
                        >
                          {/* วันที่/เดือน column */}
                          <td
                            className={`lg:sticky lg:left-0 font-medium px-4 z-20 border border-[#E5E5E5]
                              ${["capacityTarget", "capacityActual", "manpower", "ot", "costEnergy"].includes(r.key)
                                ? "bg-[#404040] text-white"
                                : ["actualTable", "back"].includes(r.key)
                                  ? "bg-[#EDEDED] text-black"
                                  : "bg-white"
                              }
                            `}
                            style={{ minWidth: `${leftStickyWidthPx}px` }}
                          >
                            {r.label}
                          </td>
                          {/* เพิ่ม column วันที่/เดือน */}
                          {baseColumns.map((col, i) => {
                            const datum = section.data[i];
                            const val = datum ? (datum as any)[r.key] : undefined;
                            const isHolidayColumn = col?.isHoliday;
                            const isCapacityColumn = col?.isCapacityFull;
                            const isClickable =
                              !isHolidayColumn &&
                              chartType === "simulation" &&
                              (r.key === "manpower" ||
                                r.key === "ot" ||
                                r.key === "planTable" ||
                                r.key === "logical") &&
                              simulationStep === '2' &&
                              canEditCells;
                            const cellState = getCellState(datum, r.key);
                            const displayValue = isHolidayColumn ? "" : numberFmt(val);
                            const finalCellClass = isHolidayColumn
                              ? "bg-[#727272] text-white"
                              : isCapacityColumn
                                ? "bg-[#FEE2E2] text-[#7F1D1D]"
                                : cellState.className;
                            const cellTitle = isHolidayColumn
                              ? col?.holidayLabel
                              : isCapacityColumn
                                ? col?.capacityReason || "Capacity fully utilized"
                                : cellState.title;
                            const buttonClassName = isClickable
                              ? `border rounded-md px-2 py-1 ${cellState.buttonHighlightClass ?? "bg-white text-gray-900"}`
                              : "";
                            return (
                              <td
                                key={`${r.key}-${i}`}
                                className={`text-center px-4 py-2 border border-[#E5E5E5] ${
                                  isClickable ? "cursor-pointer hover:opacity-90" : ""
                                } ${finalCellClass}`}
                                style={{ minWidth: `${columnWidthPx}px` }}
                                title={cellTitle}
                                onClick={() => isClickable && handleCellClick(col.name)}
                              >
                                <div className={buttonClassName}>
                                  {displayValue}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </React.Fragment>
                ))
                : rows.map((r) => (
                  <tr key={r.key} className="hover:bg-gray-50">
                    <td
                      className={`lg:sticky lg:left-0 font-medium px-4 py-2 z-10 border border-[#E5E5E5]
                            ${["capacityTarget", "capacityActual", "manpower", "ot", "costEnergy"].includes(r.key)
                          ? "bg-[#404040] text-white"
                          : ["actualTable", "back"].includes(r.key)
                            ? "bg-[#EDEDED] text-black"
                            : "bg-white"
                        }
                      `}
                      style={{ minWidth: `${leftStickyWidthPx}px` }}
                    >
                      {r.label}
                    </td>
                    {baseColumns.map((col, i) => {
                      const datum = data[i] as Datum | undefined;
                      const val = (data[i] as any)?.[r.key];
                      const isHolidayColumn = col?.isHoliday;
                      const isCapacityColumn = col?.isCapacityFull;
                      const isClickable =
                        !isHolidayColumn &&
                        chartType === "simulation" &&
                        (r.key === "manpower" ||
                          r.key === "ot" ||
                          r.key === "planTable" ||
                          r.key === "logical") &&
                        simulationStep === '2' &&
                        canEditCells;
                      const cellState = getCellState(datum, r.key);
                      const displayValue = isHolidayColumn ? "" : numberFmt(val);
                      const finalCellClass = isHolidayColumn
                        ? "bg-[#727272] text-white"
                        : isCapacityColumn
                          ? "bg-[#FEE2E2] text-[#7F1D1D]"
                          : cellState.className;
                      const cellTitle = isHolidayColumn
                        ? col?.holidayLabel
                        : isCapacityColumn
                          ? col?.capacityReason || "Capacity fully utilized"
                          : cellState.title;
                      const buttonClassName = isClickable
                        ? `border rounded-md px-2 py-1 ${cellState.buttonHighlightClass ?? "bg-white text-gray-900"}`
                        : "";
                      return (
                        <td
                          key={`${r.key}-${i}`}
                          className={`text-center px-4 py-2 border border-[#E5E5E5] ${
                            isClickable ? "cursor-pointer hover:opacity-90" : ""
                          } ${finalCellClass}`}
                          style={{ minWidth: `${columnWidthPx}px` }}
                          title={cellTitle}
                          onClick={() => isClickable && handleCellClick(col.name)}
                        >
                          <div className={buttonClassName}>
                            {displayValue}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialog */}
      <AddConditionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        date={selectedCell.date}
      />

    </div>
  );
}
