"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { PlusIcon, TagIcon } from "lucide-react";
import { toast } from "sonner";

import TagForm, {
  TagCreateFormSchemaType,
} from "@/app/(protected)/c/[id]/_components/side-bar/settings/tags/form";
import TagList from "@/app/(protected)/c/[id]/_components/side-bar/settings/tags/list";
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
import { generateRandomColor, parseErrorDetail } from "@/lib/utils";

function CollectionTag() {
  const [open, setOpen] = useState(false);
  const params = useParams() as { id?: string };
  const collectionId = params?.id;

  const { mutate, isPending } = useQueryFetchClient.useMutation(
    "post",
    "/api/v1/documents/tags",
    {
      onSuccess() {
        toast.success("Tag created successfully");
        if (collectionId) {
          cacheUtils.invalidateQueries([
            "get",
            "/api/v1/documents/tags/collection/{collection_id}",
          ]);
        }
        setOpen(false);
      },
      onError(err: unknown) {
        toast.error(parseErrorDetail(err) || "Failed to create tag");
      },
    },
  );

  const handleSubmit = async (values: TagCreateFormSchemaType) => {
    mutate({
      body: {
        collection_id: collectionId || "",
        title: values.title,
        color: values.color,
      },
    });
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <TagIcon className="size-5" />
          <h3 className="text-lg font-bold">Tags</h3>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <PlusIcon className="mr-1 h-3 w-3" />
              Add Tag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Tag</DialogTitle>
            </DialogHeader>
            <TagForm
              defaultValues={{
                color: generateRandomColor(),
                title: "",
              }}
              isPending={isPending}
              onSubmit={handleSubmit}
              closeDialog={() => setOpen(false)}
              mode="create"
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        <h4 className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide">
          Existing Tags
        </h4>
        <TagList />
      </div>
    </div>
  );
}

export default CollectionTag;
