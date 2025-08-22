import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ErrorDetail {
  loc: (string | number)[];
  msg: string;
  type: string;
}

interface ErrorWithDetailArray {
  detail: ErrorDetail[];
}

interface ErrorWithDetailString {
  detail: string;
}

export function parseErrorDetail(error: unknown): string {
  // Check if we're in development mode
  const isDev = process.env.NODE_ENV === "development";

  if (
    typeof error === "object" &&
    error !== null &&
    "detail" in error &&
    Array.isArray((error as ErrorWithDetailArray).detail)
  ) {
    const details = (error as ErrorWithDetailArray).detail;
    if (details.length > 0 && details[0]) {
      if (isDev) {
        // In development, return detailed error information
        return details
          .map((d) => {
            const location = d.loc ? ` at ${d.loc.join(".")}` : "";
            const type = d.type ? ` (${d.type})` : "";
            return `${d.msg}${location}${type}`;
          })
          .join("; ");
      } else {
        // In production, return generic message
        return "Something went wrong";
      }
    }
  }

  if (typeof error === "object" && error !== null && "detail" in error) {
    const detail = (error as ErrorWithDetailString).detail;
    if (isDev) {
      return typeof detail === "string" ? detail : "Unknown error occurred";
    } else {
      return "Something went wrong";
    }
  }

  // Fallback for unknown error types
  if (isDev) {
    return error instanceof Error ? error.message : "Unknown error occurred";
  } else {
    return "Something went wrong";
  }
}

const MIME_TYPE_DISPLAY: Record<string, string> = {
  // Documents
  "application/pdf": "PDF",
  "application/msword": "Word (.doc)",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "Word (.docx)",
  "application/vnd.ms-excel": "Excel (.xls)",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
    "Excel (.xlsx)",
  "application/vnd.ms-powerpoint": "PowerPoint (.ppt)",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    "PowerPoint (.pptx)",
  "text/plain": "Text",
  "text/markdown": "Markdown",
  "text/csv": "CSV",

  // Archives
  "application/zip": "ZIP archive",
  "application/x-tar": "TAR archive",
  "application/gzip": "GZIP",

  // Images
  "image/jpeg": "JPEG image",
  "image/png": "PNG image",
  "image/gif": "GIF image",
  "image/svg+xml": "SVG image",
  "image/webp": "WebP image",
  "image/avif": "AVIF image",

  // Audio / Video
  "audio/mpeg": "MP3 audio",
  "audio/wav": "WAV audio",
  "video/mp4": "MP4 video",
  "video/x-msvideo": "AVI video",

  // Data
  "application/json": "JSON",
  "application/octet-stream": "Binary",
  "application/octetstream": "Binary",
};

/**
 * Convert a MIME type into a human-friendly display name.
 * - Strips any parameters ("; charset=...")
 * - Uses a hard-coded map for common types
 * - Falls back to readable heuristics for image/audio/video/text/application types
 */
export function mimeTypeToName(mime?: string): string {
  const cleaned = ((mime ?? "").split(";")[0] ?? "").trim().toLowerCase();
  if (!cleaned) return "Unknown";
  if (MIME_TYPE_DISPLAY[cleaned]) return MIME_TYPE_DISPLAY[cleaned];

  const parts = cleaned.split("/");
  const main = parts[0] ?? "";
  const sub = parts[1] ?? "";

  if (main === "image") return `${sub.toUpperCase() || "Image"} image`;
  if (main === "audio") return `${sub.toUpperCase() || "Audio"} audio`;
  if (main === "video") return `${sub.toUpperCase() || "Video"} video`;
  if (main === "text") return `${sub.toUpperCase() || "Text"} text`;

  if (sub) {
    const subtype = sub
      .replace(/[.+-]/g, " ")
      .split(" ")
      .map((s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : ""))
      .filter(Boolean)
      .join(" ");
    return subtype || cleaned;
  }

  return cleaned;
}

export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = [
    "Bytes",
    "KiB",
    "MiB",
    "GiB",
    "TiB",
    "PiB",
    "EiB",
    "ZiB",
    "YiB",
  ];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
