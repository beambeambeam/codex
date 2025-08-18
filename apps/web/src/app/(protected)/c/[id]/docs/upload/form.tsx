"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import z from "zod";

import DocumentUploader from "@/app/(protected)/c/[id]/docs/upload/uploader";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { useAppForm } from "@/components/ui/tanstack-form";
import { JsonToFormData } from "@/lib/api/body-serializer";
import { useQueryFetchClient } from "@/lib/api/client";
import { parseErrorDetail } from "@/lib/utils";

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

  const { mutate, isPending } = useQueryFetchClient.useMutation(
    "post",
    "/api/v1/documents/uploads",
    {
      onSuccess: () => {
        toast.success("Documents uploaded successfully!");
        form.reset({
          files: [],
        });
      },
      onError: (error: unknown) => {
        toast.error(
          parseErrorDetail(error) || "Upload failed. Please try again.",
        );
      },
    },
  );

  return (
    <div className="relative">
      {isPending && (
        <div
          className="bg-background/20 border-border/40 absolute inset-0 z-20 flex flex-col items-center justify-center border border-solid backdrop-blur-sm"
          style={{
            borderRadius: "inherit",
            boxShadow: "0 0 0 2px rgba(0,0,0,0.08)",
            borderImage: "inherit",
          }}
        >
          <div className="flex flex-col items-center gap-2">
            <Loader
              text="Uploading your files, Please wait!"
              variant="text-shimmer"
              size="lg"
            />
            <span className="text-muted-foreground text-sm">
              Hang tight, magic is happening ✨
            </span>
          </div>
        </div>
      )}

      <form.AppForm>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <form.AppField name="files">
            {(field) => (
              <field.FormItem>
                <field.FormControl>
                  <DocumentUploader
                    value={field.state.value}
                    onValueChange={(e) => field.handleChange(e)}
                  />
                </field.FormControl>
                <field.FormMessage />
              </field.FormItem>
            )}
          </form.AppField>
          <div>
            <Button
              type="submit"
              disabled={isPending}
              variant="secondary"
              className="mt-4"
            >
              {isPending ? (
                <>
                  <Loader variant="circular" size="sm" className="mr-2" />
                  Mixing documents with magic...
                </>
              ) : (
                "Upload File/s."
              )}
            </Button>
          </div>
        </form>
      </form.AppForm>
    </div>
  );
}
export default DocumentUploadForm;
