"use client";

import { useEffect, useState } from "react";
import SelectCustom from "../custom-component/selectCustom";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { getPartCheckingData } from "@/lib/services/partChecking";
import { Skeleton } from "../ui/skeleton";

type PartCheckingData = {
    "partNo": string;
    "partName": string;
    "cn-1": number;
    "cn": number;
    "cn+1": number;
    "cn+2": number;
    "cn+3": number;
    "cn+4": number;
    "pn-1": number;
    "pn": number;
    "pn+1": number;
    "pn+2": number;
    "pn+3": number;
    "pn+4": number;
    "issuedDate": string;
    "dueDate": string;
};

function SingleDatePicker({
    date,
    setDate,
    label,
}: {
    date?: Date;
    setDate: (date?: Date) => void;
    label: string;
}) {
    const [open, setOpen] = useState(false);
    return (
        <div className="flex flex-col gap-1">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        id={label.toLowerCase().replace(/\s/g, "-")}
                        className={cn(
                            "w-full justify-between font-normal h-6",
                            !date && "text-muted-foreground"
                        )}
                    >
                        {date ? format(date, "MM/dd/yyyy") : ""}
                        <CalendarIcon className="h-4 w-4" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(selectedDate) => {
                            setDate(selectedDate);
                            setOpen(false);
                        }}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}

export default function PartCheckingTable() {
    const [issuedDate, setIssuedDate] = useState<Date | undefined>();
    const [dueDate, setDueDate] = useState<Date | undefined>();
    const [partCheckingData, setPartCheckingData] = useState<PartCheckingData[]>(
        []
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getPartCheckingData();
                setPartCheckingData(data);
            } catch (error) {
                console.error("Error fetching part checking data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const renderSkeletonRows = () => {
        const columnCount = 17;
        return [...Array(5)].map((_, rowIdx) => (
            <TableRow key={`skeleton-row-${rowIdx}`}>
                {[...Array(columnCount)].map((__, colIdx) => (
                    <TableCell key={`skeleton-cell-${rowIdx}-${colIdx}`}>
                        <Skeleton className="h-4 w-full" />
                    </TableCell>
                ))}
            </TableRow>
        ));
    };

    return (
        <>
            <div className="w-full overflow-x-auto relative">
                <div className="[&>div]:rounded-md [&>div]:border [&>div]:max-h-[200px] [&>div]:overflow-y-auto">
                    <Table>
                        <TableHeader className="*:whitespace-nowrap sticky top-0 z-40 bg-denso-dark">
                            <TableRow>
                                <TableHead rowSpan={2} className="font-medium max-w-12 bg-denso-dark">
                                    <div className="py-1 text-white">Part No (Assy)</div>
                                    <SelectCustom options={[]} label="" placeholder="Part No (Assy)" selectType="actualProduction"/>
                                </TableHead>

                                <TableHead rowSpan={2} className="font-medium max-w-10 bg-denso-dark">
                                    <div className="py-1 text-white">Part Name</div>
                                    <SelectCustom options={[]} label="" placeholder="Part Name" selectType="actualProduction"/>
                                </TableHead>
                                <TableHead
                                    colSpan={6}
                                    className="text-center text-white bg-denso-dark border-x border-gray-200"
                                >
                                    Customer order fluctuation (%)
                                </TableHead>
                                <TableHead
                                    colSpan={6}
                                    className="text-center text-white bg-denso-dark border-x border-gray-200"
                                >
                                    Production plan fluctuation (%)
                                </TableHead>
                                <TableHead rowSpan={2} className="font-medium max-w-24 bg-denso-dark">
                                    <div className="py-1 text-white">Issued Date</div>
                                    <SingleDatePicker     
                                        date={issuedDate}
                                        setDate={setIssuedDate}
                                        label=""
                                    />
                                </TableHead>
                                <TableHead rowSpan={2} className="font-medium max-w-24 bg-denso-dark">
                                    <div className="py-1 text-white">Due Date</div>
                                    <SingleDatePicker
                                        date={dueDate}
                                        setDate={setDueDate}
                                        label=""
                                    />
                                </TableHead>
                                <TableHead
                                    rowSpan={2}
                                    className="font-medium text-center align-middle text-white bg-denso-dark"
                                >
                                    List
                                </TableHead>
                            </TableRow>
                            <TableRow className="!border-none">
                                <TableHead className="text-white text-center border-x border-gray-200">
                                    N-1
                                </TableHead>
                                <TableHead className="text-white text-center border-x border-gray-200">
                                    N
                                </TableHead>
                                <TableHead className="text-white text-center border-x border-gray-200">
                                    N+1
                                </TableHead>
                                <TableHead className="text-white text-center border-x border-gray-200">
                                    N+2
                                </TableHead>
                                <TableHead className="text-white text-center border-x border-gray-200">
                                    N+3
                                </TableHead>
                                <TableHead className="text-white text-center border-x border-gray-200">
                                    N+4
                                </TableHead>
                                <TableHead className="text-white text-center border-x border-gray-200">
                                    N-1
                                </TableHead>
                                <TableHead className="text-white text-center border-x border-gray-200">
                                    N
                                </TableHead>
                                <TableHead className="text-white text-center border-x border-gray-200">
                                    N+1
                                </TableHead>
                                <TableHead className="text-white text-center border-x border-gray-200">
                                    N+2
                                </TableHead>
                                <TableHead className="text-white text-center border-x border-gray-200">
                                    N+3
                                </TableHead>
                                <TableHead className="text-white text-center border-x border-gray-200">
                                    N+4
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading
                                ? renderSkeletonRows()
                                : partCheckingData.map((p) => (
                                <TableRow key={p.partNo}>
                                    <TableCell className="text-center border-r border-gray-200 ">{p.partNo}</TableCell>
                                    <TableCell className="text-center border-r border-gray-200 ">{p.partName}</TableCell>
                                    <TableCell className="text-center border-r border-gray-200 ">{p["cn-1"]}</TableCell>
                                    <TableCell className="text-center border-r border-gray-200 ">{p.cn}</TableCell>
                                    <TableCell className="text-center border-r border-gray-200 ">{p["cn+1"]}</TableCell>
                                    <TableCell className="text-center border-r border-gray-200 ">{p["cn+2"]}</TableCell>
                                    <TableCell className="text-center border-r border-gray-200 ">{p["cn+3"]}</TableCell>
                                    <TableCell className="text-center border-r border-gray-200 ">{p["cn+4"]}</TableCell>
                                    <TableCell className="text-center border-r border-gray-200 ">{p["pn-1"]}</TableCell>
                                    <TableCell className="text-center border-r border-gray-200 ">{p.pn}</TableCell>
                                    <TableCell className="text-center border-r border-gray-200 ">{p["pn+1"]}</TableCell>
                                    <TableCell className="text-center border-r border-gray-200 ">{p["pn+2"]}</TableCell>
                                    <TableCell className="text-center border-r border-gray-200 ">{p["pn+3"]}</TableCell>
                                    <TableCell className="text-center border-r border-gray-200 ">{p["pn+4"]}</TableCell>
                                    <TableCell className="text-center border-r border-gray-200 ">
                                        {format(new Date(p.issuedDate), "dd/MM/yy")}
                                    </TableCell>
                                    <TableCell className="text-center border-r border-gray-200">
                                        {format(new Date(p.dueDate), "dd/MM/yy")}
                                    </TableCell>
                                    <TableCell className="text-center"></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
}
