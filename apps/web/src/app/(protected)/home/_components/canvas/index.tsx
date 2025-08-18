import { ReactFlowProvider } from "@xyflow/react";

import HomeCanvasFlow from "@/app/(protected)/home/_components/canvas/flow";
import { Loader } from "@/components/ui/loader";
import { GraphStoreProvider } from "@/hooks/use-graph";
import { useQueryFetchClient } from "@/lib/api/client";

interface HomeCanvasProps {
  display: string;
  imgUrl?: string;
}

function HomeCanvas(props: HomeCanvasProps) {
  const { data, isPending } = useQueryFetchClient.useQuery(
    "get",
    "/api/v1/collections",
  );

  if (isPending) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader
          size="lg"
          text="Please wait. Summoning your collections..."
          variant="text-shimmer"
        />
      </div>
    );
  }

  return (
    <GraphStoreProvider
      initialEdges={
        data
          ? data.map((item) => ({
              id: `e-${item.id}-center-node`,
              source: item.id,
              target: "center-node",
            }))
          : []
      }
      initialNodes={[
        ...(data
          ? data.map((item) => ({
              id: item.id,
              position: { x: 0, y: 0 },
              data: {
                ...item,
              },
              width: 80,
              height: 200,
              type: "collectionNode",
            }))
          : []),
        {
          id: "center-node",
          position: { x: 0, y: 0 },
          data: {
            title: props.display,
            imgUrl: props.imgUrl,
          },
          type: "centerNode",
        },
      ]}
    >
      <ReactFlowProvider>
        <HomeCanvasFlow />
      </ReactFlowProvider>
    </GraphStoreProvider>
  );
}
export default HomeCanvas;
