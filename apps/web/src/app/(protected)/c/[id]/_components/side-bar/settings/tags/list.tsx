"use client";

import React from "react";
import { useParams } from "next/navigation";
import { EditIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQueryFetchClient } from "@/lib/api/client";
import { cacheUtils } from "@/lib/query/cache";
import { parseErrorDetail } from "@/lib/utils";

import TagForm from "./form";

interface Tag {
  id: string;
  title: string;
  color: string;
  collection_id: string;
}

function TagList() {
  const params = useParams() as { id?: string };
  const collectionId = params?.id;

  const { data: tags = [], isLoading } = useQueryFetchClient.useQuery(
    "get",
    "/api/v1/documents/tags/collection/{collection_id}",
    {
      params: {
        path: {
          collection_id: collectionId || "",
        },
      },
      enabled: !!collectionId,
    },
  );

  const { mutate: deleteTag, isPending: isDeleting } =
    useQueryFetchClient.useMutation(
      "delete",
      "/api/v1/documents/tags/{tag_id}",
      {
        onSuccess() {
          toast.success("Tag deleted successfully");
          if (collectionId) {
            cacheUtils.invalidateQueries([
              "get",
              "/api/v1/documents/tags/collection/{collection_id}",
            ]);
          }
        },
        onError(err: unknown) {
          toast.error(parseErrorDetail(err) || "Failed to delete tag");
        },
      },
    );

  const handleDeleteTag = (tagId: string) => {
    deleteTag({
      params: {
        path: {
          tag_id: tagId,
        },
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="bg-muted h-6 animate-pulse rounded" />
        <div className="bg-muted h-6 w-3/4 animate-pulse rounded" />
        <div className="bg-muted h-6 w-1/2 animate-pulse rounded" />
      </div>
    );
  }

  if (tags.length === 0) {
    return (
      <div className="text-muted-foreground py-4 text-center text-sm">
        No tags created yet. Create your first tag to get started.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tags.map((tag: Tag) => (
        <div
          key={tag.id}
          className="bg-card hover:bg-accent/50 flex items-center justify-between rounded-md border p-2 transition-colors"
        >
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: tag.color }}
            />
            <span className="text-sm font-medium">{tag.title}</span>
          </div>

          <div className="flex items-center gap-1">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <EditIcon className="h-3 w-3" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Tag</DialogTitle>
                </DialogHeader>
                <TagForm />
              </DialogContent>
            </Dialog>

            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive h-6 w-6 p-0"
              onClick={() => handleDeleteTag(tag.id)}
              disabled={isDeleting}
            >
              <Trash2Icon className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TagList;
