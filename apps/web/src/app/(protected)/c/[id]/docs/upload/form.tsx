"use client";

import { useCallback } from "react";
import z from "zod";

import DocumentUploader from "@/app/(protected)/c/[id]/docs/upload/uploader";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/components/ui/tanstack-form";
import { JsonToFormData } from "@/lib/api/body-serializer";
import { useQueryFetchClient } from "@/lib/api/client";

const MIN_FILES = 1;
const MAX_FILES = 10;

const documentUploadSchema = z.object({
  files: z
    .object({
      file: z.instanceof(File),
      title: z.string(),
      description: z.string(),
    })
    .array()
    .min(MIN_FILES, "At least 1 file for upload")
    .max(MAX_FILES, "You can upload up to 10 files"),
});

export type DocumentUploadSchemaType = z.infer<typeof documentUploadSchema>;

function DocumentUploadForm() {
  const { mutate } = useQueryFetchClient.useMutation(
    "post",
    "/api/v1/documents/uploads",
  );

  const form = useAppForm({
    validators: { onChange: documentUploadSchema },
    defaultValues: {
      files: [] as DocumentUploadSchemaType["files"],
    },
    onSubmit({ value }) {
      mutate({
        body: {
          items: value.files,
        },
        bodySerializer: JsonToFormData,
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <form.AppField name="files">
          {(field) => (
            <DocumentUploader
              value={field.state.value}
              onValueChange={(e) => field.handleChange(e)}
            />
          )}
        </form.AppField>
        <div>
          <Button type="submit">Upload!</Button>
        </div>
      </form>
    </form.AppForm>
  );
}
export default DocumentUploadForm;
