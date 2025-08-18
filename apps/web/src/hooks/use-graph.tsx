import React from "react";
import type { ReactNode } from "react";
import {
  applyEdgeChanges,
  applyNodeChanges,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
} from "@xyflow/react";
import { createStore, useStore } from "zustand";
import type { StoreApi } from "zustand";

export const initialNodes: Node[] = [];
export const initialEdges: Edge[] = [];

interface GraphState {
  nodes: Node[];
  edges: Edge[];
}

interface GraphActions {
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  clearNodes: () => void;
  clearEdges: () => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  getNode: (id: string) => Node | null;
  getEdge: (id: string) => Edge | null;
  getAllNodes: () => Node[];
  getAllEdges: () => Edge[];
  getChildren: (nodeId: string) => string[];
  getDescendants: (nodeId: string) => string[];
  getParent: (nodeId: string) => string | null;
  getLevel: (nodeId: string) => number;
}

type GraphStore = GraphState & { actions: GraphActions };

const GraphStoreContext = React.createContext<StoreApi<GraphStore> | null>(
  null,
);

interface GraphStoreProviderProps {
  children: ReactNode;
  initialNodes: Node[];
  initialEdges: Edge[];
  onGraphChange?: (nodes: Node[], edges: Edge[]) => void;
}

export const GraphStoreProvider = ({
  children,
  initialNodes: initNodes = initialNodes,
  initialEdges: initEdges = initialEdges,
  onGraphChange,
}: GraphStoreProviderProps) => {
  const [store] = React.useState(() =>
    createStore<GraphStore>((set, get) => ({
      nodes: initNodes,
      edges: initEdges,
      actions: {
        getParent: (nodeId) => {
          const edges = get().edges;
          const parentEdge = edges.find((edge) => edge.target === nodeId);
          return parentEdge ? parentEdge.source : null;
        },
        getLevel: (nodeId) => {
          let level = 0;
          let current = nodeId;
          while (true) {
            const parent = get().actions.getParent(current);
            if (!parent) break;
            level++;
            current = parent;
          }
          return level;
        },
        setNodes: (nodes) => {
          set({ nodes });
          onGraphChange?.(nodes, get().edges);
        },
        setEdges: (edges) => {
          set({ edges });
          onGraphChange?.(get().nodes, edges);
        },
        clearNodes: () => set({ nodes: [] }),
        clearEdges: () => set({ edges: [] }),
        onNodesChange: (changes) => {
          set((state) => {
            const newNodes = applyNodeChanges(changes, state.nodes);
            onGraphChange?.(newNodes, state.edges);
            return { nodes: newNodes };
          });
        },
        onEdgesChange: (changes) => {
          set((state) => {
            const newEdges = applyEdgeChanges(changes, state.edges);
            onGraphChange?.(state.nodes, newEdges);
            return { edges: newEdges };
          });
        },
        getNode: (id) => {
          const found = get().nodes.find((n) => n.id === id);
          return found || null;
        },
        getEdge: (id) => {
          const found = get().edges.find((e) => e.id === id);
          return found || null;
        },
        getAllNodes: () => get().nodes,
        getAllEdges: () => get().edges,
        getChildren: (nodeId) => {
          const edges = get().edges;
          return edges
            .filter((edge) => edge.source === nodeId)
            .map((edge) => edge.target);
        },

        getDescendants: (nodeId) => {
          const edges = get().edges;
          const visited = new Set<string>();
          const descendants: string[] = [];

          const findDescendants = (currentNodeId: string) => {
            if (visited.has(currentNodeId)) return;
            visited.add(currentNodeId);

            const directChildren = edges
              .filter((edge) => edge.source === currentNodeId)
              .map((edge) => edge.target);

            for (const child of directChildren) {
              descendants.push(child);
              findDescendants(child);
            }
          };

          findDescendants(nodeId);
          return descendants;
        },
      },
    })),
  );

  return (
    <GraphStoreContext.Provider value={store}>
      {children}
    </GraphStoreContext.Provider>
  );
};

export const useGraphStore = <T,>(selector: (state: GraphStore) => T): T => {
  const store = React.useContext(GraphStoreContext);
  if (!store) {
    throw new Error("Missing GraphStoreProvider");
  }
  return useStore(store, selector);
};

export const useGraphState = () => {
  const nodes = useGraphStore((state) => state.nodes);
  const edges = useGraphStore((state) => state.edges);
  return React.useMemo(() => ({ nodes, edges }), [nodes, edges]);
};
export const useGraphActions = () => useGraphStore((state) => state.actions);
export const useAllNodes = () => useGraphActions().getAllNodes();
export const useAllEdges = () => useGraphActions().getAllEdges();
