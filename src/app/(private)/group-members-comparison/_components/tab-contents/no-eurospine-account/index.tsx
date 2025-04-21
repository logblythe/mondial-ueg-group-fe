import ApiClient from "@/api-client";
import { DataTable } from "@/components/data-table";
import EmptyList from "@/components/EmptyList";
import { Button } from "@/components/ui/button";
import { useGroupStore } from "@/store/group-store";
import { Person } from "@/type/group-type";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { columns } from "./columns";

type Props = {
  data: Person[];
  onSubmit: (rowSelection: Record<string, boolean>) => void;
  isSyncing?: boolean;
};

const apiClient = new ApiClient();

export const NoEurospineAccountView = (props: Props) => {
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

  const status = groupSyncQuery?.data?.GroupCatA;

  const isInProgress = status === "IN_PROGRESS";

  const handleClick = () => onSubmit(rowSelection);

  return (
    <div className="flex flex-col space-y-4">
      <DataTable
        columns={columns}
        data={data}
        emptyDataMessage={<EmptyList>No group member found</EmptyList>}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        enableRowSelection={(row) => {
          return Boolean(row.original.eventsAir?.primaryEmail);
        }}
        enableMultiRowSelection
      />
      <div className="flex flex-row justify-end w-full px-2">
        <Button disabled={isInProgress || isSyncing} onClick={handleClick}>
          {isInProgress || isSyncing ? (
            <Loader2 className="w-4 h-4 animate-spin mr-4" />
          ) : null}
          Create Account
        </Button>
      </div>
    </div>
  );
};
