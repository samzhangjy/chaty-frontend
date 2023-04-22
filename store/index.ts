import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import groupReducer from "../features/group/groupSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    group: groupReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
