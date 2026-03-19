"use client";

import React, { useMemo, useState } from 'react'
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";

type Option = {
  label: string
  value: string
}

interface SelectCustomProps {
  label?: string
  placeholder?: string
  groupLabel?: string
  options: Option[]
  value?: string | string[]
  onChange?: (value: string | string[]) => void
  className?: string
  multi?: boolean
  includeSelectAll?: boolean
  selectAllLabel?: string
  selectType?: string
  style?: React.CSSProperties;
  hasError?: boolean
  hasRequired?: boolean
}

export default function SelectCustom({
  label = "Select",
  placeholder = "Choose an option",
  groupLabel,
  options,
  value,
  onChange,
  className,
  multi = false,
  includeSelectAll = true,
  selectAllLabel = "All",
  selectType,
  style,
  hasError = false,
  hasRequired = false,
}: SelectCustomProps) {
  const [open, setOpen] = useState(false);

  // Internal fallback state when uncontrolled
  const [internal, setInternal] = useState<string | string[] | undefined>(
    value
  );

  const isControlled = typeof value !== "undefined";
  const current = isControlled ? value : internal;

  // Override multi and includeSelectAll if selectType is overviewDialog
  const isOverviewDialog = selectType === "overviewDialog";
  const effectiveMulti = isOverviewDialog ? false : multi;
  const effectiveIncludeSelectAll = isOverviewDialog ? false : includeSelectAll;

  const selectedValues: string[] = useMemo(() => {
    if (effectiveMulti) {
      if (Array.isArray(current)) return current;
      if (typeof current === "string" && current) return [current];
      return [];
    }
    return typeof current === "string" && current ? [current] : [];
  }, [current, effectiveMulti]);

  const labelsByValue = useMemo(() => {
    const map = new Map(options.map((o) => [o.value, o.label] as const));
    return map;
  }, [options]);

  const summaryText = useMemo(() => {
    if (effectiveMulti) {
      const isAllSelected = selectedValues.length === options.length || options.length === 0;
      if (isAllSelected) return selectAllLabel;
      if (selectedValues.length === 0) return placeholder;
      if (selectedValues.length === 1)
        return labelsByValue.get(selectedValues[0]) || placeholder;
      return `${labelsByValue.get(selectedValues[0]) || ""} +${
        selectedValues.length - 1
      }`;
    }
    return selectedValues.length
      ? labelsByValue.get(selectedValues[0]) || placeholder
      : placeholder;
  }, [labelsByValue, effectiveMulti, options.length, placeholder, selectAllLabel, selectedValues]);

  const setValue = (next: string | string[]) => {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  const toggleValue = (v: string) => {
    if (!effectiveMulti) {
      setValue(v);
      setOpen(false);
      return;
    }
    const set = new Set(selectedValues);
    if (set.has(v)) set.delete(v); else set.add(v);
    setValue(Array.from(set));
  };

  const allSelected = effectiveMulti && (selectedValues.length === options.length || options.length === 0);

  return (
    <div className={`flex flex-col ${className} `} style={style}>
      <div className={`${hasRequired ? 'hasRequired' : ''}`}>{label && <label className="text-sm font-medium text-[#5C5C5C]">{label}</label>} {hasRequired && <span className="text-red-500">*</span>}</div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            style={{ 
              height: selectType === "actualProduction" ? '24px' : undefined,
              borderColor: hasError ? '#ef4444' : undefined,
              borderWidth: hasError ? '1px' : undefined,
            }}
          >
            <span className={`truncate text-left ${summaryText === placeholder ? 'text-[#BEBEBE]' : ''}`}>
              {summaryText}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popper-anchor-width] p-0" align="start">
          <Command>
            <div className="px-2 pt-2">
              <CommandInput  placeholder={`Search ${groupLabel ?? ''}...`} />
            </div>
            <CommandList className="max-h-64">
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading={groupLabel}>
                {effectiveMulti && effectiveIncludeSelectAll && (
                  <CommandItem
                    value={selectAllLabel}
                    onSelect={() => {
                      if (allSelected) setValue([]);
                      else setValue(options.map((o) => o.value));
                    }}
                  >
                    <Checkbox
                      checked={allSelected}
                      className="mr-2"
                    />
                    {selectAllLabel}
                  </CommandItem>
                )}
                {options.map((option) => {
                  const checked = selectedValues.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onSelect={() => toggleValue(option.value)}
                    >
                      {effectiveMulti ? (
                        <>
                          <Checkbox
                            checked={checked}
                            className="mr-2"
                          />
                          {option.label}
                        </> 
                      ) : (
                        <>{option.label}</>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
