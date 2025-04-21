"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Person } from "@/type/group-type";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Person>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllRowsSelected()}
        onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        disabled={!row.getCanSelect()}
      />
    ),
  },
  {
    accessorKey: "eventsAir.internalNumber",
    header: "Id",
  },
  {
    accessorKey: "eventsAir.firstName",
    header: "First Name",
  },
  {
    accessorKey: "eventsAir.lastName",
    header: "Last Name",
  },
];
