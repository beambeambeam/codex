import { UploadIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
} from "@/components/ui/file-upload";
import { useControllableState } from "@/hooks/use-controllable-state";

const MAX_SIZE = 5 * 1024 * 1024; // 5mb

interface DocumentUploadWithTitleProps {
  value: {
    file: File;
    title: string;
    description: string;
  }[];
  onValueChange?: (value: DocumentUploadWithTitleProps["value"]) => void;
}

function DocumentUploader(props: DocumentUploadWithTitleProps) {
  const [value = [], setValue] = useControllableState({
    prop: props.value,
    onChange: props.onValueChange,
  });

  return (
    <FileUpload
      value={value?.map((item) => item.file)}
      onValueChange={(files) =>
        setValue(
          files.map((file) => ({
            file,
            title: "",
            description: "",
          })),
        )
      }
      maxSize={MAX_SIZE}
      multiple
    >
      <FileUploadList className="border-border flex flex-row flex-wrap items-start justify-center gap-4 rounded border border-dashed p-4">
        {value.map((file, index) => (
          <FileUploadItem
            key={index}
            value={file.file}
            className="bg-background relative flex w-[10rem] flex-col items-start justify-start rounded-md border p-0"
          >
            <div className="absolute right-0.5 top-0.5 z-10">
              <FileUploadItemDelete asChild>
                <Button
                  variant="default"
                  size="icon"
                  className="size-6 rounded-full"
                >
                  <X />
                  <span className="sr-only">Delete</span>
                </Button>
              </FileUploadItemDelete>
            </div>
            <FileUploadItemPreview className="size-[10rem]" />
            <FileUploadItemMetadata className="w-full px-2 pb-2" />
          </FileUploadItem>
        ))}
      </FileUploadList>
      <FileUploadDropzone className="border-dotted text-center">
        <div className="flex items-center justify-center rounded-full border p-2.5">
          <UploadIcon className="text-muted-foreground size-6" />
        </div>
        <p className="text-sm font-medium">Drag & drop images here</p>
      </FileUploadDropzone>
    </FileUpload>
  );
}
export default DocumentUploader;
