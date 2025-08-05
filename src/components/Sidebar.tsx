"use client";

import ApiClient from "@/api-client";
import useNavItems from "@/hooks/useNavItems";
import { useUser } from "@/hooks/useUser";
import { useGroupStore } from "@/store/group-store";
import { useQuery } from "@tanstack/react-query";
import classNames from "clsx";
import { ChevronLeftCircleIcon, ChevronRightCircleIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavItem, defaultNavItems } from "./defaultNavItems";
import { Progress } from "./ui/progress";

const apiClient = new ApiClient();

type Props = {
  collapsed: boolean;
  navItems?: NavItem[];
  setCollapsed(collapsed: boolean): void;
  shown: boolean;
};

const Sidebar = ({
  collapsed,
  navItems = defaultNavItems,
  shown,
  setCollapsed,
}: Props) => {
  const pathname = usePathname();
  const navigations = useNavItems();

  const { removeUser, user } = useUser();

  const { clearSelectedGroup } = useGroupStore();

  const Icon = collapsed ? ChevronRightCircleIcon : ChevronLeftCircleIcon;

  const groupStatusQuery = useQuery({
    queryKey: ["groups", "status"],
    queryFn: async () => {
      const groupStatus = await apiClient.getGroupVoucherGenerationStatus();
      return groupStatus;
    },
    refetchInterval: 5000,
  });

  const isLoading = groupStatusQuery.isLoading;

  const groupStatus = groupStatusQuery.data;

  const isGroupStatusComplete = () => {
    if (!groupStatus) return true;
    return Object.values(groupStatus).every(
      (status) => status !== "IN_PROGRESS"
    );
  };

  return (
    <div
      className={classNames({
        "bg-indigo-700 text-zinc-50 fixed md:static md:translate-x-0 z-20":
          true,
        "transition-all duration-300 ease-in-out": true,
        "w-[300px]": !collapsed,
        "w-16": collapsed,
        "-translate-x-full": !shown,
      })}
    >
      <div
        className={classNames({
          "flex flex-col justify-between h-screen md:h-full sticky inset-0":
            true,
        })}
      >
        <div
          className={classNames({
            "flex items-center border-b border-b-indigo-800 transition-none":
              true,
            "p-4 justify-between": !collapsed,
            "py-4 justify-center": collapsed,
          })}
        >
          {!collapsed && (
            <img
              src={
                "https://demo-test-sp.s3.amazonaws.com/event-rules/img/bw.png"
              }
              height={40}
              width={64}
              alt="logo image"
              className="rounded-full"
            />
          )}
          <button
            className="grid place-content-center hover:bg-indigo-800 w-10 h-10 rounded-full opacity-0 md:opacity-100"
            onClick={() => setCollapsed(!collapsed)}
          >
            <Icon className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-grow">
          <ul
            className={classNames({
              "my-4 flex flex-col gap-2 items-stretch": true,
            })}
          >
            {navigations.map((item, index) => {
              return (
                <li
                  key={index}
                  className={classNames({
                    "text-indigo-100 hover:bg-indigo-900 flex": true,
                    "transition-colors duration-300": true,
                    "rounded-md p-2 mx-3 gap-4 ": !collapsed,
                    "rounded-full p-2 mx-3 w-10 h-10": collapsed,
                    "bg-indigo-900": item.href.split("?")[0] === pathname,
                  })}
                >
                  <Link href={item.href} className="flex gap-4">
                    {item.icon} <span>{!collapsed && item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        {isLoading || !isGroupStatusComplete() ? (
          <Progress value={30} className="h-2" />
        ) : null}
        <div
          className={classNames({
            "grid place-content-stretch p-4 ": true,
          })}
        >
          <div className="flex gap-4 items-center h-11 overflow-hidden">
            <img
              src={"/Mondial-Globule-PNG.png"}
              height={36}
              width={36}
              alt="profile image"
              className="rounded-full"
            />

            {!collapsed && (
              <div className="flex flex-col ">
                <span className="text-indigo-50 my-0">Mondial Admin</span>
                <Link
                  href="/"
                  className="text-indigo-200 text-sm"
                  onClick={() => {
                    clearSelectedGroup();
                    removeUser();
                  }}
                >
                  Sign out
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Sidebar;
