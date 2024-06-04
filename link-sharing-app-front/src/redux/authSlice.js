// src/features/counter/counterSlice.js

import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "Logged",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    userLogged(state) {
      state.isLoggedIn = true;
    },
  },
});

export const { userLogged } = authSlice.actions;

export default authSlice.reducer;
