"use client";

import { toast } from "sonner";

import { useQueryFetchClient } from "@/lib/api/client";
import { cacheUtils } from "@/lib/query/cache";
import { parseErrorDetail } from "@/lib/utils";

interface UseRemoveDocumentsOptions {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export function useRemoveDocuments(options?: UseRemoveDocumentsOptions) {
  const { mutate, isPending, isError } = useQueryFetchClient.useMutation(
    "delete",
    "/api/v1/documents/{document_id}",
    {
      onSuccess: () => {
        toast.success("Document deleted successfully!");

        cacheUtils.invalidateQueries([
          "get",
          "/api/v1/documents/{collection_id}/table",
        ]);

        options?.onSuccess?.();
      },
      onError: (error: unknown) => {
        toast.error(
          parseErrorDetail(error) ||
            "Failed to delete document. Please try again.",
        );

        options?.onError?.(error);
      },
    },
  );

  const removeDocument = (documentId: string) => {
    mutate({
      params: {
        path: {
          document_id: documentId,
        },
      },
    });
  };

  const removeDocuments = async (documentIds: string[]) => {
    for (const documentId of documentIds) {
      removeDocument(documentId);
    }
  };

  return {
    mutate: removeDocument,
    removeDocument,
    removeDocuments,
    isPending,
    isError,
  };
}
