import ApiClient from "@/api-client/";
import { dehydrate } from "@tanstack/query-core";
import { HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { Metadata } from "next";
import GroupMembersList from "./_components/group-member-list";

const apiClient = new ApiClient();

export const metadata: Metadata = {
  title: "Eurospine | Groups",
  description: "View all groups",
};

export default async function GroupMembersPage({
  searchParams,
}: {
  searchParams: { groupId: string };
}) {
  const queryClient = new QueryClient();

  const { groupId } = searchParams;

  await queryClient.prefetchQuery({
    queryKey: ["groups", groupId, "members"],
    queryFn: () => apiClient.getGroupMembers(groupId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GroupMembersList groupId={groupId} />
    </HydrationBoundary>
  );
}
