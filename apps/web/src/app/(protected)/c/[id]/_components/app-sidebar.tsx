"use client";

import * as React from "react";

import CollectionSwitcher from "@/app/(protected)/c/[id]/_components/collection-switcher";
import { NavUser } from "@/app/(protected)/c/[id]/_components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

function CollectionSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} variant="inset">
      <SidebarHeader>
        <CollectionSwitcher />
      </SidebarHeader>
      <SidebarContent />
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export default CollectionSidebar;
