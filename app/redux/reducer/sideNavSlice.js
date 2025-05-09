import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    navOpen: false,
};

export const sideNavSlice = createSlice({
  name: "sideNav",
  initialState,
  reducers: {
    setsideNav: (state, action) => {
      state.navOpen = action.payload;
    },
  },
});

export const { setsideNav } = sideNavSlice.actions;
export default sideNavSlice.reducer;
