export interface PaginatedExceptionLogs {
  data: Log[];
  pageSize: number;
  message: string;
  status: string;
  pageNumber: number;
  totalCount: number;
}

export interface Log {
  id: string;
  exceptionType: string;
  message: string;
  stackTrace: string;
  timestamp: string;
}
