import { GroupMember, GroupType } from "@/type/group-type";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface GroupState {
  selectedGroupId?: string;
  selectedGroup?: GroupType;
  selectGroup: (eventId: GroupType) => void;
  selectedGroupMembers?: GroupMember[];
  setSelectedGroupMembers: (members: GroupMember[]) => void;
  clearSelectedGroup: () => void;
}

export const UseGroupStore = create(
  persist<GroupState>(
    (set, get) => ({
      selectedGroup: undefined,
      selectedGroupId: undefined,
      selectedGroupMembers: [],
      selectGroup: (group) =>
        set(() => ({
          selectedGroup: group,
          selectedGroupId: group.contactId,
          selectedGroupMembers: [],
        })),
      setSelectedGroupMembers: (members) =>
        set(() => ({ selectedGroupMembers: members })),
      clearSelectedGroup: () =>
        set(() => ({
          selectedGroup: undefined,
          selectedGroupId: undefined,
        })),
    }),
    {
      name: "selected-group-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
