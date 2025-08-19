import { createColumnHelper, Row } from "@tanstack/react-table";
import { Text } from "lucide-react";

import DocumentAcions from "@/app/(protected)/c/[id]/docs/_components/table/actions";
import { DataTableColumnHeader } from "@/components/data-table/header";
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
