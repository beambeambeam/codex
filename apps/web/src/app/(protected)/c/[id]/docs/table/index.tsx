"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";

import { documentColumns } from "@/app/(protected)/c/[id]/docs/table/columns";
import { DataTable } from "@/components/data-table";
import { DataTableFilterMenu } from "@/components/data-table/filter-menu";
import { DataTableSkeleton } from "@/components/data-table/skeleton";
import { DataTableToolbar } from "@/components/data-table/toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import { useQueryFetchClient } from "@/lib/api/client";

function DocumentTable() {
  const params = useParams<{ id: string }>();

  const { data, isPending } = useQueryFetchClient.useQuery(
    "get",
    "/api/v1/documents/{collection_id}/table",
    {
      params: {
        path: {
          collection_id: params.id,
        },
      },
    },
  );

  const { table } = useDataTable({
    data: useMemo(() => data?.documents ?? [], [data]),
    columns: documentColumns,
    pageCount: 10,
    getRowId: (row) => row.id,
    enableAdvancedFilter: true,
    manualFiltering: true,
    manualExpanding: false,
    manualGrouping: false,
    manualSorting: true,
    manualPagination: true,
  });

  if (isPending) {
    return (
      <DataTableSkeleton
        columnCount={documentColumns.length}
        rowCount={10}
        filterCount={0}
        withViewOptions={true}
        withPagination={true}
        shrinkZero={false}
      />
    );
  }

  return (
    <DataTable table={table} className="font-sans">
      <DataTableToolbar table={table}>
        <DataTableFilterMenu table={table} />
      </DataTableToolbar>
    </DataTable>
  );
}
export default DocumentTable;
