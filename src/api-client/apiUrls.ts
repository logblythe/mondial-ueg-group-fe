export const apiUrls = {
  auth: {
    login: "/api/v1/auth/login",
  },
  groups: {
    get: "/api/v1/groups",
    sync: "/groups/sync/:id",
    syncStatus: "/groups/sync/:id/status",
    refresh_cache: "/api/v1/groups/refresh-cache",
    generate_voucher: "/api/v1/groups/:id/generate-vouchers-with-auto-redeem",
  },
  exceptionLogs: "/api/v1/logs?pageNumber=0&pageSize=1000",
};
