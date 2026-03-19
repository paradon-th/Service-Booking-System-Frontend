'use client'

import { useState } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import SelectCustom from "../custom-component/selectCustom";
import CalendarDateRangePicker from "../custom-date-range-picker";
import { DateRange } from "react-day-picker";
import { Button } from "../ui/button";
import { Search, SquareArrowOutUpRight } from "lucide-react";
import PartCheckingTable from "./partCheckingTable";
import PartCheckingDetailTable from "./partCheckingDetailTable";


export default function PartChecking() {
    const [productionLine, setProductionLine] = useState<string>("");
    const [dailyStatus, setDailyStatus] = useState<"Daily" | "Monthly">("Daily");
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [productOptions, setProductOptions] = useState<{ label: string; value: string }[]>([]);
    const [internalProductOptions, setInternalProductOptions] = useState<{ label: string; value: string }[]>([
        { value: "GCAC Assy", label: "GCAC Assy" },
        { value: "GCAC Core 1", label: "GCAC Core 1" },
        { value: "GCAC Core 2", label: "GCAC Core 2" }
    ]);
    const [firstLoad, setFirstLoad] = useState(true);

    const handleProductionLineChange = (value: string | string[]) => {
        if (typeof value === 'string') {
            setProductionLine(value);
            setFirstLoad(false);
        }
    };

    const effectiveProductOptions = productOptions && productOptions.length > 0
        ? productOptions
        : internalProductOptions;

    const handleDateRangeChange = (newDateRange: DateRange | undefined) => {
        setDateRange(newDateRange);
    };

    return (
        <div>
            <h1 className="font-bold text-2xl">Part Checking</h1>
            <Card className="w-full mt-4">
                <CardHeader>
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4">

                        <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
                            <SelectCustom
                                label="Production Line"
                                placeholder="Production Line"
                                groupLabel="Production Line"
                                options={effectiveProductOptions ?? []}
                                value={productionLine}
                                onChange={handleProductionLineChange}
                                className="w-full lg:w-50"
                                selectType="overviewDialog"
                            />
                            <SelectCustom
                                label="Supp. Code"
                                placeholder="Supp. Code"
                                groupLabel="Supp. Code"
                                options={[]}
                                value={[]}
                                onChange={handleProductionLineChange}
                                className="w-full lg:w-50"
                                selectType="overviewDialog"
                            />

                            <div className="flex flex-col w-full lg:min-w-30">
                                <CalendarDateRangePicker
                                    mode={dailyStatus}
                                    onDateChange={handleDateRangeChange}
                                />
                            </div>
                            <Button variant={"outline"} className="w-full lg:w-auto">
                                <Search />
                            </Button>
                        </div>
                        <Button className="flex gap-2 w-full lg:w-28" variant={"outline"}>
                            <SquareArrowOutUpRight />
                            <p>Export</p>
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="px-6">
                    <h2 className="font-bold text-2xl pb-4">Part Checking</h2>
                    <PartCheckingTable />
                    <h2 className="font-bold text-2xl mt-14 pb-4">Part Checking Detail</h2>
                    <PartCheckingDetailTable />
                </CardContent>
            </Card>
        </div>
    );
}