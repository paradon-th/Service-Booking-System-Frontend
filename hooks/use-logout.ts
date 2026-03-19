"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { useClearPermissions } from "@/store/use-permission";

export function useLogout() {
  const router = useRouter();
  const clearPermissions = useClearPermissions();
  const [isPending, startTransition] = useTransition();

  const logout = () => {
    startTransition(async () => {
      try {
        const response = await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include"
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          const message = payload?.message ?? "Unable to logout";
          toast.error(message);
          return;
        }

        clearPermissions();
        toast.success("Signed out");
        router.push("/login");
      } catch (error) {
        toast.error("Unable to logout");
      }
    });
  };

  return { logout, isPending };
}
