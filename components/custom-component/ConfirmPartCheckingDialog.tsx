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
import { CalendarIcon, X, Check } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";

interface ConfirmPartCheckingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productionLine?: string;
  date?: string;
  dateRange?: { from: Date; to: Date };
  plans?: { key: string; ot: string; thb: string }[];
  onAddPlan?: (ot: string) => { key: string; ot: string; thb: string };
  onConfirmCheck?: () => Promise<void> | void; // callback when confirm pressed
  title?: string; // heading text
  description?: string; // body message
  confirmLabel?: string; // button label override
  iconColorClass?: string; // tailwind bg color for icon circle
}

export function ConfirmPartCheckingDialog({
  open,
  onOpenChange,
  productionLine = "Condensor",
  plans = [],
  onAddPlan,
  onConfirmCheck,
  title = "Confirm Part Checking",
  description = "Confirming will set this Part Checking to \“Checked\”. The data will be used in the Ordering step. Continue?",
  confirmLabel = "Confirm",
  iconColorClass = "bg-emerald-500",
}: ConfirmPartCheckingDialogProps) {
    
    const [selectedOt, setSelectedOt] = useState<string>("");
    const [generatedPlan, setGeneratedPlan] = useState<{ key: string; ot: string; thb: string } | null>(null);

  const handleSave = () => {
    if (selectedOt && onAddPlan) {
      const newPlan = onAddPlan(selectedOt);
      setGeneratedPlan(newPlan);
      
      // แสดง toast หรือ notification ว่าเพิ่มสำเร็จ
      console.log("✅ Added new plan:", newPlan);
      
      // Reset form
      setSelectedOt("");
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
      setGeneratedPlan({ key: nextKey, ot: value, thb: '' });
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

  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    if (isConfirming) return;
    setIsConfirming(true);
    try {
      if (onConfirmCheck) {
        await onConfirmCheck();
      }
    } finally {
      setIsConfirming(false);
      onOpenChange(false);
    }
  };



  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-6">
        <DialogHeader>
            <DialogTitle ></DialogTitle>
        </DialogHeader>
          <div className="flex flex-col gap-4 justify-center items-center">
            {/* Decorative success icon */}
            <div className="relative flex items-center justify-center">
              <div className={`absolute z-0 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full ${iconColorClass}/20 animate-ping`} />
              <div className={`absolute z-0 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full ${iconColorClass}/10`} />
              <div className={`relative z-10 rounded-full p-3 ${iconColorClass} flex items-center justify-center shadow-md`}>
                <Check className="w-5 h-5 text-white" strokeWidth={3} />
              </div>
            </div>
            <div className="text-xl font-bold mt-4">{title}</div>
            <div className="text-[14px] text-center leading-relaxed whitespace-pre-line">{description}</div>
          </div>

        {/* Footer Buttons */}
        <div className="flex justify-center gap-3 pt-4">
          <Button variant="outline" className="px-10" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={isConfirming}
            className="bg-black text-white px-10 hover:bg-black/60 disabled:opacity-60">
            {isConfirming ? 'Working...' : confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
