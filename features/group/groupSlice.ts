import { GroupToUser } from "@/types/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

interface GroupSlice {
  currentGroup: GroupToUser | null;
}

const initialState: GroupSlice = { currentGroup: null };

export const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    setCurrentGroup: (state, action: PayloadAction<GroupToUser | null>) => {
      state.currentGroup = action.payload;
      return state;
    },
  },
});

export const { setCurrentGroup } = groupSlice.actions;

export const selectCurrentGroup = (state: RootState) => state.group.currentGroup;

export default groupSlice.reducer;
