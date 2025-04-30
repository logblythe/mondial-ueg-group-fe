export type GroupVoucherGenerationPayload = {
  vouchers: Voucher[];
};

export type Voucher = {
  first_name: string;
  last_name: string;
  email: string;
  type: number;
  role: string;
  groupName: string;
  contactId: string;
};
