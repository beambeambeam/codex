"use client";

import Settings from "@/components/settings";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useUser } from "@/store/user";

export function NavUser() {
  const { user } = useUser();
  const { state, isMobile, openMobile } = useSidebar();
  const isVisible = isMobile ? openMobile : state === "expanded";

  if (!user) {
    return null;
  }

  return (
    <SidebarMenu className="w-full">
      <SidebarMenuItem className="flex w-full justify-between gap-2">
        <Avatar className="h-8 w-8 rounded-lg">
          <AvatarFallback className="rounded-lg">
            {user.display[0]}
          </AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-medium">{user.display}</span>
          <span className="truncate text-xs">{user.email}</span>
        </div>
        {isVisible && <Settings />}
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
