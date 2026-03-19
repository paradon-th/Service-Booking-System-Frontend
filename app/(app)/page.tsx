import { PermissionGate } from "@/components/features/auth/permission-gate";
import { ServiceFunction } from "@/lib/auth/service-functions";
import { ensurePermission } from "@/lib/auth/server-permissions";

export default async function Page() {
  await ensurePermission([ServiceFunction.Overview]);

  return (
    <PermissionGate serviceFuncIds={[ServiceFunction.Overview]}>
      <div className="flex h-full flex-col gap-4">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">iCube Dashboard</h1>
          <p className="text-muted-foreground">Select a module from the sidebar to begin.</p>
        </header>
      </div>
    </PermissionGate>
  );
}
