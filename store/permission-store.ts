"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

import type { PermissionDto } from "@/lib/api/generated";

export type PermissionMap = Record<number, PermissionDto>;

type PermissionState = {
  permissions: PermissionMap;
  isLoaded: boolean;
  isLoading: boolean;
  error?: string | null;
  loadPermissions: () => Promise<void>;
  clearPermissions: () => void;
  hasPermission: (serviceFuncId: number, predicate?: (permission: PermissionDto) => boolean) => boolean;
};

async function fetchPermissions() {
  const res = await fetch("/api/auth/user-permissions", { credentials: "include" });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.message ?? "Unable to load permissions");
  }
  const data = await res.json();
  return data as any[]; // Array of { functionId: number, canRead: boolean, ... }
}

export const usePermissionStore = create<PermissionState>()(
  devtools((set, get) => ({
    permissions: {},
    isLoaded: false,
    isLoading: false,
    error: null,
    loadPermissions: async () => {
      if (get().isLoading) return;
      set({ isLoading: true, error: null });
      try {
        const list = await fetchPermissions();
        const map: PermissionMap = {};
        list.forEach((p: any) => {
          map[p.functionId] = {
            serviceFuncId: p.functionId,
            canRead: p.canRead,
            canCreate: p.canCreate,
            canUpdate: p.canUpdate,
            canDelete: p.canDelete
          } as PermissionDto;
        });
        set({ permissions: map, isLoaded: true, isLoading: false });
      } catch (error) {
        set({ error: error instanceof Error ? error.message : "Unable to load permissions", isLoading: false });
      }
    },
    clearPermissions: () => set({ permissions: {}, isLoaded: false, error: null }),
    hasPermission: (serviceFuncId, predicate) => {
      const permission = get().permissions[serviceFuncId];
      if (!permission) return false;
      if (predicate) return predicate(permission);
      return permission.canRead ?? false;
    }
  }))
);
