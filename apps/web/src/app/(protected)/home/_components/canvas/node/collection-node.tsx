import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
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
    title?: string;
    description?: string;
    summary?: string;
  };
}

export const CollectionNode = memo((props: CollectionNodeProps) => {
  return (
    <BaseNode className="w-96">
      <Handle
        type="source"
        position={Position.Right}
        className="invisible !bottom-auto !left-1/2 !right-auto !top-1/2 !-translate-x-1/2 !-translate-y-1/2"
      />
      <BaseNodeHeader className="border-b">
        <Rocket className="size-4" />
        <BaseNodeHeaderTitle>
          {props.data.title ? props.data.title : "Untitled Collection"}
        </BaseNodeHeaderTitle>
      </BaseNodeHeader>
      <BaseNodeContent>
        <div>
          <p className="text-xs">
            {props.data.description
              ? props.data.description
              : "No description available for this collection."}
          </p>
          {props.data.summary && (
            <p className="text-muted-foreground mt-2 text-xs">
              {props.data.summary}
            </p>
          )}
        </div>
      </BaseNodeContent>
    </BaseNode>
  );
});

CollectionNode.displayName = "CollectionNode";
