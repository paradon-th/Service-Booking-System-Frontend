import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Access denied</h1>
        <p className="text-muted-foreground">
          You do not have permission to view this page. Contact your workspace administrator if you think this is a
          mistake.
        </p>
      </div>
      <Button asChild variant="outline">
        <Link href="/">Go back to dashboard</Link>
      </Button>
    </div>
  );
}
