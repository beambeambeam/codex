import { ReactFlow } from "@xyflow/react";

import { CollectionNode } from "@/app/(protected)/home/canvas/node/collection-node";
import { useGraphActions, useGraphState } from "@/hooks/useGraph";

const nodeTypes = {
  collectionNode: CollectionNode,
};

function HomeCanvasFlow() {
  const { nodes, edges } = useGraphState();
  const { onNodesChange, onEdgesChange } = useGraphActions();

  return (
    <div className="h-[80vh] w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
      />
    </div>
  );
}
export default HomeCanvasFlow;
