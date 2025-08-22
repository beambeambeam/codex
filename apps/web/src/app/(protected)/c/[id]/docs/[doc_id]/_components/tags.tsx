"use client";

import React, { useCallback, useState } from "react";
import { useParams } from "next/navigation";
import { EditIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import MultipleSelector, { Option } from "@/components/ui/multiselect";
import { useQueryFetchClient } from "@/lib/api/client";

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
  const params = useParams<{ id: string }>();
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

  const handleSaveTags = useCallback(() => {
    setIsEditing(false);
  }, []);

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
            placeholder="Select tags..."
            maxSelected={10}
            className="min-w-[200px]"
          />
        </div>
        <Button size="sm" onClick={handleSaveTags} className="h-8">
          Save
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleCancelEdit}
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
