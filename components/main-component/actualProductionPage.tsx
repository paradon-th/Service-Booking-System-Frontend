"use client";

import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import SelectCustom from "../custom-component/selectCustom";
import CalendarDateRangePicker from "../custom-date-range-picker";
import { DateRange } from "react-day-picker";
import { Search } from "lucide-react";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { InputActualProductionSkeleton } from "@/components/loading-skeleton";

type DayData = {
  date: string;
  plan: number;
  actD?: number;
  actN?: number;
  diff?: number;
};

type ProductionData = {
  partNumber: string;
  description: string;
  model: string;
  begin: number;
  days: DayData[];
  balance: number;
};

export default function ActualProductionPage() {
  const [data, setData] = useState<ProductionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [partNoOptions, setPartNoOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [partNos, setPartNos] = useState<string[]>([]);
  const [descValue, setDescValue] = useState<string[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogValue, setDialogValue] = useState("");
  const [editingCell, setEditingCell] = useState<{
    partNumber: string;
    date: string;
    field: "actD" | "actN";
  } | null>(null);

  const dailyStatus = "Daily";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/input-actual-production");
        const data = await response.json();

        const processedData = data.map((item: ProductionData) => ({
          ...item,
          days: item.days.map((day) => ({
            ...day,
            actD: day.actD || 0,
            actN: day.actN || 0,
            diff: (day.actD || 0) + (day.actN || 0) - day.plan,
          })),
        }));

        setData(processedData);
        const partNumbers = Array.from(
          new Set(processedData.map((d: ProductionData) => d.partNumber))
        );
        const partOptions = partNumbers.map((part) => ({
          label: String(part),
          value: String(part),
        }));
        setPartNoOptions(partOptions);
      } catch (error) {
        console.error("Error fetching part checking data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <InputActualProductionSkeleton />;
  }

  const dates =
    data.length > 0
      ? data
          .flatMap((item) => item.days.map((d) => d.date))
          .filter((date, index, self) => self.indexOf(date) === index)
      : [];

  const handleNoteChange = (date: string, value: string) => {
    setNotes((prevNotes) => ({
      ...prevNotes,
      [date]: value,
    }));
  };

  const handleDateRangeChange = (newDateRange: DateRange | undefined) => {
    setDateRange(newDateRange);
  };

  const filteredData = data.filter((item) => {
    return (
      (partNos.length === 0 || partNos.includes(item.partNumber)) &&
      (descValue.length === 0 || descValue.includes(item.description))
    );
  });

  const descriptionOptions = [...new Set(data.map((d) => d.description))].map(
    (desc) => ({
      label: desc,
      value: desc,
    })
  );

  const handleCellClick = (
    partNumber: string,
    date: string,
    field: "actD" | "actN",
    value: number | undefined
  ) => {
    setEditingCell({ partNumber, date, field });
    setDialogValue(value?.toString() || "");
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editingCell) {
      handleInputChange(
        editingCell.partNumber,
        editingCell.date,
        editingCell.field,
        dialogValue
      );
      setDialogOpen(false);
      setEditingCell(null);
    }
  };

  const handleInputChange = (
    partNumber: string,
    date: string,
    field: "actD" | "actN",
    value: string
  ) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.partNumber === partNumber
          ? {
              ...item,
              days: item.days.map((day) => {
                if (day.date === date) {
                  const updatedDay = {
                    ...day,
                    [field]: parseInt(value) || 0,
                  };
                  return {
                    ...updatedDay,
                    diff:
                      (updatedDay.actD || 0) +
                      (updatedDay.actN || 0) -
                      updatedDay.plan,
                  };
                }
                return day;
              }),
            }
          : item
      )
    );
  };

  return (
    <div>
      <div className="text-2xl font-bold">Input Actual Production (PD)</div>

      <div className="p-6 border rounded-lg shadow-md mt-4">
        <div className="w-1/2 flex items-end gap-4 mb-8">
          <SelectCustom
            label="Production Line"
            options={[]}
            value={""}
            onChange={() => {}}
            className="w-1/3"
            selectType="overviewDialog"
          />

          <div className="flex w-1/2 flex-col gap-2">
            <CalendarDateRangePicker
              mode={dailyStatus}
              onDateChange={handleDateRangeChange}
            />
          </div>

          <Button variant={"outline"}>
            <Search />
          </Button>
        </div>

        <div className="relative w-full">
          {/* FILTER BAR */}

          {/* TABLE WRAPPER */}

          <div className="relative flex border-x  border-b rounded-lg overflow-hidden">
            {/* LEFT FIXED */}

            <div className="min-w-[520px] border-r">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-[#464646] ">
                  {/* ===== HEADER ROW ===== */}

                  <TableRow>
                    <TableHead
                      rowSpan={2}
                      className="w-[180px] text-[#E8E8E8] py-[12px]"
                    >
                      <div className="pb-2">Part Number</div>

                      <SelectCustom
                        label=""
                        groupLabel="Part No."
                        options={partNoOptions}
                        value={partNos}
                        onChange={(v) =>
                          setPartNos(Array.isArray(v) ? v : v ? [v] : [])
                        }
                        className="w-[160px] h-[28px]"
                        multi
                        includeSelectAll
                        selectAllLabel="All"
                        selectType="actualProduction"
                      />
                    </TableHead>

                    <TableHead className="w-[220px] text-[#E8E8E8]">
                      <div className="pb-2">Part Description</div>

                      <SelectCustom
                        label=""
                        groupLabel="Description"
                        options={descriptionOptions}
                        value={descValue}
                        onChange={(v) =>
                          setDescValue(Array.isArray(v) ? v : v ? [v] : [])
                        }
                        className="w-[200px] h-[28px]"
                        multi
                        includeSelectAll
                        selectAllLabel="All"
                        selectType="actualProduction"
                      />
                    </TableHead>

                    <TableHead
                      rowSpan={2}
                      className="w-[120px] text-[#E8E8E8] text-center align-middle"
                    >
                      Model
                    </TableHead>

                    <TableHead
                      rowSpan={2}
                      className="w-[100px] text-[#E8E8E8] text-center align-middle"
                    >
                      Begin
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow
                      key={item.partNumber}
                      className="hover:bg-muted/40 h-[39px]"
                    >
                      <TableCell className=" border-r border-[#E5E5E5]">
                        {item.partNumber}
                      </TableCell>

                      <TableCell className="border-r border-[#E5E5E5]">
                        {item.description}
                      </TableCell>

                      <TableCell className="border-r border-[#E5E5E5]">
                        {item.model}
                      </TableCell>

                      <TableCell
                        className={
                          item.begin < 0 ? "bg-red-100" : "bg-green-100"
                        }
                      >
                        {item.begin}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* CENTER SCROLLABLE */}

            <div className=" overflow-x-auto">
              <div className="min-w-[1000px]">
                <Table >
                  <TableHeader className="sticky top-0 z-10  bg-[#464646] ">
                    <TableRow className="border-[#818181]">
                      {dates.map((day) => (
                        <TableHead
                          key={day}
                          colSpan={4}
                          className="text-center border-x  border-[#818181] font-semibold text-[#E8E8E8]"
                        >
                          {day}
                        </TableHead>
                      ))}
                    </TableRow>

                    <TableRow>
                      {dates.map((day) => (
                        <React.Fragment key={day}>
                          <TableHead className="text-[#E8E8E8] border-r border-[#818181] text-center">
                            Plan
                          </TableHead>

                          <TableHead className="text-[#E8E8E8] border-r border-[#818181] text-center">
                            Act.D
                          </TableHead>

                          <TableHead className="text-[#E8E8E8] border-r border-[#818181] text-center">
                            Act.N
                          </TableHead>

                          <TableHead className="text-[#E8E8E8] border-r border-[#818181] text-center">
                            Diff
                          </TableHead>
                        </React.Fragment>
                      ))}
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredData.map((item) => (
                      <TableRow
                        key={item.partNumber}
                        className="hover:bg-muted/40"
                      >
                        {item.days.map((d) => (
                          <React.Fragment key={d.date}>
                            <TableCell className="text-center min-w-20 border-r border-[#E5E5E5]">
                              {d.plan}
                            </TableCell>
                            <TableCell
                              className="min-w-20 border-r border-[#E5E5E5] cursor-pointer text-center"
                              onClick={() =>
                                handleCellClick(
                                  item.partNumber,
                                  d.date,
                                  "actD",
                                  d.actD
                                )
                              }
                            >
                              <div className="rounded-md border border-gray-200">
                                {d.actD}
                              </div>
                            </TableCell>

                            <TableCell
                              className="min-w-20 border-r border-[#E5E5E5] cursor-pointer text-center"
                              onClick={() =>
                                handleCellClick(
                                  item.partNumber,
                                  d.date,
                                  "actN",
                                  d.actN
                                )
                              }
                            >
                              <div className="rounded-md border border-gray-200">
                                {d.actN}
                              </div>
                            </TableCell>
                            <TableCell
                              className={
                                d.diff && d.diff < 0
                                  ? "bg-red-100 min-w-20"
                                  : "bg-green-100 min-w-20"
                              }
                            >
                              {d.diff}
                            </TableCell>
                          </React.Fragment>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* RIGHT FIXED */}

            <div className="min-w-[120px] border-l ">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-[#464646]">
                  <TableRow>
                    <TableHead
                      rowSpan={2}
                      className="text-center align-middle text-[#E8E8E8] py-[29.8px]"
                    >
                      Balance
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow
                      key={item.partNumber}
                      className="hover:bg-muted/40 h-[39px]"
                    >
                      <TableCell
                        className={`text-center ${
                          item.balance < 0 ? "bg-red-100" : "bg-green-100"
                        }`}
                      >
                        {item.balance}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="text-xl font-bold mb-4">Add Note</div>
          <div className="flex gap-6 overflow-x-auto">
            {dates.map((day) => (
              <div key={day} className="min-w-[300px]">
                <div className="flex items-center justify-between mb-2 text-sm">
                  <div>{day}</div>
                  <div className="text-[10px]">
                    {notes[day] ? notes[day].length : 0}/150
                  </div>
                </div>
                <Textarea
                  className="w-full min-h-[150px] resize-none overflow-y-auto"
                  placeholder="Reason for not meeting the plan"
                  rows={4}
                  value={notes[day] || ""}
                  onChange={(e) => handleNoteChange(day, e.target.value)}
                  maxLength={150}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button className="w-40">Save</Button>
        </div>
      </div>
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Edit Value for {editingCell?.field}
            </AlertDialogTitle>
            <AlertDialogDescription>
              <Input
                value={dialogValue}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
                  setDialogValue(numericValue);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSave();
                  }
                }}
                autoFocus
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSave}>Save</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}