import ApiClient from "@/api-client/";
import { dehydrate } from "@tanstack/query-core";
import { HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { Metadata } from "next";
import GroupList from "./_components/group-list";

const questionsClient = new ApiClient();

export const metadata: Metadata = {
  title: "UEG | Groups",
  description: "View all groups",
};

export default async function GroupsPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["groups"],
    queryFn: () => questionsClient.getGroups(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GroupList />
    </HydrationBoundary>
  );
}
