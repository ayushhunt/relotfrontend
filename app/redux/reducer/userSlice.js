import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile } from '../../../types/user';

const initialState = {
  profile: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({ 
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.profile = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setUser, setLoading, setError } = userSlice.actions;
export default userSlice.reducer; 