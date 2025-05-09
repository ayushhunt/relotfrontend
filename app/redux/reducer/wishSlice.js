import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  wishlist: [],
};

export const wishSlice = createSlice({
  name: "wish",
  initialState,
  reducers: {
    AddWish: (state, action) => {
      debugger
      if (!Array.isArray(state.wishlist)) {
        state.wishlist = [];
      }
      const existingItemIndex = state.wishlist.findIndex(
        (item) => item.id === action.payload.id
      );
      if (existingItemIndex >= 0) {
        const updatedWishlist = state.wishlist.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        state.wishlist = updatedWishlist;
      } else {
        state.wishlist.push({ ...action.payload, quantity: 1 });
      }
    },

    clearWish: (state) => {
      state.wishlist = [];
    },
  },
});

export const { AddWish, clearWish } = wishSlice.actions;
export default wishSlice.reducer;
