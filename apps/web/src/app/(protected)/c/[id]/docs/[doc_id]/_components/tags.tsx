"use client";

import React, { useCallback, useState } from "react";
import { useParams } from "next/navigation";
import { EditIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import MultipleSelector, { Option } from "@/components/ui/multiselect";
import { useQueryFetchClient } from "@/lib/api/client";
import { cacheUtils } from "@/lib/query/cache";
import { generateRandomColor, parseErrorDetail } from "@/lib/utils";

interface Tag {
  id: string;
  title: string;
  color: string;
  collection_id: string;
}

interface DocumentTagsProps {
  tags: Tag[];
  className?: string;
}

export function DocumentTags(props: DocumentTagsProps) {
  const params = useParams<{ id: string; doc_id: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTags, setSelectedTags] = useState<Option[]>([]);

  const { data: availableTags } = useQueryFetchClient.useQuery(
    "get",
    "/api/v1/documents/tags/collection/{collection_id}",
    {
      params: {
        path: {
          collection_id: params.id,
        },
      },
    },
  );

  // Update document tags mutation
  const { mutate: updateDocumentTags, isPending: isUpdating } =
    useQueryFetchClient.useMutation(
      "put",
      "/api/v1/documents/{document_id}/tags",
      {
        onSuccess() {
          toast.success("Tags updated successfully");
          cacheUtils.invalidateQueries([
            "get",
            "/api/v1/documents/{document_id}",
          ]);
        },
        onError(err: unknown) {
          toast.error(parseErrorDetail(err) || "Failed to update tags");
        },
      },
    );

  const tagOptions: Option[] = (availableTags ?? []).map((tag) => ({
    value: tag.id,
    label: tag.title,
    color: tag.color,
  }));

  const currentDocumentTagOptions: Option[] = props.tags.map((docTag) => ({
    value: docTag.id,
    label: docTag.title,
    color: docTag.color,
  }));

  const handleEditClick = useCallback(() => {
    setIsEditing(true);
    setSelectedTags(currentDocumentTagOptions);
  }, [currentDocumentTagOptions]);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setSelectedTags([]);
  }, []);

  const handleSaveTags = useCallback(async () => {
    // Convert selected tags to tag IDs or titles
    const tagIds: string[] = [];

    for (const tag of selectedTags) {
      // Check if this is a UUID (existing tag) or a string (new tag to create)
      const isUUID =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          tag.value,
        );

      if (isUUID) {
        // Existing tag - use the UUID
        tagIds.push(tag.value);
      } else {
        // New tag - use the title (will be created by backend)
        tagIds.push(tag.label);
      }
    }

    // Update document tags (backend will handle creating new tags)
    updateDocumentTags({
      params: {
        path: {
          document_id: params.doc_id,
        },
      },
      body: {
        document_id: params.doc_id,
        tag_ids: tagIds,
      },
    });

    setIsEditing(false);
  }, [selectedTags, updateDocumentTags, params.doc_id]);

  const handleTagChange = useCallback((options: Option[]) => {
    setSelectedTags(options);
  }, []);

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <MultipleSelector
            value={selectedTags}
            onChange={handleTagChange}
            options={tagOptions}
            placeholder="Select or create tags..."
            maxSelected={10}
            className="min-w-[200px]"
            emptyIndicator="No more tags found."
            creatable
            hideClearAllButton
          />
        </div>
        <Button
          size="sm"
          onClick={handleSaveTags}
          disabled={isUpdating}
          className="h-8"
        >
          {isUpdating ? "Saving..." : "Save"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleCancelEdit}
          disabled={isUpdating}
          className="h-8"
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {props.tags.length > 0 ? (
        <div className="flex flex-wrap items-center gap-1">
          {props.tags.map((docTag) => (
            <div
              key={docTag.id}
              className="animate-fadeIn bg-background text-secondary-foreground hover:bg-background data-fixed:pe-2 relative inline-flex h-7 w-fit cursor-default items-center rounded-md border pe-7 pl-2 ps-2 text-xs font-medium transition-all disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                backgroundColor: `${docTag.color}20`,
                color: docTag.color,
              }}
            >
              <span className="capitalize">{docTag.title}</span>
            </div>
          ))}
        </div>
      ) : (
        <span className="text-muted-foreground text-sm">No tags</span>
      )}

      <Button
        size="sm"
        variant="ghost"
        onClick={handleEditClick}
        className="h-6 w-6 p-0"
      >
        <EditIcon className="h-3 w-3" />
      </Button>
    </div>
  );
}
