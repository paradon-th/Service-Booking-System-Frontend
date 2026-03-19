import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function DashboardOverviewSkeleton() {
    return (
        <div className="space-y-6">
            <div className='px-4 pt-6 pb-2 space-y-6'>
                <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
                    <div className="space-y-2 w-full lg:max-w-2xl">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-4 w-5/6 sm:w-full" />
                    </div>
                    <div className="flex w-full lg:w-auto justify-start lg:justify-end">
                        <Skeleton className="h-9 w-full max-w-[160px] sm:max-w-[200px]" />
                    </div>
                </div>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end'>
                    <div className="space-y-1">
                        <Skeleton className="h-[14px] w-24 sm:w-28" />
                        <Skeleton className="h-9 w-full" />
                    </div>
                    <div className="space-y-1">
                        <Skeleton className="h-[14px] w-20 sm:w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-1">
                        <Skeleton className="h-[14px] w-24 sm:w-28" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className='space-y-1'>
                        <Skeleton className="h-[14px] w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
            </div>
            <div className='flex-1' />
            <div className="pt-2 grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(8)].map((_, index) => (
                    <div className="col-span-1" key={index}>
                        <Card className='bg-gradient-to-br from-[#FFFFFF] to-[#F4F4F6] h-full min-h-[320px] w-full'>
                            <div className='px-3 py-4 h-full flex flex-col'>
                                <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                                    <div className='w-full sm:max-w-[55%]'>
                                        {/* Title Skeleton */}
                                        <Skeleton className="h-7 w-32 mb-2" />
                                        
                                        {/* Chart Skeleton */}
                                        <div className="mt-2 flex justify-center sm:justify-start">
                                            <Skeleton className="h-[120px] w-[120px] rounded-full" />
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-row sm:flex-col justify-between text-right gap-4 sm:gap-6">
                                        {/* Badge Skeletons */}
                                        <div className='grid grid-cols-2 gap-2 sm:flex sm:flex-col sm:text-center'>
                                            <Skeleton className="h-7 w-24 rounded-full" />
                                            <Skeleton className="h-7 w-24 rounded-full" />
                                        </div>
                                        
                                        {/* Monthly Stats Skeleton */}
                                        <div className="space-y-1 text-right">
                                            <Skeleton className="h-4 w-16 ml-auto" />
                                            <Skeleton className="h-6 w-12 ml-auto" />
                                            <Skeleton className="h-4 w-20 ml-auto" />
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Production Stats Skeleton */}
                                <div className='flex flex-col gap-2 mt-8 grow justify-end'>
                                    <Skeleton className="h-9 w-full rounded-xl" />
                                    <Skeleton className="h-9 w-full rounded-xl" />
                                    <Skeleton className="h-9 w-full rounded-xl" />
                                </div>
                            </div>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    )
}
