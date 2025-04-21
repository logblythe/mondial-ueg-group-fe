export type GroupType = {
  contactId: string;
  name: string;
};

export type GroupMember = {
  id: string;
  openId?: string;
  internalNumber: number;
  firstName: string;
  lastName: string;
  primaryEmail: string;
  country?: string;
  registrationTypes: string[];
  remarks: string[];
  notes: string[];
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
  "firstName" | "lastName" | "primaryEmail" | "country"
> & {
  openId: string;
  participation: Participation;
};

export type Person = {
  eventsAir?: GroupMember;
  eurospine?: Customer;
};
