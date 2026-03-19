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

interface AddConditionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productionLine?: string;
  date?: string;
  dateRange?: { from: Date; to: Date };
}

export function AddConditionDialog({
  open,
  onOpenChange,
  productionLine = "Condensor",
  date = "Sep 1, 2025",
  dateRange,
}: AddConditionDialogProps) {
let parsedDate = new Date(date)

  const [selectedDate, setSelectedDate] = useState<Date>(new Date(parsedDate ? parsedDate : ('2025,8,1'))); // Sep 1, 2025
  console.log("🚀 ~ AddConditionDialog ~ selectedDate:", selectedDate)
  const [costEnergy, setCostEnergy] = useState("10,000");

  const handleSave = () => {
    // Handle save logic here
    console.log({  selectedDate, costEnergy });
    onOpenChange(false);
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

  useEffect(() => {
      setSelectedDate(parsedDate);
  }, [date]);


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-6">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">Add Condition</DialogTitle>
          
          </div>
          <p className="text-sm text-muted-foreground">
            These values will be used to calculate Cost Energy. You can edit them later.
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

          {/* Table Header */}
            <div className="grid grid-cols-2 gap-4 ">
              <div>
                 <Label className="mb-3"> Manpower</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          disabled={true}
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal  disabled:bg-[#EFEFEF] disabled:text-gray-500 disabled:cursor-not-allowed",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate instanceof Date && !isNaN(selectedDate.getTime())
                          ? format(selectedDate, "MMM d, yyyy")
                          : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                        
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => date && setSelectedDate(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
              </div>
                </div>
           
    
              {/* Input Row */}
              <div className="grid grid-cols-2 gap-4 ">
              <div>
                <Label className="mb-3"> Manpower</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Manpower" />
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
                <div>
                    <Label className="mb-3"> OT (hrs.)</Label>
                    <Select>
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
              </div>

          {/* Cost Energy */}
          <div className="space-y-2">
            <Label htmlFor="cost-energy" className="text-sm font-medium">
              Cost Energy
            </Label>
            <Input
              id="cost-energy"
              type="text"
              value={costEnergy}
              onChange={(e) => setCostEnergy(e.target.value)}
               className="text-base disabled:bg-[#EFEFEF] disabled:text-gray-500 disabled:cursor-not-allowed"
              disabled={true}
            />
            <p className="text-xs text-muted-foreground">Auto-calculated from Manpower and OT</p>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" className="px-10" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-black text-white hover:bg-black/90 px-10">
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
