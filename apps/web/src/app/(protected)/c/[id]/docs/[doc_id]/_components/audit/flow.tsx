"use client";

import { Background, ReactFlow } from "@xyflow/react";

import { useGraphState } from "@/hooks/use-graph";

function DocumentAuditFlow() {
  const { nodes, edges } = useGraphState();

  return (
    <div className="h-[50svh] w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        defaultEdgeOptions={{
          type: "straight",
        }}
        fitView
      >
        <Background />
      </ReactFlow>
    </div>
  );
}
export default DocumentAuditFlow;
