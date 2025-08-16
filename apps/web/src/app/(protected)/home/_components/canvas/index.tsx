import HomeCanvasFlow from "@/app/(protected)/home/_components/canvas/flow";
import { GraphStoreProvider } from "@/hooks/useGraph";
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
    return "loading";
  }

  return (
    <GraphStoreProvider
      initialEdges={[]}
      initialNodes={[
        ...(data
          ? data.map((item) => ({
              id: item.id,
              position: { x: 0, y: 0 },
              data: {
                title: item.title,
                description: item.description,
                summary: item.summary,
              },
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
      <HomeCanvasFlow />
    </GraphStoreProvider>
  );
}
export default HomeCanvas;
