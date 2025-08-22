"use client";

import React, { useCallback } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { ColorPicker } from "@/components/ui/color-picker";
import { Input } from "@/components/ui/input";
import { useAppForm } from "@/components/ui/tanstack-form";
import { generateRandomColor } from "@/lib/utils";
import { ExternalFormProps } from "@/types/form";

const tagCreateFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  color: z.string().min(1, "Color is required"),
});

export type TagCreateFormSchemaType = z.infer<typeof tagCreateFormSchema>;

function TagForm(props: ExternalFormProps<TagCreateFormSchemaType>) {
  const mode = props.mode || "create";

  const form = useAppForm({
    validators: { onChange: tagCreateFormSchema },
    defaultValues: {
      title: props.defaultValues?.title ?? "",
      color: props.defaultValues?.color ?? generateRandomColor(),
    },
    onSubmit: async ({ value }) => {
      if (props.onSubmit) {
        await props.onSubmit(value);
      }
      if (mode === "create") {
        form.reset({
          title: "",
          color: generateRandomColor(),
        });
      }
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

  const getButtonText = () => {
    if (props.isPending) {
      return mode === "create" ? "Creating..." : "Updating...";
    }
    return mode === "create" ? "Create Tag" : "Update Tag";
  };

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
                  disabled={props.isPending || props.disabled}
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
                      value={field.state.value}
                      onChange={(value: string) => {
                        field.handleChange(value);
                      }}
                    />
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
            disabled={props.isPending || props.disabled}
            className="w-fit"
            variant="outline"
          >
            {getButtonText()}
          </Button>
        </div>
      </form>
    </form.AppForm>
  );
}

export default TagForm;
