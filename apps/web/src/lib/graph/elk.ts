import { Edge, Node } from "@xyflow/react";
import ELK from "elkjs/lib/elk.bundled.js";

const elk = new ELK();

const elkOptions = {
  "elk.algorithm": "org.eclipse.elk.force",
  "org.eclipse.elk.force.model": "FRUCHTERMAN_REINGOLD",
  "org.eclipse.elk.spacing.nodeSpacing": "50",
  "org.eclipse.elk.aspectRatio": "1.1",
};

export const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  options: Record<string, string> = {},
) => {
  const elkEdges = edges.map((e) => ({
    id: e.id,
    sources: [String(e.source)],
    targets: [String(e.target)],
  }));

  const layoutOptions = { ...elkOptions, ...options };

  const graph = {
    id: "root",
    layoutOptions: layoutOptions,
    children: nodes.map((node) => ({
      ...node,
      id: String(node.id),
      width: node.width ?? 50,
      height: node.height ?? 50,
    })),
    edges: elkEdges,
  };

  return elk
    .layout(graph)
    .then((layoutedGraph) => {
      const positioned = new Map<string, { x: number; y: number }>();
      (layoutedGraph.children ?? []).forEach((c) => {
        positioned.set(String(c.id), { x: c.x ?? 0, y: c.y ?? 0 });
      });

      const newNodes = nodes.map((orig) => {
        const pos = positioned.get(String(orig.id));
        return {
          ...orig,
          position: pos ?? orig.position ?? { x: 0, y: 0 },
        } as Node;
      });

      return { nodes: newNodes, edges: edges };
    })
    .catch(() => {
      return { nodes, edges };
    });
};
