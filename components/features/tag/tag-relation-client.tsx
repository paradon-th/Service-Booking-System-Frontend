"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { PermissionGate } from "@/components/features/auth/permission-gate";
import { TagRelationFilters } from "@/components/features/tag/tag-relation-filters";
import { TagRelationForm } from "@/components/features/tag/tag-relation-form";
import { TagRelationPagination } from "@/components/features/tag/tag-relation-pagination";
import { TagRelationTable } from "@/components/features/tag/tag-relation-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import type { TagRelationCreateRequest, TagRelationDto, TagRelationUpdateRequest } from "@/lib/api/generated";
import { ServiceFunction } from "@/lib/auth/service-functions";

export type TagRelationProps = {
  items: TagRelationDto[];
  totalRecords?: number;
  totalPages?: number;
  currentPage: number;
  errorMessage?: string | null;
};

export function TagRelationClient({ items, totalRecords, totalPages, currentPage, errorMessage }: TagRelationProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [drawerState, setDrawerState] = useState<{
    open: boolean;
    mode: "create" | "edit";
    relation?: TagRelationDto | null;
    isLoading: boolean;
    relationId?: number;
  }>({ open: false, mode: "create", isLoading: false });
  const [deleteState, setDeleteState] = useState<{ open: boolean; relation?: TagRelationDto | null }>({ open: false });
  const [isSaving, setIsSaving] = useState(false);

  const refresh = () => startTransition(() => router.refresh());

  const openCreate = () => setDrawerState({ open: true, mode: "create", isLoading: false, relation: undefined });
  const openEdit = (relation: TagRelationDto) => {
    const relationId = relation.tagGroupId;
    setDrawerState({ open: true, mode: "edit", relation: undefined, relationId, isLoading: true });

    if (!relationId) {
      toast.error("Unable to edit relation – missing identifier");
      return;
    }

    startTransition(async () => {
      try {
        const detail = await fetchTagRelationDetail(relationId);
        setDrawerState({ open: true, mode: "edit", relation: detail ?? relation, relationId, isLoading: false });
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to load relation details");
        setDrawerState({ open: true, mode: "edit", relation, relationId, isLoading: false });
      }
    });
  };
  const closeDrawer = () =>
    setDrawerState({ open: false, mode: "create", relation: undefined, relationId: undefined, isLoading: false });

  const confirmDelete = (relation: TagRelationDto) => setDeleteState({ open: true, relation });

  const submitCreateOrUpdate = async (values: TagRelationCreateRequest | TagRelationUpdateRequest) => {
    const { mode, relation } = drawerState;
    const id = relation?.tagGroupId;
    if (mode === "edit" && !id) {
      throw new Error("Missing relation identifier");
    }
    const url = mode === "create" ? "/api/tag-relation" : `/api/tag-relation/${id}`;
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
        throw new Error(payload?.message ?? "Unable to save tag relation");
      }

      toast.success(mode === "create" ? "Tag relation created" : "Tag relation updated");
      refresh();
      closeDrawer();
    } finally {
      setIsSaving(false);
    }
  };

  const submitDelete = async () => {
    const target = deleteState.relation;
    if (!target?.tagGroupId) return;

    const response = await fetch(`/api/tag-relation/${target.tagGroupId}`, {
      method: "DELETE",
      credentials: "include"
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload?.message ?? "Unable to delete tag relation");
    }

    toast.success("Tag relation deleted");
    refresh();
    setDeleteState({ open: false, relation: undefined });
  };

  return (
    <PermissionGate serviceFuncIds={[ServiceFunction.Tag, ServiceFunction.TagGroup]}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Tag Relation Configuration</h1>
            <p className="text-muted-foreground">Manage tag relation groups and identity mappings.</p>
          </div>
          <div className="flex flex-col-reverse gap-2 md:flex-row md:items-center">
            <TagRelationFilters />
            <Button onClick={openCreate}>New Tag Relation</Button>
            <Dialog
              open={drawerState.open}
              onOpenChange={(open) => {
                if (!open) {
                  closeDrawer();
                } else {
                  setDrawerState((state) => ({ ...state, open }));
                }
              }}>
              <DialogContent className="max-w-4xl p-6">
                <DialogHeader className="pb-2">
                  <DialogTitle>
                    {drawerState.mode === "create"
                      ? "Create Tag Relation"
                      : drawerState.relation?.tagGroupName ?? "Edit relation"}
                  </DialogTitle>
                  <DialogDescription>
                    Define grouping and aggregation behaviour for tag relations.
                  </DialogDescription>
                </DialogHeader>
                <TagRelationForm
                  mode={drawerState.mode}
                  defaultValues={drawerState.relation}
                  isLoading={drawerState.mode === "edit" && drawerState.isLoading}
                  isSubmitting={isSaving}
                  onSubmit={async (values) => {
                    try {
                      await submitCreateOrUpdate(values);
                    } catch (error) {
                      toast.error(error instanceof Error ? error.message : "Unable to save tag relation");
                    }
                  }}
                  onCancel={closeDrawer}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {errorMessage ? (
          <div className="rounded-md border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {errorMessage}
          </div>
        ) : null}
        <TagRelationTable items={items} totalRecords={totalRecords} onEdit={openEdit} onDelete={confirmDelete} />
        <TagRelationPagination currentPage={currentPage} totalPages={totalPages} />
      </div>

      <Dialog open={deleteState.open} onOpenChange={(open) => setDeleteState((state) => ({ ...state, open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete tag relation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {deleteState.relation?.tagGroupName}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteState({ open: false, relation: undefined })}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isPending}
              onClick={() =>
                startTransition(async () => {
                  try {
                    await submitDelete();
                  } catch (error) {
                    toast.error(error instanceof Error ? error.message : "Unable to delete tag relation");
                  }
                })
              }>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PermissionGate>
  );
}

async function fetchTagRelationDetail(id: number): Promise<TagRelationDto | null> {
  const response = await fetch(`/api/tag-relation/${id}`, { credentials: "include" });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload?.message ?? "Unable to load relation details");
  }

  const detail: TagRelationDto | null = (payload?.data as TagRelationDto) ?? (payload as TagRelationDto);
  if (!detail) return detail;

  const userIds = new Set<number>();
  const groupIds = new Set<number>();

  for (const permission of detail.tagRelationPermissions ?? []) {
    if (permission.userId) userIds.add(permission.userId);
    if (permission.groupId) groupIds.add(permission.groupId);
  }
  for (const permission of detail.tagRelationDataPermissions ?? []) {
    if (permission.userId) userIds.add(permission.userId);
    if (permission.groupId) groupIds.add(permission.groupId);
  }

  const [users, groups] = await Promise.all([
    userIds.size
      ? fetch(`/api/security/users?${Array.from(userIds).map((id) => `id=${id}`).join("&")}`, {
          credentials: "include"
        })
          .then((res) => (res.ok ? res.json() : Promise.reject(res)))
          .then((data) => data?.data ?? [])
          .catch(() => [])
      : Promise.resolve([]),
    groupIds.size
      ? fetch(`/api/security/groups?${Array.from(groupIds).map((id) => `id=${id}`).join("&")}`, {
          credentials: "include"
        })
          .then((res) => (res.ok ? res.json() : Promise.reject(res)))
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

  detail.tagRelationPermissions = (detail.tagRelationPermissions ?? []).map((item) => ({
    ...item,
    displayName:
      (item.userId && userLookup.get(item.userId)) ||
      (item.groupId && groupLookup.get(item.groupId)) ||
      (item.userId ? `User #${item.userId}` : item.groupId ? `Group #${item.groupId}` : undefined)
  }));

  detail.tagRelationDataPermissions = (detail.tagRelationDataPermissions ?? []).map((item) => ({
    ...item,
    displayName:
      (item.userId && userLookup.get(item.userId)) ||
      (item.groupId && groupLookup.get(item.groupId)) ||
      (item.userId ? `User #${item.userId}` : item.groupId ? `Group #${item.groupId}` : undefined)
  }));

  return detail;
}
