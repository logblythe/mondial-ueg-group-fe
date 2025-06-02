"use client";

import ApiClient from "@/api-client/";
import { DataTable } from "@/components/data-table";
import { UseGroupStore } from "@/store/group-store";
import { GroupType } from "@/type/group-type";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { columns } from "./columns";

const apiClient = new ApiClient();

const GroupList = () => {
  const router = useRouter();

  const { selectedGroupId, selectGroup } = UseGroupStore();

  const [rowSelection, setRowSelection] = useState({});
  const [groupName, setGroupName] = useState("");

  const { data = [], isLoading } = useQuery({
    queryKey: ["groups"],
    queryFn: async () => {
      const groups = await apiClient.getGroups();

      return groups;
    },
  });

  const handleRowClick = (group: GroupType) => {
    selectGroup(group);
    setGroupName(group.name);
    router.push(`/group-members?groupId=${group.contactId}`);
  };

  return (
    <div className="container mx-auto py-10 space-y-2">
      <div className="flex flex-row  justify-between items-end">
        <div className="flex flex-row space-x-4 items-center">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            <span>All Groups</span>
          </h3>
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        </div>
      </div>
      <DataTable
        columns={columns}
        data={data?.sort((a, b) => a.name.localeCompare(b.name))}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        onRowClick={handleRowClick}
      />
    </div>
  );
};

export default GroupList;
