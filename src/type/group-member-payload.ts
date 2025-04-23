export type GroupMemberPayload = {
  vouchers: Voucher[];
};

export type Voucher = {
  first_name: string;
  last_name: string;
  email: string;
  type: number;
  role: string;
  groupName: string;
  openID?: string;
  contactId: string;
};
