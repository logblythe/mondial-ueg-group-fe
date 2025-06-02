"use client";

import ApiClient from "@/api-client/";
import EmptyList from "@/components/EmptyList";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
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
import { GenerateVoucherButton } from "./generate-voucher-button";

const apiClient = new ApiClient();

const GroupMembersList = ({ groupId }: { groupId: string }) => {
  const [hasOpenId, setHasOpenId] = useState(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [isGeneratingVoucher, setIsGeneratingVoucher] = useState(false);
  const [isAutoRedeemChecked, setIsAutoRedeemChecked] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const groupMembersQuery = useQuery({
    queryKey: ["groups", groupId, "members"],
    queryFn: () => apiClient.getGroupMembers(groupId),
  });

  const groupStatusQuery = useQuery({
    queryKey: ["groups", groupId, "status"],
    queryFn: () => apiClient.generateVoucherStatus(groupId),
    refetchInterval: isComplete ? false : 3000,
  });

  useEffect(() => {
    setIsGeneratingVoucher(true);
    setIsComplete(false);
    setRowSelection({});
    setIsAutoRedeemChecked(false);
  }, [groupId]);

  useEffect(() => {
    const members = groupMembersQuery.data || [];
    const anyWithOpenId = members.some((member) => member.openID);
    setHasOpenId(anyWithOpenId);
  }, [groupMembersQuery.data]);

  useEffect(() => {
    if (!groupStatusQuery?.data?.status) return;

    const status = groupStatusQuery.data.status;

    if (
      status.includes("FAILED") ||
      status.includes("COMPLETED") ||
      status.includes("NOT_FOUND")
    ) {
      if (status.includes("FAILED"))
        toast({
          title: "Voucher Generation Failed",
          description: status,
          variant: "destructive",
          duration: 5000,
        });
      setIsComplete(true);
      setIsGeneratingVoucher(false);
    } else {
      setIsComplete(false);
      setIsGeneratingVoucher(true);
    }
  }, [groupStatusQuery?.data?.status]);

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
    onSuccess: () => groupStatusQuery.refetch(),
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
    onSuccess: () => groupStatusQuery.refetch(),
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

  const handleOnGenerate = () => {
    const selectedRows = Object.keys(rowSelection).filter(
      (key) => rowSelection[key]
    );
    const selectedGroupMembers = selectedRows.map((row) => {
      const index = parseInt(row);
      return groupMembersQuery.data![index];
    });
    onSubmit(selectedGroupMembers);
  };

  const disableVoucherGeneration =
    Object.keys(rowSelection).length <= 0 || isGeneratingVoucher;

  return (
    <div className="container mx-auto py-10 space-y-2">
      <div className="flex flex-col md:flex-row  md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <h3 className="text-xl md:text-2xl font-semibold tracking-tight">
            <span>Group Members</span>
          </h3>
          {groupMembersQuery.isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin ml-2" />
          ) : (
            <Button
              size={"sm"}
              variant={"outline"}
              onClick={() => groupMembersQuery.refetch()}
            >
              <span>Refresh</span>
              {groupMembersQuery.isRefetching ? (
                <Loader2 className="w-4 h-4 animate-spin ml-2" />
              ) : null}
            </Button>
          )}
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <GenerateVoucherButton
            onConfirm={handleOnGenerate}
            isGeneratingVoucher={isGeneratingVoucher}
            disableVoucherGeneration={disableVoucherGeneration}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
          />
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={isAutoRedeemChecked}
              disabled={!hasOpenId}
              onCheckedChange={(e) => {
                setIsAutoRedeemChecked(e as boolean);
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
      </div>

      <DataTable
        columns={columns}
        emptyDataMessage={<EmptyList>No group members found</EmptyList>}
        data={groupMembersQuery.data || []}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        enableRowSelection={(row) => {
          const isSelectable =
            !row.original.activationCodeFormatted &&
            row.original.typeForVoucher != null &&
            row.original.remarks.length === 0 &&
            row.original.paymentStatus != "CANCELED" &&
            row.original.paymentStatus != "CANCELED_GROUP_INVENTORY";
          return isSelectable;
        }}
        enableMultiRowSelection
      />
    </div>
  );
};

export default GroupMembersList;
