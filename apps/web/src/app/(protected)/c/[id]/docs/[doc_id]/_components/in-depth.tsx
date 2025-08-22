"use client";

import { BookmarkIcon, EditIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";

interface InDepthProps {
  description?: string | null;
  summary?: string | null;
}

export function InDepth({ description, summary }: InDepthProps) {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1">
          <Badge>
            <BookmarkIcon />
            Description
          </Badge>
          <EditIcon className="text-muted-foreground/60 size-6" />
        </div>
        <p className="text-md text-md rounded-lg border p-4 font-sans">
          {description ?? (
            <span className="text-muted-foreground">No description yet!</span>
          )}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1">
          <Badge>
            <BookmarkIcon />
            Summary
          </Badge>
          <EditIcon className="text-muted-foreground/60 size-6" />
        </div>
        <p className="text-md rounded-lg border p-4 font-sans">
          {summary ?? (
            <span className="text-muted-foreground">No summary yet!</span>
          )}
        </p>
      </div>
    </div>
  );
}
