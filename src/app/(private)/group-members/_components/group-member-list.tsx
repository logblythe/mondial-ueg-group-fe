"use client";

import ApiClient from "@/api-client/";
import EmptyList from "@/components/EmptyList";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { useGroupStore } from "@/store/group-store";
import { GroupMemberPayload, Voucher } from "@/type/group-member-payload";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { columns } from "./columns";

const apiClient = new ApiClient();

const GroupMembersList = ({
  groupId,
  setLoadingGroups,
}: {
  groupId: string;
  setLoadingGroups: (loading: boolean) => void;
}) => {
  const router = useRouter();
  // const [loadingGroups, setLoadingGroups] = useState<boolean>();
  const { setSelectedGroupMembers, selectedGroupMembers = [] } =
    useGroupStore();
  const [shouldFetch, setShouldFetch] = useState<boolean>();
  const [isComplete, setIsComplete] = useState<boolean>();
  const [isButtonLoading, setIsButtonLoading] = useState<Boolean>(false);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const statusList = ["NOT_FOUND", "FAILED", "COMPLETED"];

  const groupMembersQuery = useQuery({
    queryKey: ["groups", groupId, "members"],
    queryFn: () => apiClient.getGroupMembers(groupId), // no .data
    enabled: Boolean(groupId),
  });

  const {
    data: groupStatusData,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
    status,
  } = useQuery({
    queryKey: ["groups", groupId, "members"],
    queryFn: () => apiClient.generateVoucherStatus(groupId),
    enabled: Boolean(shouldFetch),
    refetchInterval: isComplete ? false : 3000,
  });
  console.log("the data are", groupStatusData?.status);
  useEffect(() => {
    if (groupStatusData?.status === "COMPLETED") {
      setIsComplete(true);
      setIsButtonLoading(false);
    }
  }, [groupStatusData?.status]);

  const { selectedGroup } = useGroupStore();

  // useEffect(() => {
  //   if (selectedGroupMembers.length === 0) return;
  //   const rowSelection: Record<string, boolean> = {};
  //   selectedGroupMembers.forEach((selectedMember) => {
  //     const index = groupMembersQuery.data?.findIndex(
  //       (member) => member.internalNumber === selectedMember.internalNumber
  //     ) as number;
  //     rowSelection[index] = true;
  //   });
  //   setRowSelection(rowSelection);
  // }, [groupMembersQuery.data, selectedGroupMembers]);

  // useEffect(() => {
  //   if (groupId) {
  //     generateVoucherStatus.mutate({ groupId });
  //   }
  // }, [groupId]);

  // const generateVoucherStatus = useMutation({
  //   mutationFn: ({ groupId }: { groupId: string }) =>
  //     apiClient.generateVoucherStatus(groupId),
  //   onSuccess: (data) => {
  //     console.log("Voucher status generated", data.status);
  //   },
  //   onError: (error: any) => {
  //     console.error("Error generating voucher", error);
  //     if (error.response) {
  //       console.error("Response data:", error.response.data);
  //     } else if (error instanceof Error) {
  //       console.error("Error details:", error.message);
  //     }
  //   },
  // });

  // console.log("selected memebers", selectedGroupMembers);
  const toGroupMemberPayload = (): GroupMemberPayload => {
    const groupName = selectedGroup?.name || "Default Group";

    const generateVoucher: Voucher[] = selectedGroupMembers.map((member) => {
      return {
        first_name: member.firstName,
        last_name: member.lastName,
        email: member.primaryEmail,
        contactId: member.id,
        role: "DELEGATE",
        groupName: groupName,
        type: member.typeForVoucher,
        openID: member.OpenId,
      };
    });
    const payload = { vouchers: generateVoucher };
    return payload;
  };

  const voucherGenerateMutation = useMutation({
    mutationFn: ({
      groupId,
      payload,
    }: {
      groupId: string;
      payload: GroupMemberPayload;
    }) => apiClient.generateVoucher(groupId, payload),
    onSuccess: (data) => {
      console.log("Voucher generated successfully");
    },
    onError: (error: any) => {
      console.error("Error generating voucher", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error instanceof Error) {
        console.error("Error details:", error.message);
      }
    },
  });

  const onSubmit = (groupId: string) => {
    const payload = toGroupMemberPayload();
    console.log("Submitting payload", payload);
    voucherGenerateMutation.mutate({ groupId, payload });
    // generateVoucherStatus.mutate({ groupId });
  };

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
            setShouldFetch(true);
            setIsButtonLoading(true);
            onSubmit(groupId);
          }}
        >
          {/* Generate Voucher */}
          {isButtonLoading ? (
            <Loader className="w-4 h-4 animate-spin mr-2" />
          ) : null}
          {isButtonLoading ? "Generating..." : "Generate Voucher"}
        </Button>
      </div>
    </div>
  );
};

export default GroupMembersList;
