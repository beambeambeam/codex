import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseErrorDetail(error: unknown): string | undefined {
  return typeof error === "object" && error !== null && "detail" in error
    ? (error as { detail?: string }).detail
    : undefined;
}
