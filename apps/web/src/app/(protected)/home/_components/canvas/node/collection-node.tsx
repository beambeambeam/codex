import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { AlbumIcon, BadgeInfoIcon } from "lucide-react";

import {
  BaseNode,
  BaseNodeContent,
  BaseNodeHeader,
  BaseNodeHeaderTitle,
} from "@/components/base-node";
import AvatarGroup from "@/components/ui/avatar-group";
import { Badge } from "@/components/ui/badge";

interface CollectionNodeProps {
  data: {
    id: string;
    title?: string;
    description?: string;
    summary?: string;
    contributor: {
      display: string;
      imgUrl: string;
    }[];
  };
}

export const CollectionNode = memo((props: CollectionNodeProps) => {
  return (
    <BaseNode className="w-72">
      <Handle
        type="source"
        position={Position.Right}
        className="invisible !bottom-auto !left-1/2 !right-auto !top-1/2 !-translate-x-1/2 !-translate-y-1/2"
      />
      <BaseNodeHeader className="flex items-start border-b">
        <AlbumIcon className="mt-0.5 size-6" />
        <BaseNodeHeaderTitle className="flex flex-col">
          {props.data.title ? props.data.title : "Untitled Collection"}
        </BaseNodeHeaderTitle>
      </BaseNodeHeader>
      <BaseNodeContent>
        <div className="flex flex-col gap-y-3">
          <div className="flex flex-col gap-y-2">
            <Badge variant="secondary">
              <BadgeInfoIcon className="size-4" />
              description
            </Badge>
            {props.data.description ? (
              <p className="pl-2 text-xs">{props.data.description}</p>
            ) : (
              <p className="pl-2 text-xs">
                No description available for this collection.
              </p>
            )}
          </div>
          {props.data.summary && (
            <div className="flex flex-col gap-y-2">
              <Badge variant="secondary">
                <BadgeInfoIcon className="size-4" />
                summary
              </Badge>
              <p className="text-xs">{props.data.summary}</p>
            </div>
          )}
          <div className="flex w-full">
            <AvatarGroup
              size="sm"
              items={props.data.contributor.map((c, idx) => ({
                id: idx,
                name: c.display,
                image: c.imgUrl,
              }))}
              maxVisible={5}
            />
          </div>
        </div>
      </BaseNodeContent>
    </BaseNode>
  );
});

CollectionNode.displayName = "CollectionNode";
