"use client";

import { ReactNode } from "react";
import { useParams } from "next/navigation";
import { SparklesIcon } from "lucide-react";

import { CollectionStoreProvider } from "@/app/(protected)/c/[id]/_components/context";
import CollectionSettings from "@/app/(protected)/c/[id]/_components/side-bar/settings";
import { Loader } from "@/components/ui/loader";
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
      {props.children}
      <CollectionSettings />
    </CollectionStoreProvider>
  );
}
export default CollectionLayout;
