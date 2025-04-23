export type GroupType = {
  contactId: string;
  name: string;
};

export type GroupMember = {
  id: string;
  OpenId: string;
  internalNumber: number;
  firstName: string;
  lastName: string;
  primaryEmail: string;
  activationCode?: string;
  activationCodeFormatted: string[];
  activationPin: string[];
  claimAccessURL: string[];
  typeForVoucher: string[];
  paymentStatus: string;
  registrations: Array<{
    uniqueCode: string;
    paymentStatus: string;
    typeForVoucher: number;
  }>;
  remarks: string[];
};

export type Participation = {
  membershipType: string;
  mondialId: string;
  mondialRegistrationGroup: string;
  regGroup: string;
  checkboxAccepted: "0" | "1";
};

export type Customer = Pick<
  GroupMember,
  | "firstName"
  | "lastName"
  | "primaryEmail"
  | "activationCode"
  | "OpenId"
  | "remarks"
> & {
  OpenId: string;
  participation: Participation;
};
export type Voucher = {
  activationCodeFormatted: string;
};

export type Person = {
  eventsAir?: GroupMember;
  eurospine?: Customer;
};
