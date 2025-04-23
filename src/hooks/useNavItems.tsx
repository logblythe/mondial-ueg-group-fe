import React from "react";

import { useGroupStore } from "@/store/group-store";
import { CalendarCheck2, LandPlot } from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const useNavItems = () => {
  const { selectedGroupId } = useGroupStore();

  const defaultNavItems: NavItem[] = [
    {
      label: "Groups",
      href: "/groups",
      icon: <CalendarCheck2 className="w-6 h-6" />,
    },
    {
      label: "Members",
      href: selectedGroupId
        ? `/group-members?groupId=${selectedGroupId}`
        : `/group-members`,
      icon: <LandPlot className="w-6 h-6" />,
    },
  ];

  return defaultNavItems;
};

export default useNavItems;
