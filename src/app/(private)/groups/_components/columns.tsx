"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { GroupType } from "@/type/group-type";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<GroupType>[] = [
  {
    id: "select",
    cell: ({ row }) =>
      row.getIsSelected() ? (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ) : null,
  },
  {
    accessorKey: "contactId",
    header: "Id",
  },
  {
    accessorKey: "name",
    header: "Group Name",
  },
];
