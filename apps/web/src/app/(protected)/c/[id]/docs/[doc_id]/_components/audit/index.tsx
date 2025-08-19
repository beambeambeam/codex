"use client";

import { useParams } from "next/navigation";
import { ReactFlowProvider } from "@xyflow/react";

import DocumentAuditFlow from "@/app/(protected)/c/[id]/docs/[doc_id]/_components/audit/flow";
import { GraphStoreProvider } from "@/hooks/use-graph";
import { useQueryFetchClient } from "@/lib/api/client";

function DocumentAudit() {
  const params = useParams<{ doc_id: string }>();

  const { data } = useQueryFetchClient.useQuery(
    "get",
    "/api/v1/documents/{document_id}/audit",
    {
      params: {
        path: {
          document_id: params.doc_id,
        },
      },
    },
  );

  if (!data) {
    return null;
  }

  console.log(
    Array.isArray(data)
      ? data.map((item, idx) => ({
          id: item.id ?? `node-${idx}`,
          position: { x: 0, y: idx * 100 },
          data: item,
        }))
      : [],
  );

  return (
    <GraphStoreProvider
      initialNodes={
        Array.isArray(data)
          ? data.map((item, idx) => ({
              id: item.id ?? `node-${idx}`,
              position: { x: 0, y: idx * 100 },
              data: item,
            }))
          : []
      }
      initialEdges={[]}
    >
      <ReactFlowProvider>
        <DocumentAuditFlow />
      </ReactFlowProvider>
    </GraphStoreProvider>
  );
}
export default DocumentAudit;
