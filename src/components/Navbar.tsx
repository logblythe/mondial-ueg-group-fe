"use client";

import ApiClient from "@/api-client";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import classNames from "clsx";
import { RefreshCcw } from "lucide-react";
import dynamic from "next/dynamic";
import { GroupSelector } from "./EventSelector";

const ExceptionLogSheet = dynamic(() => import("./exception-logs-sheet"), {
  ssr: false,
});

type Props = {
  onMenuButtonClick(): void;
};

const apiClient = new ApiClient();

const Navbar = (props: Props) => {
  const queryClient = useQueryClient();
  const refreshCache = useMutation({
    mutationFn: () => apiClient.getRefreshCache(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
  const isLoading = refreshCache.isPending;

  function onSubmit() {
    refreshCache.mutate();
  }

  return (
    <nav
      className={classNames({
        "bg-white text-zinc-500": true,
        "flex items-center": true,
        "w-screen md:w-full sticky z-10 px-8 shadow-sm h-[73px] top-0 ": true,
      })}
    >
      <p className="font-bold text-xs md:text-sm">Group Portal</p>
      <div className="flex-grow"></div>

      <GroupSelector />

      <ExceptionLogSheet />

      <Button
        variant="outline"
        size="icon"
        onClick={onSubmit}
        className="ml-4 "
      >
        <RefreshCcw
          className={`h-4 w-4  ${isLoading ? "animate-spin" : "animate-none"}`}
        />
      </Button>
    </nav>
  );
};

export default Navbar;
