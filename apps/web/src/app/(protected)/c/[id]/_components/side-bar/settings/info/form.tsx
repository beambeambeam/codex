"use client";

import React, { useCallback } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppForm } from "@/components/ui/tanstack-form";
import { Textarea } from "@/components/ui/textarea";
import { useQueryFetchClient } from "@/lib/api/client";
import { cacheUtils } from "@/lib/query/cache";
import { parseErrorDetail } from "@/lib/utils";
import FormProps from "@/types/form";

const collectionUpdateFormSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export type CollectionUpdateFormSchemaType = z.infer<
  typeof collectionUpdateFormSchema
>;

function CollectionUpdateForm(
  props: FormProps<CollectionUpdateFormSchemaType>,
) {
  const params = useParams() as { id?: string };
  const collectionId = params?.id;

  const { mutate, isPending } = useQueryFetchClient.useMutation(
    "put",
    "/api/v1/collections/{collection_id}",
    {
      onSuccess() {
        toast.success("Collection updated");
        if (collectionId) {
          cacheUtils.invalidateQueries([
            "get",
            "/api/v1/collections/{collection_id}",
          ]);
          cacheUtils.invalidateQueries(["get", "/api/v1/collections"]);
        }
      },
      onError(err: unknown) {
        toast.error(parseErrorDetail(err) || "Failed to update collection");
      },
    },
  );

  const form = useAppForm({
    validators: { onChange: collectionUpdateFormSchema },
    defaultValues: {
      title: "",
      description: "",
      ...props.defaultValues,
    },
    onSubmit: async ({ value }) => {
      mutate({
        params: {
          path: {
            collection_id: collectionId || "",
          },
        },
        body: {
          title: value.title,
          description: value.description || null,
        },
      });
    },
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form],
  );

  return (
    <form.AppForm>
      <form className="flex flex-col gap-y-4" onSubmit={handleSubmit}>
        <form.AppField name="title">
          {(field) => (
            <field.FormItem>
              <field.FormLabel>Title</field.FormLabel>
              <field.FormControl>
                <Input
                  id="title"
                  placeholder="e.g. My Research."
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

        <form.AppField name="description">
          {(field) => (
            <field.FormItem>
              <field.FormLabel>Description</field.FormLabel>
              <field.FormControl>
                <Textarea
                  id="description"
                  placeholder="e.g. A collection of my thesis."
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={isPending}
                  className="h-[100px]"
                />
              </field.FormControl>
              <field.FormMessage />
            </field.FormItem>
          )}
        </form.AppField>

        <div className="flex w-full items-end justify-end gap-2">
          <Button
            type="submit"
            disabled={isPending}
            className="w-fit"
            variant="outline"
          >
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </form.AppForm>
  );
}
export default CollectionUpdateForm;
