"use client";

import { useEffect, useMemo, useState } from "react";

import { useDebouncedValue } from "@/hooks/use-debounce";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import type { SecurityEntity, SecurityEntityType } from "@/lib/security/types";

const PAGE_SIZE = 50;

type SecurityTab = "user" | "group";

type SecurityResponse = {
  data: Array<{ id: number; username?: string; groupName?: string; description?: string } & Record<string, unknown>>;
};

type AssigneeSearchDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (entity: SecurityEntity) => void;
  excludeIds?: Partial<Record<SecurityEntityType, number[]>>;
};

export function AssigneeSearchDialog({ open, onOpenChange, onSelect, excludeIds }: AssigneeSearchDialogProps) {
  const [activeTab, setActiveTab] = useState<SecurityTab>("user");
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 250);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<SecurityEntity[]>([]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setItems([]);
      setError(null);
      return;
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const abort = new AbortController();
    const fetchEntities = async () => {
      setIsLoading(true);
      setError(null);

      const endpoint = activeTab === "user" ? "/api/security/users" : "/api/security/groups";
      const params = new URLSearchParams();
      params.set("pageSize", PAGE_SIZE.toString());
      if (debouncedQuery) {
        params.set("search", debouncedQuery);
      }

      try {
        const response = await fetch(`${endpoint}?${params.toString()}`, {
          credentials: "include",
          signal: abort.signal
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data?.message ?? "Unable to load items");
        }

        const data = (await response.json()) as SecurityResponse;
        const normalized = (data.data ?? []).map((item) => toSecurityEntity(item, activeTab));
        setItems(normalized);
      } catch (fetchError) {
        if (abort.signal.aborted) return;
        setError(fetchError instanceof Error ? fetchError.message : "Unable to load items");
      } finally {
        if (!abort.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void fetchEntities();

    return () => {
      abort.abort();
    };
  }, [activeTab, debouncedQuery, open]);

  const filteredItems = useMemo(() => {
    if (!excludeIds) return items;

    return items.filter((item) => {
      const excluded = excludeIds[item.type];
      if (!excluded) return true;
      return !excluded.includes(item.id);
    });
  }, [excludeIds, items]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select assignee</DialogTitle>
          <DialogDescription>Assign access rights by selecting a user or group.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as SecurityTab)}>
            <TabsList>
              <TabsTrigger value="user">Users</TabsTrigger>
              <TabsTrigger value="group">Groups</TabsTrigger>
            </TabsList>

            <div className="py-3">
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={activeTab === "user" ? "Search users" : "Search groups"}
              />
            </div>

            <TabsContent value="user">
              <EntityList
                isLoading={isLoading}
                error={error}
                items={filteredItems}
                onSelect={(entity) => {
                  onSelect(entity);
                  onOpenChange(false);
                }}
              />
            </TabsContent>
            <TabsContent value="group">
              <EntityList
                isLoading={isLoading}
                error={error}
                items={filteredItems}
                onSelect={(entity) => {
                  onSelect(entity);
                  onOpenChange(false);
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

type EntityListProps = {
  items: SecurityEntity[];
  isLoading: boolean;
  error: string | null;
  onSelect: (entity: SecurityEntity) => void;
};

function EntityList({ items, isLoading, error, onSelect }: EntityListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>;
  }

  if (items.length === 0) {
    return <div className="text-sm text-muted-foreground">No results. Try a different search term.</div>;
  }

  return (
    <ScrollArea className="h-[320px] rounded-md border">
      <div className="divide-y">
        {items.map((entity) => (
          <button
            key={`${entity.type}-${entity.id}`}
            type="button"
            onClick={() => onSelect(entity)}
            className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition hover:bg-muted/70">
            <div className="min-w-0">
              <p className="truncate font-medium">{entity.name}</p>
              {entity.description ? (
                <p className="truncate text-sm text-muted-foreground">{entity.description}</p>
              ) : null}
            </div>
            <Badge variant="outline" className="shrink-0 capitalize">
              {entity.type}
            </Badge>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}

function toSecurityEntity(item: SecurityResponse["data"][number], type: SecurityTab): SecurityEntity {
  return {
    id: item.id,
    name: type === "user" ? item.username ?? `User #${item.id}` : item.groupName ?? `Group #${item.id}`,
    description: item.description,
    type
  };
}
