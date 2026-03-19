import { PermissionGate } from "@/components/features/auth/permission-gate";
import UserManagement from "@/components/main-component/userManagement";
import { ServiceFunction } from "@/lib/auth/service-functions";
import { generateMeta } from "@/lib/utils";
import { UserManagementSkeleton } from "@/components/loading-skeleton";

export function generateMetadata() {
  return generateMeta({
    title: "User Management",
    description: "User Management Page.",
    canonical: "/user-management",
  });
}

export default function UserManagementPage() {
  return (
    <PermissionGate
      serviceFuncIds={[ServiceFunction.SecurityUser]}
      loadingIndicator={<UserManagementSkeleton />}
    >
      <div className="flex flex-col gap-6 p-8">
        <UserManagement />
      </div>
    </PermissionGate>
  );
}