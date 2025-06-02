"use client";

import { useGroupStore } from "@/store/group-store";
import { GroupType } from "@/type/group-type";
import { ColumnDef } from "@tanstack/react-table";
import { Check } from "lucide-react";

export const columns: ColumnDef<GroupType>[] = [
  {
    id: "select",
    header: "",
    cell: ({ row }) => {
      const group = row.original;
      const { selectedGroupId } = useGroupStore();

      const isSelected = group.contactId === selectedGroupId;

      return isSelected ? (
        <Check className="text-green-600 font-bold w-6 h-6" />
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
