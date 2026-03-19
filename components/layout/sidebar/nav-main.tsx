"use client";

import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

import type { NavGroup, NavItemConfig, NavLink } from "@/lib/auth/navigation";
import { AUTH_NAV_GROUPS, isNavDropdown, PermissionType } from "@/lib/auth/navigation";
import { usePermissions } from "@/store/use-permission";
import { ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export type { NavGroup };

export const navGroups: NavGroup[] = AUTH_NAV_GROUPS;
export const navItems = navGroups;

export function NavMain() {
  const pathname = usePathname();
  const { permissions, isLoaded } = usePermissions();

  const hasPermissionItem = (item: NavItemConfig): boolean => {
    // If no service function is required, allow it
    if (!item.serviceFuncIds || item.serviceFuncIds.length === 0) return true;

    // Check if user has at least one of the required service functions with Read permission
    return item.serviceFuncIds.some(id => {
      const p = permissions[id];
      if (!p) return false;
      
      // If specific CRUD permissions are required (e.g. Read), check them
      if (item.requiredPermissions?.includes(PermissionType.Read)) {
        return p.canRead;
      }
      
      // Default fallback: if it's in the list, we assume it's for Read
      return p.canRead;
    });
  };

  return (
    <SidebarGroup>
      {AUTH_NAV_GROUPS.map((group) => {
        const visibleItems = group.items.filter(hasPermissionItem);
        if (visibleItems.length === 0) return null;

        return (
          <div key={group.title} className="space-y-1">
            {group.title ? (
              <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
                {group.title}
              </SidebarGroupLabel>
            ) : null}

            <SidebarGroupContent>
              <SidebarMenu>
                {visibleItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    {isNavDropdown(item) ? (
                      <>
                        <div className="hidden group-data-[collapsible=icon]:block">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <SidebarMenuButton>
                                {item.icon && <item.icon className="size-4" />}
                              </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              side="right"
                              align="start"
                              className="min-w-0 rounded-lg"
                            >
                              <DropdownMenuLabel className="truncate">{item.title}</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              {item.items.filter(hasPermissionItem).map((subItem) => (
                                <DropdownMenuItem key={subItem.href} asChild>
                                  <Link className="truncate" href={subItem.href}>{subItem.title}</Link>
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <Collapsible
                          className="w-full block group-data-[collapsible=icon]:hidden"
                          defaultOpen={item.items.some((subItem) => pathname.startsWith(subItem.href))}
                        >
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton className="group flex w-full items-center justify-between py-6">
                              <div className="flex items-center gap-2 min-w-0">
                                {item.icon ? <item.icon className="size-4" /> : null}
                                <span className="truncate">{item.title}</span>
                              </div>
                              <ChevronRight className="size-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="pl-6 py-2 relative before:absolute before:left-3 before:top-0 before:bottom-0 before:w-px before:bg-gray-200 dark:before:bg-gray-700">
                            <SidebarMenu>
                              {item.items.filter(hasPermissionItem).map((subItem) => {
                                const isActive = pathname.startsWith(subItem.href);
                                return (
                                  <SidebarMenuItem key={subItem.href}>
                                    <SidebarMenuButton asChild isActive={isActive} className="py-6">
                                      <Link href={subItem.href} className="flex gap-2 items-center min-w-0">
                                        {subItem.icon ? <subItem.icon className="size-4" /> : null}
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <span className="truncate max-w-45">{subItem.title}</span>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>{subItem.title}</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </Link>
                                    </SidebarMenuButton>
                                  </SidebarMenuItem>
                                );
                              })}
                            </SidebarMenu>
                          </CollapsibleContent>
                        </Collapsible>
                      </>
                    ) : (
                      <SidebarMenuButton onClick={() => sessionStorage.setItem("openByOverview", "false")} asChild isActive={pathname.startsWith(item.href)}>
                        <Link href={item.href} className="flex items-center gap-2 min-w-0 py-6">
                          {item.icon ? <item.icon className="size-4" /> : null}
                          <span className="group-data-[collapsible=icon]:hidden truncate">
                            {item.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </div>
        );
      })}
    </SidebarGroup>
  );
}