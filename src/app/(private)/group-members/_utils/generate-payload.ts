import {
  AutoRedeemVoucher,
  GroupAutoRedeemPayload,
} from "@/type/group-member-payload";
import { GroupMember, GroupType } from "@/type/group-type";
import {
  GroupVoucherGenerationPayload,
  Voucher,
} from "@/type/voucher-generation-payload";

export const createVoucherGenerationPayload = (
  selectedGroup: GroupType | undefined,
  groupMembers: GroupMember[]
): GroupVoucherGenerationPayload => {
  const groupName = selectedGroup?.name || "Default Group";

  const generateVoucher: Voucher[] = groupMembers.map((member) => {
    return {
      first_name: member.firstName,
      last_name: member.lastName,
      email: member.primaryEmail,
      contactId: member.id,
      role: "DELEGATE",
      groupName: groupName,
      type: member.typeForVoucher,
      internalNumber: member.internalNumber.toString(),
    };
  });
  const payload = { vouchers: generateVoucher };
  return payload;
};

export const createAutoRedeemPayload = (
  selectedGroup: GroupType | undefined,
  groupMembers: GroupMember[]
): GroupAutoRedeemPayload => {
  if (!selectedGroup) {
    return { vouchers: [] };
  }
  const groupName = selectedGroup.name;
  const generateAutoRedeem: AutoRedeemVoucher[] = groupMembers.map((member) => {
    return {
      first_name: member.firstName,
      last_name: member.lastName,
      email: member.primaryEmail,
      contactId: member.id,
      role: "DELEGATE",
      groupName: groupName,
      type: member.typeForVoucher,
      openID: member.openID ?? null,
      internalNumber: member.internalNumber.toString(),
    };
  });
  const payload = { vouchers: generateAutoRedeem };
  return payload;
};
