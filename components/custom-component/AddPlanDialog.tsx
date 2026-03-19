"use client";

import React, { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";

interface AddPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productionLine?: string;
  date?: string;
  dateRange?: { from: Date; to: Date };
  plans?: { key: string; ot: string; thb: string; manpower: string }[];
  onAddPlan?: (ot: string, manpower: string) => { key: string; ot: string; thb: string; manpower: string };
}

export function AddPlanDialog({
    open,
    onOpenChange,
    productionLine = "Condensor",
    plans = [],
    onAddPlan,
}: AddPlanDialogProps) {
    
  const [selectedOt, setSelectedOt] = useState<string>("");
  const [selectedManpower, setSelectedManpower] = useState<string>("");
  const [generatedPlan, setGeneratedPlan] = useState<{ key: string; ot: string; thb: string; manpower: string } | null>(null);

  const handleSave = () => {
    if (selectedOt && selectedManpower && onAddPlan) {
      const newPlan = onAddPlan(selectedOt, selectedManpower);
      setGeneratedPlan(newPlan);
      // แสดง toast หรือ notification ว่าเพิ่มสำเร็จ
      console.log("✅ Added new plan:", newPlan);
      // Reset form
      setSelectedOt("");
      setSelectedManpower("");
      setGeneratedPlan(null);
    }
    onOpenChange(false);
  };
  
  const handleOtChange = (value: string) => {
    setSelectedOt(value);
    // Preview plan key ที่จะถูกสร้าง
    if (plans.length > 0) {
      const lastKey = plans[plans.length - 1].key;
      const nextKeyCode = lastKey.charCodeAt(0) + 1;
      const nextKey = String.fromCharCode(nextKeyCode);
      setGeneratedPlan({ key: nextKey, ot: value, thb: '', manpower: selectedManpower });
    }
  };

  const handleManpowerChange = (value: string) => {
    setSelectedManpower(value);
    // Update preview if OT already selected
    if (selectedOt && plans.length > 0) {
      const lastKey = plans[plans.length - 1].key;
      const nextKeyCode = lastKey.charCodeAt(0) + 1;
      const nextKey = String.fromCharCode(nextKeyCode);
      setGeneratedPlan({ key: nextKey, ot: selectedOt, thb: '', manpower: value });
    }
  };

  const manpowerOptions = [
    { label: "8", value: "8" },
    { label: "10", value: "10" },
    { label: "12", value: "12" },
  ];

  const otOptions = [
    { label: "0", value: "0" },
    { label: "2", value: "2" },
  ];



  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-6">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">Add Plan</DialogTitle>

          </div>
          <p className="text-sm text-muted-foreground">
            Add a new plan by entering the main OT value.
          </p>
        </DialogHeader>
        <div className="w-full h-[1px] bg-muted-foreground/20"></div>
        <div className="space-y-6 py-4">
          {/* Production Line and Date Range */}
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="font-medium">Production Line:</span>{" "}
              <span className="text-muted-foreground">{productionLine}</span>
            </div>
        
          </div>

    
    
              {/* Input Row */}
              <div className="grid grid-cols-2 gap-4 ">
              <div>
                <Label className="mb-3">Plan Name</Label>
                <Input 
                    disabled={true}
                    value={generatedPlan ? `Plan ${generatedPlan.key}` : ''}
                    className={cn(
                        "w-full justify-start text-left font-normal disabled:bg-[#EFEFEF] disabled:text-gray-500 disabled:cursor-not-allowed"
                    )} 
                    placeholder="Plan name will be generated" />
              </div> 
              </div>
              <div className="grid grid-cols-2 gap-4">
                     <div>
                     <Label className="mb-3">OT (hrs.)</Label>
                    <Select value={selectedOt} onValueChange={handleOtChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select OT (hrs.)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel></SelectLabel>
                   { otOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                </div>

                     <div>
                     <Label className="mb-3">Manpower (people)</Label>
                    <Select value={selectedManpower} onValueChange={handleManpowerChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Manpower (people)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel></SelectLabel>
                   { manpowerOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                </div>

                  
              </div>
        </div>

      

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" className="px-10" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!selectedOt || !selectedManpower}
            className="bg-black text-white hover:bg-black/90 px-10 disabled:bg-gray-400 disabled:cursor-not-allowed">
            Add
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
