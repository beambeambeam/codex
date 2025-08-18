"use client";

import { useCallback } from "react";
import z from "zod";

import DocumentUploader from "@/app/(protected)/c/[id]/docs/upload/uploader";
import { useAppForm } from "@/components/ui/tanstack-form";

const MIN_FILES = 1;
const MAX_FILES = 10;

const documentUploadSchema = z.object({
  files: z
    .object({
      file: z.array(z.instanceof(File)),
      title: z.string(),
      description: z.string(),
    })
    .array()
    .min(MIN_FILES, "At least 1 file for upload")
    .max(MAX_FILES, "You can upload up to 10 files"),
});

export type DocumentUploadSchemaType = z.infer<typeof documentUploadSchema>;

function DocumentUploadForm() {
  const form = useAppForm({
    validators: { onChange: documentUploadSchema },
    onSubmit: ({ value }) => console.log(value),
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
              value={
                field.state.value as {
                  file: File;
                  title: string;
                  description: string;
                }[]
              }
            />
          )}
        </form.AppField>
      </form>
    </form.AppForm>
  );
}
export default DocumentUploadForm;
