"use client";

import ApiClient from "@/api-client/";
import { DataTable } from "@/components/data-table";
import { useGroupStore } from "@/store/group-store";
import { GroupType } from "@/type/group-type";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { columns } from "./columns";

const apiClient = new ApiClient();

const GroupList = () => {
  const router = useRouter();

  const { selectedGroupId, selectGroup } = useGroupStore();

  const [rowSelection, setRowSelection] = useState({});
  const [groupName, setGroupName] = useState("");
  const { data = [], isLoading } = useQuery({
    queryKey: ["groups"],
    queryFn: () => apiClient.getGroups(),
  });

  useEffect(() => {
    if (data.length === 0) return;
    const index = data?.findIndex(
      (event) => event.contactId === selectedGroupId
    ) as number;
    setRowSelection({ [index]: true });
  }, [data, selectedGroupId]);

  const handleRowClick = (group: GroupType) => {
    selectGroup(group);
    setGroupName(group.name);
    router.push(`/group-members?groupId=${group.contactId}`);
  };
  console.log("Group Name", groupName);
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
        data={data}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        onRowClick={handleRowClick}
      />
    </div>
  );
};

export default GroupList;
