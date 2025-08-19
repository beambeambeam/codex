"use client";

import { useParams } from "next/navigation";
import {
  BookIcon,
  FileClockIcon,
  GitCompareArrowsIcon,
  InfoIcon,
} from "lucide-react";

import DocumentAudit from "@/app/(protected)/c/[id]/docs/[doc_id]/_components/audit";
import DocumentKnowledgeGraph from "@/app/(protected)/c/[id]/docs/[doc_id]/_components/kg";
import { Card, CardContent } from "@/components/ui/card";
import { Pill, PillAvatar, PillIcon } from "@/components/ui/pill";
import { RelativeTimeCard } from "@/components/ui/relative-time-card";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryFetchClient } from "@/lib/api/client";
import { mimeTypeToName } from "@/lib/utils";

function DocumentPage() {
  const params = useParams<{ doc_id: string }>();

  const { data, isPending } = useQueryFetchClient.useQuery(
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

  if (isPending) {
    return null;
  }

  return (
    <section className="flex h-full flex-col gap-3 border-t-2 p-4">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>
          <div>d</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <div className="flex h-full w-full flex-col gap-6 px-4">
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
            <Separator />
            <Tabs defaultValue="In Depts">
              <TabsList>
                <TabsTrigger value="In Depts">
                  <InfoIcon />
                  In Depts
                </TabsTrigger>
                <TabsTrigger value="Knowledge Graph">
                  <GitCompareArrowsIcon />
                  Knowledge Graph
                </TabsTrigger>
                <TabsTrigger value="Audit">
                  <FileClockIcon />
                  Audit
                </TabsTrigger>
              </TabsList>
              <TabsContent value="In Depts">
                <Card>
                  <CardContent>
                    <TabsContent value="In Depts">
                      <div className="flex w-full flex-col gap-4">
                        <div className="flex flex-col gap-2">
                          <h2 className="text-muted-foreground flex items-center gap-0.5 text-sm">
                            Description
                          </h2>
                          <p className="text-md font-sans">
                            {data?.description}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <h2 className="text-muted-foreground flex items-center gap-0.5 text-sm">
                            Summary
                          </h2>
                          <p className="text-md font-sans">
                            {data?.summary ?? "No summary yet!"}
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="Knowledge Graph">
                      Change your Knowledge Graph here.
                    </TabsContent>
                    <TabsContent value="Audit">Audit</TabsContent>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent
                value="Knowledge Graph"
                className="h-full w-full font-sans"
              >
                <DocumentKnowledgeGraph
                  knowledge_graph={data?.knowledge_graph ?? null}
                  type={data?.file?.type ?? ""}
                />
              </TabsContent>
              <TabsContent value="Audit">
                <DocumentAudit />
              </TabsContent>
            </Tabs>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </section>
  );
}
export default DocumentPage;
