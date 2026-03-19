"use client";

import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import { getPartCheckingDetailData } from "@/lib/services/partChecking";
import SelectCustom from "../custom-component/selectCustom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

type PartCheckingDetailData = {
    "no": number;
    "plant": string;
    "partno": string;
    "De": string;
    "qty": string;
    "supp": string;
    "stock": number;
    "order": number;
    "buyer": number;
};

interface PartCheckingDetailTableProps {
    TypePage?: string;
}


export default function PartCheckingDetailTable({ TypePage }: PartCheckingDetailTableProps) {
    const [partCheckingDetailData, setPartCheckingDetailData] = useState<PartCheckingDetailData[]>(
        []
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getPartCheckingDetailData();
                setPartCheckingDetailData(data);
                console.table(data);
            } catch (error) {
                console.error("Error fetching part checking detail data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const renderSkeletonRows = () => {
        const columnCount = 18;
        return [...Array(6)].map((_, rowIdx) => (
            <TableRow key={`detail-skeleton-${rowIdx}`}>
                {[...Array(columnCount)].map((__, colIdx) => (
                    <TableCell key={`detail-skeleton-cell-${rowIdx}-${colIdx}`}>
                        <Skeleton className="h-4 w-full" />
                    </TableCell>
                ))}
            </TableRow>
        ));
    };

    return (
        <>
            <div className="w-full overflow-x-auto">
                <div className="[&>div]:rounded-md [&>div]:border [&>div]:max-h-[550px] [&>div]:overflow-y-auto">
                    <Table>
                        <TableHeader className="*:whitespace-nowrap sticky top-0 z-40 bg-denso-dark">
                            <TableRow>
                                <TableHead colSpan={9} className="font-medium bg-denso-dark text-white text-center border-r border-gray-200">
                                    Planner Information
                                </TableHead>
                                <TableHead colSpan={9} className="font-medium bg-denso-dark text-white text-center">
                                    Ordering Confirmation
                                </TableHead>
                            </TableRow>
                            <TableRow>
                                {/* Planer */}
                                <TableHead colSpan={7} className="font-medium bg-denso-dark text-white text-center">
                                    Part not enough or excess for production
                                </TableHead>
                                <TableHead rowSpan={2} className="font-medium bg-denso-dark text-white text-center align-middle min-w-20 border-r border-gray-200">
                                    Order <br /> Lot Size
                                </TableHead>
                                <TableHead rowSpan={2} className="font-medium bg-denso-dark text-white text-center align-middle min-w-20 border-r border-gray-200">
                                    Buyer <br /> Code
                                </TableHead>

                                {/* Ordering */}
                                <TableHead rowSpan={2} className="font-medium bg-denso-dark text-white text-center align-middle min-w-20 border-r border-gray-200">
                                    Yes / No
                                </TableHead>
                                <TableHead rowSpan={2} className="font-medium bg-denso-dark text-white text-center align-middle min-w-20 border-r border-gray-200">
                                    Due date <br /> Short Prod
                                </TableHead>
                                <TableHead colSpan={2} className="font-medium bg-denso-dark text-white text-center align-middle border-r border-gray-200">
                                    Order Expediting
                                </TableHead>
                                <TableHead colSpan={3} className="font-medium bg-denso-dark text-white text-center align-middle border-r border-gray-200">
                                    Add order to Supplier
                                </TableHead>
                                <TableHead colSpan={2} className="font-medium bg-denso-dark text-white text-center align-middle border-r border-gray-200">
                                    Excess
                                </TableHead>
                            </TableRow>

                            <TableRow>
                                {/* Planner */}
                                <TableHead className="font-medium bg-denso-dark text-center align-middle py-3 min-w-12 border-r border-gray-200">
                                    <div className="py-1 text-white">
                                        No.
                                    </div>
                                    <SelectCustom label="" placeholder="" options={[]} selectType="actualProduction"/>
                                </TableHead>
                                <TableHead className="font-medium bg-denso-dark text-center align-middle py-3 min-w-20 max-w-20 border-r border-gray-200">
                                    <div className="py-1 text-white">
                                        Plant
                                    </div>
                                    <SelectCustom label="" placeholder="" options={[]} selectType="actualProduction"/>
                                </TableHead>
                                <TableHead className="font-medium bg-denso-dark text-center align-middle py-3 min-w-25 max-w-25 border-r border-gray-200">
                                    <div className="py-1 text-white">
                                        Part No.
                                    </div>
                                    <SelectCustom label="" placeholder="" options={[]} selectType="actualProduction"/>
                                </TableHead>
                                <TableHead className="font-medium bg-denso-dark text-center min-w-70 border-r border-gray-200">
                                    <div className="py-1 text-white">
                                        De sc.
                                    </div>
                                    <SelectCustom label="" options={[]} placeholder="" selectType="actualProduction"/>
                                </TableHead>
                                <TableHead className="font-medium bg-denso-dark text-white text-center min-w-20 border-r border-gray-200">Qty / Unit</TableHead>
                                <TableHead className="font-medium bg-denso-dark text-white text-center min-w-20 border-r border-gray-200">Supp. Code</TableHead>
                                <TableHead className="font-medium bg-denso-dark text-white text-center min-w-20 border-r border-gray-200">Stock</TableHead>

                                {/* Ordering */}
                                <TableHead className="font-medium bg-denso-dark text-white text-center min-w-20 border-r border-gray-200">Sea QTY</TableHead>
                                <TableHead className="font-medium bg-denso-dark text-white text-center min-w-20 border-r border-gray-200">Plant</TableHead>
                                <TableHead className="font-medium bg-denso-dark text-white text-center min-w-20 border-r border-gray-200">Air QTY</TableHead>
                                <TableHead className="font-medium bg-denso-dark text-white text-center min-w-20 border-r border-gray-200">ETA Date</TableHead>
                                <TableHead className="font-medium bg-denso-dark text-white text-center min-w-20 border-r border-gray-200">Freight Cost</TableHead>
                                <TableHead className="font-medium bg-denso-dark text-white text-center min-w-20 border-r border-gray-200">QTY</TableHead>
                                <TableHead className="font-medium bg-denso-dark text-white text-center min-w-20 border-r border-gray-200">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading
                                ? renderSkeletonRows()
                                : partCheckingDetailData.map((p, index) => (
                                <TableRow key={index}>
                                    <TableCell className="text-center border-r border-gray-200 ">{p.no}</TableCell>
                                    <TableCell className="text-center border-r border-gray-200 ">{p.plant}</TableCell>
                                    <TableCell className="text-center border-r border-gray-200 ">{p.partno}</TableCell>
                                    <TableCell className="text-center border-r border-gray-200 ">{p.De}</TableCell>
                                    <TableCell className="text-center border-r border-gray-200 ">{p.qty}</TableCell>
                                    <TableCell className="text-center border-r border-gray-200 ">{p.supp}</TableCell>
                                    <TableCell className="text-center border-r border-gray-200 ">{p.stock}</TableCell>
                                    <TableCell className="text-center border-r border-gray-200 ">{p.order}</TableCell>
                                    <TableCell className="text-center border-r border-gray-200 ">{p.buyer}</TableCell>
                                    <TableCell className="text-center border-r border-gray-200 ">
                                        <Select>
                                            <SelectTrigger className="w-20 !h-6">
                                                <SelectValue/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Yes">Yes</SelectItem>
                                                <SelectItem value="No">No</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell className="text-center border-r border-gray-200 "></TableCell>
                                    <TableCell className="text-center border-r border-gray-200 "></TableCell>
                                    <TableCell className="text-center border-r border-gray-200 "></TableCell>
                                    <TableCell className="text-center border-r border-gray-200 "></TableCell>
                                    <TableCell className="text-center border-r border-gray-200 "></TableCell>
                                    <TableCell className="text-center border-r border-gray-200 "></TableCell>
                                    <TableCell className="text-center border-r border-gray-200 "></TableCell>
                                    <TableCell className="text-center"></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {TypePage !== "simulation" && <div className="mt-8 flex justify-end">
                    <Button className="w-40">Save</Button>
                </div>
                }   
            </div>
        </>
    );
}