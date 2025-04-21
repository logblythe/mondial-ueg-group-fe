import ApiClient from "@/api-client";
import EmptyList from "@/components/EmptyList";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGroupStore } from "@/store/group-store";
import { Person } from "@/type/group-type";
import { useQuery } from "@tanstack/react-query";
import { flexRender, useReactTable } from "@tanstack/react-table";
import { getCoreRowModel } from "@tanstack/table-core";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { columns } from "./columns";

const apiClient = new ApiClient();

type Props = {
  onSubmit: (rowSelection: Record<string, boolean>) => void;
  data: Person[];
  isSyncing?: boolean;
};

export const EurospineAccountWithoutParticipation = (props: Props) => {
  const { onSubmit, data = [], isSyncing } = props;

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const { selectedGroupId } = useGroupStore();

  const groupSyncQuery = useQuery({
    queryKey: ["groups", selectedGroupId, "status"],
    queryFn: () => apiClient.getSyncStatus(selectedGroupId!),
    enabled: !!selectedGroupId,
    refetchInterval: (data) => {
      // const syncStatus = data?.state.data?.GroupCatA;
      // if (syncStatus === "COMPLETED" || syncStatus === "FAILED") {
      //   return false; // stop polling if completed or failed
      // }
      return 3000;
    },
  });

  const status = groupSyncQuery?.data?.GroupCatB;

  const isInProgress = status === "IN_PROGRESS";

  const handleClick = () => onSubmit(rowSelection);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
  });

  return (
    <div className="flex flex-col space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.original.eventsAir?.internalNumber}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
                  <EmptyList>No group member found</EmptyList>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-row justify-end w-full px-2">
        <Button disabled={isInProgress || isSyncing} onClick={handleClick}>
          {isInProgress || isSyncing ? (
            <Loader2 className="w-4 h-4 animate-spin mr-4" />
          ) : null}
          Sync
        </Button>
      </div>
    </div>
  );
};
