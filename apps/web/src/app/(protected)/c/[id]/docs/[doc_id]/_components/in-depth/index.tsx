"use client";

import { useState } from "react";
import { BookmarkIcon, EditIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import DocumentUpdateForm from "./form";

interface InDepthProps {
  description?: string | null;
  summary?: string | null;
}

export function InDepth({ description, summary }: InDepthProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex w-full flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Edit Document Details</h3>
          <button
            onClick={handleCancel}
            className="text-muted-foreground hover:text-foreground text-sm"
          >
            Cancel
          </button>
        </div>
        <DocumentUpdateForm
          defaultValues={{
            description: description || "",
            summary: summary || "",
          }}
          onSuccess={handleCancel}
        />
      </div>
    );
  }

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
        <p
          className="text-md text-md hover:bg-muted/50 cursor-pointer rounded-lg border p-4 font-sans transition-colors"
          onClick={handleEdit}
        >
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
        <p
          className="text-md hover:bg-muted/50 cursor-pointer rounded-lg border p-4 font-sans transition-colors"
          onClick={handleEdit}
        >
          {summary ?? (
            <span className="text-muted-foreground">No summary yet!</span>
          )}
        </p>
      </div>
    </div>
  );
}
