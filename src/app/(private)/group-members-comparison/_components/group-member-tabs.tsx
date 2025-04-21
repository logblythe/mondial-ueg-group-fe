"use client";

import ApiClient, { SyncGroupPayload } from "@/api-client/";
import { categorizeData } from "@/app/(private)/group-members-comparison/categorize-data";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGroupStore } from "@/store/group-store";
import { GroupCategory } from "@/type/group-category";
import { Person } from "@/type/group-type";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2, RefreshCcw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { EurospineAccountWithParticipation } from "./tab-contents/eurospine-account-with-participation";
import { EurospineAccountWithoutParticipation } from "./tab-contents/eurospine-account-without-participation";
import { NoEurospineAccountView } from "./tab-contents/no-eurospine-account";

const apiClient = new ApiClient();

const GroupMemberTabs = ({ groupId }: { groupId: string }) => {
  const router = useRouter();

  const { selectedGroupMembers = [], selectedGroup } = useGroupStore();

  const selectedEmails = selectedGroupMembers.map(
    (member) => member.primaryEmail
  );

  const searchParams = useSearchParams();

  const activeTab = searchParams.get("tab") ?? "no_eurospine_account";

  const [data, setData] = useState<{
    noEurospineAccount: Person[];
    eurospineAccountWithoutParticipation: Person[];
    eurospineAccountWithParticipation: Person[];
  }>({
    noEurospineAccount: [],
    eurospineAccountWithoutParticipation: [],
    eurospineAccountWithParticipation: [],
  });

  const groupMembersQuery = useQuery({
    queryKey: ["groups", groupId, "members"],
    queryFn: () => apiClient.getGroupMembers(groupId),
  });

  const participationQuery = useQuery({
    queryKey: ["groups", groupId, selectedGroupMembers, "participation"],
    queryFn: () => apiClient.getGroupCustomer(selectedEmails),
    enabled: selectedGroupMembers.length > 0,
  });

  const syncGroupMutation = useMutation({
    mutationFn: (data: { payload: SyncGroupPayload }) =>
      apiClient.syncGroupMembers(selectedGroup!.contactId, data.payload),
  });

  useEffect(() => {
    if (participationQuery.isSuccess && groupMembersQuery.isSuccess) {
      const customers = participationQuery.data ?? [];
      const categorizedData = categorizeData({
        customers,
        selectedGroupMembers,
      });
      setData(categorizedData);
    }
  }, [
    groupMembersQuery.data,
    groupMembersQuery.isSuccess,
    participationQuery.data,
    participationQuery.isSuccess,
    selectedGroupMembers,
  ]);

  const handleTabValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleSync = (rowSelection: Record<string, boolean>) => {
    const selectedRows = Object.keys(rowSelection).filter(
      (key) => rowSelection[key]
    );

    if (selectedRows.length <= 0) {
      return;
    }

    let groupCategory: GroupCategory;
    let contactIds: string[];

    switch (activeTab) {
      case "no_eurospine_account":
        groupCategory = "GroupCatA";
        contactIds = data.noEurospineAccount
          .filter((_, index) => selectedRows.includes(index.toString()))
          .map((item) => item.eventsAir!.id);
        break;
      case "eurospine_account_without_participation":
        groupCategory = "GroupCatB";
        contactIds = data.eurospineAccountWithoutParticipation
          .filter((_, index) => selectedRows.includes(index.toString()))
          .map((item) => item.eventsAir!.id);
        break;
      case "eurospine_account_with_participation":
        groupCategory = "GroupCatC";
        contactIds = data.eurospineAccountWithParticipation
          .filter((_, index) => selectedRows.includes(index.toString()))
          .map((item) => item.eventsAir!.id);
        break;
      default:
        groupCategory = "GroupCatA";
        contactIds = data.noEurospineAccount
          .filter((_, index) => selectedRows.includes(index.toString()))
          .map((item) => item.eventsAir!.id);
        break;
    }

    syncGroupMutation.mutate({
      payload: {
        groupCategory,
        contactIds,
      },
    });
  };

  return (
    <div className="container mx-auto py-10 space-y-2">
      <div className="flex flex-row  justify-between items-end">
        <div className="flex flex-row space-x-4 items-center">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            <span>Group Member Comparison</span>
          </h3>
          {participationQuery.isLoading ||
          groupMembersQuery.isLoading ||
          participationQuery.isFetching ||
          groupMembersQuery.isFetching ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Button
              size={"sm"}
              variant={"outline"}
              className="h-8 rounded-xl"
              onClick={() => {
                groupMembersQuery.refetch();
                participationQuery.refetch();
              }}
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          )}
        </div>
      </div>
      <Tabs value={activeTab} onValueChange={handleTabValueChange}>
        <TabsList>
          <TabsTrigger value="no_eurospine_account">
            No Eurospine Account
          </TabsTrigger>
          <TabsTrigger value="eurospine_account_without_participation">
            Eurospine Account Without Participation
          </TabsTrigger>
          <TabsTrigger value="eurospine_account_with_participation">
            Eurospine Account With Participation
          </TabsTrigger>
        </TabsList>
        <TabsContent value="no_eurospine_account">
          <NoEurospineAccountView
            onSubmit={handleSync}
            data={data.noEurospineAccount}
            isSyncing={syncGroupMutation.isPending}
          />
        </TabsContent>
        <TabsContent value="eurospine_account_without_participation">
          <EurospineAccountWithoutParticipation
            onSubmit={handleSync}
            data={data.eurospineAccountWithoutParticipation}
            isSyncing={syncGroupMutation.isPending}
          />
        </TabsContent>
        <TabsContent value="eurospine_account_with_participation">
          <EurospineAccountWithParticipation
            onSubmit={handleSync}
            data={data.eurospineAccountWithParticipation}
            isSyncing={syncGroupMutation.isPending}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GroupMemberTabs;
