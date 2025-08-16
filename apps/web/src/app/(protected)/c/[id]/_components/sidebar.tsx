"use client";

import * as React from "react";

import CollectionInfo from "@/app/(protected)/c/[id]/_components/info";
import { NavUser } from "@/app/(protected)/c/[id]/_components/nav-user";
import CollectionSwitcher from "@/app/(protected)/c/[id]/_components/switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

function CollectionSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state, isMobile, openMobile } = useSidebar();
  const isVisible = isMobile ? openMobile : state === "expanded";

  return (
    <Sidebar collapsible="icon" {...props} variant="inset">
      <SidebarHeader>
        <CollectionSwitcher />
      </SidebarHeader>
      <SidebarContent className="p-2">
        {isVisible && <CollectionInfo />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export default CollectionSidebar;
