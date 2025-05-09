// redux/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  addresses: [
    {
      id: '1',
      name: 'Ayush Singh',
      street: 'F-751, Block G, Nanakpuri, Shakarpur',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110092',
      phone: '9876543210',
      type: 'Home'
    },
    // You can add more sample addresses here
  ],
  selectedAddress: {
    id: '1',
    name: 'Ayush Singh',
    street: 'F-751, Block G, Nanakpuri, Shakarpur',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110092',
    phone: '9876543210',
    type: 'Home'
  },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setSelectedAddress: (state, action) => {
      state.selectedAddress = action.payload;
    },
    addAddress: (state, action) => {
      const newAddress = {
        id: Date.now().toString(),
        ...action.payload
      };
      state.addresses.push(newAddress);
    },
    updateAddress: (state, action) => {
      const index = state.addresses.findIndex(addr => addr.id === action.payload.id);
      if (index !== -1) {
        state.addresses[index] = action.payload;
        
        // Update selected address if it's the same one
        if (state.selectedAddress.id === action.payload.id) {
          state.selectedAddress = action.payload;
        }
      }
    },
    removeAddress: (state, action) => {
      state.addresses = state.addresses.filter(addr => addr.id !== action.payload);
      
      // If selected address is removed, set first address as selected
      if (state.selectedAddress.id === action.payload && state.addresses.length > 0) {
        state.selectedAddress = state.addresses[0];
      } else if (state.addresses.length === 0) {
        state.selectedAddress = null;
      }
    },
  },
});

export const {
  setSelectedAddress,
  addAddress,
  updateAddress,
  removeAddress,
} = userSlice.actions;

export default userSlice.reducer;
