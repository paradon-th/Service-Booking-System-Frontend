"use client"

import React from 'react'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { RadialBar, RadialBarChart } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
// const chartData = [
//   { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
//   { browser: "safari", visitors: 200, fill: "var(--color-safari)" },

// ]
const chartConfig = {
  Daily: {
    label: "Daily",
    color: "#B7B7B7",  
  },
  Monthly: {
    label: "Monthly",
    color: "#414141",
  },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

interface CardCustomProps {

  title?: string

  typeD?: string

  typeM?: string

  productionType?: string

  chartData?: { data: string; visitors: number; fill: string }[]

  BackProd?: number

  Recovery?: number

  Safety?: number

}



export default function CardCustom({ title, typeD, typeM, chartData, BackProd, Recovery, Safety, productionType }: CardCustomProps) {
  
  // if (isLoading) {
  //   return (
  //     <Card className='bg-gradient-to-br from-[#FFFFFF] to-[#F4F4F6]'>
  //       <div className='px-3 py-4'>
  //         <div>
  //           <div className="flex justify-between">
  //             <div className='w-[55%]'>
  //               {/* Title Skeleton */}
  //               <Skeleton className="h-7 w-32 mb-2" />
                
  //               {/* Chart Skeleton */}
  //               <div className="mt-2 flex justify-center">
  //                 <Skeleton className="h-[120px] w-[120px] rounded-full" />
  //               </div>
  //             </div>
              
  //             <div className="flex flex-col justify-between text-right">
  //               {/* Badge Skeletons */}
  //               <div className='flex flex-col text-center gap-2'>
  //                 <Skeleton className="h-8 w-28 rounded-full" />
  //                 <Skeleton className="h-8 w-28 rounded-full" />
  //               </div>
                
  //               {/* Monthly Stats Skeleton */}
  //               <div className="space-y-1">
  //                 <Skeleton className="h-4 w-16 ml-auto" />
  //                 <Skeleton className="h-6 w-12 ml-auto" />
  //                 <Skeleton className="h-4 w-20 ml-auto" />
  //               </div>
  //             </div>
  //           </div>
  //         </div>
          
  //         {/* Production Stats Skeleton */}
  //         {productionType === 'proLine' && (
  //           <div className='flex flex-col gap-2 mt-8'>
  //             <Skeleton className="h-10 w-full rounded-xl" />
  //             <Skeleton className="h-10 w-full rounded-xl" />
  //             <Skeleton className="h-10 w-full rounded-xl" />
  //           </div>
  //         )}
  //       </div>
  //     </Card>
  //   );
  // }
  
  return (
    <Card className='bg-gradient-to-br from-[#FFFFFF] to-[#F4F4F6]'>
      <div className='px-3'>
            <div>
                <div className="flex justify-between ">
                  <div className='w-[55%]' >
                    <div className="font-bold text-xl">{title}</div>
                    <div className="mt-2">
                    <ChartContainer
                      config={chartConfig}
                      className="mx-auto aspect-square max-h-[120px]"
                    >
                      <RadialBarChart data={chartData} innerRadius={45} outerRadius={65}>
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent hideLabel nameKey="browser" />}
                        />
                    <RadialBar dataKey="visitors" background />
                    <text
                      x="50%"
                      y="45%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-sm"
                      fill="#B7B7B7"
                    >
                      <tspan x="50%" className='text-[12px]' dy="-1em" fill="#454545">Daily</tspan>
                      <tspan className='text-[16px] font-bold' x="50%" dy="1.1em" fill="#999999">75%</tspan>
                      <tspan className='text-[12px]' x="50%" dy="1.3em" fill="#454545">400/400</tspan>
                    </text>

                  </RadialBarChart>
                    </ChartContainer>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between text-right text-[12px]">
                    <div className='flex flex-col text-center gap-2 font-bold'>
                    {typeD === "delay" && <div className='bg-[#D32203] border-2 rounded-full px-2 py-1 text-white border-[#F4A7A4]'>D - Delay</div>}
                      {typeM === "delay" && <div className='text-red-500 border-2 rounded-full px-2 py-1 bg-[#FFF1F2] border-[#FFD7DB]'>M - Delay</div>}

                      {typeD === "risk" && <div className='bg-[#F97316] border-2 rounded-full px-2 py-1 text-white border-[#FCD9CA]'>D - Risk Delay</div>}
                      {typeM === "risk" && <div className='text-[#BA591C] border-2 rounded-full px-2 py-1 bg-[#FFF6EB] border-[#FFDBC0]'>M - Risk Delay</div>}

                      {typeD === "plan" && <div className='bg-[#00BC7D] border-2 rounded-full px-2 py-1 text-white border-[#A4F4CF]'>D - On Plan</div>}
                      {typeM === "plan" && <div className='text-[#16805A] border-2 rounded-full px-2 py-1 bg-[#ECFDF5] border-[#A4F4CF]'>M - On Plan</div>}
                      
                      {typeD === "backProd" && <div className='bg-[#F2B91F] border-2 rounded-full px-2 py-1 text-white border-[#F4E4A4]'>D - Back Prod.</div>}
                      {typeM === "backProd" && <div className='text-[#BA7C1C] border-2 rounded-full px-2 py-1 bg-[#FFFBEB] border-[#FEE994]'>M - Back Prod.</div>}
                    </div>
                    <div>
                      <div className="font-medium text-md">Monthly</div>
                      <div className="text-lg font-bold">87%</div>
                      <div className="text-sm text-muted-foreground">3000 / 3450</div>
                    </div>
                  </div>
                </div>
            </div>
            { productionType == 'proLine' &&  <div className='text-sm flex flex-col gap-2 mt-8'>
              <div className='flex justify-between rounded-xl bg-white p-2 shadow-md'>
                <div>Back Prod.</div>
                <div>{BackProd}</div>
              </div>
              <div className='flex justify-between rounded-xl bg-white p-2 shadow-md'>
                <div>Recovery</div>
                <div>{Recovery}%</div>
              </div>
              <div className='flex justify-between rounded-xl bg-white p-2 shadow-md'>
                <div>Safety</div>
                <div>{Safety}</div>
              </div>
            </div>
            }
      </div>
      </Card>
  )
}
