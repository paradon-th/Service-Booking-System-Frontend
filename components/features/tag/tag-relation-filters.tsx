"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function TagRelationFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("search") ?? "");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setValue(searchParams.get("search") ?? "");
  }, [searchParams]);

  const submit = (next: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next) {
      params.set("search", next);
    } else {
      params.delete("search");
    }
    params.delete("page");
    const query = params.toString();
    startTransition(() => {
      router.push(`/tag/relation-configuration${query ? `?${query}` : ""}`);
    });
  };

  return (
    <form
      className="flex items-center gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        submit(value.trim());
      }}>
      <Input
        placeholder="Search tag relation"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="w-64"
      />
      <Button type="submit" disabled={isPending}>
        Search
      </Button>
    </form>
  );
}
