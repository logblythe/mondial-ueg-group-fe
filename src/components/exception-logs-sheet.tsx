"use client";

import { useQueryClient } from "@tanstack/react-query";
import { RotateCcw, ShieldAlert } from "lucide-react";
import ExceptionLogs from "./exception-logs";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const ExceptionLogSheet = () => {
  const queryClient = useQueryClient();

  queryClient.invalidateQueries({
    queryKey: ["exception-logs"],
  });

  return (
    <Sheet>
      <SheetTrigger>
        <Button variant="outline" size="icon" className="ml-4">
          <ShieldAlert className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-screen max-w-md p-0">
        <div className="p-4 py-2 pr-8 border-b flex flex-row items-center justify-between">
          <h2 className="text-lg font-semibold">Exception Logs</h2>
          <Button
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["exception-logs"] })
            }
            variant={"ghost"}
            size={"icon"}
            className="align-self-end"
          >
            <RotateCcw className="size-4" />
          </Button>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-8rem)] p-4 py-2">
          <div className="space-y-4">
            <ExceptionLogs />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ExceptionLogSheet;
