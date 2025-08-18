import { UploadIcon, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Editable,
  EditableArea,
  EditableInput,
  EditablePreview,
} from "@/components/ui/editable";
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
import { formatBytes, mimeTypeToName } from "@/lib/utils";

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
            className="bg-background relative flex w-[14rem] flex-col items-start justify-start rounded-md border p-0"
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
            <FileUploadItemPreview className="size-[14rem]" />
            <FileUploadItemMetadata className="w-full px-2 pb-2" asChild>
              <div className="flex flex-col gap-2">
                <div className="w-full truncate py-1 text-sm">
                  {file.file.name}
                </div>
                <div className="flex gap-0.5">
                  <Badge variant="secondary">
                    {formatBytes(file.file.size)}
                  </Badge>
                  <Badge variant="secondary">
                    {mimeTypeToName(file.file.type)}
                  </Badge>
                </div>
                <Editable
                  defaultValue={file.title}
                  placeholder="No Title Provide"
                  onValueChange={(title) => {
                    const newValue = [...value];
                    if (newValue[index]) {
                      newValue[index] = {
                        file: newValue[index].file,
                        title,
                        description: newValue[index].description ?? "",
                      };
                      setValue(newValue);
                    }
                  }}
                >
                  <EditableArea>
                    <EditablePreview />
                    <EditableInput />
                  </EditableArea>
                </Editable>
                <Editable
                  defaultValue={file.description}
                  placeholder="No Description Provided"
                  onValueChange={(description) => {
                    const newValue = [...value];
                    if (newValue[index]) {
                      newValue[index] = {
                        file: newValue[index].file,
                        title: newValue[index].title ?? "",
                        description,
                      };
                      setValue(newValue);
                    }
                  }}
                >
                  <EditableArea>
                    <EditablePreview className="text-xs" />
                    <EditableInput className="text-xs" />
                  </EditableArea>
                </Editable>
              </div>
            </FileUploadItemMetadata>
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
