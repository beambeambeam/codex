"use client";

import { ReactNode } from "react";
import { useParams } from "next/navigation";
import { SparklesIcon } from "lucide-react";

import CollectionBreadcrums from "@/app/(protected)/c/[id]/_components/breadcrums";
import { CollectionStoreProvider } from "@/app/(protected)/c/[id]/_components/context";
import CollectionSidebar from "@/app/(protected)/c/[id]/_components/side-bar";
import CollectionSettings from "@/app/(protected)/c/[id]/_components/side-bar/settings";
import { Loader } from "@/components/ui/loader";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ToggleThemeButton } from "@/components/ui/toggle-theme";
import { useQueryFetchClient } from "@/lib/api/client";

interface CollectionLayoutProps {
  readonly children: ReactNode;
}

function CollectionLayout(props: CollectionLayoutProps) {
  const params = useParams<{ id: string }>();

  const { data, isPending } = useQueryFetchClient.useQuery(
    "get",
    "/api/v1/collections/{collection_id}",
    {
      params: {
        path: {
          collection_id: params.id,
        },
      },
    },
  );

  if (isPending) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-2">
        <SparklesIcon />
        <Loader
          text="Summoning your collection from the depths of the dbs...."
          variant="text-blink"
          className="text-xl"
        />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <CollectionStoreProvider
      initial={{
        ...data,
      }}
    >
      <SidebarProvider>
        <CollectionSidebar />
        <SidebarInset>
          <header className="group-has-data-[collapsible=offcanvas]/sidebar-wrapper:h-12 h-16.5 flex shrink-0 items-center gap-2 transition-[width,height] ease-linear">
            <div className="flex w-full items-center gap-2 px-4">
              <div className="flex w-full flex-row items-center gap-3">
                <SidebarTrigger className="-ml-1" />
                <CollectionBreadcrums />
              </div>
              <ToggleThemeButton />
            </div>
          </header>
          {props.children}
        </SidebarInset>
      </SidebarProvider>
      <CollectionSettings />
    </CollectionStoreProvider>
  );
}
export default CollectionLayout;
