export type GroupAutoRedeemPayload = {
  vouchers: AutoRedeemVoucher[];
};

export type AutoRedeemVoucher = {
  first_name: string;
  last_name: string;
  email: string;
  type: number;
  role: string;
  groupName: string;
  openID?: string;
  contactId: string;
  internalNumber: string;
};
