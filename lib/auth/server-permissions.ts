import { cache } from "react";
import { redirect } from "next/navigation";

import { apiClient } from "@/lib/api/client";
import { ApiError } from "@/lib/api/generated/core/ApiError";
import type { PermissionDto } from "@/lib/api/generated";
import { clearAuthCookies } from "@/lib/auth/session";

export const getUserPermissionsServer = cache(async (): Promise<PermissionDto[]> => {
  try {
    const response = await apiClient.auth.getUserPermissions();
    return response.data ?? [];
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        await clearAuthCookies();
        redirect("/login");
      }

      if (error.status === 403) {
        redirect("/unauthorized");
      }
    }
    throw error;
  }
});

export async function ensurePermission(serviceFuncIds: number[]) {
  if (!serviceFuncIds.length) {
    return;
  }

  try {
    const permissions = await getUserPermissionsServer();
    const map = new Map<number, PermissionDto>();
    permissions.forEach((permission) => {
      if (typeof permission.serviceFuncId === "number") {
        map.set(permission.serviceFuncId, permission);
      }
    });

    const allowed = serviceFuncIds.some((id) => map.get(id)?.canRead);
    if (!allowed) {
      redirect("/unauthorized");
    }
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        await clearAuthCookies();
        redirect("/login");
      }

      if (error.status === 403) {
        redirect("/unauthorized");
      }
    }

    throw error;
  }
}
