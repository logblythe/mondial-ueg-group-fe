"use client";

import ApiClient from "@/api-client";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import EmptyList from "./EmptyList";

const apiClient = new ApiClient();

const ExceptionLogs = () => {
  const exceptionLogsQuery = useQuery({
    queryKey: ["exception-logs"],
    queryFn: () => apiClient.getExceptionLogs(),
  });

  const { data, isLoading, isFetching, error } = exceptionLogsQuery;

  if (isLoading || isFetching)
    return (
      <div className="w-full flex items-center justify-center py-10">
        <Loader2 className="animate-spin h-4 w-4" />
      </div>
    );

  if (error) return <div>Something went wrong</div>;

  if (!data || !data.data || data.data.length === 0) {
    return <EmptyList />;
  }

  return (
    <div>
      {data?.data.map((log) => (
        <div
          key={log.id}
          className="flex flex-col space-y-1 shadow-sm p-2 mb-2 border rounded"
        >
          <p className="line-clamp-4 break-words text-sm">{log.message}</p>
          <p className="text-xs text-gray-500">
            {new Date(log.timestamp).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ExceptionLogs;
