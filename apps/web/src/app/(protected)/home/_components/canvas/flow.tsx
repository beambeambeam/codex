import { ReactFlow } from "@xyflow/react";

import CenterNode from "@/app/(protected)/home/_components/canvas/node/center-node";
import { CollectionNode } from "@/app/(protected)/home/_components/canvas/node/collection-node";
import { useGraphActions, useGraphState } from "@/hooks/useGraph";

const nodeTypes = {
  collectionNode: CollectionNode,
  centerNode: CenterNode,
};

function HomeCanvasFlow() {
  const { nodes, edges } = useGraphState();
  const { onNodesChange, onEdgesChange } = useGraphActions();

  return (
    <div className="h-full w-full">
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
