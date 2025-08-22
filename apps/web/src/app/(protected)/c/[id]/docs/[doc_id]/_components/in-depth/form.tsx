"use client";

import React, { useCallback } from "react";
import { useParams } from "next/navigation";
import { BookmarkIcon } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/components/ui/tanstack-form";
import { Textarea } from "@/components/ui/textarea";
import { useQueryFetchClient } from "@/lib/api/client";
import { cacheUtils } from "@/lib/query/cache";
import { parseErrorDetail } from "@/lib/utils";
import FormProps from "@/types/form";

const documentUpdateFormSchema = z.object({
  description: z.string(),
  summary: z.string(),
});

export type DocumentUpdateFormSchemaType = z.infer<
  typeof documentUpdateFormSchema
>;

interface DocumentUpdateFormProps
  extends FormProps<DocumentUpdateFormSchemaType> {
  onSuccess?: () => void;
  onCacel?: () => void;
}

function DocumentUpdateForm(props: DocumentUpdateFormProps) {
  const params = useParams() as { doc_id?: string };
  const documentId = params?.doc_id;

  const { mutate, isPending } = useQueryFetchClient.useMutation(
    "put",
    "/api/v1/documents/{document_id}",
    {
      onSuccess() {
        toast.success("Document updated successfully");
        if (documentId) {
          cacheUtils.invalidateQueries([
            "get",
            "/api/v1/documents/{document_id}",
          ]);
        }
        props.onSuccess?.();
      },
      onError(err: unknown) {
        toast.error(parseErrorDetail(err) || "Failed to update document");
      },
    },
  );

  const form = useAppForm({
    validators: { onChange: documentUpdateFormSchema },
    defaultValues: {
      description: "",
      summary: "",
      ...props.defaultValues,
    },
    onSubmit: async ({ value }) => {
      mutate({
        params: {
          path: {
            document_id: documentId || "",
          },
        },
        body: {
          description: value.description || null,
          summary: value.summary || null,
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
        <form.AppField name="description">
          {(field) => (
            <field.FormItem>
              <field.FormLabel>
                {" "}
                <Badge>
                  <BookmarkIcon />
                  Description
                </Badge>
              </field.FormLabel>
              <field.FormControl>
                <Textarea
                  id="description"
                  placeholder="Enter document description..."
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={isPending}
                  className="min-h-[100px]"
                />
              </field.FormControl>
              <field.FormMessage />
            </field.FormItem>
          )}
        </form.AppField>

        <form.AppField name="summary">
          {(field) => (
            <field.FormItem>
              <field.FormLabel>
                <Badge>
                  <BookmarkIcon />
                  Summary
                </Badge>
              </field.FormLabel>
              <field.FormControl>
                <Textarea
                  id="summary"
                  placeholder="Enter document summary..."
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={isPending}
                  className="min-h-[100px]"
                />
              </field.FormControl>
              <field.FormMessage />
            </field.FormItem>
          )}
        </form.AppField>

        <div className="flex w-full items-end justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            className="w-fit"
            disabled={isPending}
            onClick={() => props.onCacel?.()}
          >
            Cancel
          </Button>
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
export default DocumentUpdateForm;
