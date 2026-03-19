"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { PermissionGate } from "@/components/features/auth/permission-gate";
import { TagFilters } from "@/components/features/tag/tag-filters";
import { TagForm } from "@/components/features/tag/tag-form";
import { TagPagination } from "@/components/features/tag/tag-pagination";
import { TagTable } from "@/components/features/tag/tag-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import type { TagCreateRequest, TagDto, TagUpdateRequest } from "@/lib/api/generated";
import { ServiceFunction } from "@/lib/auth/service-functions";

export type TagConfigurationProps = {
  items: TagDto[];
  totalRecords?: number;
  totalPages?: number;
  currentPage: number;
  pageSize?: number;
  sortKey?: string;
  errorMessage?: string | null;
};

export function TagConfigurationClient({ items, totalRecords, totalPages, currentPage, pageSize, sortKey, errorMessage }: TagConfigurationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [drawerState, setDrawerState] = useState<{
    open: boolean;
    mode: "create" | "edit";
    tag?: TagDto | null;
    isLoading: boolean;
    tagId?: number;
  }>({ open: false, mode: "create", isLoading: false });

  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshingInfo, setIsRefreshingInfo] = useState(false);
  const [refreshToastId, setRefreshToastId] = useState<string | number | null>(null);

  const [deleteState, setDeleteState] = useState<{ open: boolean; tag?: TagDto | null }>({ open: false });

  const closeDrawer = () =>
    setDrawerState((state) => ({ open: false, mode: "create", tag: undefined, tagId: undefined, isLoading: false }));

  const refresh = () => startTransition(() => router.refresh());

  const handleCreate = () => {
    setDrawerState({ open: true, mode: "create", tag: undefined, tagId: undefined, isLoading: false });
  };

  const handleEdit = (tag: TagDto) => {
    const tagId = tag.tagId;
    setDrawerState({ open: true, mode: "edit", tag: undefined, tagId, isLoading: true });

    if (!tagId) {
      toast.error("Unable to edit tag – missing identifier");
      return;
    }

    startTransition(async () => {
      try {
        const detail = await fetchTagDetail(tagId);
        setDrawerState({ open: true, mode: "edit", tag: detail ?? tag, tagId, isLoading: false });
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to load tag details");
        setDrawerState({ open: true, mode: "edit", tag, tagId, isLoading: false });
      }
    });
  };

  const handleDelete = (tag: TagDto) => {
    setDeleteState({ open: true, tag });
  };

  const submitCreateOrUpdate = async (values: TagCreateRequest | TagUpdateRequest) => {
    const { mode, tag } = drawerState;
    const id = tag?.tagId;
    if (mode === "edit" && !id) {
      throw new Error("Missing tag identifier");
    }
    const url = mode === "create" ? "/api/tag" : `/api/tag/${id}`;
    const method = mode === "create" ? "POST" : "PUT";

    setIsSaving(true);
    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(values)
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.message ?? "Unable to save tag");
      }

      toast.success(mode === "create" ? "Tag created" : "Tag updated");
      refresh();
      closeDrawer();
    } finally {
      setIsSaving(false);
    }
  };

  const submitDelete = async () => {
    const target = deleteState.tag;
    if (!target?.tagId) return;

    const response = await fetch(`/api/tag/${target.tagId}`, {
      method: "DELETE",
      credentials: "include"
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload?.message ?? "Unable to delete tag");
    }

    toast.success("Tag deleted");
    refresh();
    setDeleteState({ open: false, tag: undefined });
  };

  const handleRefreshServerInfo = () => {
    if (isRefreshingInfo) return;
    setIsRefreshingInfo(true);
    const toastId = toast.loading("Refreshing server info…");
    setRefreshToastId(toastId);
    startTransition(() => {
      router.refresh();
      setIsRefreshingInfo(false);
    });
  };

  useEffect(() => {
    if (!isRefreshingInfo && refreshToastId != null) {
      toast.dismiss(refreshToastId);
      if (errorMessage) {
        toast.error(errorMessage);
      } else {
        toast.success("Server info refreshed");
      }
      setRefreshToastId(null);
    }
  }, [isRefreshingInfo, refreshToastId, errorMessage]);

  const handleSortChange = (nextSortKey: string | null) => {
    if (!nextSortKey) {
      return;
    }

    const targetKey = nextSortKey;
    const currentKey = sortKey ?? "name-asc";
    if (targetKey === currentKey) return;

    const params = new URLSearchParams(searchParams.toString());
    if (nextSortKey) {
      params.set("sort", nextSortKey);
    } else {
      params.delete("sort");
    }
    params.delete("page");
    const query = params.toString();
    startTransition(() => {
      router.push(`/tag/configuration${query ? `?${query}` : ""}`);
    });
  };

  return (
    <PermissionGate serviceFuncIds={[ServiceFunction.Tag, ServiceFunction.TagGroup]}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Tag configuration</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={handleRefreshServerInfo}
              disabled={isPending || isRefreshingInfo}>
              Refresh
            </Button>
            <Button onClick={handleCreate}>New tag</Button>
          </div>
        </div>

        <Dialog
          open={drawerState.open}
          onOpenChange={(open) => {
            if (!open) {
              closeDrawer();
            } else {
                setDrawerState((state) => ({ ...state, open }));
              }
            }}>
            <DialogContent className="max-w-5xl p-0">
              <DialogHeader className="px-6 pt-6">
                <DialogTitle className="text-xl">
                  {drawerState.mode === "create" ? "Create Tag" : drawerState.tag?.tagName ?? "Edit tag"}
                </DialogTitle>
                <DialogDescription>Define metadata and processing behavior for this tag.</DialogDescription>
              </DialogHeader>
              <div className="flex max-h-[calc(100vh-6rem)] flex-col">
                <div className="overflow-y-auto px-6 pb-6 pt-4">
                  <TagForm
                    mode={drawerState.mode}
                    defaultValues={drawerState.tag}
                    isLoading={drawerState.mode === "edit" && drawerState.isLoading}
                    isSubmitting={isSaving}
                    onSubmit={async (values) => {
                      try {
                        await submitCreateOrUpdate(values);
                      } catch (error) {
                        toast.error(error instanceof Error ? error.message : "Unable to save tag");
                      }
                    }}
                    onCancel={closeDrawer}
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        {errorMessage ? (
          <div className="rounded-md border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {errorMessage}
          </div>
        ) : null}
        <TagTable
          filters={<TagFilters />}
          items={items}
          onEdit={handleEdit}
          onDelete={handleDelete}
          sortKey={sortKey}
          onSortChange={handleSortChange}
        />
        <TagPagination currentPage={currentPage} totalPages={totalPages} pageSize={pageSize} totalRecords={totalRecords} />
      </div>

      <Dialog open={deleteState.open} onOpenChange={(open) => setDeleteState((state) => ({ ...state, open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete tag</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {deleteState.tag?.tagName}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteState({ open: false, tag: undefined })}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                startTransition(async () => {
                  try {
                    await submitDelete();
                  } catch (error) {
                    toast.error(error instanceof Error ? error.message : "Unable to delete tag");
                  }
                })
              }
              disabled={isPending}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PermissionGate>
  );
}

async function fetchTagDetail(id: number): Promise<TagDto | null> {
  const response = await fetch(`/api/tag/${id}`, { credentials: "include" });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload?.message ?? "Unable to load tag details");
  }

  const detail: TagDto | null = (payload?.data as TagDto) ?? (payload as TagDto);
  if (!detail) return detail;

  const userIds = new Set<number>();
  const groupIds = new Set<number>();

  if (detail?.userId) userIds.add(detail.userId);
  if (detail?.updatedBy) userIds.add(detail.updatedBy);

  for (const permission of detail.tagPermissions ?? []) {
    if (permission.userId) userIds.add(permission.userId);
    if (permission.groupId) groupIds.add(permission.groupId);
  }
  for (const permission of detail.tagDataPermissions ?? []) {
    if (permission.userId) userIds.add(permission.userId);
    if (permission.groupId) groupIds.add(permission.groupId);
  }

  const [users, groups] = await Promise.all([
    userIds.size
      ? fetch(`/api/security/users?${Array.from(userIds).map((id) => `id=${id}`).join("&")}`, {
          credentials: "include"
        })
          .then((res) => res.ok ? res.json() : Promise.reject(res))
          .then((data) => data?.data ?? [])
          .catch(() => [])
      : Promise.resolve([]),
    groupIds.size
      ? fetch(`/api/security/groups?${Array.from(groupIds).map((id) => `id=${id}`).join("&")}`, {
          credentials: "include"
        })
          .then((res) => res.ok ? res.json() : Promise.reject(res))
          .then((data) => data?.data ?? [])
          .catch(() => [])
      : Promise.resolve([])
  ]);

  const userLookup = new Map<number, string>();
  for (const user of users) {
    if (typeof user?.id === "number") {
      userLookup.set(user.id, user.username ?? user.description ?? `User #${user.id}`);
    }
  }

  const groupLookup = new Map<number, string>();
  for (const group of groups) {
    if (typeof group?.id === "number") {
      groupLookup.set(group.id, group.groupName ?? group.description ?? `Group #${group.id}`);
    }
  }

  detail.tagPermissions = (detail.tagPermissions ?? []).map((item) => ({
    ...item,
    displayName:
      (item.userId && userLookup.get(item.userId)) ||
      (item.groupId && groupLookup.get(item.groupId)) ||
      (item.userId ? `User #${item.userId}` : item.groupId ? `Group #${item.groupId}` : undefined)
  }));

  detail.tagDataPermissions = (detail.tagDataPermissions ?? []).map((item) => ({
    ...item,
    displayName:
      (item.userId && userLookup.get(item.userId)) ||
      (item.groupId && groupLookup.get(item.groupId)) ||
      (item.userId ? `User #${item.userId}` : item.groupId ? `Group #${item.groupId}` : undefined)
  }));

  (detail as any).creatorDisplayName = detail.userId
    ? userLookup.get(detail.userId) ?? `User #${detail.userId}`
    : undefined;
  (detail as any).updatedByDisplayName = detail.updatedBy
    ? userLookup.get(detail.updatedBy) ?? `User #${detail.updatedBy}`
    : undefined;

  return detail;
}
