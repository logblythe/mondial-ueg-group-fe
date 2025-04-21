"use client";

import ApiClient from "@/api-client/";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGroupStore } from "@/store/group-store";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const apiClient = new ApiClient();

export function GroupSelector() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const { data } = useQuery({
    queryKey: ["groups"],
    queryFn: () => apiClient.getGroups(),
  });

  const { selectGroup, selectedGroupId } = useGroupStore();

  return (
    <Select
      onValueChange={(id) => {
        const group = data?.find((group) => group.contactId === id);
        if (group) {
          selectGroup(group);
          const params = new URLSearchParams(searchParams);
          params.set("groupId", group.contactId); // Replace eventId
          router.push(`${pathname}?${params.toString()}`);
        }
      }}
      value={selectedGroupId}
      //TODO: conditionally disable the select if the pathname is
      // disabled={RULES_DETAILS_ROUTE_REGEX.test(pathname)}
    >
      <SelectTrigger
        id="select-event-trigger"
        className="min-w-[180px] max-w-[460px]"
      >
        <SelectValue placeholder="Select a group" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Events</SelectLabel>
          {data?.map((group) => {
            return (
              <SelectItem key={group.contactId} value={group.contactId}>
                {group.name}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
