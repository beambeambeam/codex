import Image from "next/image";
import { BookXIcon } from "lucide-react";

import { TextBlinkLoader } from "@/components/ui/loader";

interface FilePreviewProps {
  file: File | string;
  type: string; // MIME type
}

function FilePreview(props: FilePreviewProps) {
  const isImage = props.type.startsWith("image/");
  const isPDF = props.type === "application/pdf";

  const renderFileContent = () => {
    const fileUrl =
      typeof props.file === "string"
        ? props.file
        : URL.createObjectURL(props.file);

    if (isImage) {
      return (
        <div className="relative h-full w-full">
          <Image
            src={fileUrl}
            alt="preview"
            fill
            className="object-contain"
            unoptimized={typeof props.file !== "string"}
          />
        </div>
      );
    }

    if (isPDF) {
      return (
        <iframe src={fileUrl} className="h-full w-full" title="PDF preview" />
      );
    }

    // Fallback for unsupported file types
    if (typeof props.file === "string") {
      return (
        <div className="flex h-full w-full items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <BookXIcon className="size-12" />
            <TextBlinkLoader
              text="Unable to preview this file."
              className="text-xl"
            />

            <a
              href={props.file}
              target="_blank"
              rel="noopener noreferrer"
              className="text-destructive underline"
            >
              Download file
            </a>
          </div>
        </div>
      );
    }

    return (
      <div className="flex h-full flex-col items-center justify-center text-gray-700">
        <span className="text-lg">{props.file.name}</span>
        <span className="text-sm text-gray-500">{props.type}</span>
      </div>
    );
  };

  return (
    <div className="h-full w-full overflow-hidden rounded-lg border">
      {renderFileContent()}
    </div>
  );
}
export default FilePreview;
