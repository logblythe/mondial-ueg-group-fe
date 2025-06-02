"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { useGroupStore } from "@/store/group-store";
import { GroupType } from "@/type/group-type";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<GroupType>[] = [
  {
    id: "select",
    cell: ({ row }) => {
      const group = row.original;

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { selectedGroupId } = useGroupStore();

      const isSelected = group.contactId === selectedGroupId;

      return isSelected ? (
        <Checkbox checked={true} aria-label="Select row" />
      ) : null;
    },
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
