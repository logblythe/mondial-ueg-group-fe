"use client";

import ApiClient from "@/api-client/";
import { DataTable } from "@/components/data-table";
import EmptyList from "@/components/EmptyList";
import { Button } from "@/components/ui/button";
import { useGroupStore } from "@/store/group-store";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { columns } from "./columns";

const apiClient = new ApiClient();

const GroupMembersList = ({ groupId }: { groupId: string }) => {
  const router = useRouter();

  const { setSelectedGroupMembers, selectedGroupMembers = [] } =
    useGroupStore();

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const groupMembersQuery = useQuery({
    queryKey: ["groups", groupId, "members"],
    queryFn: () => apiClient.getGroupMembers(groupId),
    enabled: Boolean(groupId),
  });

  useEffect(() => {
    if (selectedGroupMembers.length === 0) return;
    const rowSelection: Record<string, boolean> = {};
    selectedGroupMembers.forEach((selectedMember) => {
      const index = groupMembersQuery.data?.findIndex(
        (member) => member.internalNumber === selectedMember.internalNumber
      ) as number;
      rowSelection[index] = true;
    });
    setRowSelection(rowSelection);
  }, [groupMembersQuery.data, selectedGroupMembers]);

  return (
    <div className="container mx-auto py-10 space-y-2">
      <div className="flex flex-row  justify-between items-end">
        <div className="flex flex-row space-x-4 items-center">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            <span>Group Members</span>
          </h3>
          {groupMembersQuery.isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : null}
        </div>
      </div>
      <DataTable
        columns={columns}
        emptyDataMessage={<EmptyList>No group members found</EmptyList>}
        data={groupMembersQuery.data || []}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        enableRowSelection={(row) => {
          return Boolean(row.original.primaryEmail);
        }}
        enableMultiRowSelection
      />
      <div className="flex flex-row justify-end">
        <Button
          className="px-8"
          disabled={Object.keys(rowSelection).length <= 0}
          onClick={() => {
            const selectedRows = Object.keys(rowSelection).filter(
              (key) => rowSelection[key]
            );
            const selectedGroupMembers = selectedRows.map((row) => {
              const index = parseInt(row);
              return groupMembersQuery.data![index];
            });
            setSelectedGroupMembers(selectedGroupMembers);
            router.push(
              `/group-members-comparison?groupId=${groupId}&tab=no_eurospine_account`
            );
          }}
        >
          Proceed
        </Button>
      </div>
    </div>
  );
};

export default GroupMembersList;
