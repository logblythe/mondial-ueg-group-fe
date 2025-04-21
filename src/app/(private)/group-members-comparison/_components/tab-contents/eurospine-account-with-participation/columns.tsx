"use client";

import { TooltipWrapper } from "@/components/TooltipWrapper";
import { Checkbox } from "@/components/ui/checkbox";
import { Person } from "@/type/group-type";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { CircleCheck, CircleX } from "lucide-react";

const columnHelper = createColumnHelper<Person>();

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
      />
    ),
  },
  columnHelper.group({
    id: "eventsAir",
    header: () => <span>EventsAir</span>,
    columns: [
      columnHelper.accessor((row) => row.eventsAir?.internalNumber, {
        id: "eventsAir.id",
        cell: (info) => info.getValue(),
        header: () => <span>Id</span>,
      }),
      columnHelper.accessor((row) => row.eventsAir?.firstName, {
        id: "eventsAir.firstName",
        cell: (info) => info.getValue(),
        header: () => <span>First Name</span>,
      }),
      columnHelper.accessor((row) => row.eventsAir?.lastName, {
        id: "eventsAir.lastName",
        cell: (info) => info.getValue(),
        header: () => <span>Last Name</span>,
      }),
      columnHelper.accessor((row) => row.eventsAir?.country, {
        id: "eventsAir.country",
        cell: (info) => info.getValue(),
        header: () => <span>Country</span>,
      }),
    ],
  }),
  columnHelper.group({
    id: "eurospine",
    header: () => <span>Eurospine</span>,
    columns: [
      columnHelper.accessor((row) => row.eurospine?.participation?.mondialId, {
        id: "eurospine.id",
        cell: (info) => info.getValue(),
        header: () => <span>Id</span>,
      }),
      columnHelper.accessor((row) => row.eurospine?.firstName, {
        id: "eurospine.firstName",
        cell: (info) => info.getValue(),
        header: () => <span>First Name</span>,
      }),
      columnHelper.accessor((row) => row.eurospine?.lastName, {
        id: "eurospine.lastName",
        cell: (info) => info.getValue(),
        header: () => <span>Last Name</span>,
      }),
      columnHelper.accessor((row) => row.eurospine?.country, {
        id: "eurospine.country",
        cell: (info) => info.getValue(),
        header: () => <span>Country</span>,
      }),
      columnHelper.accessor((row) => row.eventsAir?.notes, {
        id: "eventsAir.notes",
        cell: (info) => {
          if (info.getValue().length > 0) {
            return (
              <TooltipWrapper content={info.getValue()[0]}>
                <CircleCheck className="text-green-500 w-4 h-4" />
              </TooltipWrapper>
            );
          }
          return <CircleX className="text-red-500 w-4 h-4" />;
        },
        header: () => <span>Synced</span>,
      }),
    ],
  }),
];
