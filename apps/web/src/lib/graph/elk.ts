import { Edge, Node } from "@xyflow/react";
import ELK from "elkjs/lib/elk.bundled.js";

const elk = new ELK();

const elkOptions = {
  "elk.algorithm": "radial",
  "elk.radial.radius": "100",
  "elk.spacing.nodeNode": "80",
};

export const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  options: Record<string, string> = {},
) => {
  const elkEdges = edges.map((e) => ({
    id: e.id,
    sources: [e.source],
    targets: [e.target],
  }));

  const layoutOptions = { ...elkOptions, ...options };

  const graph = {
    id: "root",
    layoutOptions: layoutOptions,
    children: nodes.map((node) => ({
      ...node,
      width: node.width ?? 150,
      height: node.height ?? 50,
    })),
    edges: elkEdges,
  };

  return elk
    .layout(graph)
    .then((layoutedGraph) => ({
      nodes: layoutedGraph.children?.map((node) => ({
        ...node,
        position: { x: node.x ?? 0, y: node.y ?? 0 },
      })) as Node[],
      edges: edges,
    }))
    .catch(() => {
      return { nodes, edges };
    });
};
