import { useEffect, useRef } from "react";
import { ReactFlow, useNodesInitialized } from "@xyflow/react";

import CenterNode from "@/app/(protected)/home/_components/canvas/node/center-node";
import { CollectionNode } from "@/app/(protected)/home/_components/canvas/node/collection-node";
import { useGraphActions, useGraphState } from "@/hooks/useGraph";
import { getLayoutedElements } from "@/lib/graph/elk";

const nodeTypes = {
  collectionNode: CollectionNode,
  centerNode: CenterNode,
};

function HomeCanvasFlow() {
  const { nodes, edges } = useGraphState();
  const { onNodesChange, onEdgesChange, setEdges, setNodes } =
    useGraphActions();
  const nodesInitialized = useNodesInitialized({ includeHiddenNodes: false });
  const layoutAppliedRef = useRef(false);

  useEffect(() => {
    if (nodesInitialized && !layoutAppliedRef.current && nodes.length > 0) {
      const applyLayout = async () => {
        const { nodes: layoutedNodes, edges: layoutedEdges } =
          await getLayoutedElements(nodes, edges);

        console.log(layoutedNodes);

        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
        layoutAppliedRef.current = true;
      };

      applyLayout();
    }
  }, [nodesInitialized, nodes, edges, setNodes, setEdges]);

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
