import { Checkbox } from "@/components/ui/checkbox";
import { Person } from "@/type/group-type";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";

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
        id: "eventsAir.internalNumber",
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
      columnHelper.accessor((row) => row.eurospine?.openId, {
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
    ],
  }),
];
