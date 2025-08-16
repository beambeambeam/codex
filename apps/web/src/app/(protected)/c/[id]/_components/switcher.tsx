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
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryFetchClient } from "@/lib/api/client";

function CollectionSwitcher() {
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
            <SidebarMenuButton className="h-fit">
              <AlbumIcon className="!size-4" />
              <div className="grid h-fit flex-1 text-left text-sm leading-tight">
                <span className="text-wrap font-medium">
                  {collection?.title ?? "Untitled Collection"}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg py-2"
            align="start"
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
