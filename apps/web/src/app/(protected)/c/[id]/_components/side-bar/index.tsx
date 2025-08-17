"use client";

import * as React from "react";
import Link from "next/link";

import CollectionInfo from "@/app/(protected)/c/[id]/_components/side-bar/info";
import CollectionLinks from "@/app/(protected)/c/[id]/_components/side-bar/links";
import { NavUser } from "@/app/(protected)/c/[id]/_components/side-bar/nav-user";
import CollectionSwitcher from "@/app/(protected)/c/[id]/_components/side-bar/switcher";
import { Logo } from "@/components/ui/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

function CollectionSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props} variant="inset">
      <SidebarHeader className="border-b">
        <Link href="/home">
          <Logo className="pb-2" />
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex h-fit flex-col gap-0 pt-2">
        <CollectionSwitcher />
        <CollectionInfo />
        <CollectionLinks />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export default CollectionSidebar;
