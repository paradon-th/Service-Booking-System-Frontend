'use client'

import React, { useEffect, useState } from 'react'
import CardCustom from '../custom-component/cardCustom';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

import SelectCustom from '../custom-component/selectCustom';
import { Button } from '@/components/ui/button';
import { title } from 'process';
import { clear } from 'console';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { ProductionDashboardDialog } from '../custom-component/dialogCustom';
import { se } from 'date-fns/locale';
import { DashboardOverviewSkeleton } from '../loading-skeleton/dashboardOverviewSkeleton';

export default function DashboardOverview() {
    const number = 7;

    const [productionLines, setProductionLines] = useState<string[]>([])
    const [dailyStatuses, setDailyStatuses] = useState<string[]>([])
    const [monthlyStatuses, setMonthlyStatuses] = useState<string[]>([])
    const [open, setOpen] = useState(false);
    const [openDialogIndex, setOpenDialogIndex] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [productOptions, setProductOptions] = useState<{ label: string; value: string }[]>([]);

  const DailyOptions = [
    { label: "Delay", value: "delay" },
    { label: "Risk Delay", value: "riskDelay" },
    { label: "On Plan", value: "onPlan" },
    { label: "Back Prod.", value: "backProd" },
  ];

  const MonthlyOptions = [
    { label: "Delay", value: "delay" },
    { label: "Risk Delay", value: "riskDelay" },
    { label: "On Plan", value: "onPlan" },
    { label: "Back Prod.", value: "backProd" },
  ];

    const [lineType, setLineType] = useState("proLine")
    const [cardData, setCardData] = useState<CardType[]>([]);
    const [filteredCardData, setFilteredCardData] = useState<CardType[]>([]);
    
    // Track if this is the initial load to set "All" for filters
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    type CardType = {
        title: string;
        typeD: string;
        typeM: string;
        BackProd: number;
        Recovery: number;
        Safety: number;
        chartData: { data: string; visitors: number; fill: string }[];
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // setIsLoading(true); // Already true
                // เรียกผ่าน Generic API Proxy - ระบุแค่ apiUrl
                const baseApiUrl = process.env.NEXT_PUBLIC_API_OVERVIEW_CARD;
                
                if (!baseApiUrl) {
                    console.error("[Dashboard] API URL not configured");
                    setIsLoading(false); // Stop loading on config error
                    return;
                }

                const endpoint = `${baseApiUrl}/value`;
                
                // ใช้ค่า default จาก env (ไม่ต้องส่ง starttime/endtime)
                const params = new URLSearchParams({
                    apiUrl: endpoint,
                    // ถ้าต้องการ override ค่า default ให้เพิ่มได้
                    // starttime: "*-2y",
                    // endtime: "*",
                });
                
                const api = `/api/proxy?${params.toString()}`;

                const response = await fetch(api, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();

                // แปลงข้อมูลจาก API เป็น CardType[]
                if (result.data && Array.isArray(result.data)) {
                    const transformedData: CardType[] = result.data.map((item: any) => ({
                        // ✅ ข้อมูลจาก API
                        title: item.fields?.production_line || "Unknown",
                        
                        // 🔄 Mock data (รอข้อมูลจาก API)
                        typeD: "delay",
                        typeM: "delay",
                        BackProd: 10,
                        Recovery: 95,
                        Safety: 0,
                        chartData: [
                            { data: "daily", visitors: 275, fill: "var(--color-Daily)" },
                            { data: "monthly", visitors: 200, fill: "var(--color-Monthly)" },
                        ]
                    }));

                    setCardData(transformedData);
                    
                    // สร้าง unique production line options
                    const uniqueLines = Array.from(new Set(result.data.map((item: any) => 
                        item.fields?.production_line
                    ).filter(Boolean))) as string[];
                    
                    const options = uniqueLines.map((line: string) => ({
                        label: line,
                        value: line.toLowerCase().replace(/\s+/g, '_')
                    }));
                    
                    setProductOptions(options);
                    sessionStorage.setItem('productOptions', JSON.stringify(options));
                    
                    // ตั้งค่าเริ่มต้นให้เลือก "All" สำหรับ Production Lines (ครั้งแรกเท่านั้น)
                    if (isInitialLoad) {
                        setProductionLines(options.map(opt => opt.value));
                        setDailyStatuses(DailyOptions.map(opt => opt.value));
                        setMonthlyStatuses(MonthlyOptions.map(opt => opt.value));
                        setIsInitialLoad(false);
                    }
                    
                } else {
                    console.warn("[Dashboard] No data array found in response");
                }

            } catch (error) {
                console.error("[Dashboard] Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter effect - กรองข้อมูลตาม filters
    useEffect(() => {
        let filtered = [...cardData];

        // Filter by production lines
        if (productionLines.length > 0) {
            filtered = filtered.filter(card => {
                const cardValue = card.title.toLowerCase().replace(/\s+/g, '_');
                return productionLines.includes(cardValue);
            });
        }

        // Filter by daily status
        if (dailyStatuses.length > 0) {
            filtered = filtered.filter(card => 
                dailyStatuses.includes(card.typeD)
            );
        }

        // Filter by monthly status
        if (monthlyStatuses.length > 0) {
            filtered = filtered.filter(card => 
                monthlyStatuses.includes(card.typeM)
            );
        }

        setFilteredCardData(filtered);
    }, [cardData, productionLines, dailyStatuses, monthlyStatuses]);

    const clearAllFilters = () => {
        // Select ALL options for each filter
        setProductionLines(productOptions.map(opt => opt.value));
        setDailyStatuses(DailyOptions.map(opt => opt.value));
        setMonthlyStatuses(MonthlyOptions.map(opt => opt.value));
    }

    if (isLoading) {
        return <DashboardOverviewSkeleton />;
    }



    return (
        <div>
            <Tabs defaultValue="Production Line">
                <div className='px-4 pt-2  '>
                    <div className='flex flex-col gap-4 md:flex-row md:items-start md:justify-between'>
                        <div>
                            <div className='font-bold text-2xl'>Production Line Capacity Status</div>
                            <div>Daily and monthly production performance with delay, recovery, and safety indicators.</div>
                        </div>
                        <div className='flex md:justify-end'>
                            <TabsList className="flex flex-wrap gap-2">
                                <TabsTrigger value="Production Line">Production Line</TabsTrigger>
                                <TabsTrigger value="Line Sub">Line Sub</TabsTrigger>
                            </TabsList>

                        </div>
                    </div>
                    <div className='my-3 flex flex-col gap-4 md:flex-row md:flex-wrap md:items-end'>
                        <SelectCustom
                            label="Production Line"
                            options={productOptions}
                            value={productionLines}
                            onChange={(v) => setProductionLines(Array.isArray(v) ? v : v ? [v] : [])}
                            multi
                            includeSelectAll
                            selectAllLabel="All"
                            className="w-full md:w-56"
                        />
                        <SelectCustom
                            label="Daily Status"
                            options={DailyOptions}
                            value={dailyStatuses}
                            onChange={(v) => setDailyStatuses(Array.isArray(v) ? v : v ? [v] : [])}
                            multi
                            includeSelectAll
                            selectAllLabel="All"
                            className="w-full md:w-56"
                        />
                        <SelectCustom
                            label="Monthly Status"
                            options={MonthlyOptions}
                            value={monthlyStatuses}
                            onChange={(v) => setMonthlyStatuses(Array.isArray(v) ? v : v ? [v] : [])}
                            multi
                            includeSelectAll
                            selectAllLabel="All"
                            className="w-full md:w-56"
                        />
                        <Button onClick={() => clearAllFilters()}
                            variant="outline"
                            className="w-full border-red-500 text-red-500 hover:bg-pink-100 hover:text-red md:w-auto"
                        >
                            Clear all
                        </Button>
                    </div>
                </div>
                <TabsContent value="Production Line">
                    <div className="grid grid-cols-1 gap-4 p-4 pt-0 sm:grid-cols-2 lg:grid-cols-3  2xl:grid-cols-4">
                        {filteredCardData.map((card: CardType, index: number) => (
                            <div className="col-span-1" key={index}>
                                <Dialog open={openDialogIndex === index} onOpenChange={(open) => setOpenDialogIndex(open ? index : null)}>
                                    <form>
                                        <DialogTrigger asChild>
                                          <div tabIndex={0} role="button" onClick={() => sessionStorage.setItem('openByOverview', 'true')}>
                                            <CardCustom
                                                title={card.title}
                                                chartData={card.chartData}
                                                BackProd={card.BackProd}
                                                Recovery={card.Recovery}
                                                Safety={card.Safety}
                                                productionType={lineType}
                                                typeD={card.typeD}
                                                typeM={card.typeM}
                                            />
                                          </div>
                                        </DialogTrigger>
                                          <ProductionDashboardDialog 
                                            typeDialog={'overview'} 
                                            primaryKeyName={card.title} 
                                            productOptions={productOptions}
                                          />
                                    </form>
                                </Dialog>
                            </div>
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="Line Sub">
                    <div className="grid grid-cols-1 gap-4 p-4 pt-0 sm:grid-cols-2 lg:grid-cols-3  2 2xl:grid-cols-4" >
                        {filteredCardData.map((card: CardType, index: number) => (
                            <div className="col-span-1" key={index}>
                                 <Dialog open={openDialogIndex === index + 1000} onOpenChange={(open) => setOpenDialogIndex(open ? index + 1000 : null)}>
                                    <form>
                                        <DialogTrigger asChild>
                                          <div tabIndex={0} role="button" onClick={() => sessionStorage.setItem('openByOverview', 'true')}>
                                            <CardCustom 
                                                title={card.title}
                                                chartData={card.chartData}
                                                BackProd={card.BackProd}
                                                Recovery={card.Recovery}
                                                Safety={card.Safety}
                                                typeD={card.typeD}
                                                typeM={card.typeM}
                                            />
                                          </div>
                                        </DialogTrigger>
                                          <ProductionDashboardDialog 
                                            typeDialog={'overview'} 
                                            primaryKeyName={card.title} 
                                            productOptions={productOptions}
                                          />
                                    </form>
                                </Dialog>
                            </div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
