import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loginStatus: true,
};

export const loginStatusSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setloginStatus: (state, action) => {
       debugger
        console.log('login is called')
      state.loginStatus = action.payload;
    },
  },
});

export const { setloginStatus, clearloginStatus } = loginStatusSlice.actions;
export default loginStatusSlice.reducer;
