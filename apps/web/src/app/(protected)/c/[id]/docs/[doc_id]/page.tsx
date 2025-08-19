"use client";

import { useParams } from "next/navigation";
import { BookIcon } from "lucide-react";

import { Pill, PillAvatar, PillIcon } from "@/components/ui/pill";
import { RelativeTimeCard } from "@/components/ui/relative-time-card";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useQueryFetchClient } from "@/lib/api/client";
import { mimeTypeToName } from "@/lib/utils";

function DocumentPage() {
  const params = useParams<{ doc_id: string }>();

  const { data } = useQueryFetchClient.useQuery(
    "get",
    "/api/v1/documents/{document_id}",
    {
      params: {
        path: {
          document_id: params.doc_id,
        },
      },
    },
  );

  return (
    <section className="flex h-full flex-col gap-3 border-t-2 p-4">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>
          <div>d</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <div className="flex h-full w-full flex-col px-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-xl">{data?.title ?? "Untitled Document"}</h1>
              <h1 className="text-muted-foreground text-md">
                {decodeURIComponent(data?.file?.name ?? "")}
              </h1>
              <div className="flex gap-0.5">
                <Pill>
                  <PillAvatar
                    fallback={data?.user?.display[0]}
                    src=""
                    className="border"
                  />
                  {data?.user?.display}
                </Pill>
                <Pill>
                  <RelativeTimeCard
                    date={new Date(data?.file?.upload_at ?? "")}
                  />
                </Pill>
                <Pill>
                  <PillIcon icon={BookIcon} />
                  {mimeTypeToName(data?.file?.type)}
                </Pill>
              </div>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </section>
  );
}
export default DocumentPage;
