export const apiUrls = {
  auth: {
    login: "/api/v1/auth/login",
  },
  groups: {
    get: "/api/v1/groups",
    refresh_cache: "/api/v1/groups/refresh-cache",
    generate_voucher: "/api/v1/groups/:id/generate-vouchers-with-auto-redeem",
    all_group_status: "/api/v1/groups/generate-vouchers/status",
    generate_voucher_status_by_id:
      "/api/v1/groups/generate-vouchers/status/:id",
  },
  exceptionLogs: "/api/v1/logs?pageNumber=0&pageSize=1000",
};
