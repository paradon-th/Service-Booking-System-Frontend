"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DEFAULT_TAG_PAGE_SIZE, TAG_PAGE_SIZE_OPTIONS } from "@/lib/tag/constants";

export function TagFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("search") ?? "");
  const [isPending, startTransition] = useTransition();
  const pageSizeValue = searchParams.get("pageSize") ?? DEFAULT_TAG_PAGE_SIZE.toString();
  const [pageSizeOpen, setPageSizeOpen] = useState(false);

  useEffect(() => {
    setValue(searchParams.get("search") ?? "");
  }, [searchParams]);

  const pushParams = (params: URLSearchParams) => {
    params.delete("page");
    const query = params.toString();
    startTransition(() => {
      router.push(`/tag/configuration${query ? `?${query}` : ""}`);
    });
  };

  const submit = (next: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next) {
      params.set("search", next);
    } else {
      params.delete("search");
    }
    pushParams(params);
  };

  const updateParam = (key: string, next: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next) {
      params.set(key, next);
    } else {
      params.delete(key);
    }
    pushParams(params);
  };

  const currentPageSize = Number(pageSizeValue);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <form
        className="contents"
        onSubmit={(event) => {
          event.preventDefault();
          submit(value.trim());
        }}>
        <Input
          placeholder="Search tags..."
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="w-full min-w-[200px] flex-1 sm:w-64"
        />
      </form>

      <Popover open={pageSizeOpen} onOpenChange={setPageSizeOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2" disabled={isPending}>
            <PlusCircle className="h-4 w-4" />
            {currentPageSize} / page
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-0">
          <Command>
            <CommandInput placeholder="Rows per page" className="h-9" />
            <CommandList>
              <CommandEmpty>No page size found.</CommandEmpty>
              <CommandGroup>
                {TAG_PAGE_SIZE_OPTIONS.map((option) => (
                  <CommandItem
                    key={option}
                    value={option.toString()}
                    onSelect={() => {
                      updateParam("pageSize", option.toString());
                      setPageSizeOpen(false);
                    }}>
                    <div className="flex items-center gap-3 py-1">
                      <Checkbox
                        id={`page-size-${option}`}
                        checked={option === currentPageSize}
                        className="pointer-events-none"
                        aria-hidden
                      />
                      <label
                        htmlFor={`page-size-${option}`}
                        className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {option} / page
                      </label>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
