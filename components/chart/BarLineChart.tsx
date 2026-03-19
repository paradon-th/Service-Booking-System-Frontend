"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";



interface ProductionChartProps {
  dailyStatus : string;
  dailyData?: any[];
  monthlyData?: any[];
  chartType: string;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
  onScrollSync?: (source: 'chart', scrollLeft: number) => void;
  onChartMouseMove?: (payload: any[] | undefined) => void;
  onChartMouseLeave?: () => void;
  clickedIndex?: string | null;
  onClickedIndexChange?: (index: string | null) => void;
}

import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react";
import { RefreshCcw } from "lucide-react";
import { Button } from "../ui/button";
import { ReferenceLine } from "recharts";

export default function BarLineChart({ 
  dailyStatus, 
  dailyData, 
  monthlyData, 
  chartType, 
  scrollRef, 
  onScrollSync, 
  onChartMouseMove, 
  onChartMouseLeave,
  clickedIndex,
  onClickedIndexChange,
}: ProductionChartProps) {
  console.log("🚀 ~ BarLineChart ~ monthlyData:", monthlyData)
  console.log("🚀 ~ BarLineChart ~ dailyData:", dailyData)
  const [backOrder, setBackOrder] = useState(true);
  const [accBackOrder, setAccBackOrder] = useState(true);
  console.log("🚀 ~ BarLineChart ~ clickedIndex:", clickedIndex)

  const isMonthly = dailyStatus === "Monthly";
  const chartData = isMonthly ? monthlyData : dailyData;
  console.log("🚀 ~ BarLineChart ~ chartData:", JSON.stringify(chartData));
  
  // กำหนดความกว้างขั้นต่ำและจริงของ chart
  const minVisibleItems = isMonthly ? 3 : 14; // 14 วัน หรือ 3 เดือน
  const itemWidth = isMonthly ? 120 : 110; // ความกว้างต่อ item
  const dataCount = chartData?.length || 0;
  
  // ความกว้างขั้นต่ำ (แสดง 14 วัน หรือ 3 เดือน)
  const minChartWidth = minVisibleItems * itemWidth;
  
  // ความกว้างจริงของ chart (ตามจำนวนข้อมูล)
  const actualChartWidth = Math.max(dataCount * itemWidth, minChartWidth);


  const handleBackOrderClick = (checked: boolean) => {
    setBackOrder(checked);
  };

  const handleAccBackOrderClick = (checked: boolean) => {
    setAccBackOrder(checked);
  };

  return (
    <div className="w-full max-w-full overflow-hidden">
      {/* Container ที่จำกัดความกว้างและมี scroll */}
      <div className="mb-3 flex flex-col gap-3 lg:flex-col lg:items-end lg:justify-between">
        {chartType === "overview" && (
          <div className="flex flex-wrap gap-3 text-sm">
            <div className="inline-flex items-center gap-2">
              <Checkbox className="cursor-pointer" checked={backOrder} onCheckedChange={handleBackOrderClick} />
              <span className="flex items-center gap-2">
                <div className="w-6 h-1 rounded-sm bg-[#73D1EB] relative">
                  <div className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-[#73D1EB] -translate-x-1/2 -translate-y-1/2"></div>
                </div>
                Back Order
              </span>
            </div>
            <div className="inline-flex items-center gap-2">
              <Checkbox className="cursor-pointer" checked={accBackOrder} onCheckedChange={handleAccBackOrderClick} />
              <span className="flex items-center gap-2">
                <div className="w-6 h-1 rounded-sm bg-[#F89E37]"></div>
                Accumulate Back Order
              </span>
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-3 text-xs sm:text-sm lg:justify-end">
          <div className="flex gap-1 items-center">
            <div className="w-6 h-1 bg-[#8EA8C7]"></div>
            Cap (8 Hrs.)
          </div>
          <div className="flex gap-1 items-center">
            <div className="w-6 h-1 bg-[#DD7484]"></div>
            Cap (10 Hrs.)
          </div>
          <div className="flex gap-1 items-center">
            <div className="w-6 h-1 bg-[#AEBE79]"></div>
            Cap (10 Hrs.)
          </div>
          <div className="flex gap-1 items-center">
            <div className="w-6 h-1 bg-[#4A4A4A]"></div>
            Capacity Daily (Plan)
          </div>
          <div className="flex gap-1 items-center">
            <div className="w-6 h-3 rounded-sm bg-[#BBC4D5]"></div>
            Target
          </div>
          <div className="flex gap-1 items-center">
            <div className="w-6 h-3 rounded-sm bg-[#414141]"></div>
            Actual
          </div>
          {chartType === "simulation" && (
            <Button variant="outline" size="icon" className="h-8 w-8">
              <RefreshCcw className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
     <div className="rounded-md border">
        <div 
          className="overflow-x-auto"
          ref={scrollRef}
          onScroll={(e) => onScrollSync?.('chart', e.currentTarget.scrollLeft)}
          style={{ 
            width: '100%',
            maxWidth: '100%',
          }}
        >
          {/* Inner container กำหนดความกว้างจริงของ chart */}
          <div style={{ width: isMonthly ? '100%' :  actualChartWidth , height: 450 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={chartData}
                margin={{ top: 36, right: 24, bottom: 8, left: 8 }}
                onClick={(state) => {
                  if (state && state.activeLabel) {
                    // ใช้ callback function จาก parent เพื่ออัพเดท state
                    if (onClickedIndexChange) {
                      onClickedIndexChange(state.activeLabel);
                    }
                    if (onChartMouseMove) {
                      onChartMouseMove(state.activePayload);
                    }
                  }
                }}
              >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tickMargin={8} />
            <YAxis />
            <Tooltip 
            content={() => null} 
            cursor={false}/>
  
            {/* เส้นสีแดงแนวตั้งที่ตำแหน่งที่คลิก */}
            {clickedIndex && (
              <ReferenceLine 
                x={clickedIndex} 
                stroke="#ef4444" 
                strokeWidth={2}
                label={{ value: '', position: 'top' }}
              />
            )}
  
            {/* Legend ย้ายขึ้นบนซ้าย-กลางให้คล้ายภาพ */}
      
  
            {/* เส้น Cap */}
            <Line type="monotone" dataKey="cap8"   stroke="#94a3b8" strokeWidth={2} name="Cap (8 Hrs.)"  dot={false} />
            <Line type="monotone" dataKey="cap10"  stroke="#f87171" strokeWidth={2} name="Cap (10 Hrs.)" dot={false} />
            <Line type="monotone" dataKey="cap10b" stroke="#84cc16" strokeWidth={2} name="Cap (10 Hrs.)" dot={false} />
  
            {/* Capacity Daily (Plan) */}
            <Line type="monotone" dataKey="plan" stroke="#000000" strokeWidth={2} name="Capacity Daily (Plan)" dot={false} />
  
            {/* Back Order + Accumulate Back Order (ให้ Back Order มีจุดใหญ่แบบภาพ) */}
          { backOrder && (
            <Line
              type="monotone"
              dataKey="backOrder"
              stroke="#38bdf8"
              strokeWidth={3}
              name="Back Order"
              dot={(props) => (
                <circle
                  key={props.index} 
                  cx={props.cx}
                  cy={props.cy}
                  r={6}
                  stroke="#38bdf8"
                  strokeWidth={2}
                  fill="#73D1EB" // กำหนดสีพื้นหลังจุด
                />
              )}
              activeDot={{ r: 8 }}
            />
          )}
           { accBackOrder &&
            <Line
              type="monotone"
              dataKey="accumulate"
              stroke="#fbbf24"
              strokeWidth={3}
              name="Accumulate Back Order"
              dot={false}
            />
          }
  
            {/* แท่ง Target / Actual */}
            <Bar dataKey="target" barSize={isMonthly ? 60 : 40} fill="#BBC4D5" name="Target" />
            <Bar dataKey="actual" barSize={isMonthly ? 60 : 40} fill="#9ca3af" name="Actual" />
          </ComposedChart>
        </ResponsiveContainer>
          </div>
        </div>
     </div>
    </div>
  );
}