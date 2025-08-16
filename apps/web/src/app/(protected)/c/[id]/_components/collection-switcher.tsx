"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AlbumIcon, ChevronsUpDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Scroller } from "@/components/ui/scroller";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryFetchClient } from "@/lib/api/client";

function CollectionSwitcher() {
  const { isMobile } = useSidebar();
  const params = useParams<{ id: string }>();

  const { data, isPending } = useQueryFetchClient.useQuery(
    "get",
    "/api/v1/collections",
  );

  if (isPending) {
    return <Skeleton className="h-12" />;
  }
  const collection = data?.find((c) => c.id === params.id);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <AlbumIcon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {collection?.title ?? "Untitled Collection"}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Collections
            </DropdownMenuLabel>
            <Scroller className="h-50" withNavigation hideScrollbar>
              {data
                ?.filter((c) => c.id !== params.id)
                .sort(
                  (a, b) =>
                    new Date(b.latest_update ?? 0).getTime() -
                    new Date(a.latest_update ?? 0).getTime(),
                )
                .map((collection) => (
                  <Link href={`${collection.id}`} key={collection.id}>
                    <DropdownMenuItem className="gap-2 p-2">
                      {collection.title ?? "Untitled Collection"}
                    </DropdownMenuItem>
                  </Link>
                ))}
            </Scroller>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export default CollectionSwitcher;
