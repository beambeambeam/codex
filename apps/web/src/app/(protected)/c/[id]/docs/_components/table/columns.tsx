import { createColumnHelper, Row } from "@tanstack/react-table";
import { Tag, Text } from "lucide-react";

import DocumentAcions from "@/app/(protected)/c/[id]/docs/_components/table/actions";
import { DataTableColumnHeader } from "@/components/data-table/header";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Pill, PillAvatar } from "@/components/ui/pill";
import { RelativeTimeCard } from "@/components/ui/relative-time-card";
import { components } from "@/lib/api/path";
import { mimeTypeToName } from "@/lib/utils";

export type DocumentsType = components["schemas"]["DocumentResponse"];

const columnHelper = createColumnHelper<DocumentsType>();

export const documentColumns = [
  columnHelper.accessor("file.name", {
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="File Name" />;
    },
    cell: (info) => decodeURIComponent(info.getValue() ?? ""),
    meta: {
      label: "File Name",
      placeholder: "Search file names...",
      variant: "text",
      icon: Text,
    },
    enableColumnFilter: true,
  }),
  columnHelper.accessor("title", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: (info) =>
      info.getValue() ?? (
        <p className="text-muted-foreground">Untitled Title</p>
      ),
    meta: {
      label: "Title",
      placeholder: "Filter by title...",
      variant: "text",
      icon: Text,
    },
    enableColumnFilter: true,
  }),
  columnHelper.accessor("description", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: (info) =>
      info.getValue() ?? (
        <p className="text-muted-foreground">No description provided</p>
      ),
    meta: {
      label: "Description",
      placeholder: "Filter by description...",
      variant: "text",
      icon: Text,
    },
    enableColumnFilter: true,
  }),
  columnHelper.accessor("tags", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tags" />
    ),
    cell: (info) => {
      const tags = info.getValue();
      if (!tags || tags.length === 0) {
        return <p className="text-muted-foreground">No tags</p>;
      }

      const displayTags = tags.slice(0, 2);
      const remainingCount = tags.length - 2;

      return (
        <div className="flex items-center gap-1">
          {displayTags.map((tag) => (
            <div
              key={tag.id}
              className="relative inline-flex h-7 w-fit cursor-default items-center rounded-md border px-2 text-xs font-medium transition-all"
              style={{
                backgroundColor: `${tag.color}20`,
                color: tag.color,
              }}
            >
              <span className="capitalize">{tag.title}</span>
            </div>
          ))}
          {remainingCount > 0 && (
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="bg-secondary text-secondary-foreground hover:bg-secondary/80 relative inline-flex h-7 w-fit cursor-pointer items-center rounded-md border px-2 text-xs font-medium transition-all">
                  +{remainingCount}
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-auto p-2">
                <div className="flex flex-wrap gap-1">
                  {tags.slice(2).map((tag) => (
                    <div
                      key={tag.id}
                      className="relative inline-flex h-7 w-fit cursor-default items-center rounded-md border px-2 text-xs font-medium transition-all"
                      style={{
                        backgroundColor: `${tag.color}20`,
                        color: tag.color,
                      }}
                    >
                      <span className="capitalize">{tag.title}</span>
                    </div>
                  ))}
                </div>
              </HoverCardContent>
            </HoverCard>
          )}
        </div>
      );
    },
    meta: {
      label: "Tags",
      placeholder: "Filter by tags...",
      variant: "text",
      icon: Tag,
    },
    enableColumnFilter: true,
  }),
  columnHelper.accessor("file.upload_by", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Uploaded By" />
    ),
    cell: (info) =>
      info.getValue() ? (
        <Pill>
          <PillAvatar
            fallback={info.row.original.user?.display[0]}
            src=""
            className="border"
          />
          {info.row.original.user?.display}
        </Pill>
      ) : (
        <p className="text-muted-foreground">Unknown</p>
      ),
    meta: {
      label: "Uploaded By",
      placeholder: "Search uploader...",
      variant: "text",
      icon: Text,
    },
    enableColumnFilter: true,
  }),
  columnHelper.accessor("file.type", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="File Type" />
    ),
    cell: (info) =>
      mimeTypeToName(
        info.getValue() ?? <p className="text-muted-foreground">Unknown</p>,
      ),
    meta: {
      label: "File Type",
      placeholder: "Search file types...",
      variant: "text",
      icon: Text,
    },
    enableColumnFilter: true,
  }),
  columnHelper.accessor("file.upload_at", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Uploaded At" />
    ),
    cell: (info) => <RelativeTimeCard date={info.getValue() ?? ""} />,
    meta: {
      label: "Uploaded At",
      placeholder: "Search upload dates...",
      variant: "text",
      icon: Text,
    },
    enableColumnFilter: true,
  }),
  columnHelper.display({
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }: { row: Row<DocumentsType> }) => (
      <DocumentAcions row={row} />
    ),
    meta: { label: "Actions" },
    enableColumnFilter: false,
    enableSorting: false,
  }),
];
