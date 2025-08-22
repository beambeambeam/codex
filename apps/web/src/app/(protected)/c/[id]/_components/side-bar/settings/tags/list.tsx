"use client";

import React from "react";
import { useParams } from "next/navigation";
import { EditIcon, TagsIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-muted-foreground/60 flex flex-col items-center gap-2">
          <div className="border-muted-foreground/60 border-3 rounded-full border-dashed p-4">
            <TagsIcon className="size-12" />
          </div>

          <div className="flex flex-col items-center">No tags created yet.</div>
        </div>
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
                <Button variant="ghost" size="icon-sm">
                  <EditIcon />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Tag</DialogTitle>
                </DialogHeader>
                <TagForm
                  defaultValues={{
                    color: tag.color,
                    title: tag.title,
                  }}
                />
              </DialogContent>
            </Dialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive h-6 w-6 p-0"
                  disabled={isDeleting}
                >
                  <Trash2Icon className="h-3 w-3" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Tag</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete the tag &quot;{tag.title}
                    &quot;? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDeleteTag(tag.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TagList;
