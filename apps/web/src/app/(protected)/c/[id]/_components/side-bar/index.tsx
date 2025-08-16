"use client";

import * as React from "react";

import CollectionLinks from "@/app/(protected)/c/[id]/_components/side-bar/links";
import { NavUser } from "@/app/(protected)/c/[id]/_components/side-bar/nav-user";
import CollectionSwitcher from "@/app/(protected)/c/[id]/_components/side-bar/switcher";
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
      <SidebarContent>
        {isVisible && (
          <>
            <CollectionLinks />
          </>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export default CollectionSidebar;
