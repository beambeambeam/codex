import { createColumnHelper } from "@tanstack/react-table";
import { Text } from "lucide-react";

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
];
