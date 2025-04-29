"use client";

import ApiClient from "@/api-client/";
import EmptyList from "@/components/EmptyList";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useGroupStore } from "@/store/group-store";
import { GroupMemberPayload, Voucher } from "@/type/group-member-payload";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { columns } from "./columns";

const apiClient = new ApiClient();

const GroupMembersList = ({ groupId }: { groupId: string }) => {
  const router = useRouter();
  const [hasOpenId, setHasOpenId] = useState(false);
  const { setSelectedGroupMembers, selectedGroupMembers = [] } =
    useGroupStore();
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [shouldAutoRedeem, setShouldAutoRedeem] = useState(false);

  const groupMembersQuery = useQuery({
    queryKey: ["groups", groupId, "members"],
    queryFn: () => apiClient.getGroupMembers(groupId),
    enabled: Boolean(groupId),
  });

  const {
    data: groupStatusData,
    isLoading,
    isFetching,
    refetch: refetchVoucherStatus,
  } = useQuery({
    queryKey: ["groups", groupId, "status"],
    queryFn: () => apiClient.generateVoucherStatus(groupId),
    refetchInterval: isComplete ? false : 3000,
    enabled: Boolean(groupId),
  });
  console.log("the data are", groupStatusData?.status);

  useEffect(() => {
    const members = groupMembersQuery.data || [];
    console.log("the group members are", members);
    const anyWithOpenId = members.some((member) => member.openID);
    console.log("check openid", anyWithOpenId);
    setHasOpenId(anyWithOpenId);
  }, [groupMembersQuery.data]);

  // const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setShouldAutoRedeem(event.target.checked);
  //   if (selectedGroup) {
  //     if (hasOpenId) {
  //       selectedGroup.forEach((id) => {
  //         if (!intervalsRef.current[id]) {
  //           intervalsRef.current[id] = setInterval(() => {
  //             fetchAutoreedemStatus(id);
  //           }, 10000);
  //         }
  //       });
  //     }
  //   }
  // };

  const handleAutoRedeem = () => {
    const OpenID = selectedGroupMembers.some((member) => member.openID);

    setHasOpenId(OpenID);
  };
  console.log("has openId", hasOpenId);
  console.log("the selected members are", rowSelection);
  useEffect(() => {
    if (
      groupStatusData?.status === "COMPLETED" ||
      groupStatusData?.status === "NOT_FOUND" ||
      groupStatusData?.status === "FAILED"
    ) {
      setIsComplete(true);
      setIsButtonLoading(false);
      groupMembersQuery.refetch();
    }
    if (isLoading || isFetching) {
      setIsButtonLoading(true);
    }
  }, [groupStatusData?.status]);

  const { selectedGroup } = useGroupStore();

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
        openID: member.openID,
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
      setIsComplete(false);
      refetchVoucherStatus();
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
    setIsButtonLoading(true);
    const payload = toGroupMemberPayload();
    setIsComplete(false);
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
          disabled={Object.keys(rowSelection).length <= 0 || isButtonLoading}
          onClick={() => {
            const selectedRows = Object.keys(rowSelection).filter(
              (key) => rowSelection[key]
            );
            const selectedGroupMembers = selectedRows.map((row) => {
              const index = parseInt(row);
              return groupMembersQuery.data![index];
            });
            setSelectedGroupMembers(selectedGroupMembers);
            onSubmit(groupId);
          }}
        >
          {/* Generate Voucher */}
          {isButtonLoading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : null}
          Generate Voucher
        </Button>
      </div>

      <div className="flex flex-row justify-end">
        <Checkbox disabled={!hasOpenId} />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Auto-redeem the generated voucher?
        </label>
      </div>
    </div>
  );
};

export default GroupMembersList;
