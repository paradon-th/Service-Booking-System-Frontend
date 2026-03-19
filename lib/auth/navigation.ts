import { House, CalendarClock, Settings, Users, ShieldCheck } from "lucide-react";
import type { ComponentType } from "react";
import { ServiceFunction } from "@/lib/auth/service-functions";

export enum PermissionType {
  Read = "Read",
  Create = "Create",
  Update = "Update",
  Delete = "Delete",
}

export type NavLink = {
  title: string;
  href: string;
  icon: any;
  serviceFuncIds?: number[];
  requiredPermissions?: PermissionType[];
};

export type NavDropdown = {
  title: string;
  icon: any;
  serviceFuncIds?: number[];
  requiredPermissions?: PermissionType[];
  items: NavLink[];
};

export type NavItemConfig = NavLink | NavDropdown;

export function isNavDropdown(item: NavItemConfig): item is NavDropdown {
  return (item as NavDropdown).items !== undefined;
}

export type NavGroup = {
  title: string;
  items: NavItemConfig[];
};

export const AUTH_NAV_GROUPS: NavGroup[] = [
  {
    title: "General",
    items: [
      { title: "Dashboard", href: "/overview", icon: House, serviceFuncIds: [ServiceFunction.Overview], requiredPermissions: [PermissionType.Read] },
      { title: "Bookings", href: "/bookings", icon: CalendarClock, requiredPermissions: [PermissionType.Read] },
      { title: "Available Services", href: "/services", icon: Settings, requiredPermissions: [PermissionType.Read] },
      {
        title: "Authority",
        icon: ShieldCheck,
        serviceFuncIds: [ServiceFunction.SecurityUser],
        requiredPermissions: [PermissionType.Read, PermissionType.Create, PermissionType.Update, PermissionType.Delete],
        items: [
          { title: "User Management", href: "/user-management", icon: Users, serviceFuncIds: [ServiceFunction.SecurityUser], requiredPermissions: [PermissionType.Read, PermissionType.Create, PermissionType.Update, PermissionType.Delete] },
          { title: "System Setup", href: "/system-management", icon: Settings, requiredPermissions: [PermissionType.Read] },
        ]
      }
    ]
  },
];
