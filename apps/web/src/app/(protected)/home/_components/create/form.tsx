"use client";

import React, { useCallback } from "react";
import { SparklesIcon } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// label not needed; form uses form field components
import { Loader } from "@/components/ui/loader";
import { useAppForm } from "@/components/ui/tanstack-form";
import { Textarea } from "@/components/ui/textarea";
import { useQueryFetchClient } from "@/lib/api/client";
import { cacheUtils } from "@/lib/query/cache";
import { parseErrorDetail } from "@/lib/utils";

export const createCollectionSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export type CreateCollectionSchemaType = z.infer<typeof createCollectionSchema>;

interface CreateCollectionFormProps {
  close?: () => void;
}

export default function CreateCollectionForm(props: CreateCollectionFormProps) {
  const { mutate, isPending } = useQueryFetchClient.useMutation(
    "post",
    "/api/v1/collections",
    {
      onSuccess() {
        toast.success("Collection created");
        cacheUtils.invalidateAndRefetch(["get", "/api/v1/collections"]);
        if (props?.close) {
          props.close();
        }
      },
      onError(err: unknown) {
        toast.error(parseErrorDetail(err) || "Failed to create collection");
      },
    },
  );

  const form = useAppForm({
    validators: { onChange: createCollectionSchema },
    defaultValues: {
      title: "",
      description: "",
    },
    onSubmit: async ({ value }) => {
      mutate({
        body: {
          title: value.title === "" ? "Untitled Collection" : value.title,
          description: value.description === "" ? null : value.description,
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
              <field.FormLabel>description</field.FormLabel>
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

        <div className="flex w-full items-center justify-end pt-4">
          <Button
            type="submit"
            disabled={isPending}
            className="w-fit"
            variant="outline"
          >
            {isPending ? (
              <>
                <Loader className="mr-2" /> Creating...
              </>
            ) : (
              <>
                <SparklesIcon />
                <span>Create Collection</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </form.AppForm>
  );
}
