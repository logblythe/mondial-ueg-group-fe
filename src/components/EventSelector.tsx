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
import { useState } from "react";

const apiClient = new ApiClient();

export function GroupSelector() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [loadingGroups, setLoadingGroups] = useState(false);

  const { data } = useQuery({
    queryKey: ["groups"],
    queryFn: () => apiClient.getGroups(),
  });

  const { selectGroup, selectedGroupId } = useGroupStore();

  const handleGroupSelect = (id: string) => {
    const group = data?.find((group) => group.contactId === id);
    if (group) {
      selectGroup(group);
      router.push(`/group-members?groupId=${group.contactId}`);
    }
  };

  return (
    <Select
      onValueChange={handleGroupSelect}
      value={selectedGroupId || undefined}
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
          {data
            ?.slice()
            .sort((a, b) => a.name.localeCompare(b.name))
            ?.map((group) => {
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
