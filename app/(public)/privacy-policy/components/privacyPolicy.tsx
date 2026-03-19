import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dot } from 'lucide-react'
import React from 'react'
// import ข้อมูลที่สร้างไว้
import { policyData } from '../data/privacy-data'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const PrivacyPolicy = () => {
    return (
        <Card className="!bg-white z-50 w-full max-w-[60%] mx-4 md:mx-auto max-h-[95vh] overflow-y-auto p-4 md:p-6 flex flex-col shadow-lg">
            <CardHeader className="text-center pb-2 md:pb-1">
                <CardTitle className="flex text-xl md:text-2xl items-center mt-2 md:mt-6 text-[#454545] font-bold">
                    Privacy Policy
                </CardTitle>
            </CardHeader>
            <CardContent className='px-6'>
                <div className='rounded-lg bg-[#F8F8F8] h-[600px] w-full overflow-y-auto p-6'>
                    {policyData.map((section, index) => (
                        <div key={section.id} className={`${index !== policyData.length - 1 ? 'mb-6' : ''}`}>
                            <h1 className="font-bold text-lg mb-2 text-[#333]">
                                {section.title}
                            </h1>
                            <div className="space-y-1">
                                {section.points.map((point, pIndex) => (
                                    <div key={pIndex} className='flex items-start mb-3'>
                                        <Dot className="shrink-0 mt-[2px] text-gray-500" />
                                        <span className="text-sm md:text-base text-gray-700">
                                            {point}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter>
                <div className='w-full flex justify-end item-end'>
                    <div className='flex gap-6'>
                        <Link href="/login">
                            <Button variant='outline' className='px-6'>
                                Dedcline
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button className='px-6'>
                                Accept
                            </Button>
                        </Link>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}

export default PrivacyPolicy