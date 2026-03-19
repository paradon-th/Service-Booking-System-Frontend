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
import { PencilLine, Plus, Search, Trash2 } from "lucide-react";
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
import { ManualInputProductionPlanSkeleton } from "@/components/loading-skeleton";

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
    pcs: number;
    dueDate: string;
    reason: string;
};

export default function ManualInputProductionPlan() {
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
                const response = await fetch("/api/manual-input-production-plan");
                const data = await response.json();

                setData(data);
                
                const partOptions = data.map((item: ProductionData) => ({
                    label: item.partNumber,
                    value: item.partNumber,
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
        return <ManualInputProductionPlanSkeleton />;
    }

   

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
            <div className="text-2xl font-bold">Manual Input Production Plan</div>

            <div className="p-6 border rounded-lg shadow-md h-full mt-4">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4 mb-8">
                    <div className="flex flex-col lg:flex-row w-full lg:w-1/2 items-end gap-4 ">
                        <SelectCustom
                            label="Production Line"
                            options={[]}
                            value={""}
                            onChange={() => { }}
                            className="w-full lg:w-1/3"
                            selectType="overviewDialog"
                        />

                        <div className="flex w-full lg:w-1/2 flex-col gap-2">
                            <CalendarDateRangePicker
                                mode={dailyStatus}
                                onDateChange={handleDateRangeChange}
                            />
                        </div>

                        <Button variant={"outline"} className="w-full lg:w-auto">
                            <Search />
                        </Button>
                    </div>
                    <div>
                        <Button className="w-full lg:w-40"><Plus />Add Plan</Button>
                    </div>
                </div>

                <div className="relative w-full">
                    <div className="relative w-full border rounded-lg overflow-x-auto">
                            <Table>
                                <TableHeader className="sticky left-0 z-10 text-[#E8E8E8] py-[12px] w-[160px] bg-[#464646]">
                                    {/* ===== HEADER ROW ===== */}

                                    <TableRow>
                                        <TableHead
                                            rowSpan={2}
                                            className="w-[80px] text-[#E8E8E8] py-[12px]"
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
                                            className="w-[120px] text-[#E8E8E8] text-center align-middle"
                                        >
                                            prod .Qty (Pcs.)
                                        </TableHead>

                                        <TableHead className="w-[220px] text-[#E8E8E8]">
                                            <div className="pb-2">Due Date</div>

                                                <CalendarDateRangePicker className="text-black"
                                                              mode={dailyStatus}
                                                              onDateChange={handleDateRangeChange} 
                                                               selectType="actualProduction"
                                                            />
                                        </TableHead>

                                        <TableHead
                                            rowSpan={2}
                                            className="w-[120px] text-[#E8E8E8] text-center align-middle"
                                        >
                                            Reason
                                        </TableHead>

                                        <TableHead
                                            rowSpan={2}
                                            className="w-[120px] text-[#E8E8E8] text-center align-middle"
                                        >
                                            Actions
                                        </TableHead>

                                 
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {filteredData.map((item) => (
                                        <TableRow
                                            key={item.partNumber}
                                            className="hover:bg-muted/40"
                                        >
                                            <TableCell className=" border-r border-[#E5E5E5]">
                                                {item.partNumber}
                                            </TableCell>

                                            <TableCell className="border-r border-[#E5E5E5]">
                                                {item.description}
                                            </TableCell>

                                            <TableCell className="border-r border-[#E5E5E5] text-center">
                                                {item.model}
                                            </TableCell>

                                            <TableCell className="border-r border-[#E5E5E5] text-center">
                                                {item.pcs}
                                            </TableCell>

                                            <TableCell className="border-r border-[#E5E5E5] text-center">
                                                {item.dueDate}
                                            </TableCell>

                                            <TableCell className="border-r border-[#E5E5E5] text-center">
                                                {item.reason}
                                            </TableCell>

                                            <TableCell className="border-r border-[#E5E5E5] text-center">
                                                <div className="flex gap-2 justify-center">
                                                    <Button variant="outline" size="icon">
                                                        <PencilLine />
                                                    </Button>
                                                    <Button variant="outline" size="icon" className="border-red-500 hover:bg-red-500/10">
                                                        <Trash2 className="text-red-500"/>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                            

                                         
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                    </div>
                </div>
            </div>
        </div>
    );
}