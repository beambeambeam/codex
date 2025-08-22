"use client";

import React, { useCallback } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  ColorPicker,
  ColorPickerAlpha,
  ColorPickerHue,
  ColorPickerSelection,
} from "@/components/ui/color-picker";
import { Input } from "@/components/ui/input";
import { useAppForm } from "@/components/ui/tanstack-form";
import { useQueryFetchClient } from "@/lib/api/client";
import { cacheUtils } from "@/lib/query/cache";
import { generateRandomColor, parseErrorDetail } from "@/lib/utils";
import FormProps from "@/types/form";

const tagCreateFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  color: z.string().min(1, "Color is required"),
});

export type TagCreateFormSchemaType = z.infer<typeof tagCreateFormSchema>;

function TagForm(props: FormProps<TagCreateFormSchemaType>) {
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
        form.reset({
          title: "",
          color: generateRandomColor(),
        });
      },
      onError(err: unknown) {
        toast.error(parseErrorDetail(err) || "Failed to create tag");
      },
    },
  );

  const form = useAppForm({
    validators: { onChange: tagCreateFormSchema },
    defaultValues: {
      title: props.defaultValues?.title ?? "",
      color: props.defaultValues?.color ?? "",
    },
    onSubmit: async ({ value }) => {
      mutate({
        body: {
          collection_id: collectionId || "",
          title: value.title,
          color: value.color,
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
                  placeholder="e.g. Important, Research, Draft"
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

        <form.AppField name="color">
          {(field) => (
            <field.FormItem>
              <field.FormLabel>Color</field.FormLabel>
              <field.FormControl>
                <div className="flex items-start gap-2">
                  <div
                    className="size-12 rounded-md"
                    style={{
                      background: field.state.value,
                    }}
                  />
                  <div className="flex-1">
                    <ColorPicker
                      value={field.state.value || "#3B82F6"}
                      onChange={(color) => {
                        console.log(color);
                        if (Array.isArray(color) && color.length >= 3) {
                          const [r, g, b] = color;
                          // Convert RGBA to hex, ignoring alpha for hex representation
                          const hex = `#${Math.round(r).toString(16).padStart(2, "0")}${Math.round(g).toString(16).padStart(2, "0")}${Math.round(b).toString(16).padStart(2, "0")}`;
                          field.handleChange(hex);
                        }
                      }}
                      className="h-32"
                    >
                      <ColorPickerSelection className="h-20 w-full" />
                      <div className="flex gap-2">
                        <ColorPickerHue className="flex-1" />
                        <ColorPickerAlpha className="w-16" />
                      </div>
                    </ColorPicker>
                  </div>
                </div>
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
            {isPending ? "Creating..." : "Create Tag"}
          </Button>
        </div>
      </form>
    </form.AppForm>
  );
}

export default TagForm;
