"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { GroupMember } from "@/type/group-type";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<GroupMember>[] = [
  {
    id: "select",
    header: ({ table }) => {
      const rows = table.getRowModel().rows;
      const selectableRowCount = rows.filter((row) => {
        const data = row.original;
        return (
          !data.activationCodeFormatted &&
          data.typeForVoucher != null &&
          data.paymentStatus !== "CANCELED" &&
          data.paymentStatus !== "CANCELED_GROUP_INVENTORY"
        );
      }).length;

      return (
        <Checkbox
          checked={table.getIsAllRowsSelected()}
          onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
          disabled={selectableRowCount === 0}
        />
      );
    },
    cell: ({ row }) => {
      if (row.getCanSelect()) {
        return (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
          />
        );
      }
      return null;
    },
  },
  {
    accessorKey: "internalNumber",
    header: "Id",
    enableSorting: true,
  },
  {
    accessorKey: "firstName",
    header: "First Name",
    enableSorting: false,
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
    enableSorting: true,
  },
  {
    accessorKey: "activationCodeFormatted",
    header: "Code Formatted",
    enableSorting: false,
  },
  {
    accessorKey: "openID",
    header: "Open Id",
    enableSorting: false,
  },
  {
    accessorKey: "remarks",
    header: "Remarks",
    cell: ({ row }) => {
      const remarks = row.getValue("remarks") as string[];

      return (
        <ul className="flex flex-col">
          {remarks?.map((remark, index) => (
            <li key={index} className="text-sm text-gray-500">
              * {remark}
            </li>
          ))}
        </ul>
      );
    },
  },
];
