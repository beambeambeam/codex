import { memo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Handle, Position } from "@xyflow/react";
import { AlbumIcon, BadgeInfoIcon, SquareArrowOutUpRight } from "lucide-react";

import {
  BaseNode,
  BaseNodeContent,
  BaseNodeHeader,
  BaseNodeHeaderTitle,
} from "@/components/base-node";
import AvatarGroup from "@/components/ui/avatar-group";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const router = useRouter();

  const HREF = `c/${props.data.id}`;

  return (
    <BaseNode className="w-72" onDoubleClick={() => router.push(HREF)}>
      <Handle
        type="source"
        position={Position.Right}
        className="invisible !bottom-auto !left-1/2 !right-auto !top-1/2 !-translate-x-1/2 !-translate-y-1/2"
      />
      <BaseNodeHeader className="flex items-center justify-between border-b">
        <AlbumIcon className="mt-0.5" />
        <BaseNodeHeaderTitle className="flex flex-col">
          {props.data.title ? props.data.title : "Untitled Collection"}
        </BaseNodeHeaderTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="4" cy="10" r="1.5" fill="currentColor" />
                <circle cx="10" cy="10" r="1.5" fill="currentColor" />
                <circle cx="16" cy="10" r="1.5" fill="currentColor" />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel className="w-40 truncate text-center">
              {props.data.title}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href={HREF}>
              <DropdownMenuItem>
                <SquareArrowOutUpRight />
                Checkout.
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
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
