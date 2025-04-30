"use client";

import ApiClient from "@/api-client/";
import EmptyList from "@/components/EmptyList";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useGroupStore } from "@/store/group-store";
import {
  AutoRedeemVoucher,
  GroupAutoRedeemPayload,
} from "@/type/group-member-payload";
import { GroupMember } from "@/type/group-type";
import {
  GroupVoucherGenerationPayload,
  Voucher,
} from "@/type/voucher-generation-payload";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { columns } from "./columns";

const apiClient = new ApiClient();

const GroupMembersList = ({ groupId }: { groupId: string }) => {
  const [hasOpenId, setHasOpenId] = useState(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isAutoRedeemChecked, setIsAutoREdeemChecked] = useState(false);

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

  useEffect(() => {
    const members = groupMembersQuery.data || [];
    const anyWithOpenId = members.some((member) => member.openID);
    setHasOpenId(anyWithOpenId);
  }, [groupMembersQuery.data]);

  useEffect(() => {
    if (
      groupStatusData?.status === "COMPLETED" ||
      groupStatusData?.status === "NOT_FOUND" ||
      groupStatusData?.status === "FAILED" ||
      groupStatusData?.status.includes("FAILED")
    ) {
      setIsComplete(true);
      setIsButtonLoading(false);
      groupMembersQuery.refetch();
    } else if (isLoading || isFetching) {
      setIsButtonLoading(true);
    } else {
      setIsButtonLoading(false);
    }
  }, [isLoading, isFetching, groupStatusData]);

  const { selectedGroup } = useGroupStore();

  const createVoucherGenerationPayload = (
    groupMembers: GroupMember[]
  ): GroupVoucherGenerationPayload => {
    const groupName = selectedGroup?.name || "Default Group";

    const generateVoucher: Voucher[] = groupMembers.map((member) => {
      return {
        first_name: member.firstName,
        last_name: member.lastName,
        email: member.primaryEmail,
        contactId: member.id,
        role: "DELEGATE",
        groupName: groupName,
        type: member.typeForVoucher,
      };
    });
    const payload = { vouchers: generateVoucher };
    return payload;
  };

  const createAutoRedeemPayload = (
    groupMembers: GroupMember[]
  ): GroupAutoRedeemPayload => {
    if (!selectedGroup) {
      return { vouchers: [] };
    }
    const groupName = selectedGroup.name;
    const generateAutoRedeem: AutoRedeemVoucher[] = groupMembers.map(
      (member) => {
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
      }
    );
    const payload = { vouchers: generateAutoRedeem };
    return payload;
  };

  const voucherGenerateMutation = useMutation({
    mutationFn: ({
      groupId,
      payload,
    }: {
      groupId: string;
      payload: GroupVoucherGenerationPayload;
    }) => apiClient.generateVoucher(groupId, payload),
    onSuccess: (data) => {
      refetchVoucherStatus();
    },
    onError: (error: any) => {
      console.error("Error generating voucher", error);
      if (error.response) {
        console.error("Response data:", error.response);
      } else if (error instanceof Error) {
        console.error("Error details:", error.message);
      }
    },
  });

  const autoRedeemGenerateMutation = useMutation({
    mutationFn: ({
      groupId,
      payload,
    }: {
      groupId: string;
      payload: GroupAutoRedeemPayload;
    }) => apiClient.generateAutoReedem(groupId, payload),
    onSuccess: (data) => {
      refetchVoucherStatus();
    },
    onError: (error: any) => {
      console.error("Error generating voucher", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
      } else if (error instanceof Error) {
        console.error("Error details:", error.message);
      }
    },
  });

  const onSubmit = (groupMembers: GroupMember[]) => {
    setIsButtonLoading(true);
    setIsComplete(false);
    if (isAutoRedeemChecked) {
      const autoRedeemPayload = createAutoRedeemPayload(groupMembers);
      if (autoRedeemPayload.vouchers.length > 0) {
        autoRedeemGenerateMutation.mutate({
          groupId,
          payload: autoRedeemPayload,
        });
      }
    } else {
      const voucherPayload = createVoucherGenerationPayload(groupMembers);
      if (voucherPayload.vouchers.length > 0) {
        voucherGenerateMutation.mutate({ groupId, payload: voucherPayload });
      }
    }
  };

  const handleOnClick = () => {
    const selectedRows = Object.keys(rowSelection).filter(
      (key) => rowSelection[key]
    );
    const selectedGroupMembers = selectedRows.map((row) => {
      const index = parseInt(row);
      return groupMembersQuery.data![index];
    });
    onSubmit(selectedGroupMembers);
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
      <div className="flex flex-row justify-end pt-4">
        <Button
          className="px-8"
          disabled={Object.keys(rowSelection).length <= 0 || isButtonLoading}
          onClick={handleOnClick}
        >
          {isButtonLoading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : null}
          Generate Voucher
        </Button>
      </div>

      <div className="flex flex-row justify-end gap-2 items-center pt-2">
        <Checkbox
          disabled={!hasOpenId}
          onCheckedChange={(e) => {
            setIsAutoREdeemChecked(e as boolean);
          }}
        />
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
