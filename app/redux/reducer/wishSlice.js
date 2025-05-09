import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  wishlist: null,
};

export const wishSlice = createSlice({
  name: "wish",
  initialState,
  reducers: {
    setWish: (state, action) => {
      console.log("setWish reducer called with:", action.payload);
      state.wishlist = action.payload;
    },
    clearWish: (state) => {
      state.wishlist = null;
    },
  },
});

export const { setWish, clearWish } = wishSlice.actions;
export default wishSlice.reducer;
