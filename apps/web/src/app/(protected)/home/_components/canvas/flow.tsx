import { useEffect, useRef } from "react";
import { ReactFlow, useNodesInitialized, useReactFlow } from "@xyflow/react";

import CenterNode from "@/app/(protected)/home/_components/canvas/node/center-node";
import { CollectionNode } from "@/app/(protected)/home/_components/canvas/node/collection-node";
import { useGraphActions, useGraphState } from "@/hooks/use-graph";
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
  const reactFlow = useReactFlow();

  useEffect(() => {
    if (nodesInitialized && !layoutAppliedRef.current && nodes.length > 0) {
      const applyLayout = async () => {
        const { nodes: layoutedNodes, edges: layoutedEdges } =
          await getLayoutedElements(nodes, edges);

        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
        layoutAppliedRef.current = true;
        reactFlow.fitView();
      };

      applyLayout();
    }
  }, [nodesInitialized, nodes, edges, setNodes, setEdges, reactFlow]);

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        defaultEdgeOptions={{
          type: "straight",
        }}
      />
    </div>
  );
}
export default HomeCanvasFlow;
