import { createColumnHelper, Row } from "@tanstack/react-table";
import { Text } from "lucide-react";

import DocumentAcions from "@/app/(protected)/c/[id]/docs/table/actions";
import { DataTableColumnHeader } from "@/components/data-table/header";
import { components } from "@/lib/api/path";

export type DocumentsType = components["schemas"]["DocumentResponse"];

const columnHelper = createColumnHelper<DocumentsType>();

export const documentColumns = [
  columnHelper.accessor("id", {
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
    cell: (info) => info.getValue() ?? "",
    meta: {
      label: "Title",
      placeholder: "Search titles...",
      variant: "text",
      icon: Text,
    },
    enableColumnFilter: true,
  }),
  columnHelper.accessor("description", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: (info) => info.getValue() ?? "",
    meta: {
      label: "Description",
      placeholder: "Search descriptions...",
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
