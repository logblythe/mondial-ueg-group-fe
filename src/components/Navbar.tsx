import { Button } from "@/components/ui/button";
import classNames from "clsx";
import { RefreshCcw } from "lucide-react";
import { GroupSelector } from "./EventSelector";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import ApiClient from "@/api-client";

type Props = {
  onMenuButtonClick(): void;
};

const apiClient = new ApiClient();

const Navbar = (props: Props) => {
  const queryClient = useQueryClient();
  const RefreshCache = useMutation({
    mutationFn: () => apiClient.getRefreshCache(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      console.log("on success");
    },
    onError: () => {
      console.log("on error");
    },
  });
  const isLoading = RefreshCache.isPending;

  function onSubmit() {
    RefreshCache.mutate();
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

      {isLoading ? (
        <Button
          variant="outline"
          size="icon"
          onClick={onSubmit}
          className="animate-spin ml-5 size-6"
        >
          <RefreshCcw />
        </Button>
      ) : (
        <Button
          variant="outline"
          size="icon"
          onClick={onSubmit}
          className="ml-5 size-6"
        >
          <RefreshCcw />
        </Button>
      )}
    </nav>
  );
};

export default Navbar;
