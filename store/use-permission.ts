"use client";

import { useEffect } from "react";

import type { PermissionDto } from "@/lib/api/generated";
import { usePermissionStore } from "@/store/permission-store";

export function usePermissions() {
  const { permissions, loadPermissions, isLoaded, isLoading, error } = usePermissionStore((state) => state);

  useEffect(() => {
    if (!isLoaded && !isLoading && !error) {
      void loadPermissions();
    }
  }, [isLoaded, isLoading, error, loadPermissions]);

  return { permissions, isLoaded, isLoading, error };
}

export function usePermission(
  serviceFuncId: number,
  predicate?: (permission: PermissionDto) => boolean
) {
  const hasPermission = usePermissionStore((state) => state.hasPermission);
  return hasPermission(serviceFuncId, predicate);
}

export function useClearPermissions() {
  return usePermissionStore((state) => state.clearPermissions);
}
