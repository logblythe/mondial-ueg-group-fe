import { Customer, GroupMember, Person } from "@/type/group-type";

type Props = {
  customers: Customer[];
  selectedGroupMembers: GroupMember[];
};

export const categorizeData = ({
  customers,
  selectedGroupMembers = [],
}: Props) => {
  const noEurospineAccount: Person[] = [];
  const eurospineAccountWithoutParticipation: Person[] = [];
  const eurospineAccountWithParticipation: Person[] = [];

  for (const member of selectedGroupMembers) {
    if (!member) {
      continue;
    }
    if (!member?.primaryEmail) {
      noEurospineAccount.push({
        eventsAir: member,
      });
      continue;
    }

    const customer = customers.find(
      (customer) => customer.primaryEmail === member.primaryEmail
    );

    if (!customer) {
      noEurospineAccount.push({
        eventsAir: member,
      });
      continue;
    }

    const { participation } = customer;

    if (!participation || participation.checkboxAccepted !== "1") {
      eurospineAccountWithoutParticipation.push({
        eventsAir: member,
        eurospine: customer,
      });
    } else {
      eurospineAccountWithParticipation.push({
        eventsAir: member,
        eurospine: customer,
      });
    }
  }

  // for (const email of selectedGroupMembers) {
  //   if (!email) {
  //     continue;
  //   }

  //   const customer = customers.find(
  //     (customer) => customer.primaryEmail === email
  //   );
  //   const selectedGroupMember = groupMembers.find(
  //     (member) => member.primaryEmail === email
  //   );

  //   if (!customer) {
  //     if (selectedGroupMember) {
  //       noEurospineAccount.push({
  //         eventsAir: selectedGroupMember,
  //       });
  //     }
  //     continue;
  //   }

  //   const { participation } = customer;

  //   if (!participation || participation.checkboxAccepted !== "1") {
  //     eurospineAccountWithoutParticipation.push({
  //       eventsAir: selectedGroupMember,
  //       eurospine: customer,
  //     });
  //   } else {
  //     eurospineAccountWithParticipation.push({
  //       eventsAir: selectedGroupMember,
  //       eurospine: customer,
  //     });
  //   }
  // }

  return {
    noEurospineAccount,
    eurospineAccountWithoutParticipation,
    eurospineAccountWithParticipation,
  };
};
