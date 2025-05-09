import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    remTime: null,
};

export const remTimeSlice = createSlice({
  name: "time",
  initialState,
  reducers: {
    setRemTime: (state, action) => {
      state.remTime = action.payload;
    },
  },
});

export const { setRemTime } = remTimeSlice.actions;
export default remTimeSlice.reducer;
