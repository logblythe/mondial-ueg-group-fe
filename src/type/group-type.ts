export type GroupType = {
  contactId: string;
  name: string;
};

export type GroupMember = {
  id: string;
  openID: string;
  internalNumber: number;
  firstName: string;
  lastName: string;
  primaryEmail: string;
  activationCode?: string;
  activationCodeFormatted: string[];
  activationPin: string[];
  claimAccessURL: string[];
  typeForVoucher: number;
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
export type status = {
  groupId: string;
  status: string;
};
export type Customer = Pick<
  GroupMember,
  | "firstName"
  | "lastName"
  | "primaryEmail"
  | "activationCode"
  | "openID"
  | "remarks"
> & {
  OpenId: string;
  participation: Participation;
};

export type Person = {
  eventsAir?: GroupMember;
  eurospine?: Customer;
};
export type PersonalDetails = {
  firstName: string;
  lastName: string;
  email: string;
  id: string;
};

export type AutoReedemStatus = {
  name: string;
  status: string;
};
