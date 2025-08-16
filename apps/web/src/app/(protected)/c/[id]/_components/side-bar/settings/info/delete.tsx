"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import {
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { toast } from "sonner";

import { useCollectionState } from "@/app/(protected)/c/[id]/_components/context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAppForm } from "@/components/ui/tanstack-form";
import { useQueryFetchClient } from "@/lib/api/client";
import { cacheUtils } from "@/lib/query/cache";
import { parseErrorDetail } from "@/lib/utils";
import { useUser } from "@/store/user";

function CollectionDelete() {
  const params = useParams() as { id?: string };
  const collectionId = params?.id;

  const { user } = useUser();
  const display = user?.display || "";

  const { collection } = useCollectionState();

  const expected = useMemo(
    () => `${display}/${collection?.title || ""}`,
    [display, collection?.title],
  );

  const { mutate, isPending } = useQueryFetchClient.useMutation(
    "delete",
    "/api/v1/collections/{collection_id}",
    {
      onSuccess() {
        toast.success("Collection deleted");
        cacheUtils.invalidateQueries(["get", "/api/v1/collections"]);
      },
      onError(err: unknown) {
        toast.error(parseErrorDetail(err) || "Failed to delete collection");
      },
    },
  );

  const form = useAppForm({
    defaultValues: { confirm: "" },
    onSubmit: ({ value }) => {
      if (!collectionId) return;
      if (value.confirm !== expected) {
        toast.error("Confirmation does not match");
        return;
      }
      mutate({ params: { path: { collection_id: collectionId } } });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.handleSubmit();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete This Collection</Button>
      </DialogTrigger>
      <DialogContent className="md:min-w-4xl max-w-full">
        <DialogHeader>
          <DialogTitle className="text-destructive font-bold">
            Delete This Collection.
          </DialogTitle>
          <DialogDescription hidden>
            This is dialog for delete the collections.
          </DialogDescription>
        </DialogHeader>

        <form.AppForm>
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-muted-foreground text-sm">
              To confirm deletion, type{" "}
              <code className="rounded-lg border p-2 font-mono">
                {expected}
              </code>{" "}
              below.
            </p>

            <form.AppField name="confirm">
              {(field) => (
                <field.FormItem>
                  <field.FormControl>
                    <Input
                      id="confirm"
                      placeholder={expected}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={isPending}
                    />
                  </field.FormControl>
                  <field.FormMessage />
                </field.FormItem>
              )}
            </form.AppField>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <form.AppField name="confirm">
                {(field) => (
                  <Button
                    type="submit"
                    variant="destructive"
                    disabled={field.state.value !== expected || isPending}
                  >
                    {isPending ? "Deleting..." : "Delete"}
                  </Button>
                )}
              </form.AppField>
            </DialogFooter>
          </form>
        </form.AppForm>
      </DialogContent>
    </Dialog>
  );
}
export default CollectionDelete;
