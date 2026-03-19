"use client";

import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { usePermissions } from "@/store/use-permission";
import { usePermissionStore } from "@/store/permission-store";

type PermissionGateProps = {
  serviceFuncIds?: number[];
  children: ReactNode;
  fallback?: ReactNode;
  loadingIndicator?: ReactNode;
};

export function PermissionGate({ serviceFuncIds, children, fallback, loadingIndicator }: PermissionGateProps) {
  const { isLoaded, isLoading, error } = usePermissions();
  const permissions = usePermissionStore((state) => state.permissions);
  const loadPermissions = usePermissionStore((state) => state.loadPermissions);

  if (!serviceFuncIds || serviceFuncIds.length === 0) {
    return <>{children}</>;
  }

  if (error && !isLoaded) {
    return (
      <div className="space-y-4 rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
        <div className="space-y-2">
          <p>Unable to load permissions.</p>
          <p className="text-xs text-muted-foreground/80">{error}</p>
        </div>
        <Button
          size="sm"
          variant="outline"
          disabled={isLoading}
          onClick={() => {
            void loadPermissions();
          }}>
          Try again
        </Button>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <>
        {loadingIndicator ?? (
          <div className="text-sm text-muted-foreground">Loading permissions…</div>
        )}
      </>
    );
  }

  const allowed = serviceFuncIds.some((id) => permissions[id]?.canRead);

  if (!allowed) {
    return (
      <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
        {fallback ?? "You do not have permission to view this page."}
      </div>
    );
  }

  return <>{children}</>;
}
