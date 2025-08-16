import { memo } from "react";
import { Rocket } from "lucide-react";

import {
  BaseNode,
  BaseNodeContent,
  BaseNodeHeader,
  BaseNodeHeaderTitle,
} from "@/components/base-node";

interface CollectionNodeProps {
  data: {
    id: string;
    title: string | null;
    description: string | null;
    summary: string | null;
  };
}

export const CollectionNode = memo((props: CollectionNodeProps) => {
  return (
    <BaseNode className="w-96">
      <BaseNodeHeader className="border-b">
        <Rocket className="size-4" />
        <BaseNodeHeaderTitle>{props.data.title}</BaseNodeHeaderTitle>
      </BaseNodeHeader>
      <BaseNodeContent>
        <p className="text-xs">{props.data.description}</p>
      </BaseNodeContent>
    </BaseNode>
  );
});

CollectionNode.displayName = "CollectionNode";
